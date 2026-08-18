"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, User } from "lucide-react";

/**
 * Name, email, village. Kept on the device — this build has no patient account
 * service, and the point of the gate is that the record belongs to somebody,
 * not that a password proves it. The demo door signs in as Rahul, whose
 * seeded history is what ARIA remembers.
 */

const KEY = "nirog.profile.v1";

export function PatientLoginForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [village, setVillage] = useState("");
  const [error, setError] = useState<string | null>(null);

  function enter(profile: { name: string; email?: string; location?: string }) {
    try {
      const raw = localStorage.getItem(KEY);
      const prev = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      localStorage.setItem(
        KEY,
        JSON.stringify({
          ...prev,
          name: profile.name,
          ...(profile.email ? { email: profile.email } : {}),
          ...(profile.location ? { location: profile.location } : {}),
        }),
      );
    } catch {
      // Private browsing — the session still works, it just won't be remembered.
    }
    router.push("/patient");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (n.length < 2) {
      setError("Please tell us your name.");
      return;
    }
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("That email doesn't look right — or leave it empty.");
      return;
    }
    enter({ name: n, email: email.trim() || undefined, location: village.trim() || undefined });
  }

  return (
    <div className="relative w-full max-w-sm">
      {/* The judge's door goes first, same rule as the clinician side. */}
      <button
        type="button"
        onClick={() => enter({ name: "Rahul" })}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
      >
        <Sparkles className="size-4" />
        Continue as Rahul — the demo patient
      </button>
      <p className="mt-2 text-center text-xs" style={{ color: "var(--gray3, #7a8699)" }}>
        No sign-in needed. Rahul has a history ARIA remembers.
      </p>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-ink/10" />
        <span className="text-xs font-medium" style={{ color: "var(--gray3, #7a8699)" }}>
          or as yourself
        </span>
        <span className="h-px flex-1 bg-ink/10" />
      </div>

      <form
        onSubmit={submit}
        className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lift backdrop-blur"
      >
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-soft-blue text-blue">
            <User className="size-4.5" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">Your details</p>
            <p className="text-xs text-ink-soft">
              So what you tell ARIA is filed under you.
            </p>
          </div>
        </div>

        <label className="mt-5 block text-xs font-semibold text-ink-soft" htmlFor="p-name">
          Name
        </label>
        <input
          id="p-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Asha Kumari"
          autoComplete="name"
          className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-blue"
        />

        <label className="mt-4 block text-xs font-semibold text-ink-soft" htmlFor="p-email">
          Email <span className="font-normal">(optional)</span>
        </label>
        <input
          id="p-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="asha@example.com"
          autoComplete="email"
          className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-blue"
        />

        <label className="mt-4 block text-xs font-semibold text-ink-soft" htmlFor="p-village">
          Village or town <span className="font-normal">(optional)</span>
        </label>
        <input
          id="p-village"
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          placeholder="Sultanpur, Barabanki"
          className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-blue"
        />

        {error && (
          <p role="alert" className="mt-3 rounded-lg bg-soft-red px-3 py-2 text-sm text-red">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-full bg-blue px-6 py-3 text-[15px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Continue <ArrowRight className="size-4" />
        </button>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-faint">
          Kept on this device only. No password, no account service — a demo
          should not collect what it cannot protect.
        </p>
      </form>
    </div>
  );
}
