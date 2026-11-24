import { describe, it, expect } from "vitest";
import { safeNextPath } from "@/lib/http/safe-next";

/**
 * The OAuth callback redirects to `${origin}${next}`. `next` comes from the
 * query string, so every value here is one an attacker can put in a link.
 */
describe("safeNextPath", () => {
  it("keeps an ordinary same-site path", () => {
    expect(safeNextPath("/portal/patients/pat_rahul")).toBe(
      "/portal/patients/pat_rahul",
    );
    expect(safeNextPath("/portal?tab=queue")).toBe("/portal?tab=queue");
  });

  it("falls back when nothing was asked for", () => {
    expect(safeNextPath(null)).toBe("/portal");
    expect(safeNextPath("")).toBe("/portal");
  });

  it.each([
    ["@evil.example"], // origin + "@evil.example" → userinfo trick
    [".evil.example"], // origin + ".evil.example" → a different host
    ["//evil.example"], // protocol-relative
    ["/\\evil.example"], // browsers read the backslash as a slash
    ["/\t/evil.example"], // tab is stripped by URL parsers
    ["https://evil.example"],
    ["evil.example"],
  ])("refuses %j", (next) => {
    expect(safeNextPath(next)).toBe("/portal");
  });

  it("never yields a URL on another host", () => {
    const origin = "https://nirog.example";
    for (const next of ["@evil.example", ".evil.example", "//evil.example", "/\\evil.example"]) {
      expect(new URL(`${origin}${safeNextPath(next)}`).host).toBe("nirog.example");
    }
  });
});
