"use server";

/**
 * The intake write path.
 *
 * Order matters here, and it is the opposite of the obvious one. The complaint
 * is written to the database even when the clever parts fail, and the embedding
 * is attached in the same statement when it is available. If Bedrock is down,
 * the row still lands — with a null embedding, and the chart says so.
 *
 * Losing the semantic index is degraded service. Losing what the patient said
 * is data loss, and no amount of AI is worth that trade.
 */

import { revalidatePath } from "next/cache";
import { query, MEMORY_TIMEOUT_MS } from "@/lib/memory/db";
import { searchMemory, logRecall, RECALL_THRESHOLD } from "@/lib/memory/recall";
import { withMemory } from "@/lib/memory/degrade";
import { resolveRegion, type ResolvedRegion } from "@/lib/clinical/resolve";
import { embedderFromEnv, resilientEmbedder } from "@/lib/ai/embed";
import { detectAll, type ComplaintRecord } from "@/lib/clinical/recurrence";
import type { RecallMatch } from "@/lib/memory/recall";
import type { Region } from "@/lib/clinical/regions";

export interface IntakeResult {
  ok: boolean;
  error?: string;

  patientName?: string;
  text?: string;

  /** What memory returned for this complaint. */
  matches?: Array<{
    rawText: string;
    occurredAt: string;
    distance: number;
    region: Region;
  }>;

  resolved?: ResolvedRegion;

  /** Whether a recurrence now exists *including* this new complaint. */
  flagLevel?: "recurrent" | "watch" | null;
  flagVisits?: number;
  flagSpanDays?: number;

  embedProvider?: string;
  embedFailed?: boolean;
  memoryDegraded?: boolean;
  degradedReason?: string;
  latencyMs?: number;
}

export async function submitComplaint(
  _prev: IntakeResult | null,
  form: FormData,
): Promise<IntakeResult> {
  const patientId = String(form.get("patientId") ?? "").trim();
  const text = String(form.get("text") ?? "").trim();

  if (!patientId) return { ok: false, error: "Choose a patient." };
  if (text.length < 3) {
    return { ok: false, error: "Describe the symptom in a few words." };
  }
  if (text.length > 500) {
    return { ok: false, error: "Keep it under 500 characters." };
  }

  const started = Date.now();

  /* ---- 1. Embed. A failure here is survivable. ---- */
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
    // Even the offline fallback failed, which should not be possible. Record
    // the complaint anyway, unembedded.
    embedFailed = true;
    embedProvider = "none";
  }

  /* ---- 2. Ask memory what this patient said before. ---- */
  let matches: RecallMatch[] = [];
  let memoryDegraded = false;
  let degradedReason: string | undefined;

  if (vector) {
    const embedding = vector;
    const outcome = await withMemory(
      () => searchMemory({ patientId, embedding, limit: 5 }),
      [] as RecallMatch[],
      MEMORY_TIMEOUT_MS,
    );
    matches = outcome.value;
    memoryDegraded = outcome.degraded;
    degradedReason = outcome.reason;
  }

  /* ---- 3. Resolve the region, inheriting from memory if the words don't say. ---- */
  const resolved = resolveRegion(text, matches);

  /* ---- 4. Write it down. ---- */
  let patientName: string | undefined;
  try {
    const [patient] = await query<{ name: string }>(
      `SELECT name FROM patient WHERE id = $1`,
      [patientId],
    );
    if (!patient) return { ok: false, error: "That patient no longer exists." };
    patientName = patient.name;

    const [visit] = await query<{ id: string }>(
      `INSERT INTO visit (patient_id, channel) VALUES ($1,'app') RETURNING id`,
      [patientId],
    );

    await query(
      `INSERT INTO complaint
         (patient_id, visit_id, raw_text, body_region, region_source,
          region_inherited_from, embedding, embed_model, embedded_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        patientId,
        visit.id,
        text,
        resolved.region,
        resolved.source,
        resolved.inheritedFrom ?? null,
        vector ? `[${vector.join(",")}]` : null,
        vector ? embedProvider : null,
        vector ? new Date() : null,
      ],
    );
  } catch (err) {
    return {
      ok: false,
      error:
        "Could not write to memory: " +
        (err instanceof Error ? err.message : String(err)),
    };
  }

  /* ---- 5. Audit the recall, whatever happened. ---- */
  const latencyMs = Date.now() - started;
  await logRecall({
    patientId,
    queryText: text,
    matchesFound: matches.length,
    topDistance: matches[0]?.distance ?? null,
    latencyMs,
    degraded: memoryDegraded,
    degradedReason,
    embedProvider,
  });

  /* ---- 6. Re-run the rule including what was just said. ---- */
  let flagLevel: "recurrent" | "watch" | null = null;
  let flagVisits: number | undefined;
  let flagSpanDays: number | undefined;

  if (!memoryDegraded) {
    const rows = await query<{
      id: string;
      visit_id: string;
      patient_id: string;
      raw_text: string;
      body_region: string;
      occurred_at: Date;
    }>(
      `SELECT id, visit_id, patient_id, raw_text, body_region, occurred_at
         FROM complaint WHERE patient_id = $1 ORDER BY occurred_at ASC`,
      [patientId],
    );

    const history: ComplaintRecord[] = rows.map((r) => ({
      id: r.id,
      visitId: r.visit_id,
      patientId: r.patient_id,
      rawText: r.raw_text,
      bodyRegion: r.body_region as Region,
      occurredAt: new Date(r.occurred_at),
    }));

    const flag = detectAll(history, new Date()).find(
      (f) => f.region === resolved.region,
    );
    if (flag) {
      flagLevel = flag.level;
      flagVisits = flag.visitCount;
      flagSpanDays = flag.spanDays;
    }
  }

  revalidatePath("/doctor");
  revalidatePath(`/doctor/${patientId}`);

  return {
    ok: true,
    patientName,
    text,
    matches: matches
      .filter((m) => m.distance <= RECALL_THRESHOLD)
      .map((m) => ({
        rawText: m.rawText,
        occurredAt: m.occurredAt.toISOString(),
        distance: m.distance,
        region: m.bodyRegion,
      })),
    resolved,
    flagLevel,
    flagVisits,
    flagSpanDays,
    embedProvider,
    embedFailed,
    memoryDegraded,
    degradedReason,
    latencyMs,
  };
}
