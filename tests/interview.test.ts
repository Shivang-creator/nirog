import { describe, it, expect, vi, afterEach } from "vitest";
import {
  beginInterview,
  interviewTurn,
  nextQuestion,
  recordAnswer,
  slotsFor,
  questionFor,
  toIntake,
  summarise,
  progress,
  SLOT_LABELS,
  CLOSING,
  AFTER_CLOSING,
  type Slot,
} from "@/lib/clinical/interview";
import { REGIONS } from "@/lib/clinical/regions";

afterEach(() => vi.restoreAllMocks());

/**
 * Answer everything she asks until she stops asking.
 *
 * The guard is not defensive dressing. An interview that cannot terminate is the
 * failure mode that matters here, so the test has to be able to fail rather than
 * hang the suite.
 */
function runInterview(
  opening: string,
  reply: (slot: Slot) => string = () => "a little, yes",
) {
  let step = interviewTurn(beginInterview(opening), opening);
  const asked: Slot[] = [];
  const spoken: string[] = [step.reply];

  while (!step.done) {
    if (asked.length > 40) throw new Error("the interview did not terminate");
    const slot = step.state.pending as Slot;
    asked.push(slot);
    step = interviewTurn(step.state, reply(slot));
    spoken.push(step.reply);
  }

  return { asked, spoken, state: step.state };
}

describe("the interview — start to finish", () => {
  const run = runInterview("I get headaches almost every evening");

  it("asks every slot for the region, in order", () => {
    expect(run.asked).toEqual(slotsFor("head"));
  });

  it("asks nothing twice", () => {
    expect(new Set(run.asked).size).toBe(run.asked.length);
  });

  it("terminates", () => {
    expect(run.state.closed).toBe(true);
    expect(nextQuestion(run.state).done).toBe(true);
  });

  it("closes by handing the patient to the doctor", () => {
    expect(run.spoken[run.spoken.length - 1]).toBe(CLOSING);
    expect(CLOSING).toMatch(/doctor/i);
  });

  it("files every answer under its heading", () => {
    const intake = toIntake(run.state);
    for (const slot of slotsFor("head")) {
      expect(intake[SLOT_LABELS[slot]]).toEqual(["a little, yes"]);
    }
  });

  it("counts itself finished", () => {
    const p = progress(run.state);
    expect(p.answered).toBe(p.total);
  });

  it("has nothing further to ask if the patient keeps talking", () => {
    const after = interviewTurn(run.state, "so should I be worried?");
    expect(after.reply).toBe(AFTER_CLOSING);
    expect(after.state).toEqual(run.state);
  });
});

describe("the record it leaves", () => {
  const run = runInterview("my stomach has been hurting since yesterday", (slot) =>
    slot === "severity" ? "about a seven" : "since Tuesday, on and off",
  );

  it("keeps the presenting complaint word for word", () => {
    expect(summarise(run.state)).toContain(
      "my stomach has been hurting since yesterday",
    );
  });

  it("keeps the answers word for word too", () => {
    expect(summarise(run.state)).toContain("about a seven");
    expect(summarise(run.state)).toContain("since Tuesday, on and off");
  });

  it("says how much of the history was actually taken", () => {
    expect(summarise(run.state)).toMatch(/11 of 11 history questions answered/);
  });
});

describe("answers out of order", () => {
  it("takes a slot the patient volunteers before it is asked", () => {
    let s = beginInterview("my chest feels tight");
    s = recordAnswer(s, "severity", "it is about a seven");
    expect(s.answers.severity).toBe("it is about a seven");
    expect(runFrom(s).asked).not.toContain("severity");
  });

  it("still expects an answer to the question standing", () => {
    const opened = interviewTurn(beginInterview("my chest feels tight"), "my chest feels tight");
    const answered = interviewTurn(opened.state, "middle of my chest");
    expect(answered.state.pending).toBe("onset");

    const volunteered = recordAnswer(answered.state, "severity", "about a seven");
    expect(nextQuestion(volunteered).slot).toBe("onset");
  });

  it("skips a slot already answered when it comes round", () => {
    const opened = interviewTurn(beginInterview("my chest feels tight"), "my chest feels tight");
    const located = interviewTurn(opened.state, "middle of my chest");
    const volunteered = recordAnswer(located.state, "severity", "about a seven");
    const onset = interviewTurn(volunteered, "since this morning");
    expect(onset.state.pending).toBe("character");
    // Severity sits between character and safety, and has already been given.
    const character = interviewTurn(onset.state, "a tight band across it");
    expect(character.state.pending).toBe("safety");
  });

  it("ignores an empty answer rather than recording one", () => {
    const s = beginInterview("my knee hurts");
    expect(recordAnswer(s, "onset", "   ")).toEqual(s);
  });

  /** Finish an interview that has been part-filled by hand. */
  function runFrom(state: ReturnType<typeof beginInterview>) {
    let step = interviewTurn(state, "");
    const asked: Slot[] = [];
    while (!step.done) {
      if (asked.length > 40) throw new Error("the interview did not terminate");
      asked.push(step.state.pending as Slot);
      step = interviewTurn(step.state, "yes");
    }
    return { asked, state: step.state };
  }
});

