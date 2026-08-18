import { query } from "@/lib/memory/db";
import { withMemory, MemoryOutcome } from "@/lib/memory/degrade";
import { MEMORY_TIMEOUT_MS } from "@/lib/memory/db";
import { Home } from "@/components/nirog/Home";

export const dynamic = "force-dynamic";

/**
 * Resolve the demo patient.
 *
 * A real deployment would take this from a session. There is no auth here on
 * purpose: a judge testing alone must land on a patient who already has a
 * history, or the memory layer has nothing to demonstrate and the whole point of
 * the project is invisible on first open.
 */
async function demoPatientId(): Promise<MemoryOutcome<string | null>> {
  return withMemory(
    async () => {
      const [row] = await query<{ id: string }>(
        `SELECT id FROM patient WHERE name = 'Rahul' LIMIT 1`,
      );
      return row?.id ?? null;
    },
    null,
    MEMORY_TIMEOUT_MS,
  );
}

export default async function Page() {
  const outcome = await demoPatientId();
  return <Home patientId={outcome.value} />;
}
