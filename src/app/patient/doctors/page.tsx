import Link from "next/link";
import { HideScene } from "@/components/nirog/SceneVisibility";

export const dynamic = "force-dynamic";

/**
 * Where the handover goes.
 *
 * The patient's half of the handoff. The doctor's half of the same moment is
 * /portal, and a reviewer who follows one of these through lands there looking
 * at the patient they were just being.
 */

const DOCTORS = [
  {
    name: "Dr. Ananya Rao",
    spec: "General Physician",
    exp: 11,
    rating: 4.8,
    fee: 249,
    online: true,
    langs: "Hindi, English",
  },
  {
    name: "Dr. Imran Sheikh",
    spec: "Orthopaedics",
    exp: 14,
    rating: 4.7,
    fee: 399,
    online: true,
    langs: "Hindi, Urdu, English",
  },
  {
    name: "Dr. Kavya Menon",
    spec: "Internal Medicine",
    exp: 8,
    rating: 4.9,
    fee: 299,
    online: false,
    langs: "Malayalam, English",
  },
];

export default function DoctorsPage() {
  return (
    <div className="min-h-dvh" style={{ background: "var(--bg)" }}>
      <HideScene />

      <div className="mx-auto w-full max-w-6xl px-6 pt-12 pb-36 lg:px-10 lg:pt-16">
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
              Doctors
            </h1>
            <p
              className="mt-3 max-w-xl"
              style={{ fontSize: 15, lineHeight: "22px", color: "var(--gray)" }}
            >
              Your case goes ahead of you. They open the call with your history
              already on screen, so the first two minutes are not spent
              repeating yourself.
            </p>
          </div>

          <Link
            href="/patient/case"
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
            Back to my case
          </Link>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {DOCTORS.map((d) => (
            <article
              key={d.name}
              className="flex flex-col justify-between rounded-3xl px-6 py-6"
              style={{
                background: "#fff",
                border: "1px solid var(--hairline)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="relative grid shrink-0 place-items-center"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      background: "#e4eefc",
                      color: "#0a84ff",
                      fontSize: 17,
                      fontWeight: 700,
                    }}
                  >
                    {d.name.split(" ")[1]?.[0] ?? "D"}
                    {d.online && (
                      <span
                        aria-hidden
                        className="absolute"
                        style={{
                          right: -1,
                          bottom: -1,
                          width: 14,
                          height: 14,
                          borderRadius: 7,
                          background: "#34c759",
                          border: "2.5px solid #fff",
                        }}
                      />
                    )}
                  </div>
                  <span
                    className="tabular"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: d.online ? "#f2f7f3" : "var(--bg)",
                      color: d.online ? "#3f6b52" : "var(--gray3)",
                    }}
                  >
                    {d.online ? "Online now" : "Back tomorrow"}
                  </span>
                </div>

                <p
                  className="mt-4"
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "-0.4px",
                    color: "var(--ink)",
                  }}
                >
                  {d.name}
                </p>
                <p className="mt-1" style={{ fontSize: 14, color: "var(--gray)" }}>
                  {d.spec}
                </p>
                <p
                  className="tabular mt-2"
                  style={{ fontSize: 13, color: "var(--gray3)" }}
                >
                  {d.exp} years · {d.rating} ★
                </p>
                <p className="mt-1" style={{ fontSize: 13, color: "var(--gray3)" }}>
                  Speaks {d.langs}
                </p>
              </div>

              <div
                className="mt-6 flex items-center justify-between pt-5"
                style={{ borderTop: "1px solid var(--hairline)" }}
              >
                <span
                  className="tabular"
                  style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)" }}
                >
                  ₹{d.fee}
                </span>
                <Link
                  href="/portal"
                  className="no-select"
                  style={{
                    padding: "10px 22px",
                    borderRadius: 999,
                    background: "var(--ink)",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "-0.14px",
                  }}
                >
                  Call
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p
          className="mt-8 max-w-2xl"
          style={{ fontSize: 13.5, lineHeight: "20px", color: "var(--gray3)" }}
        >
          Calling opens the clinician&rsquo;s side of Nirog, so you can see the
          same consultation from the other chair. Same database, same patient.
        </p>
      </div>
    </div>
  );
}
