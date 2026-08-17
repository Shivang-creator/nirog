/**
 * Recall — the read path of agent memory.
 *
 * Given something a patient just said, find the times they said something that
 * meant the same thing, however differently they worded it.
 */

import type { Region } from "../clinical/regions";
import type { ComplaintRecord } from "../clinical/recurrence";
import { query, toVectorLiteral, MEMORY_TIMEOUT_MS } from "./db";
import { withMemory, type MemoryOutcome } from "./degrade";

/**
 * Cosine distance above which two complaints are treated as unrelated.
 *
 * Tuned so that "my lower back has been aching" and "I keep getting this pain
 * when I stand up" match, while "my lower back has been aching" and "I've had a
 * headache since Tuesday" do not. Exported and asserted in the test suite, so a
 * change to this number has to break a test before it can change a diagnosis.
 */
export const RECALL_THRESHOLD = 0.55;

export interface RecallMatch {
  id: string;
  visitId: string;
  patientId: string;
  rawText: string;
  bodyRegion: Region;
  occurredAt: Date;
  distance: number;
}

interface RecallRow {
  id: string;
  visit_id: string;
  patient_id: string;
  raw_text: string;
  body_region: string;
  occurred_at: Date;
  distance: string | number | null;
}

/**
 * The vector search itself.
 *
 * `ORDER BY embedding <=> $vector LIMIT n` with patient_id equality is the shape
 * the C-SPANN index is built for — the planner resolves it to a `vector search`
 * node with a prefix span, not a scan. See schema.sql.
 */
export async function searchMemory(opts: {
  patientId: string;
  embedding: number[];
  limit?: number;
  excludeComplaintId?: string;
  /** Only complaints strictly before this instant — prevents a complaint recalling itself. */
  before?: Date;
}): Promise<RecallMatch[]> {
  const limit = opts.limit ?? 10;
  const vec = toVectorLiteral(opts.embedding);

  // Note the absence of an `embedding IS NOT NULL` guard.
  //
  // It was here originally and it was a mistake twice over. It is redundant —
  // the vector index contains only rows that have an embedding — and its
  // presence stopped CockroachDB from considering the index at all, forcing a
  // table scan even where a vector search would have won.
  //
  // Unembedded rows are handled below instead, where a null distance becomes
  // Infinity rather than silently coercing to 0 and ranking first.
  const rows = await query<RecallRow>(
    `
    SELECT id, visit_id, patient_id, raw_text, body_region, occurred_at,
           embedding <=> $2 AS distance
      FROM complaint
     WHERE patient_id = $1
       AND ($3::UUID IS NULL OR id <> $3::UUID)
       AND ($4::TIMESTAMPTZ IS NULL OR occurred_at < $4::TIMESTAMPTZ)
     ORDER BY embedding <=> $2
     LIMIT $5
    `,
    [
      opts.patientId,
      vec,
      opts.excludeComplaintId ?? null,
      opts.before ?? null,
      limit,
    ],
  );

  return rows
    .map((r) => ({
      id: r.id,
      visitId: r.visit_id,
      patientId: r.patient_id,
      rawText: r.raw_text,
      bodyRegion: r.body_region as Region,
      occurredAt: new Date(r.occurred_at),
      // A complaint recorded while the embedding service was down has no
      // vector, so `<=>` yields NULL. Number(null) is 0 — which would rank an
      // unembedded complaint as a *perfect* match and put it at the top of a
      // doctor's screen. Infinity is the honest value: unknown distance, never
      // surfaced.
      distance: r.distance === null ? Infinity : Number(r.distance),
    }))
    .filter((m) => Number.isFinite(m.distance) && m.distance <= RECALL_THRESHOLD);
}

/**
 * Recall wrapped in the degradation contract.
 *
 * Callers get a `MemoryOutcome`, never a bare array, so it is impossible to
 * consume this result without also handling the case where memory was down —
 * the type system makes the honest path the only path.
 */
export async function recall(opts: {
  patientId: string;
  embedding: number[];
  limit?: number;
  excludeComplaintId?: string;
  before?: Date;
}): Promise<MemoryOutcome<RecallMatch[]>> {
  return withMemory(() => searchMemory(opts), [], MEMORY_TIMEOUT_MS);
}

/**
 * The patient's full complaint history — the input to the recurrence rule.
 *
 * Separate from the vector path on purpose: recurrence is counted over what was
 * actually recorded, not over what semantic search happened to surface. If the
 * embedding service were down when a complaint was written, that complaint has
 * no vector and would be invisible to `searchMemory` — but it still happened,
 * and it still counts toward a recurrence.
 */
export async function loadHistory(
  patientId: string,
): Promise<MemoryOutcome<ComplaintRecord[]>> {
  return withMemory(
    async () => {
      const rows = await query<RecallRow>(
        `
        SELECT id, visit_id, patient_id, raw_text, body_region, occurred_at
          FROM complaint
         WHERE patient_id = $1
         ORDER BY occurred_at ASC
        `,
        [patientId],
      );
      return rows.map((r) => ({
        id: r.id,
        visitId: r.visit_id,
        patientId: r.patient_id,
        rawText: r.raw_text,
        bodyRegion: r.body_region as Region,
        occurredAt: new Date(r.occurred_at),
      }));
    },
    [],
    MEMORY_TIMEOUT_MS,
  );
}

/**
 * Write the audit row for a recall attempt, successful or not.
 *
 * Failures here are logged and swallowed. Losing an audit row is bad; failing a
 * patient's consultation because the audit write timed out is worse.
 */
export async function logRecall(opts: {
  patientId: string;
  queryComplaintId?: string | null;
  queryText: string;
  matchesFound: number;
  topDistance: number | null;
  latencyMs: number;
  degraded: boolean;
  degradedReason?: string;
  embedProvider: string;
}): Promise<void> {
  try {
    await query(
      `
      INSERT INTO recall_event
        (patient_id, query_complaint_id, query_text, matches_found,
         top_distance, latency_ms, degraded, degraded_reason, embed_provider)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `,
      [
        opts.patientId,
        opts.queryComplaintId ?? null,
        opts.queryText,
        opts.matchesFound,
        opts.topDistance,
        opts.latencyMs,
        opts.degraded,
        opts.degradedReason ?? null,
        opts.embedProvider,
      ],
    );
  } catch (err) {
    console.error(
      "[memory] could not write audit row:",
      err instanceof Error ? err.message : err,
    );
  }
}
