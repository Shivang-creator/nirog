import { describe, it, expect } from "vitest";
import { floorTriage, mergeFlags, realRedFlags } from "@/lib/clinical/red-flags";

const CHEST = { id: "chest-pain", label: "Chest pain with sweating", advice: "Go to hospital now." };
const STROKE = { id: "stroke", label: "Possible stroke", advice: "Call an ambulance." };

/**
 * A red flag, once raised, has to reach the doctor. The chat route returns the
 * flags for one turn only and the client used to overwrite the previous set
 * with them, so a later turn with an empty list erased the emergency.
 */
describe("mergeFlags", () => {
  it("keeps an earlier flag when a later turn returns none", () => {
    expect(mergeFlags([CHEST], [])).toEqual([CHEST]);
  });

  it("adds a new flag without dropping the old one", () => {
    expect(mergeFlags([CHEST], [STROKE])).toEqual([CHEST, STROKE]);
  });

  it("lists a repeated flag once, in the wording the patient first heard", () => {
    const reworded = { ...CHEST, advice: "Different words." };
    expect(mergeFlags([CHEST], [reworded])).toEqual([CHEST]);
  });

  it("falls back to the label when the model omits an id", () => {
    const a = { id: "", label: "Severe bleeding", advice: "x" };
    const b = { id: "", label: "severe bleeding ", advice: "y" };
    expect(mergeFlags([a], [b])).toEqual([a]);
  });
});

describe("realRedFlags", () => {
  it.each([
    ["None"],
    ["None identified"],
    ["none reported during intake"],
    ["No red flags identified"],
    ["No red-flag features"],
    ["Nil"],
    ["N/A"],
    ["Not identified"],
    ["Nothing identified"],
    ["No red flags were reported during the intake."],
    ["No acute concerns"],
    [""],
    ["   "],
  ])("does not count %j as a red flag", (s) => {
    expect(realRedFlags([s])).toEqual([]);
  });

  // Real red flags that open with a negative. A prefix match would drop them.
  it.each([
    ["Chest pain radiating to the left arm with sweating"],
    ["Sudden worst-ever headache"],
    ["No urine output for 24 hours"],
    ["Not able to move the right arm"],
    ["Nothing by mouth tolerated for two days"],
    ["No signs of improvement after five days of fever"],
    ["None of the pain relief is working and the pain is 10/10"],
  ])("counts %j", (s) => {
    expect(realRedFlags([s])).toEqual([s]);
  });

  it("handles a missing list", () => {
    expect(realRedFlags(null)).toEqual([]);
    expect(realRedFlags(undefined)).toEqual([]);
  });
});

/**
 * The property under test is one-directional: the rule may raise the model's
 * level, and may never lower it.
 */
describe("floorTriage", () => {
  it("raises self-care to emergency when ARIA raised a red flag in the conversation", () => {
    const r = floorTriage({ modelLevel: "self_care", intakeFlags: [CHEST], handoverRedFlags: [] });
    expect(r.level).toBe("emergency");
    expect(r.raised).toBe(true);
    expect(r.note).toContain("fixed rule");
    expect(r.note).toContain("self care to emergency");
  });

  it.each(["routine", "urgent"] as const)(
    "raises %s to emergency on an intake red flag",
    (modelLevel) => {
      expect(
        floorTriage({ modelLevel, intakeFlags: [CHEST], handoverRedFlags: null }).level,
      ).toBe("emergency");
    },
  );

  it("raises to urgent when the handover itself lists a red flag", () => {
    const r = floorTriage({
      modelLevel: "self_care",
      intakeFlags: [],
      handoverRedFlags: ["Blood in stool for three days"],
    });
    expect(r.level).toBe("urgent");
    expect(r.raised).toBe(true);
  });

  it("does not let a listed red flag pull an emergency down to urgent", () => {
    const r = floorTriage({
      modelLevel: "emergency",
      intakeFlags: [],
      handoverRedFlags: ["Blood in stool"],
    });
    expect(r).toEqual({ level: "emergency", raised: false, note: null });
  });

  it("leaves the model's level alone when nothing was flagged", () => {
    for (const modelLevel of ["self_care", "routine", "urgent", "emergency"] as const) {
      expect(
        floorTriage({ modelLevel, intakeFlags: [], handoverRedFlags: ["None identified"] }),
      ).toEqual({ level: modelLevel, raised: false, note: null });
    }
  });

  it("never returns a level below the model's, for any input", () => {
    const rank = { self_care: 0, routine: 1, urgent: 2, emergency: 3 };
    const levels = ["self_care", "routine", "urgent", "emergency"] as const;
    for (const modelLevel of levels) {
      for (const intakeFlags of [[], [CHEST], [CHEST, STROKE]]) {
        for (const handoverRedFlags of [[], ["None"], ["Sudden weakness on one side"]]) {
          const r = floorTriage({ modelLevel, intakeFlags, handoverRedFlags });
          expect(rank[r.level]).toBeGreaterThanOrEqual(rank[modelLevel]);
          if (intakeFlags.length) expect(r.level).toBe("emergency");
        }
      }
    }
  });
});