describe("adapting to the body region", () => {
  it("asks a lower back about the leg, not about movement in general", () => {
    expect(questionFor("radiation", "lower_back")).toMatch(/leg/);
    expect(questionFor("radiation", "unknown")).toMatch(/move anywhere/);
  });

  it("asks each region its own safety question", () => {
    expect(questionFor("safety", "lower_back")).toMatch(/bladder/);
    expect(questionFor("safety", "head")).toMatch(/worst headache/);
    expect(questionFor("safety", "chest")).toMatch(/breathe/);
    expect(questionFor("safety", "leg")).toMatch(/swollen/);
  });

  it("drops a slot that makes no sense for the region", () => {
    expect(slotsFor("systemic")).not.toContain("radiation");
    expect(slotsFor("head")).toContain("radiation");
  });

  it("falls back to the general wording for a region with no special case", () => {
    expect(questionFor("onset", "lower_back")).toBe(questionFor("onset", "unknown"));
  });

  it("takes the region from the words when they name one", () => {
    expect(beginInterview("my lower back is aching again").region).toBe("lower_back");
  });

  /*
   * The case this whole project is about. "The ache is back again" names no body
   * part — *back* is an adverb there — so on the words alone she asks a general
   * history. With the region memory returned, she asks a lumbar one.
   */
  it("takes it from memory when the words name none", () => {
    expect(beginInterview("the ache is back again, it's been three weeks now").region).toBe(
      "unknown",
    );
    const remembered = beginInterview(
      "the ache is back again, it's been three weeks now",
      "lower_back",
    );
    expect(remembered.region).toBe("lower_back");
    expect(nextQuestion(remembered).question).toMatch(/lower back/);
  });

  it("does not let memory overrule words that do name one", () => {
    expect(beginInterview("my head is pounding", "lower_back").region).toBe("head");
  });
});

describe("how the questions sound", () => {
  const everything = REGIONS.flatMap((r) => slotsFor(r).map((s) => questionFor(s, r)));

  it("asks one thing at a time", () => {
    for (const q of everything) {
      expect(q.endsWith("?")).toBe(true);
      expect(q.match(/\?/g)).toHaveLength(1);
    }
  });

  it("keeps them short enough to say out loud", () => {
    for (const q of everything) {
      expect(q.split(" ").length).toBeLessThanOrEqual(16);
    }
  });

  it("uses no punctuation Polly has to guess at", () => {
    for (const q of [...everything, CLOSING, AFTER_CLOSING]) {
      expect(q).not.toMatch(/[—–]/);
    }
  });

  it("never apologises for itself or mentions the plumbing", () => {
    const spoken = [...everything, CLOSING, AFTER_CLOSING].join(" ");
    expect(spoken).not.toMatch(/sorry|apolog|unavailable|can't reach|cannot reach|service|offline|fallback/i);
  });
});

describe("determinism", () => {
  it("gives the same interview twice", () => {
    const a = runInterview("my lower back has been aching for a few days");
    const b = runInterview("my lower back has been aching for a few days");
    expect(a.spoken).toEqual(b.spoken);
    expect(a.state).toEqual(b.state);
  });

  it("does not mutate the state it is handed", () => {
    const s = beginInterview("my knee hurts");
    const before = structuredClone(s);
    interviewTurn(s, "my knee hurts");
    recordAnswer(s, "onset", "last week");
    expect(s).toEqual(before);
  });

  it("touches the network at no point", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    runInterview("I've had a fever for 3 days");
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

/**
 * The reason this module exists. NEXT_PUBLIC_ARIA_API_URL was never delivered, so
 * the configured check below is false in production and the interview is what the
 * patient gets. It has to be a real history, not an error message.
 */
describe("when the clinical service is not configured", () => {
  const original = process.env.NEXT_PUBLIC_ARIA_API_URL;

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_ARIA_API_URL;
    else process.env.NEXT_PUBLIC_ARIA_API_URL = original;
    vi.resetModules();
  });

  it("reports itself unconfigured when the URL is absent", async () => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_ARIA_API_URL;
    const { isConfigured } = await import("@/lib/nirog/aria");
    expect(isConfigured()).toBe(false);
  });

  it("reports itself configured when the URL is there", async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_ARIA_API_URL = "https://example.invalid/aria/";
    const { isConfigured } = await import("@/lib/nirog/aria");
    expect(isConfigured()).toBe(true);
  });

  it("leaves the patient with a full history either way", () => {
    const run = runInterview("I've had a fever for 3 days");
    expect(run.asked.length).toBeGreaterThan(8);
    expect(run.state.closed).toBe(true);
    for (const line of run.spoken) {
      expect(line).not.toMatch(/sorry|try again|can't reach|cannot reach/i);
    }
  });
});
