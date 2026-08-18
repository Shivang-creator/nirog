import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nirog — has this patient told us this before?",
  description:
    "Agent memory for clinical intake. Patients describe the same problem differently every visit; Nirog links those descriptions and surfaces the recurrence.",
};

const NAV = [
  { href: "/", label: "Home" },
  { href: "/intake", label: "Intake" },
  { href: "/doctor", label: "Doctor" },
  { href: "/method", label: "Method" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-rule">
          <div className="mx-auto w-full max-w-4xl px-6 py-4 flex items-baseline justify-between gap-6">
            <Link href="/" className="flex items-baseline gap-2.5">
              <span className="text-[17px] tracking-[-0.01em] font-medium">
                Nirog
              </span>
              <span className="hidden sm:inline text-[12px] text-ink-3">
                the patient&rsquo;s history, remembered
              </span>
            </Link>
            <nav className="flex gap-5 text-[13px] text-ink-2">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="hover:text-ink">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-rule mt-16">
          <div className="mx-auto w-full max-w-4xl px-6 py-6 text-[12px] text-ink-3 leading-relaxed">
            <p>
              Nirog is a demonstration built for the CockroachDB × AWS
              hackathon. It is not a medical device, it does not diagnose, and
              nothing it produces should be acted on without a clinician.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
