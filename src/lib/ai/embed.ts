/**
 * Embeddings, with an honest fallback.
 *
 * Two backends implement one interface:
 *
 *   bedrock  — Amazon Titan Text Embeddings V2. The real thing.
 *   offline  — a deterministic lexical embedder, used when no AWS key is present.
 *
 * The fallback exists so the app builds, runs, seeds and passes its full test
 * suite with no cloud access at all. It is *not* a secret substitute for the
 * real model, and it never pretends to be one: whichever backend answered is
 * written to `recall_event.embed_provider` on every single recall, and shown in
 * the UI. If a screenshot in this repo was produced without Bedrock, the
 * provenance is in the database.
 *
 * Both produce 1024 dimensions so the schema and the vector index are identical
 * either way, and switching backends never requires a re-migration.
 */

import { createHash } from "node:crypto";

export const EMBED_DIMS = 1024;

export interface EmbeddingResult {
  vector: number[];
  /** e.g. "bedrock:amazon.titan-embed-text-v2:0" or "offline:lexical-v1" */
  provider: string;
}

export interface Embedder {
  readonly provider: string;
  embed(text: string): Promise<EmbeddingResult>;
}

/* ------------------------------------------------------------------ *
 * Offline lexical embedder
 * ------------------------------------------------------------------ */

/**
 * Clinical concept expansion.
 *
 * A pure bag-of-words embedder cannot connect "my lower back has been aching"
 * to "I keep getting this pain when I stand up" — they share no content words,
 * which is precisely the problem this product exists to solve. So before
 * hashing, each token is expanded to the concepts it implies.
 *
 * This is a hand-written lexicon doing a crude imitation of what a real
 * embedding model learns. It is good enough to demonstrate the mechanism
 * offline and nowhere near good enough to ship as the real recall path.
 */
const CONCEPTS: Record<string, readonly string[]> = {
  // sensations collapse to a shared concept
  ache: ["pain"], aching: ["pain"], aches: ["pain"], achy: ["pain"],
  sore: ["pain"], soreness: ["pain"], hurt: ["pain"], hurts: ["pain"],
  hurting: ["pain"], pain: ["pain"], painful: ["pain"], throb: ["pain"],
  throbbing: ["pain"], stiff: ["pain", "stiffness"], stiffness: ["stiffness"],
  twinge: ["pain"], niggle: ["pain"], discomfort: ["pain"],

  // lumbar vocabulary, including the postural phrasings patients actually use
  back: ["back"], lower: ["lower"], lumbar: ["back", "lower"],
  spine: ["back"], kamar: ["back", "lower"],
  stand: ["posture", "back", "lower"], standing: ["posture", "back", "lower"],
  stood: ["posture", "back", "lower"], sitting: ["posture"], sit: ["posture"],
  bending: ["posture", "back"], bend: ["posture", "back"],
  lifting: ["posture", "back"], lift: ["posture", "back"],
  desk: ["posture"], chair: ["posture"],

  // time / persistence
  again: ["recurrence"], back_again: ["recurrence"], returned: ["recurrence"],
  keeps: ["recurrence", "persistent"], keep: ["recurrence", "persistent"],
  still: ["persistent"], persistent: ["persistent"], constant: ["persistent"],
  weeks: ["duration"], week: ["duration"], days: ["duration"], day: ["duration"],
  months: ["duration"], month: ["duration"], morning: ["diurnal"],
  night: ["diurnal"], evening: ["diurnal"],

  // other regions, so unrelated complaints stay far apart
  head: ["head"], headache: ["head", "pain"], migraine: ["head", "pain"],
  stomach: ["abdomen"], belly: ["abdomen"], nausea: ["abdomen"],
  chest: ["chest"], cough: ["chest"], breath: ["chest"],
  fever: ["systemic"], tired: ["systemic"], fatigue: ["systemic"],
  knee: ["leg"], leg: ["leg"], ankle: ["leg"], shoulder: ["arm"],
  neck: ["neck"], rash: ["skin"], itchy: ["skin"],
};

