"use client";

import { useCase } from "@/lib/nirog/caseStore";

/**
 * What ARIA said when she raised a red flag, in writing.
 *
 * When the conversation turns up a red flag she tells the patient to seek
 * emergency care, and 1.2 seconds later the home screen sends them here. Until
 * now this page showed nothing about it. Her advice existed only as audio that
 * the navigation had just walked away from — and audio is the one channel this
 * app already knows it cannot rely on: the browser may not have unlocked it,
 * the phone may be on silent, the voice request may have failed.
 *
 * Worse, the first thing on this page is the recurrence panel, which for most
 * patients is the green "Nothing recurring … this is an answer, not a blank".
 * That sentence is about visit history. Read by someone who was just told to
 * go to hospital and did not hear it, it is an all-clear.
 *
 * So the flag is repeated here as text, first on the page, in her own words,
 * and it stays for as long as the conversation does.
 */
export function RedFlagNotice() {
  const kase = useCase();
  if (!kase.redFlag && kase.flags.length === 0) return null;

  return (
    <section
      role="alert"
      className="mb-6 rounded-3xl px-7 py-6"
      style={{ background: "#fde8ea", border: "1px solid #f3b6bd" }}
    >
      <p className="label" style={{ color: "#c02434" }}>
        This may need urgent care
      </p>
      <p
        className="mt-2 max-w-2xl"
        style={{ fontSize: 17, fontWeight: 600, lineHeight: "24px", color: "var(--ink)" }}
      >
        Something you told ARIA can be a sign of an emergency. Please do not
        wait for this app or for a callback.
      </p>

      {kase.flags.length > 0 && (
        <ul className="mt-3 space-y-2">
          {kase.flags.map((f) => (
            <li key={f.id || f.label} style={{ fontSize: 15, lineHeight: "22px", color: "var(--ink)" }}>
              <span style={{ fontWeight: 600 }}>{f.label}</span>
              {f.advice ? <> — {f.advice}</> : null}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 max-w-2xl" style={{ fontSize: 15, lineHeight: "22px", color: "var(--ink)" }}>
        Go to the nearest hospital or call your local emergency number now (in
        India, 112, or 108 for an ambulance).
      </p>
      <p className="mt-3" style={{ fontSize: 12.5, lineHeight: "18px", color: "var(--gray)" }}>
        ARIA is not a doctor and this is not a diagnosis. The panels below are
        about your past visits, not about how serious today is.
      </p>
    </section>
  );
}
