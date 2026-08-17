import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="pt-20 pb-16 max-w-2xl">
        <p className="label mb-5">The one question</p>
        <h1 className="text-[34px] sm:text-[42px] leading-[1.12] tracking-[-0.02em] font-medium">
          Has this patient told us this before?
        </h1>
        <p className="mt-7 text-[16px] leading-[1.65] text-ink-2">
          Not what is wrong with them &mdash; that is diagnosis, and software
          should stay out of it. The narrower question is the one nobody can
          answer from memory: <em>have these words been said in this room
          before, in different words?</em>
        </p>
      </section>

      <section className="pb-16 border-t border-rule pt-12">
        <p className="label mb-6">Why it is hard</p>
        <div className="max-w-2xl space-y-5 text-[15px] leading-[1.7] text-ink-2">
          <p>
            In July a patient says{" "}
            <span className="quote">
              &ldquo;my lower back has been aching for a few days.&rdquo;
            </span>
          </p>
          <p>
            Three weeks later, to a different clinician:{" "}
            <span className="quote">
              &ldquo;I keep getting this pain when I stand up from my desk.&rdquo;
            </span>
          </p>
          <p>
            Six weeks after that:{" "}
            <span className="quote">
              &ldquo;the ache is back again.&rdquo;
            </span>
          </p>
          <p className="text-ink">
            Three presentations of one problem. Those first two sentences share{" "}
            <strong className="font-medium">no words at all</strong>, so no
            search over the notes will ever connect them. The third does not name
            a body part &mdash; &ldquo;back&rdquo; there means <em>returned</em>.
          </p>
          <p>
            The recurrence is the diagnostic signal, and it is invisible
            precisely because patients never repeat themselves verbatim. That is
            not a search problem. It is a memory problem.
          </p>
        </div>
      </section>

      <section className="pb-16 border-t border-rule pt-12">
        <p className="label mb-6">What it does</p>
        <div className="grid sm:grid-cols-3 gap-8 max-w-3xl">
          <div>
            <h3 className="text-[15px] font-medium mb-2">Remembers</h3>
            <p className="text-[14px] leading-[1.6] text-ink-2">
              Every complaint is stored in the patient&rsquo;s own words, with an
              embedding written in the same row and the same statement.
            </p>
          </div>
          <div>
            <h3 className="text-[15px] font-medium mb-2">Connects</h3>
            <p className="text-[14px] leading-[1.6] text-ink-2">
              Vector search finds what the patient said before, however
              differently they worded it &mdash; and can supply a body region the
              new complaint never named.
            </p>
          </div>
          <div>
            <h3 className="text-[15px] font-medium mb-2">Flags</h3>
            <p className="text-[14px] leading-[1.6] text-ink-2">
              A fixed arithmetic rule decides whether a pattern is worth
              interrupting a doctor for. No model makes that call.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 border-t border-rule pt-12">
        <p className="label mb-6">When the memory dies</p>
        <div className="max-w-2xl space-y-5 text-[15px] leading-[1.7] text-ink-2">
          <p>
            The obvious way to handle a failed lookup is to return an empty list.
            It is also the dangerous one: on screen,{" "}
            <em>&ldquo;no prior complaints found&rdquo;</em> and{" "}
            <em>&ldquo;could not check for prior complaints&rdquo;</em> both
            render as a chart with no warning on it. A doctor reads that absence
            as reassurance.
          </p>
          <p className="text-ink">
            An infrastructure failure would have become a clinical finding,
            silently, and nobody in the room would know it happened.
          </p>
          <p>
            So Anamnesis never returns an empty history when it means an
            unreachable one. It says which of the two it is, every time, and
            writes a row proving it knew.
          </p>
        </div>
      </section>

      <section className="pb-24 border-t border-rule pt-12">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/doctor"
            className="px-5 py-2.5 text-[14px] rounded-md bg-ink text-paper hover:opacity-90"
          >
            Open the doctor view
          </Link>
          <Link
            href="/intake"
            className="px-5 py-2.5 text-[14px] rounded-md border border-rule hover:bg-panel"
          >
            Try an intake
          </Link>
          <Link
            href="/method"
            className="px-5 py-2.5 text-[14px] rounded-md border border-rule hover:bg-panel"
          >
            How it works
          </Link>
        </div>
        <p className="mt-6 text-[13px] text-ink-3">
          Opens on three seeded patients. Two of them are supposed to come back
          clean &mdash; a tool that only ever finds patterns is not detecting
          anything.
        </p>
      </section>
    </div>
  );
}
