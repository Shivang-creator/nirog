/**
 * SBAR handover assembly.
 *
 * SBAR (Situation, Background, Assessment, Recommendation) is the standard
 * structure for handing a patient from one clinician to another. Using the
 * format the receiving doctor already reads is most of the battle: a handover
 * nobody can skim is a handover nobody reads.
 *
 * Every field here is assembled from rows in the database. No model writes any
 * of it, so nothing can appear in a handover that did not come from something
 * the patient actually said or a rule that actually fired.
 *
 * This file is careful about one thing above all: it does not diagnose. It
 * reports a pattern and hands it to a human. "Three presentations in six weeks"
 * is an observation. "Likely disc involvement" would be a diagnosis, and this
 * system has no business making one.
 */

import { REGION_LABELS, type Region } from "./regions";
import type { ComplaintRecord, RecurrenceFlag } from "./recurrence";

export interface Patient {
  id: string;
  name: string;
  yearOfBirth: number;
  sex: string;
  familyHistory?: string | null;
}

export interface SbarInput {
  patient: Patient;
  complaints: ComplaintRecord[];
  flags: RecurrenceFlag[];
  now: Date;
  /** True when memory could not be reached — changes the whole document. */
  degraded: boolean;
}

export interface Sbar {
  situation: string;
  background: string[];
  assessment: string[];
  recommendation: string[];
  /** Rendered under the handover so the reader can see what it is built on. */
  provenance: string[];
  degraded: boolean;
}

function age(yearOfBirth: number, now: Date): number {
  return now.getFullYear() - yearOfBirth;
}

function shortDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function weeksAgo(d: Date, now: Date): string {
  const days = Math.round((now.getTime() - d.getTime()) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 14) return `${days} days ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 9) return `${weeks} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
}

export function buildSbar(input: SbarInput): Sbar {
  const { patient, complaints, flags, now, degraded } = input;
  const a = age(patient.yearOfBirth, now);
  const sorted = [...complaints].sort(
    (x, y) => y.occurredAt.getTime() - x.occurredAt.getTime(),
  );
  const latest = sorted[0];
  const strongest = flags[0];

  /* ---------- Situation ---------- */
  const situation = latest
    ? `${a}-year-old ${patient.sex.toLowerCase()}, presenting ${weeksAgo(latest.occurredAt, now)} with: “${latest.rawText}”`
    : `${a}-year-old ${patient.sex.toLowerCase()}. No complaints recorded.`;

  /* ---------- Background ---------- */
  const background: string[] = [];

  if (degraded) {
    background.push(
      "Prior history could not be retrieved. The items below may be incomplete.",
    );
  }

  if (strongest) {
    const region = REGION_LABELS[strongest.region].toLowerCase();
    background.push(
      `${strongest.visitCount} separate presentations involving the ${region} across ${strongest.spanDays} days:`,
    );
    for (const c of strongest.complaints) {
      background.push(`  ${shortDate(c.occurredAt)}  “${c.rawText}”`);
    }
    background.push(
      "Linked by meaning rather than by matching words. The patient described the same problem differently each time.",
    );
  } else if (sorted.length > 1) {
    background.push(`${sorted.length} complaints on record, no recurring pattern:`);
    for (const c of sorted.slice(0, 5)) {
      background.push(`  ${shortDate(c.occurredAt)}  “${c.rawText}”`);
    }
  } else {
    background.push("No prior complaints on record.");
  }

  if (patient.familyHistory) {
    background.push(`Family history: ${patient.familyHistory}`);
  }

  /* ---------- Assessment ---------- */
  const assessment: string[] = [];

  if (degraded) {
    assessment.push(
      "NOT ASSESSED. The patient's history was unavailable when this was written. No recurrence flag appears because none was looked for.",
    );
  } else if (strongest?.level === "recurrent") {
    assessment.push(
      `Recurrent presentation: ${strongest.visitCount} visits in ${strongest.spanDays} days for the same body region.`,
    );
    assessment.push(`Rule applied: ${strongest.rule}.`);
    assessment.push(
      "This is a pattern in the record, not a diagnosis. The cause has not been assessed.",
    );
  } else if (strongest?.level === "watch") {
    assessment.push(
      `Repeat presentation: ${strongest.visitCount} visits in ${strongest.spanDays} days. Below the recurrence threshold, flagged for awareness only.`,
    );
  } else {
    assessment.push(
      "No recurring pattern found in the recorded history. This is a real negative result, not a failure to look.",
    );
  }

  /* ---------- Recommendation ---------- */
  const recommendation: string[] = [];

  if (degraded) {
    recommendation.push(
      "Re-run this handover once the record is reachable, before making a management decision that depends on history.",
    );
  } else if (strongest?.level === "recurrent") {
    recommendation.push(
      "Consider whether repeated symptomatic management is still appropriate, or whether the underlying cause warrants investigation.",
    );
    if (patient.familyHistory) {
      recommendation.push(
        "Family history above may be relevant to that decision.",
      );
    }
    recommendation.push("Clinical judgement required. This tool does not triage.");
  } else if (strongest?.level === "watch") {
    recommendation.push(
      "No action indicated by this tool. Noted in case a third presentation follows.",
    );
  } else {
    recommendation.push("No action indicated by this tool.");
  }

  /* ---------- Provenance ---------- */
  const provenance: string[] = [
    `Assembled ${shortDate(now)} from ${complaints.length} recorded complaint${complaints.length === 1 ? "" : "s"}.`,
    "Every quoted line is the patient's own wording, unedited.",
    "Recurrence determined by a fixed rule, not by a model.",
  ];

  return { situation, background, assessment, recommendation, provenance, degraded };
}

/** Plain-text rendering, used for copy-to-clipboard and the prose pass. */
export function renderSbar(s: Sbar): string {
  const block = (label: string, lines: string[]) =>
    `${label}\n${lines.map((l) => (l.startsWith("  ") ? l : `  ${l}`)).join("\n")}`;
  return [
    `S  ${s.situation}`,
    block("B", s.background),
    block("A", s.assessment),
    block("R", s.recommendation),
  ].join("\n\n");
}

export type { Region };
