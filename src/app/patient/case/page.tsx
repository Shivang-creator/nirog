import Link from "next/link";
import { query, MEMORY_TIMEOUT_MS } from "@/lib/memory/db";
import { withMemory, DEGRADED_NOTICE } from "@/lib/memory/degrade";
import { getChart } from "@/lib/memory/queries";
import { REGION_LABELS } from "@/lib/clinical/regions";
import { renderSbar } from "@/lib/clinical/sbar";
import { HideScene } from "@/components/nirog/SceneVisibility";
import { ConversationHandover } from "@/components/nirog/ConversationHandover";

export const dynamic = "force-dynamic";

/**
 * The case file.
 *
 * On the phone this is one column you scroll. On a laptop that column looks
 * lost, so the layout splits: the verdict and the handover sit in the main
 * column, and the timeline runs beside them where it can be read against the
 * dates rather than after them.
 */

function fmt(d: Date) {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
  const chartOutcome = idOutcome.value ? await getChart(idOutcome.value) : null;

  const degraded = idOutcome.degraded || (chartOutcome?.degraded ?? false);
  const chart = chartOutcome?.value ?? null;
  const flag = chart?.flags[0] ?? null;
  const inherited = chart?.complaints.filter((c) => c.regionSource === "inherited") ?? [];

  return (
    <div className="min-h-dvh" style={{ background: "var(--bg)" }}>
      <HideScene />

      <div className="mx-auto w-full max-w-6xl px-6 pt-12 pb-36 lg:px-10 lg:pt-16">
        {/* ---------- header ---------- */}
        <header className="flex flex-wrap items-end justify-between gap-6 pb-8">
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "-0.13px",
                color: "var(--gray)",
              }}
            >
              Nirog
            </p>
            <h1
              className="mt-2"
              style={{
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: "-1.2px",
                lineHeight: "42px",
                color: "var(--ink)",
              }}
            >
              Your case file
            </h1>
            <p
              className="mt-3 max-w-xl"
              style={{ fontSize: 15, lineHeight: "22px", color: "var(--gray)" }}
            >
              Everything you have told ARIA, and what she made of it. Your own
              words are kept exactly as you said them.
            </p>
          </div>

          <div className="flex gap-2.5">
            <Link
              href="/patient"
              className="no-select inline-flex items-center"
              style={{
                padding: "11px 20px",
                borderRadius: 999,
                background: "var(--ink)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.14px",
                boxShadow: "var(--shadow-ink)",
              }}
            >
              Talk to ARIA
            </Link>
            <Link
              href="/patient/doctors"
              className="no-select glass-heavy inline-flex items-center"
              style={{
                padding: "11px 20px",
                borderRadius: 999,
                color: "var(--ink)",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.14px",
              }}
            >
              See a doctor
            </Link>
          </div>
        </header>

        {degraded && (
          <div
            className="rounded-2xl px-6 py-5"
            style={{ background: "#fdf2ec", border: "1px solid #e8d5b5" }}
          >
            <p className="label" style={{ color: "#9a3412" }}>
              Records unreachable
            </p>
            <p
              className="mt-2 max-w-2xl"
              style={{ fontSize: 15, lineHeight: "22px", color: "var(--ink)" }}
            >
              {DEGRADED_NOTICE}
            </p>
          </div>
        )}

        {!degraded && chart && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
            {/* ---------- left: the verdict, then the handover ---------- */}
            <div className="flex flex-col gap-6">
              {flag ? (
                <section
                  className="rounded-3xl px-7 py-7"
                  style={{
                    background: flag.level === "recurrent" ? "#fdf6ec" : "#fff",
                    border: `1px solid ${
                      flag.level === "recurrent" ? "#e8d5b5" : "var(--hairline)"
                    }`,
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p
                      className="label"
                      style={{
                        color: flag.level === "recurrent" ? "#b45309" : "#475569",
                      }}
                    >
                      {flag.level === "recurrent"
                        ? "This keeps coming back"
                        : "You have raised this before"}
                    </p>
                    <p className="tabular" style={{ fontSize: 13, color: "var(--gray3)" }}>
                      {flag.visitCount} visits over {flag.spanDays} days
                    </p>
                  </div>

                  <p
                    className="mt-3"
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      letterSpacing: "-0.7px",
                      lineHeight: "31px",
                      color: "var(--ink)",
                    }}
                  >
                    {REGION_LABELS[flag.region]}
                  </p>

                  <p
                    className="mt-2 max-w-lg"
                    style={{ fontSize: 15, lineHeight: "22px", color: "var(--gray)" }}
                  >
                    You described this {flag.visitCount} separate times without
                    ever using the same words twice. Searching your notes would
                    not have connected them.
                  </p>

                  <p
                    className="mt-5 pt-4"
                    style={{
                      borderTop: "1px solid var(--hairline)",
                      fontSize: 13,
                      lineHeight: "19px",
                      color: "var(--gray)",
                    }}
                  >
                    {flag.rule}. That is a pattern in your record. It is not a
                    diagnosis, and nothing here has worked out the cause.
                  </p>
                </section>
              ) : (
                <section
                  className="rounded-3xl px-7 py-7"
                  style={{
                    background: "#f2f7f3",
                    border: "1px solid var(--hairline)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <p className="label" style={{ color: "#3f6b52" }}>
                    Nothing recurring
                  </p>
                  <p
                    className="mt-3"
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      letterSpacing: "-0.6px",
                      color: "var(--ink)",
                    }}
                  >
                    No pattern in your {chart.complaints.length} complaint
                    {chart.complaints.length === 1 ? "" : "s"}
                  </p>
                  <p
                    className="mt-2 max-w-lg"
                    style={{ fontSize: 15, lineHeight: "22px", color: "var(--gray)" }}
                  >
                    Your history was reached and checked. This is an answer, not
                    a blank.
                  </p>
                </section>
              )}

              {/*
                What she made of the conversation, above the fixed record —
                because it is the thing the patient just did, and it is also the
                thing that can be absent. The SBAR underneath never is.
              */}
              <ConversationHandover />

              {/* ---------- handover ---------- */}
              <section
                className="rounded-3xl px-7 py-7"
                style={{
                  background: "#fff",
                  border: "1px solid var(--hairline)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="label">What the doctor receives</p>
                  <p style={{ fontSize: 12, color: "var(--gray3)" }}>SBAR</p>
                </div>
                <pre
                  className="mt-4 overflow-x-auto"
                  style={{
                    fontSize: 13,
                    lineHeight: "20px",
                    whiteSpace: "pre-wrap",
                    fontFamily: "var(--font-mono), ui-monospace, monospace",
                    color: "var(--ink)",
                  }}
                >
                  {renderSbar(chart.sbar)}
                </pre>
                <ul
                  className="mt-5 space-y-1 pt-4"
                  style={{ borderTop: "1px solid var(--hairline)" }}
                >
                  {chart.sbar.provenance.map((p) => (
                    <li key={p} style={{ fontSize: 12.5, color: "var(--gray3)" }}>
                      {p}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* ---------- right: the timeline ---------- */}
            <aside className="flex flex-col gap-6">
              <section
                className="rounded-3xl px-7 py-7"
                style={{
                  background: "#fff",
                  border: "1px solid var(--hairline)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="label">Everything on record</p>
                  <p className="tabular" style={{ fontSize: 12, color: "var(--gray3)" }}>
                    {chart.complaints.length}
                  </p>
                </div>

                <ol className="mt-5">
                  {chart.complaints.map((c, i) => {
                    const partOfFlag = flag?.complaints.some((f) => f.id === c.id);
                    return (
                      <li key={c.id} className="relative flex gap-4 pb-6 last:pb-0">
                        {/* the thread */}
                        {i < chart.complaints.length - 1 && (
                          <span
                            aria-hidden
                            className="absolute"
                            style={{
                              left: 5,
                              top: 16,
                              bottom: 0,
                              width: 1,
                              background: "var(--hairline)",
                            }}
                          />
                        )}
                        <span
                          aria-hidden
                          className="relative mt-1.5 shrink-0"
                          style={{
                            width: 11,
                            height: 11,
                            borderRadius: 6,
                            background: partOfFlag ? "#b45309" : "var(--gray3)",
                            outline: partOfFlag ? "3px solid #fdf6ec" : "none",
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className="tabular"
                            style={{ fontSize: 12.5, color: "var(--gray3)" }}
                          >
                            {fmt(c.occurredAt)}
                          </p>
                          <p
                            className="mt-1"
                            style={{
                              fontSize: 15,
                              fontStyle: "italic",
                              lineHeight: "21px",
                              color: "var(--ink)",
                            }}
                          >
                            &ldquo;{c.rawText}&rdquo;
                          </p>
                          <div
                            className="mt-2 flex flex-wrap items-center gap-2"
                            style={{ fontSize: 12, color: "var(--gray3)" }}
                          >
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: 999,
                                border: "1px solid var(--hairline)",
                              }}
                            >
                              {REGION_LABELS[c.bodyRegion]}
                            </span>
                            {c.regionSource === "inherited" && (
                              <span style={{ color: "#b45309" }}>
                                matched from an earlier visit
                              </span>
                            )}
                            {!c.hasEmbedding && (
                              <span style={{ color: "#9a3412" }}>not indexed</span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>

              {/* The inheritance case, spelled out where it happened. */}
              {inherited.length > 0 && (
                <section
                  className="rounded-3xl px-7 py-6"
                  style={{ background: "#fdf6ec", border: "1px solid #e8d5b5" }}
                >
                  <p className="label" style={{ color: "#b45309" }}>
                    One of these named no body part
                  </p>
                  {inherited.map((c) => (
                    <div key={c.id} className="mt-3">
                      <p
                        style={{
                          fontSize: 15,
                          fontStyle: "italic",
                          lineHeight: "21px",
                          color: "var(--ink)",
                        }}
                      >
                        &ldquo;{c.rawText}&rdquo;
                      </p>
                      <p
                        className="mt-2"
                        style={{ fontSize: 13, lineHeight: "19px", color: "var(--gray)" }}
                      >
                        You said &ldquo;back&rdquo;, meaning it had returned. On
                        its own that sentence points at nothing. Read next to{" "}
                        <span style={{ fontStyle: "italic" }}>
                          &ldquo;{c.inheritedFromText}&rdquo;
                        </span>{" "}
                        it is obviously your lower back, so that is where it was
                        filed.
                      </p>
                    </div>
                  ))}
                </section>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
