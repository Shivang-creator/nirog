import { NextRequest, NextResponse } from "next/server";
import { query, MEMORY_TIMEOUT_MS } from "@/lib/memory/db";
import { withMemory } from "@/lib/memory/degrade";
import { isPatientId } from "@/lib/memory/ids";
import { searchMemory, logRecall, recallThresholdFor } from "@/lib/memory/recall";
import { resolveRegion, inheritThresholdFor } from "@/lib/clinical/resolve";
import { embedderFromEnv, resilientEmbedder } from "@/lib/ai/embed";
import type { RecallMatch } from "@/lib/memory/recall";

export const dynamic = "force-dynamic";

/**
 * Write one thing the patient said into memory.
 *
 * Called on every turn, in parallel with the model request — the consultation
 * never waits for this. A failure here loses a row; a failure that blocked the
 * conversation would lose the patient.
 *
 * Order is deliberate: embed, ask memory what this resembles, resolve the body
 * region (which may have to be inherited from an earlier visit), then write. The
 * complaint is recorded even when the embedding fails, with a null vector and a
 * chart that says so. Losing the semantic index is degraded service; losing the
 * patient's words is data loss.
 */

/** One visit per consultation, reused across turns rather than one per sentence. */
async function currentVisit(patientId: string): Promise<string> {
  const [open] = await query<{ id: string }>(
    `SELECT id FROM visit
      WHERE patient_id = $1 AND occurred_at > now() - INTERVAL '2 hours'
      ORDER BY occurred_at DESC LIMIT 1`,
    [patientId],
  );
  if (open) return open.id;

  const [created] = await query<{ id: string }>(
    `INSERT INTO visit (patient_id, channel) VALUES ($1, 'app') RETURNING id`,
    [patientId],
  );
  return created.id;
}

export async function POST(req: NextRequest) {
  let body: { patientId?: string; text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const patientId = String(body.patientId ?? "").trim();
  const text = String(body.text ?? "").trim();

  if (!isPatientId(patientId)) {
    return NextResponse.json({ error: "bad patient id" }, { status: 400 });
  }
  if (text.length < 3 || text.length > 1000) {
    return NextResponse.json({ error: "bad text" }, { status: 400 });
  }

  const started = Date.now();

  /* 1. Embed. Survivable. */
  const configured = embedderFromEnv();
  let embedFailed = false;
  const embedder = resilientEmbedder(configured, () => {
    embedFailed = true;
  });

  let vector: number[] | null = null;
  let embedProvider = configured.provider;
  try {
    const r = await embedder.embed(text);
    vector = r.vector;
    embedProvider = r.provider;
  } catch {
    embedFailed = true;
    embedProvider = "none";
  }

  /* 2. What has this patient said like this before? */
  let matches: RecallMatch[] = [];
  let degraded = false;
  let degradedReason: string | undefined;

  if (vector) {
    const embedding = vector;
    // Thresholds live on the query vector's embedding space — a Titan vector
    // compared against Titan history needs Titan's scale, not the offline one.
    const threshold = recallThresholdFor(embedProvider);
    const outcome = await withMemory(
      () => searchMemory({ patientId, embedding, limit: 5, threshold }),
      [] as RecallMatch[],
      MEMORY_TIMEOUT_MS,
    );
    matches = outcome.value;
    degraded = outcome.degraded;
    degradedReason = outcome.reason;
  }

  /* 3. Region — from the words, or inherited from memory when they don't say. */
  const resolved = resolveRegion(text, matches, inheritThresholdFor(embedProvider));

  /* 4. Write. */
  try {
    const visitId = await currentVisit(patientId);
    await query(
      `INSERT INTO complaint
         (patient_id, visit_id, raw_text, body_region, region_source,
          region_inherited_from, embedding, embed_model, embedded_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        patientId, visitId, text, resolved.region, resolved.source,
        resolved.inheritedFrom ?? null,
        vector ? `[${vector.join(",")}]` : null,
        vector ? embedProvider : null,
        vector ? new Date() : null,
      ],
    );
  } catch (err) {
    // The one case an auditor most wants recorded: the recall ran but the
    // write was lost. logRecall never throws — it logs and moves on.
    await logRecall({
      patientId,
      queryText: text,
      matchesFound: matches.length,
      topDistance: matches[0]?.distance ?? null,
      latencyMs: Date.now() - started,
      degraded: true,
      degradedReason: `complaint insert failed: ${
        err instanceof Error ? err.message : String(err)
      }`,
      embedProvider,
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }

  /* 5. Audit, whatever happened. */
  await logRecall({
    patientId,
    queryText: text,
    matchesFound: matches.length,
    topDistance: matches[0]?.distance ?? null,
    latencyMs: Date.now() - started,
    degraded,
    degradedReason,
    embedProvider,
  });

  return NextResponse.json({
    ok: true,
    region: resolved.region,
    regionSource: resolved.source,
    inheritedFrom: resolved.inheritedFromText ?? null,
    matches: matches.map((m) => ({
      text: m.rawText,
      distance: m.distance,
      occurredAt: m.occurredAt.toISOString(),
    })),
    embedProvider,
    embedFailed,
    degraded,
    latencyMs: Date.now() - started,
  });
}
