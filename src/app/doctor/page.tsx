import Link from "next/link";
import { listPatients, type PatientSummary } from "@/lib/memory/queries";
import { DegradedPanel, fmtDate } from "@/components/Panels";

export const dynamic = "force-dynamic";

export default async function DoctorList() {
  const outcome = await listPatients();
  const demo = outcome.value.filter((p) => !p.synthetic);
  const synthetic = outcome.value.filter((p) => p.synthetic);

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <p className="label mb-3">Doctor view</p>
      <h1 className="text-[28px] tracking-[-0.015em] font-medium">Patients</h1>
      <p className="mt-3 text-[15px] text-ink-2 max-w-xl leading-[1.6]">
        Open a patient to see what memory found. Two of these three are supposed
        to come back clean &mdash; a tool that only ever finds patterns is not
        detecting anything.
      </p>

      <div className="mt-8">
        {outcome.degraded ? (
          <DegradedPanel reason={outcome.reason} />
        ) : outcome.value.length === 0 ? (
          <div className="rounded-lg border border-rule px-5 py-4 text-[14px] text-ink-2">
            No patients yet. Run{" "}
            <code className="font-mono text-[13px]">npm run db:seed</code> to
            load the demo chart.
          </div>
        ) : (
          <>
            <PatientList patients={demo} />

            {/*
              The synthetic rows exist so query plans and latency are measured
              against a table the size of a real clinic. They are pushed below a
              divider and folded away because a reviewer opening this page alone
              needs to land on the demo, not scroll past four hundred rows of
              filler looking for it.
            */}
            {synthetic.length > 0 && (
              <details className="mt-10">
                <summary className="text-[13px] text-ink-3 cursor-pointer hover:text-ink">
                  {synthetic.length} synthetic patients &mdash; generated filler,
                  so the table is the size of a real clinic
                </summary>
                <p className="mt-3 mb-4 text-[13px] text-ink-3 max-w-xl leading-[1.6]">
                  Loaded by{" "}
                  <code className="font-mono text-[12px]">npm run db:volume</code>.
                  Their complaints are drawn from a small phrase bank, so they are
                  useful for measuring and useless for reading. Nothing in the
                  demo depends on them.
                </p>
                <PatientList patients={synthetic} />
              </details>
            )}
          </>
        )}
      </div>

      <p className="mt-6 text-[12px] text-ink-3">
        Read latency {outcome.latencyMs}ms.
      </p>
    </div>
  );
}

function PatientList({ patients }: { patients: PatientSummary[] }) {
  if (patients.length === 0) return null;
  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {patients.map((p) => (
        <li key={p.id}>
          <Link
            href={`/doctor/${p.id}`}
            className="flex items-baseline justify-between gap-4 py-4 hover:bg-panel px-2 -mx-2 rounded"
          >
            <div className="min-w-0">
              <p className="text-[16px]">{p.name}</p>
              <p className="mt-1 text-[13px] text-ink-3">
                {new Date().getFullYear() - p.yearOfBirth} &middot; {p.sex}
                {p.familyHistory ? ` · ${p.familyHistory}` : ""}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[13px] text-ink-2 tabular-nums">
                {p.visitCount} visit{p.visitCount === 1 ? "" : "s"} &middot;{" "}
                {p.complaintCount} complaint
                {p.complaintCount === 1 ? "" : "s"}
              </p>
              {p.lastSeen && (
                <p className="mt-1 text-[12px] text-ink-3 tabular-nums">
                  last seen {fmtDate(p.lastSeen)}
                </p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