const STOP = new Set([
  "a", "an", "the", "is", "it", "i", "my", "me", "of", "in", "on", "at", "to",
  "and", "or", "but", "for", "with", "this", "that", "been", "have", "has",
  "had", "am", "was", "were", "be", "get", "getting", "got", "from", "when",
  "up", "out", "so", "very", "really", "just", "some", "few", "bit",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

/** Stable per-token pseudo-random projection. Deterministic across processes. */
function tokenVector(token: string, out: Float64Array, weight: number): void {
  const digest = createHash("sha256").update(token).digest();
  // Each token touches a fixed sparse set of dimensions. Sparse projection keeps
  // unrelated tokens close to orthogonal, which is what stops every complaint
  // from looking vaguely similar to every other one.
  for (let k = 0; k < 8; k++) {
    const idx =
      ((digest[k * 2] << 8) | digest[k * 2 + 1]) % EMBED_DIMS;
    const sign = digest[k * 2 + 1] & 1 ? 1 : -1;
    out[idx] += sign * weight;
  }
}

/**
 * How much a token contributes as itself, versus through the concepts it implies.
 *
 * When a token has a concept mapping, the concept *is* its meaning and the
 * surface form is close to noise — "aching" and "hurts" should not be pushed
 * apart by the letters they happen to use. So a mapped token keeps only a
 * fraction of its own weight and spends the rest on its concepts.
 *
 * Unmapped tokens keep full weight: the lexicon does not know them, so their
 * literal form is the only signal available.
 */
const MAPPED_SURFACE_WEIGHT = 0.3;
const CONCEPT_WEIGHT = 2.0;

export function offlineEmbed(text: string): number[] {
  const out = new Float64Array(EMBED_DIMS);
  const tokens = tokenize(text);

  for (const t of tokens) {
    const concepts = CONCEPTS[t];
    if (concepts?.length) {
      tokenVector(t, out, MAPPED_SURFACE_WEIGHT);
      for (const c of concepts) tokenVector(`concept:${c}`, out, CONCEPT_WEIGHT);
    } else {
      tokenVector(t, out, 1);
    }
  }

  // L2 normalise so cosine distance behaves and short complaints are not
  // penalised for being short.
  let norm = 0;
  for (let i = 0; i < EMBED_DIMS; i++) norm += out[i] * out[i];
  norm = Math.sqrt(norm);
  if (norm === 0) return Array.from({ length: EMBED_DIMS }, () => 0);
  return Array.from(out, (v) => v / norm);
}

export const offlineEmbedder: Embedder = {
  provider: "offline:lexical-v1",
  async embed(text: string) {
    return { vector: offlineEmbed(text), provider: "offline:lexical-v1" };
  },
};

/* ------------------------------------------------------------------ *
 * Bedrock embedder
 * ------------------------------------------------------------------ */

export function bedrockEmbedder(opts: {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  model: string;
}): Embedder {
  const provider = `bedrock:${opts.model}`;

  return {
    provider,
    async embed(text: string) {
      // Imported lazily so the offline path never pays for the AWS SDK, and so
      // a machine with no AWS dependency installed can still run the tests.
      const { BedrockRuntimeClient, InvokeModelCommand } = await import(
        "@aws-sdk/client-bedrock-runtime"
      );

      const client = new BedrockRuntimeClient({
        region: opts.region,
        credentials: {
          accessKeyId: opts.accessKeyId,
          secretAccessKey: opts.secretAccessKey,
        },
      });

      const res = await client.send(
        new InvokeModelCommand({
          modelId: opts.model,
          contentType: "application/json",
          body: JSON.stringify({
            inputText: text,
            dimensions: EMBED_DIMS,
            // Titan can return unit-norm vectors directly. Asking for it here
            // means the vector we store and the vector the index compares are
            // already the shape cosine expects.
            normalize: true,
          }),
        }),
      );

      const body = JSON.parse(new TextDecoder().decode(res.body));
      const vector: number[] = body.embedding;

      if (!Array.isArray(vector) || vector.length !== EMBED_DIMS) {
        throw new Error(
          `Titan returned ${vector?.length ?? "no"} dimensions, expected ${EMBED_DIMS}`,
        );
      }
      return { vector, provider };
    },
  };
}

/* ------------------------------------------------------------------ *
 * Resilience
 * ------------------------------------------------------------------ */

/**
 * Try the real embedder; fall back to the offline one if it fails.
 *
 * The subtlety here is provenance. The returned `provider` is always the
 * backend that *actually produced the vector*, never the one we hoped to use.
 * So a database seeded during a Bedrock outage records `offline:lexical-v1` on
 * exactly the rows the fallback handled, and a later query can tell which
 * embeddings are real and which are stand-ins.
 *
 * This is a deliberate departure from `embedderFromEnv`, which does not fall
 * back: silently substituting a lesser model for a configured one is how a
 * system ends up lying about its own capabilities. Here the substitution is
 * loud, per-call, and recorded.
 */
export function resilientEmbedder(
  primary: Embedder,
  onFallback?: (err: Error) => void,
): Embedder {
  if (primary.provider === offlineEmbedder.provider) return primary;

  let warned = false;
  return {
    provider: primary.provider,
    async embed(text: string) {
      try {
        return await primary.embed(text);
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        if (!warned) {
          warned = true;
          onFallback?.(e);
        }
        // Note: offlineEmbedder returns its own provider string, so the caller
        // records the truth without having to remember to.
        return offlineEmbedder.embed(text);
      }
    },
  };
}

/* ------------------------------------------------------------------ *
 * Selection
 * ------------------------------------------------------------------ */

/**
 * Pick a backend from the environment.
 *
 * Presence of an AWS key is the only switch. There is no "prefer offline" flag,
 * because a deployment that has real credentials and quietly uses the fallback
 * anyway is the exact failure this provenance system is meant to make impossible.
 */
export function embedderFromEnv(
  env: Record<string, string | undefined> = process.env,
): Embedder {
  const region = env.AWS_REGION?.trim();
  const accessKeyId = env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = env.AWS_SECRET_ACCESS_KEY?.trim();
  const model = env.BEDROCK_EMBED_MODEL?.trim() || "amazon.titan-embed-text-v2:0";

  if (region && accessKeyId && secretAccessKey) {
    return bedrockEmbedder({ region, accessKeyId, secretAccessKey, model });
  }
  return offlineEmbedder;
}

/**
 * Cosine distance, matching what CockroachDB's `<=>` operator returns.
 * Used in tests to reason about ranking without a database round-trip.
 */
export function cosineDistance(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 1;
  return 1 - dot / (Math.sqrt(na) * Math.sqrt(nb));
}
