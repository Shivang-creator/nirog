import Link from "next/link";
import { HideScene } from "@/components/nirog/SceneVisibility";

export const dynamic = "force-dynamic";

/**
 * Where the handover goes.
 *
 * The patient's side of the handoff. The doctor's side of the same moment is
 * /portal — same product, same database, the other chair.
 */

const DOCTORS = [
  { name: "Dr. Ananya Rao", spec: "General Physician", exp: 11, rating: 4.8, fee: 249, online: true },
  { name: "Dr. Imran Sheikh", spec: "Orthopaedics", exp: 14, rating: 4.7, fee: 399, online: true },
  { name: "Dr. Kavya Menon", spec: "Internal Medicine", exp: 8, rating: 4.9, fee: 299, online: false },
];

export default function DoctorsPage() {
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
          Doctors
          <br />
          <span style={{ color: "var(--gray3)" }}>who already read your case.</span>
        </h1>
        <p className="mt-3" style={{ fontSize: 14, lineHeight: "20px", color: "var(--gray)" }}>
          Your handover goes with you. They open the consultation with your
          history already on screen — including anything you have raised before.
        </p>

        <ul className="mt-8" style={{ borderTop: "1px solid var(--hairline)" }}>
          {DOCTORS.map((d) => (
            <li
              key={d.name}
              className="flex items-center gap-4 py-4"
              style={{ borderBottom: "1px solid var(--hairline)" }}
            >
              <div
                className="grid place-items-center shrink-0 relative"
                style={{
                  width: 44, height: 44, borderRadius: 22,
                  background: "#e4eefc", color: "#0a84ff",
                  fontSize: 15, fontWeight: 700,
                }}
              >
                {d.name.split(" ")[1]?.[0] ?? "D"}
                {d.online && (
                  <span
                    aria-hidden
                    className="absolute"
                    style={{
                      right: -1, bottom: -1, width: 12, height: 12, borderRadius: 6,
                      background: "#34c759", border: "2px solid var(--bg)",
                    }}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{d.name}</p>
                <p className="mt-0.5 tabular" style={{ fontSize: 13, color: "var(--gray3)" }}>
                  {d.spec} · {d.exp} yrs · {d.rating} ★
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="tabular" style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                  ₹{d.fee}
                </span>
                <Link
                  href="/portal"
                  className="no-select"
                  style={{
                    padding: "8px 16px", borderRadius: 999, background: "var(--ink)",
                    color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "-0.13px",
                  }}
                >
                  Call
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {/*
          The seam between the two halves of the product, said out loud. A
          reviewer following "Call" lands in the clinician's workspace looking
          at the same patient they were just being — which is the fastest way to
          see that one database is serving both sides.
        */}
        <p className="mt-6" style={{ fontSize: 12.5, lineHeight: "18px", color: "var(--gray3)" }}>
          Calling opens the clinician&rsquo;s workspace, so you can see the other
          side of the same consultation.
        </p>

        <div className="mt-10">
          <Link
            href="/patient/case"
            className="inline-flex items-center no-select glass-heavy"
            style={{
              padding: "12px 20px", borderRadius: 999, color: "var(--ink)",
              fontSize: 15, fontWeight: 600, letterSpacing: "-0.15px",
            }}
          >
            Back to my case
          </Link>
        </div>
      </div>
    </div>
  );
}
