import { describe, it, expect } from "vitest";
import {
  detectRegion,
  detectAll,
  daysBetween,
  DEFAULT_CONFIG,
  type ComplaintRecord,
} from "@/lib/clinical/recurrence";
import type { Region } from "@/lib/clinical/regions";

const NOW = new Date("2026-08-18T00:00:00Z");
const day = (n: number) => new Date(NOW.getTime() - n * 86_400_000);

let seq = 0;
function c(
  daysAgo: number,
  region: Region,
  opts: { visit?: string; text?: string } = {},
): ComplaintRecord {
  seq++;
  return {
    id: `c${seq}`,
    visitId: opts.visit ?? `v${seq}`,
    patientId: "p1",
    rawText: opts.text ?? "complaint",
    bodyRegion: region,
    occurredAt: day(daysAgo),
  };
}

describe("recurrence rule", () => {
  it("flags three visits in ninety days as recurrent", () => {
    const f = detectRegion(
      [c(37, "lower_back"), c(16, "lower_back"), c(1, "lower_back")],
      "lower_back",
      NOW,
    );
    expect(f?.level).toBe("recurrent");
    expect(f?.visitCount).toBe(3);
    expect(f?.spanDays).toBe(36);
  });

  it("flags two recent visits as watch, not recurrent", () => {
    const f = detectRegion([c(20, "head"), c(2, "head")], "head", NOW);
    expect(f?.level).toBe("watch");
    expect(f?.visitCount).toBe(2);
  });

  it("returns null for a single complaint", () => {
    // The most important negative case. One complaint is not a pattern.
    expect(detectRegion([c(3, "lower_back")], "lower_back", NOW)).toBeNull();
  });

  it("returns null when there is nothing at all", () => {
    expect(detectRegion([], "lower_back", NOW)).toBeNull();
  });

  it("returns null for a different region than the one asked about", () => {
    const all = [c(30, "head"), c(15, "head"), c(2, "head")];
    expect(detectRegion(all, "lower_back", NOW)).toBeNull();
    expect(detectRegion(all, "head", NOW)?.level).toBe("recurrent");
  });

  it("never flags the unknown bucket", () => {
    // Unclassified complaints would otherwise pile up and trigger a meaningless
    // flag on a patient who simply used words the lexicon doesn't cover.
    const all = [c(30, "unknown"), c(15, "unknown"), c(2, "unknown")];
    expect(detectRegion(all, "unknown", NOW)).toBeNull();
    expect(detectAll(all, NOW)).toHaveLength(0);
  });

  describe("counts visits, not complaints", () => {
    it("does not flag three complaints logged in one visit", () => {
      // A talkative patient describing one ache three ways has come once.
      const one = "same-visit";
      const f = detectRegion(
        [
          c(2, "lower_back", { visit: one }),
          c(2, "lower_back", { visit: one }),
          c(2, "lower_back", { visit: one }),
        ],
        "lower_back",
        NOW,
      );
      expect(f).toBeNull();
    });

    it("flags when the same three complaints span three visits", () => {
      const f = detectRegion(
        [
          c(40, "lower_back", { visit: "a" }),
          c(20, "lower_back", { visit: "b" }),
          c(2, "lower_back", { visit: "c" }),
        ],
        "lower_back",
        NOW,
      );
      expect(f?.level).toBe("recurrent");
      expect(f?.visitCount).toBe(3);
    });

    it("counts a visit once even when it holds several complaints", () => {
      const f = detectRegion(
        [
          c(40, "lower_back", { visit: "a" }),
          c(40, "lower_back", { visit: "a" }),
          c(20, "lower_back", { visit: "b" }),
          c(2, "lower_back", { visit: "c" }),
        ],
        "lower_back",
        NOW,
      );
      expect(f?.visitCount).toBe(3);
    });
  });

  describe("window boundaries", () => {
    it("includes a visit just inside the ninety-day window", () => {
      const f = detectRegion(
        [c(89, "lower_back"), c(45, "lower_back"), c(1, "lower_back")],
        "lower_back",
        NOW,
      );
      expect(f?.level).toBe("recurrent");
    });

    it("excludes a visit that has aged out of the window", () => {
      const f = detectRegion(
        [c(91, "lower_back"), c(45, "lower_back"), c(1, "lower_back")],
        "lower_back",
        NOW,
      );
      // Only two remain inside ninety days, and they are 44 days apart, so this
      // is not a watch either.
      expect(f?.level).not.toBe("recurrent");
    });

    it("drops to watch when the oldest of three ages out but two stay recent", () => {
      const f = detectRegion(
        [c(120, "lower_back"), c(20, "lower_back"), c(3, "lower_back")],
        "lower_back",
        NOW,
      );
      expect(f?.level).toBe("watch");
    });

    it("respects a custom configuration", () => {
      const strict = { ...DEFAULT_CONFIG, recurrentVisits: 4 };
      const three = [c(30, "lower_back"), c(15, "lower_back"), c(2, "lower_back")];
      expect(detectRegion(three, "lower_back", NOW)?.level).toBe("recurrent");
      expect(detectRegion(three, "lower_back", NOW, strict)?.level).toBe("watch");
    });
  });

  describe("detectAll", () => {
    it("returns nothing when nothing recurs", () => {
      const flags = detectAll([c(3, "head"), c(2, "abdomen"), c(1, "skin")], NOW);
      expect(flags).toEqual([]);
    });

    it("puts recurrent ahead of watch", () => {
      const flags = detectAll(
        [
          c(40, "lower_back"),
          c(20, "lower_back"),
          c(2, "lower_back"),
          c(10, "head"),
          c(3, "head"),
        ],
        NOW,
      );
      expect(flags.map((f) => f.level)).toEqual(["recurrent", "watch"]);
      expect(flags[0].region).toBe("lower_back");
    });

    it("ignores unrelated one-off complaints entirely", () => {
      const flags = detectAll(
        [
          c(40, "lower_back"),
          c(20, "lower_back"),
          c(2, "lower_back"),
          c(30, "skin"),
          c(12, "abdomen"),
        ],
        NOW,
      );
      expect(flags).toHaveLength(1);
      expect(flags[0].region).toBe("lower_back");
    });
  });

  it("carries the complaints that produced the flag", () => {
    const complaints = [c(40, "lower_back"), c(20, "lower_back"), c(2, "lower_back")];
    const f = detectRegion(complaints, "lower_back", NOW);
    expect(f?.complaints).toHaveLength(3);
    // Chronological, because the timeline is the point.
    const times = f!.complaints.map((x) => x.occurredAt.getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it("states the rule that fired in plain English", () => {
    const f = detectRegion(
      [c(40, "lower_back"), c(20, "lower_back"), c(2, "lower_back")],
      "lower_back",
      NOW,
    );
    expect(f?.rule).toMatch(/3 or more separate visits/);
    expect(f?.rule).toMatch(/90 days/);
  });

  it("is deterministic across repeated evaluation", () => {
    const complaints = [c(40, "lower_back"), c(20, "lower_back"), c(2, "lower_back")];
    const first = JSON.stringify(detectAll(complaints, NOW));
    for (let i = 0; i < 20; i++) {
      expect(JSON.stringify(detectAll(complaints, NOW))).toBe(first);
    }
  });

  it("is order-independent", () => {
    const complaints = [c(40, "lower_back"), c(20, "lower_back"), c(2, "lower_back")];
    const forward = detectRegion(complaints, "lower_back", NOW);
    const backward = detectRegion([...complaints].reverse(), "lower_back", NOW);
    expect(backward?.visitCount).toBe(forward?.visitCount);
    expect(backward?.spanDays).toBe(forward?.spanDays);
  });
});

describe("daysBetween", () => {
  it("is symmetric", () => {
    expect(daysBetween(day(0), day(10))).toBe(daysBetween(day(10), day(0)));
  });

  it("is zero for the same instant", () => {
    expect(daysBetween(NOW, NOW)).toBe(0);
  });

  it("measures whole days", () => {
    expect(daysBetween(day(0), day(7))).toBeCloseTo(7, 6);
  });
});
