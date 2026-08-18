import { NextRequest, NextResponse } from "next/server";
import {
  PollyClient,
  SynthesizeSpeechCommand,
  type VoiceId,
  type Engine,
  type LanguageCode,
} from "@aws-sdk/client-polly";

export const dynamic = "force-dynamic";

/**
 * ARIA's voice.
 *
 * The scene tries three sources in order — this endpoint, then ElevenLabs, then
 * the browser's built-in speechSynthesis. Without the first two it falls to the
 * third, which is why she sounded like a screen reader instead of like herself.
 *
 * Kajal is the only Indian-English neural voice Polly offers, and this is a
 * product for rural India. Aditi and Raveena are also en-IN but standard-tier,
 * and the difference is audible in exactly the place it matters: a nurse who
 * sounds synthetic is a nurse nobody tells the truth to.
 *
 * Credentials stay on the server. The mobile app routed this through a Lambda
 * for the same reason; a Next.js route handler already is one.
 */

/*
 * Polly's en-NZ neural voice is called Aria, which is also the nurse's name.
 * Voice and language are one decision and travel together — a voice read with
 * the wrong language code gets the vowels right and the rhythm wrong.
 */
const VOICE = (process.env.POLLY_VOICE_ID ?? "Aria") as VoiceId;
const ENGINE = (process.env.POLLY_ENGINE ?? "neural") as Engine;
const SPEAK_LANG = (process.env.POLLY_LANGUAGE_CODE ?? "en-NZ") as LanguageCode;

/** Polly's hard ceiling is 3000 characters; ARIA's lines are nowhere near it. */
const MAX_CHARS = 1000;

function client() {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!region || !accessKeyId || !secretAccessKey) return null;
  return new PollyClient({ region, credentials: { accessKeyId, secretAccessKey } });
}

export async function POST(req: NextRequest) {
  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const text = String(body.text ?? "").trim();
  if (!text) return NextResponse.json({ error: "no text" }, { status: 400 });
  if (text.length > MAX_CHARS) {
    return NextResponse.json({ error: "text too long" }, { status: 400 });
  }

  const polly = client();
  if (!polly) {
    /*
     * 501, not 500. The scene treats any failure here as "fall through to the
     * next voice", so an unconfigured deployment still talks — just in the
     * browser's voice. Saying which it is keeps that visible rather than
     * looking like a bug.
     */
    return NextResponse.json(
      { error: "Polly is not configured on this deployment." },
      { status: 501 },
    );
  }

  try {
    const started = Date.now();
    const res = await polly.send(
      new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: "mp3",
        VoiceId: VOICE,
        Engine: ENGINE,
        LanguageCode: SPEAK_LANG,
      }),
    );

    if (!res.AudioStream) {
      return NextResponse.json({ error: "no audio returned" }, { status: 502 });
    }

    const bytes = await res.AudioStream.transformToByteArray();

    // The scene expects base64 in a JSON envelope, matching the Lambda's
    // /speak contract, so nurseHtml.ts needs no change to use this.
    return NextResponse.json({
      audio: Buffer.from(bytes).toString("base64"),
      voice: VOICE,
      engine: ENGINE,
      language: SPEAK_LANG,
      latencyMs: Date.now() - started,
    });
  } catch (err) {
    const e = err as { name?: string; message?: string };
    console.error("[speak] polly failed:", e.name, e.message);
    return NextResponse.json(
      { error: `${e.name ?? "Error"}: ${e.message ?? "synthesis failed"}` },
      { status: 502 },
    );
  }
}
