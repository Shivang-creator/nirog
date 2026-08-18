import { listPatients } from "@/lib/memory/queries";
import { DegradedPanel } from "@/components/Panels";
import { IntakeForm } from "./IntakeForm";

export const dynamic = "force-dynamic";

export default async function Intake() {
  const outcome = await listPatients();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <p className="label mb-3">Intake</p>
      <h1 className="text-[28px] tracking-[-0.015em] font-medium">
        Say something a patient would say
      </h1>
      <p className="mt-3 text-[15px] text-ink-2 leading-[1.6] max-w-xl">
        It gets embedded, written to CockroachDB, and compared against
        everything that patient has said before. You will see the distance to
        each match, how the body region was decided, and whether the recurrence
        rule fires.
      </p>

      {outcome.degraded ? (
        <div className="mt-8">
          <DegradedPanel reason={outcome.reason} />
        </div>
      ) : outcome.value.length === 0 ? (
        <div className="mt-8 rounded-lg border border-rule px-5 py-4 text-[14px] text-ink-2">
          No patients yet. Run{" "}
          <code className="font-mono text-[13px]">npm run db:seed</code> first.
        </div>
      ) : (
        <IntakeForm
          patients={outcome.value.map((p) => ({
            id: p.id,
            name: p.name,
            complaintCount: p.complaintCount,
            synthetic: p.synthetic,
          }))}
        />
      )}

      <p className="mt-10 text-[13px] text-ink-3 leading-[1.6] max-w-xl">
        Try{" "}
        <span className="quote">
          &ldquo;the ache is back again&rdquo;
        </span>{" "}
        on Anita. It names no body part &mdash; the word &ldquo;back&rdquo; there
        means <em>returned</em> &mdash; so the region has to come from memory.
        Then try the same sentence on Rahul, who has no lumbar history, and watch
        it stay unclassified.
      </p>
    </div>
  );
}
