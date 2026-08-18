import "server-only";

/**
 * Read models for the pages.
 *
 * Everything here returns a `MemoryOutcome`, so a page cannot render a chart
 * without deciding what to show when memory was unreachable.
 */

import { query, MEMORY_TIMEOUT_MS } from "./db";
import { isPatientId } from "./ids";
import { withMemory, type MemoryOutcome } from "./degrade";

export { isPatientId } from "./ids";
import { detectAll, type ComplaintRecord } from "../clinical/recurrence";
import { buildSbar, type Patient, type Sbar } from "../clinical/sbar";
import type { RecurrenceFlag } from "../clinical/recurrence";
import type { Region } from "../clinical/regions";
import type { RegionSource } from "../clinical/resolve";

export interface PatientSummary extends Patient {
  complaintCount: number;
  visitCount: number;
  lastSeen: Date | null;
  /** Generated filler from `npm run db:volume`, not a hand-written demo case. */
  synthetic: boolean;
}

/**
 * Synthetic patients are tagged with a "(vol)" suffix by the volume seeder.
 *
 * They exist so query plans and latency are measured against a table that
 * resembles a real clinic, and they must not get in the way of the three cases
 * that actually demonstrate anything. A reviewer opening this page alone has to
 * land on the demo immediately, not scroll past four hundred rows of filler
 * looking for it.
 */
const SYNTHETIC_SUFFIX = "(vol)";

export interface ChartComplaint extends ComplaintRecord {
  regionSource: RegionSource;
  inheritedFromText: string | null;
  embedModel: string | null;
  hasEmbedding: boolean;
}

export interface Chart {
  patient: Patient;
  complaints: ChartComplaint[];
  flags: RecurrenceFlag[];
  sbar: Sbar;
}

export async function listPatients(): Promise<MemoryOutcome<PatientSummary[]>> {
  return withMemory(
    async () => {
      const rows = await query<{
        id: string;
        name: string;
        year_of_birth: number;
        sex: string;
        family_history: string | null;
        complaint_count: string;
        visit_count: string;
        last_seen: Date | null;
      }>(`
        SELECT p.id, p.name, p.year_of_birth, p.sex, p.family_history,
               count(DISTINCT c.id)       AS complaint_count,
               count(DISTINCT c.visit_id) AS visit_count,
               max(c.occurred_at)         AS last_seen
          FROM patient p
          LEFT JOIN complaint c ON c.patient_id = p.id
         GROUP BY p.id, p.name, p.year_of_birth, p.sex, p.family_history
         ORDER BY (p.name LIKE '%${SYNTHETIC_SUFFIX}') ASC,
                  max(c.occurred_at) DESC NULLS LAST
      `);

      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        yearOfBirth: r.year_of_birth,
        sex: r.sex,
        familyHistory: r.family_history,
        complaintCount: Number(r.complaint_count),
        visitCount: Number(r.visit_count),
        lastSeen: r.last_seen ? new Date(r.last_seen) : null,
        synthetic: r.name.endsWith(SYNTHETIC_SUFFIX),
      }));
    },
    [],
    MEMORY_TIMEOUT_MS,
  );
}

/**
 * A patient's whole chart, with the recurrence rule already applied.
 *
 * Note the `degraded` flag threading all the way into `buildSbar`. When memory
 * is down the handover is not merely missing a section — it says so in the
 * assessment, because a doctor skimming an SBAR should not have to notice an
 * absence to know something is wrong.
 */
export async function getChart(
  patientId: string,
  now: Date = new Date(),
): Promise<MemoryOutcome<Chart | null>> {
  // Answered without a round trip, and without raising a false alarm.
  if (!isPatientId(patientId)) {
    return { ok: true, value: null, degraded: false, latencyMs: 0 };
  }

  return withMemory(
    async () => {
      const [patientRow] = await query<{
        id: string;
        name: string;
        year_of_birth: number;
        sex: string;
        family_history: string | null;
      }>(`SELECT id, name, year_of_birth, sex, family_history FROM patient WHERE id = $1`, [
        patientId,
      ]);

      if (!patientRow) return null;

      const patient: Patient = {
        id: patientRow.id,
        name: patientRow.name,
        yearOfBirth: patientRow.year_of_birth,
        sex: patientRow.sex,
        familyHistory: patientRow.family_history,
      };

      const rows = await query<{
        id: string;
        visit_id: string;
        patient_id: string;
        raw_text: string;
        body_region: string;
        region_source: string;
        inherited_text: string | null;
        embed_model: string | null;
        has_embedding: boolean;
        occurred_at: Date;
      }>(
        `
        SELECT c.id, c.visit_id, c.patient_id, c.raw_text, c.body_region,
               c.region_source, c.embed_model, c.occurred_at,
               (c.embedding IS NOT NULL) AS has_embedding,
               src.raw_text AS inherited_text
          FROM complaint c
          LEFT JOIN complaint src ON src.id = c.region_inherited_from
         WHERE c.patient_id = $1
         ORDER BY c.occurred_at ASC
        `,
        [patientId],
      );

      const complaints: ChartComplaint[] = rows.map((r) => ({
        id: r.id,
        visitId: r.visit_id,
        patientId: r.patient_id,
        rawText: r.raw_text,
        bodyRegion: r.body_region as Region,
        occurredAt: new Date(r.occurred_at),
        regionSource: r.region_source as RegionSource,
        inheritedFromText: r.inherited_text,
        embedModel: r.embed_model,
        hasEmbedding: r.has_embedding,
      }));

      const flags = detectAll(complaints, now);
      const sbar = buildSbar({ patient, complaints, flags, now, degraded: false });

      return { patient, complaints, flags, sbar };
    },
    null,
    MEMORY_TIMEOUT_MS,
  );
}

export interface RecallAudit {
  id: string;
  queryText: string;
  matchesFound: number;
  topDistance: number | null;
  latencyMs: number;
  degraded: boolean;
  degradedReason: string | null;
  embedProvider: string;
  createdAt: Date;
}

/** The audit trail, newest first. Rendered on the method page. */
export async function recentRecalls(
  limit = 20,
): Promise<MemoryOutcome<RecallAudit[]>> {
  return withMemory(
    async () => {
      const rows = await query<{
        id: string;
        query_text: string;
        matches_found: number;
        top_distance: string | null;
        latency_ms: number;
        degraded: boolean;
        degraded_reason: string | null;
        embed_provider: string;
        created_at: Date;
      }>(
        `SELECT id, query_text, matches_found, top_distance, latency_ms,
                degraded, degraded_reason, embed_provider, created_at
           FROM recall_event
          ORDER BY created_at DESC
          LIMIT $1`,
        [limit],
      );

      return rows.map((r) => ({
        id: r.id,
        queryText: r.query_text,
        matchesFound: r.matches_found,
        topDistance: r.top_distance === null ? null : Number(r.top_distance),
        latencyMs: r.latency_ms,
        degraded: r.degraded,
        degradedReason: r.degraded_reason,
        embedProvider: r.embed_provider,
        createdAt: new Date(r.created_at),
      }));
    },
    [],
    MEMORY_TIMEOUT_MS,
  );
}
