import { describe, it, expect } from "vitest";
import {
  resolveRegion,
  explainResolution,
  INHERIT_THRESHOLD,
} from "@/lib/clinical/resolve";
import { RECALL_THRESHOLD } from "@/lib/memory/recall";
import type { RecallMatch } from "@/lib/memory/recall";
import type { Region } from "@/lib/clinical/regions";

function match(
  text: string,
  region: Region,
  distance: number,
  id = "m1",
): RecallMatch {
  return {
    id,
    visitId: "v1",
    patientId: "p1",
    rawText: text,
    bodyRegion: region,
    occurredAt: new Date("2026-07-11T00:00:00Z"),
    distance,
  };
}

const LUMBAR = "my lower back has been aching for a few days";

describe("resolveRegion — lexicon wins when the text names a region", () => {
  it("uses the lexicon and ignores memory entirely", () => {
    const r = resolveRegion(LUMBAR, [match("headache", "head", 0.01)]);
    expect(r.region).toBe("lower_back");
    expect(r.source).toBe("lexicon");
    // A very close head complaint must not override an explicit lumbar mention.
    expect(r.inheritedFrom).toBeUndefined();
  });

  it("reports the terms that fired", () => {
    const r = resolveRegion(LUMBAR, []);
    expect(r.matchedTerms).toContain("lower back");
  });
});

describe("resolveRegion — inheritance", () => {
  // "back" here is an adverb meaning *returned*. There is no body part in this
  // sentence, which is exactly why memory has to supply one.
  const elliptical = "the ache is back again, it's been three weeks now";

  it("inherits a region from a close prior complaint", () => {
    const r = resolveRegion(elliptical, [match(LUMBAR, "lower_back", 0.29)]);
    expect(r.region).toBe("lower_back");
    expect(r.source).toBe("inherited");
    expect(r.inheritedFrom).toBe("m1");
    expect(r.inheritedFromText).toBe(LUMBAR);
    expect(r.distance).toBe(0.29);
  });

  it("picks the closest match when several qualify", () => {
    const r = resolveRegion(elliptical, [
      match("head was pounding", "head", 0.38, "far"),
      match(LUMBAR, "lower_back", 0.12, "near"),
    ]);
    expect(r.region).toBe("lower_back");
    expect(r.inheritedFrom).toBe("near");
  });

  it("refuses to inherit from a match that is merely related", () => {
    // Between the two thresholds: close enough to show a doctor, not close
    // enough to silently change what gets counted.
    const between = (INHERIT_THRESHOLD + RECALL_THRESHOLD) / 2;
    const r = resolveRegion(elliptical, [match(LUMBAR, "lower_back", between)]);
    expect(r.source).toBe("none");
    expect(r.region).toBe("unknown");
  });

  it("requires a stricter distance than plain recall", () => {
    // The bar for acting on a match is higher than the bar for showing it.
    expect(INHERIT_THRESHOLD).toBeLessThan(RECALL_THRESHOLD);
  });

  it("never inherits from an unknown region", () => {
    const r = resolveRegion(elliptical, [match("felt off", "unknown", 0.05)]);
    expect(r.source).toBe("none");
    expect(r.region).toBe("unknown");
  });

  it("stays unknown when memory is empty", () => {
    // This is the degraded case: memory was unreachable, so matches is [].
    // The complaint must not acquire a region by guesswork.
    const r = resolveRegion(elliptical, []);
    expect(r.source).toBe("none");
    expect(r.region).toBe("unknown");
  });

  it("is exactly at the boundary inclusive", () => {
    const r = resolveRegion(elliptical, [
      match(LUMBAR, "lower_back", INHERIT_THRESHOLD),
    ]);
    expect(r.source).toBe("inherited");
  });

  it("rejects just past the boundary", () => {
    const r = resolveRegion(elliptical, [
      match(LUMBAR, "lower_back", INHERIT_THRESHOLD + 0.001),
    ]);
    expect(r.source).toBe("none");
  });

  it("does not let a headache inherit lumbar", () => {
    // The guard against the naive "back means lumbar" shortcut.
    const r = resolveRegion("the headache is back again", [
      match(LUMBAR, "lower_back", 0.1),
    ]);
    expect(r.region).toBe("head");
    expect(r.source).toBe("lexicon");
  });

  it("is deterministic", () => {
    const matches = [match(LUMBAR, "lower_back", 0.29)];
    const first = JSON.stringify(resolveRegion(elliptical, matches));
    for (let i = 0; i < 10; i++) {
      expect(JSON.stringify(resolveRegion(elliptical, matches))).toBe(first);
    }
  });
});

describe("explainResolution", () => {
  it("names the matched terms for a direct classification", () => {
    expect(explainResolution(resolveRegion(LUMBAR, []))).toMatch(/Named directly/);
  });

  it("quotes the source complaint and the distance for an inheritance", () => {
    const r = resolveRegion("the ache is back again", [
      match(LUMBAR, "lower_back", 0.292),
    ]);
    const text = explainResolution(r);
    expect(text).toMatch(/inherited from/);
    expect(text).toContain(LUMBAR);
    expect(text).toContain("0.292");
  });

  it("says plainly when nothing could be resolved", () => {
    expect(explainResolution(resolveRegion("I feel odd", []))).toMatch(
      /nothing similar in memory/,
    );
  });
});
