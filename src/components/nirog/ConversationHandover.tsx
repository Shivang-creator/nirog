"use client";

import { useCase } from "@/lib/nirog/caseStore";

/**
 * The letter ARIA writes from the conversation you just had.
 *
 * Distinct from the SBAR above it, and the distinction is the point. That one is
 * assembled from CockroachDB rows by a fixed rule and exists whether or not any
 * model is reachable. This one is written by gpt-oss from the transcript, and it
 * is the model's *reading* of what was said — candidates to verify, and an
 * honest list of what the intake never covered.
 *
 * It lives in the tab's case store rather than the database because it belongs
 * to this conversation: open the case file without having spoken to her and
 * there is nothing here to show, which is correct.
 */

const TRIAGE: Record<string, { label: string; bg: string; fg: string }> = {
  emergency: { label: "Emergency", bg: "#fde8ea", fg: "#c02434" },
  urgent: { label: "Urgent", bg: "#fdf1dd", fg: "#a35b06" },
  routine: { label: "Routine", bg: "#e8f0fe", fg: "#1a56b8" },
  self_care: { label: "Self care", bg: "#e6f5ec", fg: "#127a3d" },
};

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-4">
      <p className="label">{title}</p>
      <ul className="mt-1.5 space-y-1">
        {items.map((t, i) => (
          <li key={i} style={{ fontSize: 14, lineHeight: "21px", color: "var(--ink)" }}>
            · {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ConversationHandover() {
  const kase = useCase();
  const h = kase.handover;

  // Nothing was said in this tab, so there is nothing to hand over. Say so only
  // if she got as far as finishing — otherwise this panel is simply not yet due.
  if (!h) {
    if (!kase.complete) return null;
    return (
      <section
        className="rounded-3xl px-7 py-7"
        style={{ background: "#fff", border: "1px solid var(--hairline)", boxShadow: "var(--shadow-card)" }}
      >
        <p className="label">From your conversation</p>
        <p className="mt-2" style={{ fontSize: 14, color: "var(--gray)" }}>
          ARIA is still writing this up. It takes a few seconds, and the record
          above does not wait for it.
        </p>
      </section>
    );
  }

  const t = TRIAGE[h.recommendation.triage_level] ?? TRIAGE.routine;

  return (
    <section
      className="rounded-3xl px-7 py-7"
      style={{ background: "#fff", border: "1px solid var(--hairline)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="label">From your conversation</p>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 999,
            background: t.bg,
            color: t.fg,
          }}
        >
          {t.label}
        </span>
      </div>

      <p className="mt-3" style={{ fontSize: 15, lineHeight: "23px", color: "var(--ink)" }}>
        {h.situation.summary}
      </p>
      {h.situation.duration && (
        <p className="mt-1" style={{ fontSize: 13, color: "var(--gray3)" }}>
          {h.situation.chief_complaint} · {h.situation.duration}
        </p>
      )}

      <List title="History" items={h.background.history_of_presenting_complaint} />
      <List title="Associated symptoms" items={h.background.associated_symptoms} />

      {h.assessment.candidate_conditions.length > 0 && (
        <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--hairline)" }}>
          <p className="label">For the doctor to verify</p>
          {h.assessment.candidate_conditions.map((c, i) => (
            <div key={i} className="mt-2.5">
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{c.condition}</p>
              <p style={{ fontSize: 13, lineHeight: "19px", color: "var(--gray)" }}>{c.rationale}</p>
            </div>
          ))}
        </div>
      )}

      <List title="Red flags" items={h.assessment.red_flags} />

      {/*
        What the conversation did NOT cover. As clinically useful as what it did,
        and the reason this is a handover rather than a summary.
      */}
      <List title="Not established" items={h.assessment.not_established} />
      <List title="Questions for the clinician" items={h.recommendation.questions_for_clinician} />

      <p className="mt-5 pt-4" style={{ borderTop: "1px solid var(--hairline)", fontSize: 12, lineHeight: "18px", color: "var(--gray3)" }}>
        {h.meta.disclaimer} Written by {h.meta.generated_by}.
      </p>
    </section>
  );
}
