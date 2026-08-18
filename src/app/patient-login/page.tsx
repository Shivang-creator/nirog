import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { PatientLoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in — Nirog" };

/**
 * The light gate in front of the patient app.
 *
 * Deliberately outside the /patient tree, because that layout carries the 3D
 * scene and a sign-in page has no business paying for an avatar. And
 * deliberately light: a name and an email, kept on the device, so what a
 * patient tells ARIA is filed under somebody rather than under nobody — with a
 * demo door beside it, since a reviewer should never be stopped by a form.
 */
export default function PatientLoginPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6 py-16"
      style={{ background: "#d9e5f6" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-blob left-[6%] top-[10%] size-[380px] bg-blue/20" />
        <div className="aurora-blob bottom-[0%] right-[4%] size-[400px] bg-aria/15" style={{ animationDelay: "-8s" }} />
      </div>

      <Link href="/" aria-label="Nirog home" className="absolute left-6 top-6">
        <Logo size={26} />
      </Link>

      <PatientLoginForm />
    </main>
  );
}
