/**
 * Taking the history.
 *
 * A structured history is the oldest tool in clinical medicine and it is a fixed
 * list of questions. Where is it, when did it start, what does it feel like, what
 * makes it worse. Every nurse asks roughly the same ones, and the order is the
 * skill rather than the wording. So this is a list and a cursor.
 *
 * That makes it the deterministic layer for the conversation, in the same sense
 * that recurrence.ts is the deterministic layer for the chart. A model on top can
 * ask sharper follow-ups and it is welcome to. Nothing about the interview should
 * stop working when the model is unreachable, because a patient halfway through
 * describing their chest does not care whose GPU is down.
 *
 * OLDCARTS is the mnemonic every clinician learns for the slots: Onset, Location,
 * Duration, Character, Aggravating and alleviating factors, Radiation, Timing,
 * Severity. It is a memory aid for the list, not an order to ask them in — asking
 * how long each episode lasts before you know where the pain is sounds like a
 * form being filled. The order below is the order the questions come out in a
 * room.
 *
 * Two rules hold everywhere in this file.
 *
 * Every question is one question. Polly reads these out loud, and "is anything
 * making it worse, and is anything making it better" gets one answer and quietly
 * loses the other.
 *
 * The safety questions are asked and recorded, never acted on. Deciding that an
 * answer is an emergency is triage, and triage belongs to a clinician. What this
 * guarantees is that the question was put.
 */

import { classify, type Region } from "./regions";

/**
 * The slots, in the order they are asked.
 *
 * Location first because everything after it is easier to phrase once you know
 * where you are. The safety question sits fourth rather than last: a patient who
 * gives up after four questions has still been asked the one that matters, and
 * opening with it would frighten someone who came in about a sore knee.
 *
 * Aggravating and alleviating are separate slots although OLDCARTS spells them as
 * one letter. They are two questions and they get asked as two.
 */
export const SLOTS = [
  "location",
  "onset",
  "character",
  "severity",
  "safety",
  "radiation",
  "timing",
  "duration",
  "aggravating",
  "alleviating",
  "associated",
] as const;

export type Slot = (typeof SLOTS)[number];

/** Headings for the collected answers, as a clinician reads them. */
export const SLOT_LABELS: Record<Slot, string> = {
  location: "Location",
  onset: "Onset",
  character: "Character",
  severity: "Severity",
  safety: "Safety check",
  radiation: "Radiation",
  timing: "Timing",
  duration: "Duration",
  aggravating: "Makes it worse",
  alleviating: "Makes it better",
  associated: "Associated symptoms",
};

/**
 * The questions when the complaint has not told us where it is.
 *
 * Short sentences, because they are heard and not read. A spoken question longer
 * than about a dozen words has usually lost the patient by the verb.
 */
const BASE_QUESTIONS: Record<Slot, string> = {
  location: "Where in your body do you feel this?",
  onset: "When did it first start?",
  character: "What does it feel like?",
  severity: "From zero to ten, how bad is it right now?",
  safety: "Have you had a fever with this?",
  radiation: "Does it stay in one spot, or does it move anywhere?",
  timing: "Is it there all the time, or does it come and go?",
  duration: "When it comes on, how long does it usually last?",
  aggravating: "Is there anything that makes it worse?",
  alleviating: "Is there anything that makes it better?",
  associated: "Have you noticed anything else along with it?",
};

/**
 * Where the region changes the question.
 *
 * Only the slots that genuinely differ are overridden. "Does it travel down into
 * your leg" is a real lumbar question and "does it move anywhere" is a
 * placeholder for one, but there is no better way to ask about onset just because
 * the complaint is a headache, so onset is left alone almost everywhere.
 *
 * The safety line is region-specific on purpose. A general "is anything worrying
 * you" collects reassurance, not information.
 */
