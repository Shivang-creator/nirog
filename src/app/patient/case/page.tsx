import Link from "next/link";
import { query, MEMORY_TIMEOUT_MS } from "@/lib/memory/db";
import { withMemory } from "@/lib/memory/degrade";
import { getChart } from "@/lib/memory/queries";
import { REGION_LABELS } from "@/lib/clinical/regions";
import { renderSbar } from "@/lib/clinical/sbar";
import { HideScene } from "@/components/nirog/SceneVisibility";
import { DEGRADED_NOTICE } from "@/lib/memory/degrade";

export const dynamic = "force-dynamic";

/**
 * The case file.
 *
 * In the mobile app this screen fills up from the live ARIA interview. Here it
 * is fed by memory as well, which is the point of the project: what the patient
 * said months ago is part of the case whether or not they mention it again
 * today, and it is the part a five-minute consultation loses first.
 */

function fmt(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

async function demoPatientId() {
  return withMemory(
    async () => {
      const [r] = await query<{ id: string }>(
        `SELECT id FROM patient WHERE name = 'Rahul' LIMIT 1`,
      );
      return r?.id ?? null;
    },
    null,
    MEMORY_TIMEOUT_MS,
  );
}

export default async function CasePage() {
  const idOutcome = await demoPatientId();
  const chartOutcome = idOutcome.value
    ? await getChart(idOutcome.value)
    : null;

  const degraded = idOutcome.degraded || (chartOutcome?.degraded ?? false);
  const chart = chartOutcome?.value ?? null;
  const flag = chart?.flags[0] ?? null;

  return (
    <div className="min-h-dvh" style={{ background: "var(--bg)" }}>
      <HideScene />

      <div className="mx-auto w-full max-w-2xl px-5 pt-14 pb-32">
        <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.14px", color: "var(--gray)" }}>
          Nirog
        </p>
        <h1
          style={{
            fontSize: 30, fontWeight: 700, letterSpacing: "-0.9px",
            lineHeight: "34px", marginTop: 8, color: "var(--ink)",
          }}
        >
          Your case
          <br />
          <span style={{ color: "var(--gray3)" }}>file.</span>
        </h1>

        {/* ---- memory unreachable ---- */}
        {degraded && (
          <div
            className="mt-7 rounded-2xl px-5 py-4"
            style={{ background: "#fdf2ec", border: "1px solid #e8d5b5" }}
          >
            <p className="label" style={{ color: "#9a3412" }}>Memory unreachable</p>
            <p className="mt-2" style={{ fontSize: 14, lineHeight: "20px", color: "var(--ink)" }}>
              {DEGRADED_NOTICE}
            </p>
          </div>
        )}

        {/* ---- recurrence ---- */}
        {!degraded && chart && (
          <>
            {flag ? (
              <div
                className="mt-7 rounded-2xl px-5 py-5"
                style={{
                  background: flag.level === "recurrent" ? "#fdf6ec" : "#f4f5f7",
                  border: `1px solid ${flag.level === "recurrent" ? "#e8d5b5" : "var(--hairline)"}`,
                }}
              >
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <p
                    style={{
                      fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
                      fontWeight: 600,
                      color: flag.level === "recurrent" ? "#b45309" : "#475569",
                    }}
                  >
                    {flag.level === "recurrent" ? "Recurrence found" : "Repeat presentation"}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--gray3)" }}>
                    {flag.visitCount} visits · {flag.spanDays} days
                  </p>
                </div>

                <p className="mt-2" style={{ fontSize: 16, color: "var(--ink)" }}>
                  {REGION_LABELS[flag.region]} — you have raised this{" "}
                  {flag.visitCount} times.
                </p>

                <ol className="mt-4 space-y-3">
                  {flag.complaints.map((c) => (
                    <li key={c.id} className="flex gap-3" style={{ fontSize: 14, lineHeight: "20px" }}>
                      <span
                        className="shrink-0 tabular"
                        style={{ width: 86, color: "var(--gray3)" }}
                      >
                        {fmt(c.occurredAt)}
                      </span>
                      <span style={{ fontStyle: "italic", color: "var(--ink)" }}>
                        &ldquo;{c.rawText}&rdquo;
                      </span>
                    </li>
                  ))}
                </ol>

                <p
                  className="mt-4 pt-3"
                  style={{ borderTop: "1px solid var(--hairline)", fontSize: 12, color: "var(--gray)" }}
                >
                  Linked by meaning, not by matching words. {flag.rule}. This is a
                  pattern in your record, not a diagnosis.
                </p>
              </div>
            ) : (
              <div
                className="mt-7 rounded-2xl px-5 py-5"
                style={{ background: "#f2f7f3", border: "1px solid var(--hairline)" }}
              >
                <p
                  style={{
                    fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
                    fontWeight: 600, color: "#3f6b52",
                  }}
                >
                  No recurrence
                </p>
                <p className="mt-2" style={{ fontSize: 16, color: "var(--ink)" }}>
                  Nothing in your {chart.complaints.length} recorded complaint
                  {chart.complaints.length === 1 ? "" : "s"} forms a pattern.
                </p>
                <p className="mt-2" style={{ fontSize: 13, color: "var(--gray)" }}>
                  That is a real answer — your history was reached and checked.
                </p>
              </div>
            )}

            {/* ---- everything on record ---- */}
            {chart.complaints.length > 0 && (
              <section className="mt-10">
                <p className="label">Everything on record</p>
                <ul
                  className="mt-3"
                  style={{ borderTop: "1px solid var(--hairline)" }}
                >
                  {chart.complaints.map((c) => (
                    <li
                      key={c.id}
                      className="py-4"
                      style={{ borderBottom: "1px solid var(--hairline)" }}
                    >
                      <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                        <span
                          className="shrink-0 tabular"
                          style={{ width: 86, fontSize: 13, color: "var(--gray3)" }}
                        >
                          {fmt(c.occurredAt)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p style={{ fontSize: 15, fontStyle: "italic", lineHeight: "21px", color: "var(--ink)" }}>
                            &ldquo;{c.rawText}&rdquo;
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2" style={{ fontSize: 12, color: "var(--gray3)" }}>
                            <span
                              style={{
                                padding: "2px 7px", borderRadius: 6,
                                border: "1px solid var(--hairline)",
                              }}
                            >
                              {REGION_LABELS[c.bodyRegion]}
                            </span>
                            {c.regionSource === "inherited" && c.inheritedFromText && (
                              <span style={{ color: "#b45309" }}>
                                you did not name a body part — matched to &ldquo;
                                {c.inheritedFromText}&rdquo;
                              </span>
                            )}
                            {!c.hasEmbedding && (
                              <span style={{ color: "#9a3412" }}>
                                not indexed — invisible to recall
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
            <section className="mt-10">
              <div className="flex items-baseline justify-between gap-3">
                <p className="label">Doctor handover · SBAR</p>
                <p style={{ fontSize: 12, color: "var(--gray3)" }}>
                  assembled from your record
                </p>
              </div>
              <pre
                className="mt-3 overflow-x-auto rounded-2xl px-5 py-4"
                style={{
                  background: "#fff", border: "1px solid var(--hairline)",
                  fontSize: 12.5, lineHeight: "19px", whiteSpace: "pre-wrap",
                  fontFamily: "var(--font-mono), ui-monospace, monospace",
                  color: "var(--ink)",
                }}
              >
                {renderSbar(chart.sbar)}
              </pre>
              <ul className="mt-3 space-y-1">
                {chart.sbar.provenance.map((p) => (
                  <li key={p} style={{ fontSize: 12, color: "var(--gray3)" }}>{p}</li>
                ))}
              </ul>
            </section>
          </>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/patient"
            className="inline-flex items-center no-select"
            style={{
              padding: "12px 20px", borderRadius: 999, background: "var(--ink)",
              color: "#fff", fontSize: 15, fontWeight: 600, letterSpacing: "-0.15px",
              boxShadow: "var(--shadow-ink)",
            }}
          >
            Talk to ARIA
          </Link>
          <Link
            href="/patient/doctors"
            className="inline-flex items-center no-select glass-heavy"
            style={{
              padding: "12px 20px", borderRadius: 999, color: "var(--ink)",
              fontSize: 15, fontWeight: 600, letterSpacing: "-0.15px",
            }}
          >
            See a doctor
          </Link>
        </div>
      </div>
    </div>
  );
}
