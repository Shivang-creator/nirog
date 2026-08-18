import "server-only";

import { query, MEMORY_TIMEOUT_MS } from "./db";
import { withMemory, type MemoryOutcome } from "./degrade";

/**
 * The join between the two halves of the product.
 *
 * The clinician's portal and the patient's app were built against different
 * records: the portal carries a scheduling and encounter chart, CockroachDB
 * carries what the patient actually said. Both describe the same person, and
 * until they are joined the doctor is reading a chart that cannot see the
 * memory ARIA is filling in the next room.
 *
 * The link is an explicit table rather than a fuzzy name match. A patient
 * record silently attached to the wrong person's history is the worst failure
 * this system could have, and it is worth far more than the convenience of
 * matching "Rahul Yadav" to "Rahul" automatically. Anything not listed here
 * has no memory record, and the panel says so rather than guessing.
 */
const MEMORY_NAME: Record<string, string> = {
  // Portal patient id → the name their complaints are filed under in CockroachDB.
  pat_rahul: "Rahul",
};

/** True when this portal patient has a memory record to look up at all. */
export function hasMemoryLink(portalPatientId: string): boolean {
  return portalPatientId in MEMORY_NAME;
}

/**
 * The CockroachDB patient id for a portal patient, or null when there is none.
 *
 * Returns a MemoryOutcome, so an unreachable database is distinguishable from
 * a patient who genuinely has no memory record — the distinction the whole
 * degradation story rests on.
 */
export async function memoryIdFor(
  portalPatientId: string,
): Promise<MemoryOutcome<string | null>> {
  const name = MEMORY_NAME[portalPatientId];
  if (!name) {
    return { ok: true, value: null, degraded: false, latencyMs: 0 };
  }

  return withMemory(
    async () => {
      const [row] = await query<{ id: string }>(
        `SELECT id FROM patient WHERE name = $1 LIMIT 1`,
        [name],
      );
      return row?.id ?? null;
    },
    null,
    MEMORY_TIMEOUT_MS,
  );
}
