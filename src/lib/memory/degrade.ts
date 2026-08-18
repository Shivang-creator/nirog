/**
 * What the agent does when its memory is unreachable.
 *
 * This file is the argument of the whole project, so it is worth stating plainly.
 *
 * The obvious implementation of a failed lookup is to return an empty list. It
 * is also the dangerous one. Downstream, "no prior complaints found" and "could
 * not check for prior complaints" render identically — a chart with no
 * recurrence banner. A doctor reads that absence as reassurance. The agent will
 * have converted an infrastructure failure into a clinical finding, silently,
 * and nobody in the room will know it happened.
 *
 * So a failed recall here is never empty. It is `degraded: true`, it carries the
 * reason, and every surface that renders it is obliged to say out loud that the
 * history could not be checked. The UI shows an amber panel instead of a green
 * all-clear, and the event is written to `recall_event` so it can be audited
 * after the fact rather than inferred.
 *
 * Absence of evidence is not evidence of absence, and an agent that cannot tell
 * the difference should not be near a patient.
 */

export interface MemoryOutcome<T> {
  ok: boolean;
  value: T;
  degraded: boolean;
  reason?: string;
  latencyMs: number;
}

export class MemoryTimeout extends Error {
  constructor(ms: number) {
    super(`memory did not respond within ${ms}ms`);
    this.name = "MemoryTimeout";
  }
}

/**
 * Run a memory read under a hard timeout, converting any failure into an
 * explicit degraded outcome rather than an exception or an empty result.
 *
 * `fallback` is what the caller gets when memory is unreachable. It should be
 * the *neutral* value, never the reassuring one.
 */
export async function withMemory<T>(
  fn: () => Promise<T>,
  fallback: T,
  timeoutMs: number,
): Promise<MemoryOutcome<T>> {
  const started = Date.now();
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    const value = await Promise.race([
      fn(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new MemoryTimeout(timeoutMs)), timeoutMs);
      }),
    ]);
    return { ok: true, value, degraded: false, latencyMs: Date.now() - started };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    // Logged, not swallowed. An operator should be able to find these.
    console.error("[memory] degraded:", reason);
    return {
      ok: false,
      value: fallback,
      degraded: true,
      reason,
      latencyMs: Date.now() - started,
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * The sentence the agent says when it could not reach memory.
 *
 * Deliberately not reassuring, and deliberately not a generic error toast.
 * It names what is unknown and tells the reader what they must not conclude.
 */
export const DEGRADED_NOTICE =
  "This patient's history could not be reached, so nobody has checked it. " +
  "Treat what follows as a first presentation that has not been verified. " +
  "No recurrence flag appears below because none was looked for.";
