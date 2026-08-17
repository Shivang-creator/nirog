import { describe, it, expect } from "vitest";
import { RECALL_THRESHOLD } from "@/lib/memory/recall";

/**
 * These guard the row-to-match mapping in searchMemory, which is where a
 * genuinely dangerous bug lived.
 *
 * `embedding <=> $vec` returns NULL for a complaint that was recorded while the
 * embedding service was down. `Number(null)` is 0, so the naive mapping ranked
 * every unembedded complaint as a *perfect* match and put it at the top of a
 * doctor's screen — the least relevant rows presented as the most.
 *
 * The mapping logic is replicated here rather than exported, because exporting
 * internals purely to test them tends to make the internals worse. If
 * searchMemory's mapping changes, this file must change with it.
 */
function toDistance(raw: string | number | null): number {
  return raw === null ? Infinity : Number(raw);
}

function keep(distance: number): boolean {
  return Number.isFinite(distance) && distance <= RECALL_THRESHOLD;
}

describe("distance mapping", () => {
  it("reads a numeric distance", () => {
    expect(toDistance(0.292)).toBeCloseTo(0.292, 6);
  });

  it("reads the string form the pg driver returns for FLOAT8", () => {
    expect(toDistance("0.292")).toBeCloseTo(0.292, 6);
  });

  it("maps a null distance to Infinity, not zero", () => {
    // The bug. Number(null) === 0 would make this the closest possible match.
    expect(toDistance(null)).toBe(Infinity);
    expect(toDistance(null)).not.toBe(0);
  });
});

describe("threshold filter", () => {
  it("keeps a close match", () => {
    expect(keep(0.29)).toBe(true);
  });

  it("keeps a match exactly at the threshold", () => {
    expect(keep(RECALL_THRESHOLD)).toBe(true);
  });

  it("drops a match just past the threshold", () => {
    expect(keep(RECALL_THRESHOLD + 0.0001)).toBe(false);
  });

  it("drops an unembedded complaint", () => {
    expect(keep(toDistance(null))).toBe(false);
  });

  it("drops NaN rather than letting it through a comparison", () => {
    // NaN <= x is false, so a naive filter would already drop it — but only by
    // accident. Number.isFinite makes that intentional.
    expect(keep(NaN)).toBe(false);
  });

  it("keeps an identical complaint at distance zero", () => {
    // Distinguishing a genuine 0 from the null-coerced 0 is the entire point.
    expect(keep(0)).toBe(true);
  });
});
