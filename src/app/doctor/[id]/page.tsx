import Link from "next/link";
import { notFound } from "next/navigation";
import { getChart } from "@/lib/memory/queries";
import { REGION_LABELS } from "@/lib/clinical/regions";
import { renderSbar } from "@/lib/clinical/sbar";
import { DegradedPanel, FlagPanel, ClearPanel, fmtDate } from "@/components/Panels";

export const dynamic = "force-dynamic";

export default async function Chart({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const outcome = await getChart(id);

  if (!outcome.degraded && outcome.value === null) notFound();

  const chart = outcome.value;
  const sbar = chart?.sbar;

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <Link href="/doctor" className="text-[13px] text-ink-3 hover:text-ink">
        &larr; Patients
      </Link>

      <div className="mt-4 flex items-baseline justify-between gap-4 flex-wrap">
        <h1 className="text-[28px] tracking-[-0.015em] font-medium">
          {chart?.patient.name ?? "Patient"}
        </h1>
        {chart && (
          <p className="text-[13px] text-ink-3">
            {new Date().getFullYear() - chart.patient.yearOfBirth} &middot;{" "}
            {chart.patient.sex}
          </p>
        )}
      </div>

      {chart?.patient.familyHistory && (
        <p className="mt-2 text-[14px] text-ink-2">
          Family history: {chart.patient.familyHistory}
        </p>
      )}

      {/* ---- The banner. Exactly one of three states, never ambiguous. ---- */}
      <div className="mt-8">
        {outcome.degraded ? (
          <DegradedPanel reason={outcome.reason} />
        ) : chart!.flags.length > 0 ? (
          <div className="space-y-4">
            {chart!.flags.map((f) => (
              <FlagPanel key={f.region} flag={f} />
            ))}
          </div>
        ) : (
          <ClearPanel complaintCount={chart!.complaints.length} />
        )}
      </div>

      {/* ---- Full timeline ---- */}
      {chart && chart.complaints.length > 0 && (
        <section className="mt-12">
          <p className="label mb-4">Everything on record</p>
          <ul className="divide-y divide-rule border-y border-rule">
            {chart.complaints.map((c) => (
              <li key={c.id} className="py-4">
                <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                  <span className="text-[13px] text-ink-3 tabular-nums shrink-0 w-[86px]">
                    {fmtDate(c.occurredAt)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="quote text-[15px] leading-[1.55]">
                      &ldquo;{c.rawText}&rdquo;
                    </p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap text-[12px] text-ink-3">
                      <span className="px-1.5 py-0.5 rounded border border-rule">
                        {REGION_LABELS[c.bodyRegion]}
                      </span>

                      {/*
                        The inheritance case, shown rather than hidden. A doctor
                        being told a complaint counts toward a recurrence is
                        entitled to see that its region was inferred and from
                        what — otherwise the flag is an assertion.
                      */}
                      {c.regionSource === "inherited" && c.inheritedFromText && (
                        <span style={{ color: "var(--flag)" }}>
                          region inherited from &ldquo;{c.inheritedFromText}
                          &rdquo;
                        </span>
                      )}
                      {c.regionSource === "none" && (
                        <span>no region named, nothing similar in memory</span>
                      )}
                      {!c.hasEmbedding && (
                        <span style={{ color: "var(--down)" }}>
                          not embedded &mdash; invisible to semantic recall
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---- SBAR ---- */}
      {sbar && (
        <section className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <p className="label">SBAR handover</p>
            <p className="text-[12px] text-ink-3">
              assembled from the record, not written by a model
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-rule bg-panel px-6 py-5 space-y-5">
            <SbarBlock letter="S" title="Situation" lines={[sbar.situation]} />
            <SbarBlock letter="B" title="Background" lines={sbar.background} />
            <SbarBlock letter="A" title="Assessment" lines={sbar.assessment} />
            <SbarBlock
              letter="R"
              title="Recommendation"
              lines={sbar.recommendation}
            />
          </div>

          <details className="mt-4">
            <summary className="text-[13px] text-ink-3 cursor-pointer hover:text-ink">
              Plain text, for pasting into a record system
            </summary>
            <pre className="mt-3 p-4 rounded-lg border border-rule bg-panel font-mono text-[12px] leading-[1.6] whitespace-pre-wrap overflow-x-auto">
              {renderSbar(sbar)}
            </pre>
          </details>

          <ul className="mt-4 space-y-1">
            {sbar.provenance.map((p) => (
              <li key={p} className="text-[12px] text-ink-3">
                {p}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-[12px] text-ink-3">
        Chart read in {outcome.latencyMs}ms.
      </p>
    </div>
  );
}

function SbarBlock({
  letter,
  title,
  lines,
}: {
  letter: string;
  title: string;
  lines: string[];
}) {
  return (
    <div className="flex gap-4">
      <span className="font-mono text-[13px] text-ink-3 shrink-0 w-4 pt-0.5">
        {letter}
      </span>
      <div className="min-w-0 flex-1">
        <p className="label mb-1.5">{title}</p>
        {lines.map((l, i) => (
          <p
            key={i}
            className={
              l.startsWith("  ")
                ? "text-[14px] leading-[1.6] text-ink-2 pl-4"
                : "text-[14px] leading-[1.6] text-ink"
            }
          >
            {l.trim()}
          </p>
        ))}
      </div>
    </div>
  );
}
