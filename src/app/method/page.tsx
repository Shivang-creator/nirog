import { recentRecalls } from "@/lib/memory/queries";
import {
  RECALL_THRESHOLD,
  BEDROCK_RECALL_THRESHOLD,
} from "@/lib/memory/recall";
import {
  INHERIT_THRESHOLD,
  BEDROCK_INHERIT_THRESHOLD,
} from "@/lib/clinical/resolve";
import { DEFAULT_CONFIG } from "@/lib/clinical/recurrence";

export const dynamic = "force-dynamic";

export default async function Method() {
  const audit = await recentRecalls(12);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <p className="label mb-3">Method</p>
      <h1 className="text-[28px] tracking-[-0.015em] font-medium">
        How it works, and what it cannot do
      </h1>

      {/* ---- Architecture ---- */}
      <section className="mt-10">
        <h2 className="text-[17px] font-medium">Two layers</h2>
        <p className="mt-3 text-[15px] leading-[1.7] text-ink-2">
          The embedding finds candidates. A fixed rule decides what they mean.
          Keeping those apart is what makes the flag defensible &mdash; a doctor
          asking &ldquo;why did you flag this?&rdquo; gets arithmetic, not a
          similarity score.
        </p>
        <dl className="mt-5 space-y-4">
          <Row
            k="Semantic recall"
            v={`Amazon Titan Text Embeddings V2, 1024 dimensions, cosine distance. A prior complaint is surfaced when distance ≤ ${BEDROCK_RECALL_THRESHOLD} (${RECALL_THRESHOLD} on the offline fallback embedder — distances are only comparable within one embedding space, so each has its own cut-off).`}
          />
          <Row
            k="Region inheritance"
            v={`When a complaint names no body part, the region is adopted from the nearest prior complaint — but only at distance ≤ ${BEDROCK_INHERIT_THRESHOLD} (${INHERIT_THRESHOLD} offline), stricter than plain recall. The bar for acting on a match is higher than the bar for showing it.`}
          />
          <Row
            k="Recurrence rule"
            v={`${DEFAULT_CONFIG.recurrentVisits} or more separate visits naming one body region within ${DEFAULT_CONFIG.recurrentWindowDays} days. ${DEFAULT_CONFIG.watchVisits} within ${DEFAULT_CONFIG.watchWindowDays} days is flagged for awareness only. No model is involved in this step.`}
          />
          <Row
            k="Visits, not complaints"
            v="Three complaints logged in one appointment are one presentation. Counting complaints would let a talkative patient trigger a recurrence on their first visit."
          />
        </dl>
      </section>

      {/* ---- Storage ---- */}
      <section className="mt-12">
        <h2 className="text-[17px] font-medium">One database, one row</h2>
        <p className="mt-3 text-[15px] leading-[1.7] text-ink-2">
          The embedding lives in the same table as the complaint it belongs to,
          written in the same statement. There is no separate vector store, so
          there is no window in which a complaint exists but is not yet
          searchable &mdash; and an agent cannot tell the difference between
          &ldquo;not indexed yet&rdquo; and &ldquo;never happened.&rdquo;
        </p>
        <pre className="mt-4 p-4 rounded-lg border border-rule bg-panel font-mono text-[12px] leading-[1.6] overflow-x-auto">
{`CREATE VECTOR INDEX complaint_embedding_idx
  ON complaint (patient_id, embedding vector_cosine_ops);

-- patient_id as a prefix column means a lookup searches only
-- that patient's vectors:
--
--   • vector search
--       table: complaint@complaint_embedding_idx
--       prefix spans: [/'<patient-uuid>' - /'<patient-uuid>']
--
-- A query that cannot express "search everyone" cannot
-- accidentally do it.`}
        </pre>
      </section>

      {/* ---- Degradation ---- */}
      <section className="mt-12">
        <h2 className="text-[17px] font-medium">When memory is unreachable</h2>
        <p className="mt-3 text-[15px] leading-[1.7] text-ink-2">
          A failed lookup never returns an empty list. On screen,{" "}
          <em>&ldquo;no prior complaints&rdquo;</em> and{" "}
          <em>&ldquo;could not check&rdquo;</em> would both render as a chart
          with no warning, and a doctor reads that absence as reassurance. So
          every read returns an outcome that says which of the two it is, the UI
          renders an amber panel instead of a green one, and the event is
          written to the audit table below.
        </p>
      </section>

      {/* ---- Audit ---- */}
      <section className="mt-12">
        <h2 className="text-[17px] font-medium">Recent recalls</h2>
        <p className="mt-3 text-[15px] leading-[1.7] text-ink-2">
          Every memory query, including the ones that failed and the ones that
          found nothing. This is the difference between an agent you can audit
          and one you have to trust.
        </p>

        {audit.degraded ? (
          <p className="mt-4 text-[14px]" style={{ color: "var(--down)" }}>
            The audit log itself could not be read.
          </p>
        ) : audit.value.length === 0 ? (
          <p className="mt-4 text-[14px] text-ink-2">
            Nothing yet. Submit an intake and it will appear here.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-[12px] border-collapse">
              <thead>
                <tr className="text-left text-ink-3 border-b border-rule">
                  <th className="py-2 pr-3 font-normal">Query</th>
                  <th className="py-2 pr-3 font-normal tabular-nums">Hits</th>
                  <th className="py-2 pr-3 font-normal tabular-nums">Nearest</th>
                  <th className="py-2 pr-3 font-normal tabular-nums">ms</th>
                  <th className="py-2 font-normal">Provider</th>
                </tr>
              </thead>
              <tbody>
                {audit.value.map((a) => (
                  <tr key={a.id} className="border-b border-rule align-top">
                    <td className="py-2 pr-3 max-w-[240px]">
                      <span className="quote">{a.queryText}</span>
                      {a.degraded && (
                        <span
                          className="block mt-0.5"
                          style={{ color: "var(--down)" }}
                        >
                          degraded: {a.degradedReason}
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-3 tabular-nums">{a.matchesFound}</td>
                    <td className="py-2 pr-3 tabular-nums font-mono">
                      {a.topDistance === null ? "—" : a.topDistance.toFixed(3)}
                    </td>
                    <td className="py-2 pr-3 tabular-nums">{a.latencyMs}</td>
                    <td className="py-2 font-mono text-[11px] text-ink-3">
                      {a.embedProvider}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ---- Limits ---- */}
      <section className="mt-12 pb-8">
        <h2 className="text-[17px] font-medium">Honest limits</h2>
        <ul className="mt-4 space-y-3 text-[15px] leading-[1.65] text-ink-2">
          <li>
            <strong className="text-ink font-medium">
              It does not diagnose, and it is not a medical device.
            </strong>{" "}
            It reports that a pattern exists in a record. The cause is not
            assessed and never will be by this software.
          </li>
          <li>
            <strong className="text-ink font-medium">
              The body-region lexicon is English-first.
            </strong>{" "}
            It covers a handful of Hindi terms because patients code-switch, but
            a complaint written entirely in another language will land in{" "}
            <em>unclassified</em> and count toward nothing.
          </li>
          <li>
            <strong className="text-ink font-medium">
              Region inheritance can be wrong.
            </strong>{" "}
            If a patient&rsquo;s two conditions are described in similar
            language, an elliptical follow-up could be attached to the wrong
            one. The chart shows every inheritance and what it came from, so a
            clinician can overrule it &mdash; but it is a real failure mode, not
            a hypothetical one.
          </li>
          <li>
            <strong className="text-ink font-medium">
              The thresholds are asserted, not validated.
            </strong>{" "}
            {BEDROCK_RECALL_THRESHOLD} and {BEDROCK_INHERIT_THRESHOLD} (and
            their offline counterparts {RECALL_THRESHOLD} and{" "}
            {INHERIT_THRESHOLD}) were tuned against a labelled battery of
            sentence pairs, not a clinical corpus. Three visits in ninety
            days is a defensible starting point, not a guideline this project is
            in any position to establish.
          </li>
          <li>
            <strong className="text-ink font-medium">
              A complaint recorded while the embedding service was down is
              invisible to semantic recall
            </strong>{" "}
            until it is re-embedded. It still counts toward recurrence, because
            recurrence reads the record rather than the index &mdash; but it
            will not surface as a match. The chart marks those rows.
          </li>
          <li>
            <strong className="text-ink font-medium">n is small.</strong> Three
            seeded patients. Nothing here has been tested against real clinical
            data, and the failure modes that matter would only appear there.
          </li>
        </ul>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid sm:grid-cols-[160px_1fr] gap-1 sm:gap-4">
      <dt className="text-[13px] text-ink-3 pt-0.5">{k}</dt>
      <dd className="text-[14px] leading-[1.6] text-ink-2">{v}</dd>
    </div>
  );
}
