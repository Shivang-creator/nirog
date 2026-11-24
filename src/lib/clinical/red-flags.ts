/**
 * The two rules a model is not allowed to overrule.
 *
 * Everywhere else in this project the deterministic layer holds on its own and
 * the model sits on top of it. The conversation route was the exception: the
 * red flag ARIA raises mid-intake and the triage level on the handover were
 * both whatever gpt-oss returned on that call, with nothing fixed underneath.
 * Two things followed from that.
 *
 * A red flag did not survive the next turn. Each chat response replaced the
 * flags from the one before, and the chat request carries no flags, so a model
 * that said "seek emergency care now" on turn three and returned an empty list
 * on turn four had silently withdrawn it. The handover written at the end then
 * told the doctor no red flags were raised.
 *
 * The triage level could contradict the red flags sitting next to it. Nothing
 * stopped a handover reading "Self care" above a list of red flags, or after
 * ARIA had told the patient to go to hospital.
 *
 * Both are closed here with arithmetic. Neither rule can lower a level or
 * remove a flag: a model may escalate freely, it may not de-escalate.
 *
 * Pure, and no model anywhere in it.
 */

export type TriageLevel = "emergency" | "urgent" | "routine" | "self_care";

export interface IntakeFlag {
  id: string;
  label: string;
  advice: string;
}

const RANK: Record<TriageLevel, number> = {
  self_care: 0,
  routine: 1,
  urgent: 2,
  emergency: 3,
};

/**
 * Red flags accumulate over a conversation; they are never replaced.
 *
 * Keyed by id, falling back to the label, so the same flag reported on two
 * turns is listed once. The earliest wording is kept — it is the one the
 * patient actually heard.
 */
export function mergeFlags(
  previous: readonly IntakeFlag[],
  next: readonly IntakeFlag[],
): IntakeFlag[] {
  const key = (f: IntakeFlag) => (f.id || f.label).trim().toLowerCase();
  const seen = new Set<string>();
  const out: IntakeFlag[] = [];
  for (const f of [...previous, ...next]) {
    const k = key(f);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(f);
  }
  return out;
}

/**
 * A model asked for a list of red flags and finding none tends to write the
 * absence into the list: "None identified", "No red flags reported". Those are
 * not red flags and must not raise a level.
 *
 * Deliberately narrow: the WHOLE entry has to be a statement of absence. A
 * prefix test would also swallow "No urine output for 24 hours" and "Nothing
 * by mouth for two days", which are red flags that happen to open with a
 * negative. Anything this does not recognise counts as a flag, because the
 * miss it guards against is the expensive one.
 */
const FOUND = "(?:identified|reported|noted|found|present|raised|elicited|detected|apparent)";
const ABSENCE = new RegExp(
  "^\\s*(?:" +
    "none|nil|n/?a|" +
    "no\\s+red[\\s-]?flags?|" +
    "no\\s+(?:acute\\s+)?(?:red[\\s-]?flag\\s+)?(?:features|symptoms|signs|concerns)|" +
    `not\\s+(?:${FOUND}|applicable)|` +
    `nothing\\s+${FOUND}` +
    ")" +
    `(?:\\s+(?:were|was|are|is))?(?:\\s+${FOUND})?` +
    "(?:\\s+(?:during|in|at)\\s+(?:the\\s+)?(?:intake|interview|conversation|this\\s+time|present)\\b.*)?" +
    "[\\s.]*$",
  "i",
);

export function realRedFlags(items: readonly string[] | null | undefined): string[] {
  return (items ?? []).filter((s) => s.trim() && !ABSENCE.test(s));
}

export interface TriageFloorInput {
  /** What the model put on the handover. */
  modelLevel: TriageLevel;
  /** Flags ARIA raised during the conversation — each told the patient to seek emergency care. */
  intakeFlags: readonly IntakeFlag[] | null | undefined;
  /** The handover's own red-flag list. */
  handoverRedFlags: readonly string[] | null | undefined;
}

export interface TriageFloorResult {
  level: TriageLevel;
  raised: boolean;
  /** Appended to the rationale so the doctor can see a rule, not the model, set the level. */
  note: string | null;
}

/**
 * The lowest triage level a handover may carry, given what was flagged.
 *
 *   - ARIA raised a red flag in the conversation → emergency. She raises one
 *     only when her instruction is to tell the patient to seek emergency care
 *     now; a handover that then says anything less contradicts what the patient
 *     was told.
 *   - The handover lists a red flag of its own → at least urgent.
 *
 * Never lowers. A model that says "emergency" with no flags keeps it.
 */
export function floorTriage(input: TriageFloorInput): TriageFloorResult {
  const intake = (input.intakeFlags ?? []).filter((f) => (f.label || f.id).trim());
  const listed = realRedFlags(input.handoverRedFlags);

  let floor: TriageLevel = "self_care";
  let why = "";
  if (intake.length > 0) {
    floor = "emergency";
    why = `${intake.length} red flag${intake.length === 1 ? " was" : "s were"} raised during intake`;
  } else if (listed.length > 0) {
    floor = "urgent";
    why = `${listed.length} red flag${listed.length === 1 ? " is" : "s are"} listed in this handover`;
  }

  if (RANK[input.modelLevel] >= RANK[floor]) {
    return { level: input.modelLevel, raised: false, note: null };
  }
  return {
    level: floor,
    raised: true,
    note:
      `Triage raised from ${input.modelLevel.replace("_", " ")} to ${floor} by a fixed rule, ` +
      `not by the model: ${why}.`,
  };
}
