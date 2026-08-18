import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { chatConfigured, converseJson, CHAT_MODEL } from "@/lib/ai/converse";

export const dynamic = "force-dynamic";
export const maxDuration = 90;

/**
 * The SBAR handover — what the doctor sees before the consult.
 *
 * Everything in it is framed for verification, not as conclusions: candidate
 * conditions carry their rationale and the symptoms that support them, and
 * `not_established` lists what the intake did NOT cover, which is as clinically
 * important as what it did.
 */

const requestSchema = z.object({
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), text: z.string() }))
    .min(1)
    .max(80),
  intake: z.record(z.string(), z.array(z.string())),
  candidates: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      source: z.string(),
      symptoms: z.string(),
      score: z.number(),
    }),
  ),
  profile: z
    .object({
      name: z.string().nullish(),
      age: z.union([z.string(), z.number()]).nullish(),
      sex: z.string().nullish(),
      conditions: z.string().nullish(),
    })
    .nullish(),
  flags: z
    .array(z.object({ id: z.string(), label: z.string(), advice: z.string() }))
    .nullish(),
});

// The model occasionally hands back a bare string where a list belongs, or
// null for a section it has nothing for. Both mean the same thing to a doctor;
// coerce rather than fail the whole handover over a shape nit.
const strList = z
  .union([z.array(z.string()), z.string().transform((s) => (s ? [s] : []))])
  .nullish();

const handoverSchema = z.object({
  situation: z.object({
    chief_complaint: z.string(),
    duration: z.string().nullish(),
    severity: z.string().nullish(),
    summary: z.string(),
  }),
  background: z.object({
    history_of_presenting_complaint: strList.transform((v) => v ?? []),
    associated_symptoms: strList,
    past_medical_history: strList,
    medications: strList,
    allergies: strList,
    family_social_history: strList,
  }),
  assessment: z.object({
    candidate_conditions: z.array(
      z.object({
        condition: z.string(),
        rationale: z.string(),
        supporting_symptoms: strList,
        evidence_id: z.string().nullish(),
        evidence_source: z.string().nullish(),
        match_score: z.number().nullish(),
      }),
    ),
    red_flags: strList.transform((v) => v ?? []),
    not_established: strList.transform((v) => v ?? []),
  }),
  recommendation: z.object({
    triage_level: z.enum(["emergency", "urgent", "routine", "self_care"]),
    triage_rationale: z.string(),
    suggested_investigations: strList,
    questions_for_clinician: strList,
  }),
});

const SYSTEM = [
  `You are a clinical documentation assistant writing an SBAR handover from a nurse-intake transcript, for a doctor who is about to see the patient. Precise, neutral clinical register. Quote the patient's own words for symptoms where possible.`,
  ``,
  `Rules: candidate conditions are possibilities for the doctor to VERIFY, ranked by how well the reported symptoms support them — never certainties. "not_established" must honestly list what the intake did not cover. Triage conservatively: when in doubt between two levels, pick the more cautious one.`,
  ``,
  `Respond with ONLY a JSON object in exactly this shape:`,
  `{"situation":{"chief_complaint","duration"?,"severity"?,"summary"},"background":{"history_of_presenting_complaint":[...],"associated_symptoms"?,"past_medical_history"?,"medications"?,"allergies"?,"family_social_history"?},"assessment":{"candidate_conditions":[{"condition","rationale","supporting_symptoms"?,"match_score"?}],"red_flags":[...],"not_established":[...]},"recommendation":{"triage_level":"emergency|urgent|routine|self_care","triage_rationale","suggested_investigations"?,"questions_for_clinician"?}}`,
].join("\n");

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

  const caseBrief = [
    `Patient profile: ${JSON.stringify(parsed.profile ?? {})}`,
    `Recorded intake: ${JSON.stringify(parsed.intake)}`,
    `Candidates under consideration: ${JSON.stringify(parsed.candidates)}`,
    `Red flags raised during intake: ${JSON.stringify(parsed.flags ?? [])}`,
    ``,
    `Transcript:`,
    ...parsed.history.map((t) => `${t.role === "user" ? "Patient" : "Nurse"}: ${t.text}`),
    ``,
    `Write the SBAR handover now.`,
  ].join("\n");

  try {
    const handover = handoverSchema.parse(
      await converseJson({
        system: SYSTEM,
        turns: [{ role: "user", text: caseBrief }],
        maxTokens: 3000,
        temperature: 0.2,
        // The handover is written once, read by a doctor, and worth the wait.
        reasoningEffort: "medium",
      }),
    );

    return NextResponse.json({
      ...handover,
      meta: {
        generated_at: new Date().toISOString(),
        generated_by: CHAT_MODEL,
        knowledge_base:
          "model clinical knowledge only — no external knowledge base attached",
        disclaimer:
          "AI-drafted from a nurse-intake conversation. Every item requires verification by the treating clinician before any clinical use.",
      },
    });
  } catch (err) {
    console.error("[aria/handover]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "The handover could not be generated. Please try again." },
      { status: 502 },
    );
  }
}