const REGION_QUESTIONS: Partial<Record<Region, Partial<Record<Slot, string>>>> = {
  lower_back: {
    location: "Whereabouts in your lower back is it worst?",
    radiation: "Does it travel down into your leg at all?",
    aggravating: "Does bending or lifting set it off?",
    safety: "Have you had any trouble controlling your bladder or your bowels?",
  },
  upper_back: {
    location: "Is it between your shoulder blades, or lower down?",
    safety: "Does it get worse when you take a deep breath in?",
  },
  neck: {
    location: "Is it at the back of your neck, or more to one side?",
    radiation: "Does it go down into your arm at all?",
    safety: "Can you bring your chin down to your chest without it hurting?",
  },
  head: {
    location: "Which part of your head does it sit in?",
    character: "Is it a pounding pain, or more of a steady pressure?",
    safety: "Did it come on all at once, like the worst headache you have ever had?",
    associated: "Have you noticed anything happening to your vision with it?",
  },
  chest: {
    location: "Is it in the middle of your chest, or off to one side?",
    radiation: "Does it spread into your arm or your jaw?",
    aggravating: "Does it come on when you walk or climb stairs?",
    safety: "Are you finding it hard to breathe at the moment?",
  },
  abdomen: {
    location: "Whereabouts in your stomach is it worst?",
    radiation: "Does it move round to your back at all?",
    aggravating: "Does eating make it worse?",
    safety: "Have you seen any blood when you go to the toilet?",
  },
  pelvis: {
    location: "Is it low down in the middle, or more to one side?",
    safety: "Have you had any burning when you pass urine?",
  },
  arm: {
    location: "Which part of your arm is it worst in?",
    radiation: "Does it run down into your hand?",
    aggravating: "Does moving it make it worse?",
    safety: "Is your hand weak or numb at all?",
  },
  leg: {
    location: "Which part of your leg is it worst in?",
    radiation: "Does it run further down the leg?",
    aggravating: "Does walking make it worse?",
    safety: "Is that leg more swollen than the other one?",
  },
  skin: {
    location: "Where on your body is it?",
    character: "Is it itchy, or is it more sore?",
    radiation: "Has it spread anywhere since it started?",
    safety: "Have you had a fever along with it?",
  },
  systemic: {
    location: "Do you feel it all over, or in one place more than others?",
    character: "How would you describe it?",
    safety: "Have you been losing weight without meaning to?",
  },
};

/**
 * Slots that make no sense for a region and are dropped rather than asked badly.
 *
 * Nothing radiates when the complaint is tiredness. Asking anyway is how a
 * questionnaire tells the patient it is not really listening.
 */
const SKIPPED: Partial<Record<Region, readonly Slot[]>> = {
  systemic: ["radiation"],
};

/**
 * What she says before the question.
 *
 * Cycled by how much has been answered, not shuffled. A random pick would make
 * the transcript different on every run, and a conversation that cannot be
 * reproduced cannot be tested.
 */
const ACKNOWLEDGEMENTS = ["Thank you.", "Okay.", "I see.", "Got it.", "Alright."];

/**
 * The handover, spoken. She stops asking and says who has it now.
 *
 * No thanks at the front: the acknowledgement on the last question is already a
 * "thank you" one turn in five, and hearing it twice in a row is the tell that
 * nobody listened to this out loud.
 */
export const CLOSING =
  "That is everything I need to ask. I have written down what you told me, " +
  "and the doctor will take it from here.";

/** If they keep talking after the history is finished. */
export const AFTER_CLOSING =
  "Everything you told me is with the doctor now. They will go through it with you.";

export interface InterviewState {
  /** The presenting complaint, in the patient's own words. */
  complaint: string;
  region: Region;
  /** Slot to the patient's answer, unedited. */
  answers: Partial<Record<Slot, string>>;
  /** Slots put to the patient, in the order they were asked. */
  asked: Slot[];
  /** The slot the last question was for. The next thing they say answers it. */
  pending: Slot | null;
  closed: boolean;
}

export interface NextQuestion {
  /** What she says out loud. The closing line when there is nothing left to ask. */
  question: string;
  /** Null once the history is complete. */
  slot: Slot | null;
  done: boolean;
}

/** The slots this region gets asked, in order. */
export function slotsFor(region: Region): Slot[] {
  const skip = SKIPPED[region] ?? [];
  return SLOTS.filter((s) => !skip.includes(s));
}

/** The wording for one slot, adapted to the region where there is a better way to ask. */
export function questionFor(slot: Slot, region: Region): string {
  return REGION_QUESTIONS[region]?.[slot] ?? BASE_QUESTIONS[slot];
}

