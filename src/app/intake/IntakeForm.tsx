"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitComplaint, type IntakeResult } from "./actions";
import { REGION_LABELS } from "@/lib/clinical/regions";

interface PatientOption {
  id: string;
  name: string;
  complaintCount: number;
}

/** Suggested wordings, so a judge testing alone can reproduce the demo. */
const EXAMPLES = [
  "the ache is back again, it's been three weeks now",
  "I keep getting this pain when I stand up from my desk",
  "sharp headache behind my eyes since yesterday",
];

export function IntakeForm({ patients }: { patients: PatientOption[] }) {
  const [result, action, pending] = useActionState<IntakeResult | null, FormData>(
    submitComplaint,
    null,
  );

  return (
    <>
      <form action={action} className="mt-8 space-y-5">
        <div>
          <label htmlFor="patientId" className="label block mb-2">
            Patient
          </label>
          <select
            id="patientId"
            name="patientId"
            required
            defaultValue={patients[0]?.id ?? ""}
            className="w-full sm:w-80 rounded-md border border-rule bg-panel px-3 py-2 text-[14px]"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.complaintCount} on record)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="text" className="label block mb-2">
            In the patient&rsquo;s own words
          </label>
          <textarea
            id="text"
            name="text"
            required
            rows={3}
            maxLength={500}
            placeholder="the ache is back again, it's been three weeks now"
            className="w-full rounded-md border border-rule bg-panel px-3 py-2.5 text-[15px] leading-[1.55] resize-y"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {EXAMPLES.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => {
                  const el = document.getElementById("text") as HTMLTextAreaElement;
                  el.value = e;
                  el.focus();
                }}
                className="text-[12px] px-2 py-1 rounded border border-rule text-ink-2 hover:text-ink hover:bg-panel"
              >
                {e.length > 44 ? e.slice(0, 42) + "…" : e}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 text-[14px] rounded-md bg-ink text-paper hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Asking memory…" : "Record it and ask memory"}
        </button>
      </form>

      {result && <Result result={result} />}
    </>
  );
}

function Result({ result }: { result: IntakeResult }) {
  if (!result.ok) {
    return (
      <div className="mt-8 rounded-lg border border-rule px-5 py-4 text-[14px]">
        <p style={{ color: "var(--down)" }}>{result.error}</p>
      </div>
    );
  }

  const r = result.resolved;
  const matches = result.matches ?? [];

  return (
    <div className="mt-10 space-y-6">
      <div>
        <p className="label mb-2">Recorded</p>
        <p className="quote text-[16px]">&ldquo;{result.text}&rdquo;</p>
      </div>

      {/* What memory found */}
      <div className="rounded-lg border border-rule bg-panel px-5 py-4">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <p className="label">What memory returned</p>
          <p className="text-[12px] text-ink-3 tabular-nums">
            {result.latencyMs}ms
          </p>
        </div>

        {result.memoryDegraded ? (
          <p className="mt-3 text-[14px]" style={{ color: "var(--down)" }}>
            Memory was unreachable, so nothing was checked. The complaint is
            recorded but unlinked.
          </p>
        ) : matches.length === 0 ? (
          <p className="mt-3 text-[14px] text-ink-2">
            Nothing similar in this patient&rsquo;s history. That is a real
            answer &mdash; the search ran and returned nothing above threshold.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {matches.map((m, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-[1.55]">
                <span className="font-mono text-[12px] text-ink-3 shrink-0 pt-0.5 w-14 tabular-nums">
                  {m.distance.toFixed(3)}
                </span>
                <div className="min-w-0">
                  <p className="quote">&ldquo;{m.rawText}&rdquo;</p>
                  <p className="text-[12px] text-ink-3 mt-0.5">
                    {new Date(m.occurredAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    &middot; {REGION_LABELS[m.region]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* How the region was decided */}
      {r && (
        <div className="rounded-lg border border-rule bg-panel px-5 py-4">
          <p className="label">Body region</p>
          <p className="mt-2 text-[15px]">
            {REGION_LABELS[r.region]}
            {r.source === "inherited" && (
              <span className="ml-2 text-[13px]" style={{ color: "var(--flag)" }}>
                inherited from memory
              </span>
            )}
          </p>
          {r.source === "lexicon" && (
            <p className="mt-1.5 text-[13px] text-ink-2">
              Named directly in the text ({r.matchedTerms.join(", ")}).
            </p>
          )}
          {r.source === "inherited" && (
            <p className="mt-1.5 text-[13px] text-ink-2">
              The complaint named no body part. Memory supplied one from{" "}
              <span className="quote">
                &ldquo;{r.inheritedFromText}&rdquo;
              </span>{" "}
              at distance {r.distance?.toFixed(3)}.
            </p>
          )}
          {r.source === "none" && (
            <p className="mt-1.5 text-[13px] text-ink-2">
              No body part named, and nothing in memory close enough to inherit
              from. Left unclassified rather than guessed.
            </p>
          )}
        </div>
      )}

      {/* The rule */}
      <div
        className="rounded-lg border px-5 py-4"
        style={{
          borderColor:
            result.flagLevel === "recurrent" ? "var(--flag-rule)" : "var(--rule)",
          background:
            result.flagLevel === "recurrent" ? "var(--flag-bg)" : "var(--panel)",
        }}
      >
        <p className="label">Recurrence rule</p>
        {result.memoryDegraded ? (
          <p className="mt-2 text-[14px]" style={{ color: "var(--down)" }}>
            Not evaluated &mdash; the history could not be read.
          </p>
        ) : result.flagLevel === "recurrent" ? (
          <p className="mt-2 text-[15px]">
            <strong className="font-medium">Recurrence flagged.</strong>{" "}
            {result.flagVisits} separate visits across {result.flagSpanDays} days
            for this region.
          </p>
        ) : result.flagLevel === "watch" ? (
          <p className="mt-2 text-[15px]">
            Repeat presentation &mdash; {result.flagVisits} visits in{" "}
            {result.flagSpanDays} days. Below the recurrence threshold.
          </p>
        ) : (
          <p className="mt-2 text-[15px] text-ink-2">
            No recurrence. The rule was applied and did not fire.
          </p>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-4 flex-wrap text-[12px] text-ink-3">
        <p>
          Embedding: <span className="font-mono">{result.embedProvider}</span>
          {result.embedFailed && (
            <span style={{ color: "var(--down)" }}>
              {" "}
              &mdash; configured backend failed, fell back
            </span>
          )}
        </p>
        <Link href="/doctor" className="hover:text-ink underline">
          See it on the chart &rarr;
        </Link>
      </div>
    </div>
  );
}
