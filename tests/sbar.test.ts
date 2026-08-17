import { describe, it, expect } from "vitest";
import { buildSbar, renderSbar, type Patient } from "@/lib/clinical/sbar";
import { detectAll, type ComplaintRecord } from "@/lib/clinical/recurrence";
import type { Region } from "@/lib/clinical/regions";

const NOW = new Date("2026-08-18T00:00:00Z");
const day = (n: number) => new Date(NOW.getTime() - n * 86_400_000);

const anita: Patient = {
  id: "p1",
  name: "Anita R.",
  yearOfBirth: 1992,
  sex: "Female",
  familyHistory: "Father — lumbar disc surgery at 40",
};

let seq = 0;
function c(daysAgo: number, region: Region, text: string): ComplaintRecord {
  seq++;
  return {
    id: `c${seq}`,
    visitId: `v${seq}`,
    patientId: "p1",
    rawText: text,
    bodyRegion: region,
    occurredAt: day(daysAgo),
  };
}

const recurring = [
  c(37, "lower_back", "my lower back has been aching for a few days"),
  c(16, "lower_back", "I keep getting this pain when I stand up from my desk"),
  c(1, "lower_back", "the ache is back again, it's been three weeks now"),
];

function sbarFor(complaints: ComplaintRecord[], degraded = false) {
  return buildSbar({
    patient: anita,
    complaints,
    flags: degraded ? [] : detectAll(complaints, NOW),
    now: NOW,
    degraded,
  });
}

describe("SBAR — recurring case", () => {
  const s = sbarFor(recurring);

  it("opens with age, sex and the presenting complaint", () => {
    expect(s.situation).toMatch(/34-year-old female/);
    expect(s.situation).toMatch(/the ache is back again/);
  });

  it("quotes every prior complaint verbatim", () => {
    const joined = s.background.join("\n");
    for (const x of recurring) expect(joined).toContain(x.rawText);
  });

  it("states the visit count and the span", () => {
    expect(s.background.join(" ")).toMatch(/3 separate presentations/);
    expect(s.background.join(" ")).toMatch(/36 days/);
  });

  it("says the link was semantic, not keyword", () => {
    expect(s.background.join(" ")).toMatch(/semantic similarity, not shared keywords/);
  });

  it("includes family history when there is one", () => {
    expect(s.background.join(" ")).toContain("lumbar disc surgery");
  });

  it("names the rule that fired", () => {
    expect(s.assessment.join(" ")).toMatch(/3 or more separate visits/);
  });

  it("refuses to diagnose", () => {
    const all = [...s.assessment, ...s.recommendation].join(" ");
    expect(all).toMatch(/not a diagnosis/i);
    expect(all).toMatch(/Clinical judgement required/i);
    // Nothing that looks like a conclusion about cause.
    expect(all).not.toMatch(/\b(likely|probably|consistent with|suggestive of)\b/i);
  });

  it("recommends considering investigation without prescribing one", () => {
    expect(s.recommendation.join(" ")).toMatch(/warrants investigation/);
    expect(s.recommendation.join(" ")).not.toMatch(/\b(MRI|X-ray|prescribe|refer to)\b/i);
  });

  it("shows its provenance", () => {
    expect(s.provenance.join(" ")).toMatch(/patient's own wording/);
    expect(s.provenance.join(" ")).toMatch(/fixed rule, not by a model/);
  });
});

describe("SBAR — no recurrence", () => {
  const s = sbarFor([c(3, "head", "headache since Tuesday")]);

  it("says so as a positive result, not a shrug", () => {
    expect(s.assessment.join(" ")).toMatch(/No recurring pattern/);
    expect(s.assessment.join(" ")).toMatch(/real negative result, not a failure to look/);
  });

  it("recommends nothing", () => {
    expect(s.recommendation.join(" ")).toMatch(/No action indicated/);
  });

  it("is not marked degraded", () => {
    expect(s.degraded).toBe(false);
  });
});

describe("SBAR — watch level", () => {
  const s = sbarFor([
    c(20, "head", "headache again"),
    c(2, "head", "head is pounding"),
  ]);

  it("uses softer language than a recurrence", () => {
    expect(s.assessment.join(" ")).toMatch(/Repeat presentation/);
    expect(s.assessment.join(" ")).toMatch(/Below the recurrence threshold/);
  });

  it("does not recommend investigation", () => {
    expect(s.recommendation.join(" ")).not.toMatch(/warrants investigation/);
  });
});

describe("SBAR — degraded memory", () => {
  const s = sbarFor(recurring, true);

  it("is marked degraded", () => {
    expect(s.degraded).toBe(true);
  });

  it("warns in the background that history may be incomplete", () => {
    expect(s.background.join(" ")).toMatch(/could not be retrieved/i);
  });

  it("refuses to assess rather than reporting a clean record", () => {
    const a = s.assessment.join(" ");
    expect(a).toMatch(/NOT ASSESSED/);
    expect(a).not.toMatch(/No recurring pattern found/);
  });

  it("tells the reader not to treat the missing flag as reassurance", () => {
    expect(s.assessment.join(" ")).toMatch(/not.*a negative finding/i);
  });

  it("recommends re-running before acting", () => {
    expect(s.recommendation.join(" ")).toMatch(/Re-run this handover/);
  });
});

describe("SBAR — empty record", () => {
  const s = sbarFor([]);

  it("does not invent a presenting complaint", () => {
    expect(s.situation).toMatch(/No complaints recorded/);
  });

  it("still produces every section", () => {
    expect(s.background.length).toBeGreaterThan(0);
    expect(s.assessment.length).toBeGreaterThan(0);
    expect(s.recommendation.length).toBeGreaterThan(0);
  });
});

describe("renderSbar", () => {
  it("emits the four SBAR blocks in order", () => {
    const text = renderSbar(sbarFor(recurring));
    expect(text.indexOf("S  ")).toBeLessThan(text.indexOf("\nB\n"));
    expect(text.indexOf("\nB\n")).toBeLessThan(text.indexOf("\nA\n"));
    expect(text.indexOf("\nA\n")).toBeLessThan(text.indexOf("\nR\n"));
  });

  it("is plain text, safe to paste into any record system", () => {
    const text = renderSbar(sbarFor(recurring));
    expect(text).not.toMatch(/<[a-z]/i);
  });

  it("is deterministic", () => {
    const a = renderSbar(sbarFor(recurring));
    const b = renderSbar(sbarFor(recurring));
    expect(a).toBe(b);
  });
});
