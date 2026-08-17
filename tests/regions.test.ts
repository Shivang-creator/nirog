import { describe, it, expect } from "vitest";
import { classify, REGIONS, REGION_LABELS } from "@/lib/clinical/regions";

describe("region classification", () => {
  it("finds the obvious lumbar phrasing", () => {
    expect(classify("my lower back has been aching").region).toBe("lower_back");
  });

  it("finds lumbar from a postural description with no back word at all", () => {
    // This is the case the whole product exists for: the patient never says
    // "back", but they are describing the same problem.
    expect(classify("I keep getting this pain when I stand up").region).toBe(
      "lower_back",
    );
  });

  it("prefers the more specific region when both could match", () => {
    // "lower back" must beat the generic "back" entry, or every lumbar
    // complaint lands in the wrong bucket and the recurrence count is wrong.
    const c = classify("pain in my lower back and my back generally");
    expect(c.region).toBe("lower_back");
    expect(c.matchedTerms).toContain("lower back");
  });

  it("separates upper back from lower back", () => {
    expect(classify("aching between my shoulder blades").region).toBe("upper_back");
    expect(classify("pain in the small of my back").region).toBe("lower_back");
  });

  it("handles code-switching into Hindi", () => {
    // Patients switch language mid-sentence. Losing that is losing the complaint.
    expect(classify("kamar mein dard").region).toBe("lower_back");
    expect(classify("sar dard since morning").region).toBe("head");
    expect(classify("bukhar for two days").region).toBe("systemic");
  });

  it.each([
    ["a splitting headache since Tuesday", "head"],
    ["my chest feels tight and I'm short of breath", "chest"],
    ["stomach cramps and nausea", "abdomen"],
    ["my knee gives way on stairs", "leg"],
    ["itchy rash on my forearm", "skin"],
    ["stiff neck when I turn my head", "neck"],
    ["exhausted all the time, no appetite", "systemic"],
  ])("classifies %j as %s", (text, region) => {
    expect(classify(text).region).toBe(region);
  });

  it("returns unknown rather than guessing", () => {
    expect(classify("I feel a bit off today").region).toBe("unknown");
    expect(classify("").region).toBe("unknown");
    expect(classify("hello").region).toBe("unknown");
  });

  it("does not count a denied symptom", () => {
    // A thorough negative history would otherwise light up every region.
    expect(classify("no chest pain at all").region).not.toBe("chest");
    expect(classify("denies any headache").region).not.toBe("head");
    expect(classify("not my stomach this time").region).not.toBe("abdomen");
  });

  it("still classifies the positive symptom in a mixed sentence", () => {
    const c = classify("no chest pain, but my lower back is killing me");
    expect(c.region).toBe("lower_back");
  });

  it("is unaffected by punctuation and case", () => {
    expect(classify("LOWER BACK!!! aching...").region).toBe("lower_back");
    expect(classify("lower-back ache").region).toBe("lower_back");
  });

  it("is deterministic", () => {
    const text = "the ache is back again, three weeks now";
    const first = classify(text);
    for (let i = 0; i < 20; i++) {
      expect(classify(text)).toEqual(first);
    }
  });

  it("reports which terms fired, so the grouping is inspectable", () => {
    const c = classify("my lower back has been aching");
    expect(c.matchedTerms.length).toBeGreaterThan(0);
    expect(c.matchedTerms).toEqual([...c.matchedTerms].sort());
  });

  it("every region has a human label", () => {
    for (const r of REGIONS) {
      expect(REGION_LABELS[r]).toBeTruthy();
    }
  });
});
