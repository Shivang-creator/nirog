/**
 * Patient id validation.
 *
 * Deliberately its own module with no `server-only` import, so it can be
 * exercised by the offline test suite and reused from anywhere. It is a pure
 * string check; it has no business being coupled to the data layer.
 *
 * Why it exists at all:
 *
 * A patient id that is not a UUID cannot match any row, and we know that
 * without asking the database. Passing one through anyway makes the driver
 * throw, which `withMemory` faithfully reports as `degraded: true`, which
 * renders the "memory unreachable" panel. A mistyped URL would then produce the
 * same warning as a genuine outage.
 *
 * That is worse than an ordinary bug. The degraded panel is the one piece of UI
 * a clinician has to trust without thinking about it, and a warning that also
 * fires on typos is a warning people learn to scroll past — which makes it worth
 * nothing on the day it is real. Bad input is a 404. Only a real failure gets to
 * raise the alarm.
 *
 * Note this is not an injection defence. The queries are parameterised and
 * CockroachDB rejects hostile input safely on its own.
 */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isPatientId(value: string): boolean {
  return UUID_RE.test(value.trim());
}
