"use client";

/**
 * The floating glass tab bar.
 *
 * Ported from app/(tabs)/_layout.tsx: 54×44 tabs, 21px glyphs, a 4×4 dot under
 * the active one, all inside a 999px glass pill.
 *
 * Three tabs, not the app's five. MedMart and the Health Locker are shopping and
 * filing — neither is part of "ARIA asks, she reasons, a doctor receives it", and
 * a tab bar with two dead ends in it makes the live path harder to find.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/patient", label: "Home", icon: "home" as const },
  { href: "/patient/case", label: "Case", icon: "pulse" as const },
  { href: "/patient/doctors", label: "Doctors", icon: "video" as const },
];

export function TabBar() {
  const path = usePathname();

  return (
    <nav
      className="fixed left-0 right-0 z-30 flex justify-center no-select"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
    >
      <div
        className="flex"
        style={{
          gap: 4, padding: "8px 10px", borderRadius: 999,
          background: "var(--glass-fill)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-card)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
        }}
      >
        {TABS.map((t) => {
          const active = t.href === "/patient" ? path === "/patient" : path.startsWith(t.href);
          const colour = active ? "var(--blue)" : "var(--gray3)";
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-label={t.label}
              aria-current={active ? "page" : undefined}
              className="grid place-items-center"
              style={{ width: 54, height: 44, borderRadius: 999, gap: 3 }}
            >
              <svg
                width="21" height="21" viewBox="0 0 24 24"
                fill={active ? colour : "none"}
                stroke={colour}
                strokeWidth={active ? 0 : 1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {t.icon === "home" && <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />}
                {t.icon === "pulse" && (
                  active
                    ? <path d="M2 12h4l2.5-7 4 14L15 12h7v2h-6l-3 8-4-14L7 14H2z" />
                    : <path d="M3 12h4l2.5-7 4 14L16 12h5" />
                )}
                {t.icon === "video" && (
                  active
                    ? <path d="M15 8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-2.5l5 3.5a1 1 0 0 0 2-.8V7.8a1 1 0 0 0-2-.8l-5 3.5z" />
                    : <><rect x="2" y="6" width="13" height="12" rx="2" /><path d="m15 10.5 6-3.5v10l-6-3.5z" /></>
                )}
              </svg>
              <span
                aria-hidden
                style={{
                  width: 4, height: 4, borderRadius: 2,
                  background: active ? "var(--blue)" : "transparent",
                }}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
