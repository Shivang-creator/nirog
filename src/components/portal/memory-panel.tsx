import Link from "next/link";
import { Brain, AlertTriangle, Link2, ArrowUpRight } from "lucide-react";
import { getChart } from "@/lib/memory/queries";
import { memoryIdFor, hasMemoryLink } from "@/lib/memory/link";
import { DEGRADED_NOTICE } from "@/lib/memory/degrade";
import { REGION_LABELS } from "@/lib/clinical/regions";

/**
 * What ARIA heard, on the doctor's screen.
 *
 * The same CockroachDB rows the patient's case file is built from, read here
 * through the same `getChart` call and the same recurrence rule. Nothing is
 * recomputed for the clinician's benefit: if the doctor and the patient ever
 * disagreed about what was said, the record would be worthless.
 *
 * Three states, and the difference between the last two is the point:
 *   - a recurrence the rule fired on, with the visit dates behind it
 *   - no pattern found, said plainly
 *   - memory unreachable, said louder — never rendered as a clean record
 */

function fmt(d: Date) {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function MemoryPanel({ portalPatientId }: { portalPatientId: string }) {
  // A patient with no linked memory record renders nothing at all, rather than
  // an empty panel that reads as "we looked and there was nothing".
  if (!hasMemoryLink(portalPatientId)) return null;

  const idOutcome = await memoryIdFor(portalPatientId);
  const chartOutcome = idOutcome.value ? await getChart(idOutcome.value) : null;

  const degraded = idOutcome.degraded || (chartOutcome?.degraded ?? false);
  const chart = chartOutcome?.value ?? null;
  const flag = chart?.flags[0] ?? null;
  const complaints = chart?.complaints ?? [];

  return (
    <section className="overflow-hidden rounded-2xl border border-hairline bg-panel shadow-quiet">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-soft-blue text-blue">
            <Brain className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Memory</p>
            <p className="text-xs text-ink-soft">
              What this patient has told ARIA before · CockroachDB
            </p>
          </div>
        </div>
        {chart && (
          <Link
            href="/patient/case"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue hover:underline"
          >
            Case file <ArrowUpRight className="size-3" />
          </Link>
        )}
      </div>

      <div className="px-5 py-4">
        {degraded ? (
          /*
           * The one state that must never be quiet. An unreachable history and
           * a clean history look identical on a chart unless something says so.
           */
          <div className="flex gap-2.5 rounded-xl bg-soft-amber px-4 py-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber" />
            <div>
              <p className="text-sm font-semibold text-ink">
                History not assessed
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                {DEGRADED_NOTICE}
              </p>
            </div>
          </div>
        ) : complaints.length === 0 ? (
          <p className="text-sm text-ink-soft">
            No earlier complaints on file. This is a first presentation.
          </p>
        ) : (
          <>
            {flag ? (
              <div
                className={
                  flag.level === "recurrent"
                    ? "rounded-xl bg-soft-red px-4 py-3"
                    : "rounded-xl bg-soft-amber px-4 py-3"
                }
              >
                <p className="text-sm font-semibold text-ink">
                  {flag.level === "recurrent" ? "Recurrence" : "Worth watching"}
                  {" · "}
                  {REGION_LABELS[flag.region]}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                  {flag.visitCount} separate visits in {flag.spanDays} days.{" "}
                  {flag.rule}
                </p>
              </div>
            ) : (
              <p className="text-sm text-ink-soft">
                {complaints.length} earlier complaint
                {complaints.length === 1 ? "" : "s"} on file, with no recurring
                pattern.
              </p>
            )}

            {/*
             * The patient's own words, unedited. A doctor asking "why was this
             * flagged?" gets these dates and these sentences, not a score.
             */}
            <ol className="mt-4 space-y-3">
              {complaints.map((c) => (
                <li key={c.id} className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink-faint" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ink-soft">
                      {fmt(c.occurredAt)} · {REGION_LABELS[c.bodyRegion]}
                      {c.regionSource === "inherited" && (
                        <span className="ml-1.5 inline-flex items-center gap-1 text-blue">
                          <Link2 className="size-3" />
                          region from memory
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-sm text-ink">“{c.rawText}”</p>
                    {c.regionSource === "inherited" && c.inheritedFromText && (
                      <p className="mt-0.5 text-xs text-ink-faint">
                        Named no body part — linked to “{c.inheritedFromText}”
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </section>
  );
}
