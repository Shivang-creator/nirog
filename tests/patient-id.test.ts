import { describe, it, expect } from "vitest";
import { isPatientId } from "@/lib/memory/ids";

/**
 * Guards a bug that mattered more than a normal 404.
 *
 * A malformed patient id used to reach the driver, throw, and be reported by
 * `withMemory` as `degraded: true` — which renders the "memory unreachable"
 * panel. So a mistyped URL produced the same red warning as a genuine database
 * outage.
 *
 * That panel is the one piece of UI a clinician has to be able to trust without
 * thinking. A warning that also fires on typos is a warning people learn to
 * scroll past, and then it is worth nothing on the day it is real.
 */
describe("isPatientId", () => {
  it("accepts a real UUID", () => {
    expect(isPatientId("7c9c53c3-633c-4931-9803-1d141c1fab6d")).toBe(true);
  });

  it("accepts uppercase", () => {
    expect(isPatientId("7C9C53C3-633C-4931-9803-1D141C1FAB6D")).toBe(true);
  });

  it("tolerates surrounding whitespace", () => {
    expect(isPatientId("  7c9c53c3-633c-4931-9803-1d141c1fab6d  ")).toBe(true);
  });

  it.each([
    ["not-a-uuid"],
    ["123"],
    [""],
    ["   "],
    ["7c9c53c3-633c-4931-9803"],
    ["7c9c53c3-633c-4931-9803-1d141c1fab6d-extra"],
    ["7c9c53c3_633c_4931_9803_1d141c1fab6d"],
    ["zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz"],
  ])("rejects %j", (bad) => {
    expect(isPatientId(bad)).toBe(false);
  });

  it("rejects a SQL injection attempt", () => {
    // Parameterised queries already make this safe. The point of rejecting it
    // here is that it should read as a bad request, not as an outage.
    expect(isPatientId("' OR 1=1--")).toBe(false);
    expect(isPatientId("'; DROP TABLE patient;--")).toBe(false);
  });

  it("rejects a UUID with an embedded newline", () => {
    expect(isPatientId("7c9c53c3-633c-4931-9803-1d141c1fab6d\nDROP")).toBe(false);
  });
});