/**
 * Open a history on what the patient just said.
 *
 * `remembered` is the region memory came back with, and it is consulted only when
 * the words name nothing — the same order resolveRegion uses, for the same
 * reason. "The ache is back again" contains no body part, so on its own it gets a
 * generic interview. With the previous visit in hand it gets the lumbar one.
 */
export function beginInterview(
  complaint: string,
  remembered: Region | null = null,
): InterviewState {
  const text = complaint.trim();
  const named = classify(text).region;
  return {
    complaint: text,
    region: named === "unknown" ? (remembered ?? "unknown") : named,
    answers: {},
    asked: [],
    pending: null,
    closed: false,
  };
}

/**
 * File an answer against a slot.
 *
 * Kept unedited. How somebody describes their own pain is information, and a
 * tidied version of "it grabs me when I stand" is a worse clinical record than
 * the sentence itself.
 *
 * The slot is passed in rather than inferred, so an answer can be filed out of
 * order — a patient who volunteers the severity while being asked about onset has
 * answered both, and should not be asked again.
 */
export function recordAnswer(
  state: InterviewState,
  slot: Slot,
  rawText: string,
): InterviewState {
  const text = rawText.trim();
  if (!text) return state;
  return {
    ...state,
    answers: { ...state.answers, [slot]: text },
    pending: state.pending === slot ? null : state.pending,
  };
}

/**
 * The next thing to ask, or the closing line.
 *
 * Pure, and driven off the answers rather than off `asked`. A slot that was put
 * to the patient and never answered comes round again, which is what a nurse does
 * when someone talks past the question.
 */
export function nextQuestion(state: InterviewState): NextQuestion {
  const slot = slotsFor(state.region).find((s) => state.answers[s] === undefined);
  if (!slot) return { question: CLOSING, slot: null, done: true };
  return { question: questionFor(slot, state.region), slot, done: false };
}

export interface InterviewTurn {
  state: InterviewState;
  /** Her whole spoken reply: the acknowledgement and the question. */
  reply: string;
  done: boolean;
}

/**
 * One turn. Hear the answer to the question standing, then ask the next.
 *
 * Synchronous and total: there is no path through this that returns nothing to
 * say, which is the entire point of it existing.
 */
export function interviewTurn(state: InterviewState, rawText: string): InterviewTurn {
  if (state.closed) return { state, reply: AFTER_CLOSING, done: true };

  const heard = state.pending ? recordAnswer(state, state.pending, rawText) : state;
  const q = nextQuestion(heard);

  if (q.done || !q.slot) {
    return {
      state: { ...heard, pending: null, closed: true },
      reply: CLOSING,
      done: true,
    };
  }

  const ack = ACKNOWLEDGEMENTS[Object.keys(heard.answers).length % ACKNOWLEDGEMENTS.length];
  return {
    state: { ...heard, pending: q.slot, asked: [...heard.asked, q.slot] },
    reply: `${ack} ${q.question}`,
    done: false,
  };
}

/** How far through the history she is, for anything that wants to show progress. */
export function progress(state: InterviewState): { answered: number; total: number } {
  const total = slotsFor(state.region).length;
  const answered = slotsFor(state.region).filter(
    (s) => state.answers[s] !== undefined,
  ).length;
  return { answered, total };
}

/**
 * The collected history, keyed by heading.
 *
 * Same shape the clinical service returns, so whatever consumes an intake does
 * not have to know which of the two filled it in.
 */
export function toIntake(state: InterviewState): Record<string, string[]> {
  const intake: Record<string, string[]> = {};
  for (const slot of slotsFor(state.region)) {
    const answer = state.answers[slot];
    if (answer !== undefined) intake[SLOT_LABELS[slot]] = [answer];
  }
  return intake;
}

/**
 * The history as plain text, for the case file.
 *
 * Quoted throughout. Nothing in here is a finding, an impression or a
 * conclusion — it is a record of what was asked and what was said back.
 */
export function summarise(state: InterviewState): string {
  const lines = [`Presenting complaint: “${state.complaint}”`];
  for (const slot of slotsFor(state.region)) {
    const answer = state.answers[slot];
    if (answer !== undefined) lines.push(`${SLOT_LABELS[slot]}: “${answer}”`);
  }
  const { answered, total } = progress(state);
  lines.push(`${answered} of ${total} history questions answered.`);
  return lines.join("\n");
}
