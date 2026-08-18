"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * View and edit the account, and the household on it.
 *
 * Ported from the phone's `user` and `profiles` in data/dummy.ts. Kept in
 * localStorage: this deployment has no patient accounts, and writing to a
 * server that cannot store it would be a worse lie than saying so plainly at
 * the bottom of the screen.
 */

interface Person {
  id: string;
  name: string;
  rel: string;
  age: number;
}

interface Account {
  name: string;
  abhaId: string;
  location: string;
  phone: string;
  language: string;
  healthScore: number;
  people: Person[];
}

const DEFAULTS: Account = {
  name: "Rahul",
  abhaId: "14-2847-9012-6635",
  location: "Barabanki, Uttar Pradesh",
  phone: "+91 ••••• •4821",
  language: "Hindi",
  healthScore: 82,
  people: [
    { id: "self", name: "Rahul", rel: "Self", age: 34 },
    { id: "mother", name: "Sunita", rel: "Mother", age: 61 },
    { id: "father", name: "Mahesh", rel: "Father", age: 66 },
    { id: "child", name: "Aarav", rel: "Child", age: 7 },
  ],
};

const KEY = "nirog.profile.v1";

function Field({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-3.5"
      style={{ borderBottom: "1px solid var(--hairline)" }}
    >
      <span style={{ fontSize: 14, color: "var(--gray)" }}>{label}</span>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 rounded-lg px-3 py-1.5 text-right"
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--ink)",
            background: "var(--bg)",
            border: "1px solid var(--hairline)",
            maxWidth: 280,
          }}
        />
      ) : (
        <span
          className="truncate"
          style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

export function ProfileClient() {
  const [acct, setAcct] = useState<Account>(DEFAULTS);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [active, setActive] = useState("self");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setAcct({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Account>) });
    } catch {
      // A corrupt local record is not worth blocking the screen over.
    }
  }, []);

  const set = <K extends keyof Account>(k: K, v: Account[K]) =>
    setAcct((a) => ({ ...a, [k]: v }));

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(acct));
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch {
      // Private browsing. The edit still applies for this session.
    }
    setEditing(false);
  }

  const person = acct.people.find((p) => p.id === active) ?? acct.people[0];

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-12 pb-36 lg:px-10 lg:pt-16">
      <header className="pb-8">
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.13px", color: "var(--gray)" }}>
          Nirog
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-1.2px",
              lineHeight: "42px",
              color: "var(--ink)",
            }}
          >
            Your profile
          </h1>
          <button
            type="button"
            onClick={() => (editing ? save() : setEditing(true))}
            className="no-select"
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              background: editing ? "var(--blue)" : "var(--ink)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {editing ? "Save changes" : "Edit"}
          </button>
        </div>
        {saved && (
          <p className="mt-3" style={{ fontSize: 13, color: "var(--green, #127a3d)" }}>
            Saved on this device.
          </p>
        )}
      </header>

      {/* the household — one handset, several patients */}
      <section
        className="rounded-3xl px-7 py-6"
        style={{ background: "#fff", border: "1px solid var(--hairline)", boxShadow: "var(--shadow-card)" }}
      >
        <p className="label">Who this account covers</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {acct.people.map((p) => {
            const on = p.id === active;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(p.id)}
                className="no-select"
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  background: on ? "var(--ink)" : "var(--bg)",
                  color: on ? "#fff" : "var(--gray)",
                  border: "1px solid var(--hairline)",
                }}
              >
                {p.name}
                <span style={{ fontWeight: 400, opacity: 0.75 }}> · {p.rel}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-4" style={{ fontSize: 13.5, lineHeight: "20px", color: "var(--gray3)" }}>
          {person.name}, {person.age}. Each person on this handset has their own
          record, and their own memory — what {person.name} told ARIA is never
          searched against anybody else&rsquo;s history.
        </p>
      </section>

      {/* the account itself */}
      <section
        className="mt-5 rounded-3xl px-7 py-6"
        style={{ background: "#fff", border: "1px solid var(--hairline)", boxShadow: "var(--shadow-card)" }}
      >
        <p className="label">Account</p>
        <div className="mt-2">
          <Field label="Name" value={acct.name} editing={editing} onChange={(v) => set("name", v)} />
          <Field label="ABHA ID" value={acct.abhaId} editing={editing} onChange={(v) => set("abhaId", v)} />
          <Field label="Village / district" value={acct.location} editing={editing} onChange={(v) => set("location", v)} />
          <Field label="Phone" value={acct.phone} editing={editing} onChange={(v) => set("phone", v)} />
          <Field label="Preferred language" value={acct.language} editing={editing} onChange={(v) => set("language", v)} />
        </div>
      </section>

      <section
        className="mt-5 rounded-3xl px-7 py-6"
        style={{ background: "#fff", border: "1px solid var(--hairline)", boxShadow: "var(--shadow-card)" }}
      >
        <p className="label">Your record</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/patient/case"
            style={{ padding: "10px 20px", borderRadius: 999, background: "var(--bg)", border: "1px solid var(--hairline)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}
          >
            Case file
          </Link>
          <Link
            href="/patient/doctors"
            style={{ padding: "10px 20px", borderRadius: 999, background: "var(--bg)", border: "1px solid var(--hairline)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}
          >
            Doctors
          </Link>
        </div>
      </section>

      <p className="mt-6 max-w-2xl" style={{ fontSize: 13, lineHeight: "20px", color: "var(--gray3)" }}>
        Edits are kept on this device only. This build has no patient sign-in, so
        there is no account to write them to, and a profile screen that claimed
        to save to a server that cannot store it would be the same kind of lie
        this project spends its time refusing to tell elsewhere.
      </p>
    </div>
  );
}
