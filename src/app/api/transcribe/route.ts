import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Speech-to-text for the microphone.
 *
 * Not implemented yet, and it fails loudly on purpose.
 *
 * The scene treats a non-OK response as a recognition error and surfaces it in
 * the dock, which is the behaviour we want. The alternative — returning an
 * empty transcript with 200 — reads to the scene as "they said nothing", so it
 * reopens the microphone and the patient talks into a loop that never answers.
 * A visible failure they can type around beats an invisible one they cannot.
 *
 * To enable: attach AmazonTranscribeFullAccess to the IAM user, then implement
 * StartStreamTranscription here. Polly (/api/speak) needed exactly the same
 * kind of grant and now works, so the path is known.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Voice input is not enabled on this deployment — type your answer or " +
        "tap a suggestion instead.",
    },
    { status: 501 },
  );
}
