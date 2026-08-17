import { REGION_LABELS } from "@/lib/clinical/regions";
import type { RecurrenceFlag } from "@/lib/clinical/recurrence";
import { DEGRADED_NOTICE } from "@/lib/memory/degrade";

export function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * The panel shown when memory could not be reached.
 *
 * Amber, not red: this is not an error the user caused and not a crash. It is
 * the system telling the truth about what it does not know. It deliberately
 * occupies the same position a recurrence flag would, so a doctor scanning the
 * page cannot mistake a broken lookup for a clean one.
 */
export function DegradedPanel({ reason }: { reason?: string }) {
  return (
    <div className="rounded-lg border border-flag-rule bg-down-bg px-5 py-4">
      <p className="label" style={{ color: "var(--down)" }}>
        Memory unreachable
      </p>
      <p className="mt-2 text-[14px] leading-[1.6] text-ink">{DEGRADED_NOTICE}</p>
      {reason && (
        <p className="mt-3 font-mono text-[11px] text-ink-3 break-all">{reason}</p>
      )}
    </div>
  );
}

export function FlagPanel({ flag }: { flag: RecurrenceFlag }) {
  const recurrent = flag.level === "recurrent";
  return (
    <div
      className="rounded-lg border px-5 py-4"
      style={{
        borderColor: recurrent ? "var(--flag-rule)" : "var(--rule)",
        background: recurrent ? "var(--flag-bg)" : "var(--watch-bg)",
      }}
    >
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <p
          className="label"
          style={{ color: recurrent ? "var(--flag)" : "var(--watch)" }}
        >
          {recurrent ? "Recurrence flagged" : "Repeat presentation"}
        </p>
        <p className="text-[12px] text-ink-3">
          {flag.visitCount} visits &middot; {flag.spanDays} days
        </p>
      </div>

      <p className="mt-2 text-[15px] text-ink">
        {REGION_LABELS[flag.region]} &mdash; {flag.visitCount} separate
        presentations across {flag.spanDays} days
      </p>

      <ol className="mt-4 space-y-2.5">
        {flag.complaints.map((c) => (
          <li key={c.id} className="flex gap-3 text-[14px] leading-[1.55]">
            <span className="text-ink-3 tabular-nums shrink-0 w-[86px]">
              {fmtDate(c.occurredAt)}
            </span>
            <span className="quote">&ldquo;{c.rawText}&rdquo;</span>
          </li>
        ))}
      </ol>

      <p className="mt-4 pt-3 border-t text-[12px] text-ink-3" style={{ borderColor: "var(--rule)" }}>
        Rule applied: {flag.rule}. This is a pattern in the record, not a
        diagnosis.
      </p>
    </div>
  );
}

export function ClearPanel({ complaintCount }: { complaintCount: number }) {
  return (
    <div
      className="rounded-lg border px-5 py-4"
      style={{ borderColor: "var(--rule)", background: "var(--clear-bg)" }}
    >
      <p className="label" style={{ color: "var(--clear)" }}>
        No recurrence
      </p>
      <p className="mt-2 text-[15px] text-ink">
        Nothing in this patient&rsquo;s {complaintCount} recorded complaint
        {complaintCount === 1 ? "" : "s"} meets the recurrence rule.
      </p>
      <p className="mt-2 text-[13px] text-ink-2">
        This is a real negative result, not a failure to look. The history was
        reached and checked.
      </p>
    </div>
  );
}
