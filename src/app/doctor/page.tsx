import Link from "next/link";
import { listPatients } from "@/lib/memory/queries";
import { DegradedPanel, fmtDate } from "@/components/Panels";

export const dynamic = "force-dynamic";

export default async function DoctorList() {
  const outcome = await listPatients();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <p className="label mb-3">Doctor view</p>
      <h1 className="text-[28px] tracking-[-0.015em] font-medium">Patients</h1>
      <p className="mt-3 text-[15px] text-ink-2 max-w-xl leading-[1.6]">
        Open a patient to see what memory found. Two of these three are supposed
        to come back clean.
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
          <ul className="divide-y divide-rule border-y border-rule">
            {outcome.value.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/doctor/${p.id}`}
                  className="flex items-baseline justify-between gap-4 py-4 hover:bg-panel px-2 -mx-2 rounded"
                >
                  <div>
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
        )}
      </div>

      <p className="mt-6 text-[12px] text-ink-3">
        Read latency {outcome.latencyMs}ms.
      </p>
    </div>
  );
}
