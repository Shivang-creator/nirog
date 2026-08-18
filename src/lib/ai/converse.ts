import "server-only";

/**
 * Chat completion on Amazon Bedrock — the generative half of ARIA's brain.
 *
 * This replaces the external Lambda that `lib/nirog/aria.ts` was written
 * against: the same stateless contract, served from this app's own /api/aria
 * routes, billed to this project's AWS account. The clinical-memory layer
 * remains deliberately non-generative (see "Why there is no LLM in the
 * clinical output" in the README) — this model conducts the *conversation*;
 * it never writes the chart.
 *
 * gpt-oss models emit their chain of thought as `reasoningContent` blocks
 * before the answer. Those never leave this module: the patient hears the
 * reply, not the deliberation.
 */

export const CHAT_MODEL =
  process.env.BEDROCK_CHAT_MODEL ?? "openai.gpt-oss-120b-1:0";

export function chatConfigured(): boolean {
  return Boolean(
    process.env.AWS_REGION &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY,
  );
}

export interface ConverseTurn {
  role: "user" | "assistant";
  text: string;
}

/**
 * One completion. Returns the model's final text with reasoning blocks
 * stripped. Throws on transport/model errors — callers translate to HTTP.
 */
export async function converseText(opts: {
  system: string;
  turns: ConverseTurn[];
  maxTokens?: number;
  temperature?: number;
  reasoningEffort?: "low" | "medium" | "high";
}): Promise<string> {
  // Lazy import, same rationale as embed.ts: paths that never chat never load
  // the SDK.
  const { BedrockRuntimeClient, ConverseCommand } = await import(
    "@aws-sdk/client-bedrock-runtime"
  );
  const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

  // Converse requires alternating roles starting with "user"; collapse any
  // consecutive same-role turns rather than rejecting the transcript.
  const messages: { role: "user" | "assistant"; content: { text: string }[] }[] =
    [];
  for (const t of opts.turns) {
    const last = messages[messages.length - 1];
    if (last && last.role === t.role) {
      last.content[0].text += `\n${t.text}`;
    } else {
      messages.push({ role: t.role, content: [{ text: t.text }] });
    }
  }
  if (messages[0]?.role !== "user") {
    messages.unshift({ role: "user", content: [{ text: "(patient is present)" }] });
  }

  const res = await client.send(
    new ConverseCommand({
      modelId: CHAT_MODEL,
      system: [{ text: opts.system }],
      messages,
      inferenceConfig: {
        maxTokens: opts.maxTokens ?? 1500,
        temperature: opts.temperature ?? 0.4,
      },
      // gpt-oss thinks before it answers and bills those tokens too. A voice
      // conversation cares about the next question, not a treatise — low
      // effort roughly halves latency; the handover overrides this upward.
      additionalModelRequestFields: {
        reasoning_effort: opts.reasoningEffort ?? "low",
      },
    }),
  );

  const blocks = res.output?.message?.content ?? [];
  const text = blocks
    .map((b) => ("text" in b ? b.text : null))
    .filter((t): t is string => typeof t === "string" && t.length > 0)
    .join("\n")
    .trim();

  if (!text) throw new Error(`${CHAT_MODEL} returned no text`);
  return text;
}

/**
 * A completion that must be JSON. Strips markdown fences and anything the
 * model said around the object, then parses. The zod validation happens at
 * the route, where the expected shape is known.
 */
export async function converseJson<T>(opts: {
  system: string;
  turns: ConverseTurn[];
  maxTokens?: number;
  temperature?: number;
  reasoningEffort?: "low" | "medium" | "high";
}): Promise<T> {
  const raw = await converseText(opts);
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end <= start) {
    throw new Error(`${CHAT_MODEL} returned no JSON object`);
  }
  return JSON.parse(raw.slice(start, end + 1)) as T;
}
