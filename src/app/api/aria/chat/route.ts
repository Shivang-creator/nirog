import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { chatConfigured, converseJson, CHAT_MODEL } from "@/lib/ai/converse";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * One conversational turn of ARIA's clinical intake.
 *
 * Stateless by contract (see lib/nirog/aria.ts): the client posts the whole
 * transcript plus the case state from the previous turn, and gets back the
 * reply plus the updated case state. Nothing here is a diagnosis — candidates
 * are conversation guidance for ARIA and become *suggestions for a doctor to
 * verify* in the handover, never conclusions shown as fact to the patient.
 */

const QUESTION_BUDGET = 8;

const turnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string().max(4000),
});

const requestSchema = z.object({
  history: z.array(turnSchema).min(1).max(60),
  profile: z
    .object({
      name: z.string().optional(),
      age: z.union([z.string(), z.number()]).optional(),
      sex: z.string().optional(),
      conditions: z.string().optional(),
    })
    .default({}),
  intake: z.record(z.string(), z.array(z.string())).default({}),
  candidates: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        source: z.string(),
        symptoms: z.string(),
        score: z.number(),
      }),
    )
    .default([]),
  complete: z.boolean().default(false),
});

const modelResultSchema = z.object({
  reply: z.string().min(1),
  intake: z.record(z.string(), z.array(z.string())),
  candidates: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      symptoms: z.string(),
      score: z.number().min(0).max(1),
    }),
  ),
  complete: z.boolean(),
  summary: z.string().nullable(),
  redFlag: z.boolean(),
  flags: z.array(
    z.object({ id: z.string(), label: z.string(), advice: z.string() }),
  ),
});

function systemPrompt(args: {
  profile: z.infer<typeof requestSchema>["profile"];
  intake: Record<string, string[]>;
  candidates: unknown[];
  complete: boolean;
  questionsAsked: number;
}): string {
  return [
    `You are ARIA, a warm, professional clinical intake nurse for Nirog, a telehealth service for rural India. You speak briefly and naturally — your words are read aloud by a voice engine, so no markdown, no lists, no emoji, one or two short sentences per reply.`,
    ``,
    `Your job is a structured intake, NOT a diagnosis. Never name a probable condition to the patient, never prescribe. You gather the history a doctor needs (OLDCARTS: onset, location, duration, character, aggravating, relieving, timing, severity — plus associated symptoms, medications, allergies, relevant history), one question at a time.`,
    ``,
    `RED FLAGS: if anything suggests an emergency (chest pain with sweating or breathlessness, signs of stroke, severe bleeding, anaphylaxis, suicidal intent, a very sick infant, etc.), set redFlag true, add a flag {id, label, advice}, and your reply must calmly tell them to seek emergency care now.`,
    ``,
    `QUESTION BUDGET: you have asked ${args.questionsAsked} of ${QUESTION_BUDGET} questions. When the budget is spent or the picture is sufficient, set complete=true, stop asking, thank them, and write "summary": a short plain-language recap of what you recorded (not a diagnosis). After completion (phase qa) you may answer their general questions but never diagnose.`,
    ``,
    `CASE STATE — carry it forward, never drop what is already recorded:`,
    `Patient profile: ${JSON.stringify(args.profile)}`,
    `Intake so far: ${JSON.stringify(args.intake)}`,
    `Candidates so far: ${JSON.stringify(args.candidates)}`,
    `Already complete: ${args.complete}`,
    ``,
    `"candidates" are conditions YOU are considering to steer questioning — from your own medical knowledge, each {id: kebab-case, name, symptoms: comma-separated matching symptoms the patient actually reported, score: 0..1}. Keep at most 5, re-scored every turn. They are shown to the doctor as suggestions to verify, so be conservative.`,
    ``,
    `Respond with ONLY a JSON object, no prose around it:`,
    `{"reply": string, "intake": {slot: [findings]}, "candidates": [...], "complete": boolean, "summary": string|null, "redFlag": boolean, "flags": [{"id","label","advice"}]}`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  if (!chatConfigured()) {
    return NextResponse.json(
      { error: "ARIA's model is not configured — set the AWS credentials." },
      { status: 501 },
    );
  }

  let parsed: z.infer<typeof requestSchema>;
  try {
    parsed = requestSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const questionsAsked = parsed.history.filter(
    (t) => t.role === "assistant" && t.text.includes("?"),
  ).length;

  try {
    const result = modelResultSchema.parse(
      await converseJson({
        system: systemPrompt({
          profile: parsed.profile,
          intake: parsed.intake,
          candidates: parsed.candidates,
          complete: parsed.complete,
          questionsAsked,
        }),
        turns: parsed.history,
      }),
    );

    const complete = parsed.complete || result.complete;

    // The model pads slots it has not filled with empty strings; an empty
    // slot is "not asked yet", not a finding, and must not render as one.
    const intake = Object.fromEntries(
      Object.entries(result.intake)
        .map(([slot, findings]) => [slot, findings.filter((f) => f.trim())])
        .filter(([, findings]) => findings.length > 0),
    );

    return NextResponse.json({
      reply: result.reply,
      intake,
      candidates: result.candidates.map((c) => ({ ...c, source: CHAT_MODEL })),
      complete,
      summary: result.summary,
      redFlag: result.redFlag,
      flags: result.flags,
      phase: complete ? "qa" : "intake",
      questionsLeft: Math.max(0, QUESTION_BUDGET - questionsAsked - 1),
    });
  } catch (err) {
    console.error("[aria/chat]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "ARIA could not answer just now. Please try again." },
      { status: 502 },
    );
  }
}
