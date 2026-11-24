import { NextRequest, NextResponse } from "next/server";
import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
  type LanguageCode,
} from "@aws-sdk/client-transcribe-streaming";

import { limited } from "@/lib/http/paid-route";
import { readJsonCapped } from "@/lib/http/rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Turns what the patient said into text.
 *
 * The scene records at 16 kHz mono and posts a WAV. Amazon Transcribe streaming
 * wants raw PCM, so the header comes off before anything is sent.
 *
 * A failure here is loud on purpose. Returning an empty transcript with a 200
 * would look to the scene like the patient had said nothing, so it would open
 * the microphone again and they would talk into a loop that never answers.
 * Better to say the microphone is broken and let them type.
 */

const SAMPLE_RATE = 16_000;

/**
 * The scene stops recording at 30 seconds (MIC_MAX_MS), which is 960 KB of
 * 16 kHz mono PCM and about 1.3 MB once base64-encoded. Transcribe bills by the
 * second of audio, so a clip with no ceiling is a bill with no ceiling; this
 * allows roughly twice the longest answer the scene can send.
 */
const MAX_BODY_BYTES = 2_700_000;

/**
 * Strip the RIFF header.
 *
 * Walking the chunks is safer than assuming the usual 44 bytes. Some encoders
 * write a LIST chunk before the data and that offset moves.
 */
function pcmFromWav(buf: Buffer): Buffer {
  if (buf.length < 12 || buf.toString("ascii", 0, 4) !== "RIFF") return buf;
  let off = 12;
  while (off + 8 <= buf.length) {
    const id = buf.toString("ascii", off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (id === "data") {
      return buf.subarray(off + 8, Math.min(off + 8 + size, buf.length));
    }
    off += 8 + size + (size % 2);
  }
  return buf;
}

/** Transcribe rejects anything over 32 KB in a single event. */
function* chunks(pcm: Buffer, size = 16_000) {
  for (let i = 0; i < pcm.length; i += size) {
    yield { AudioEvent: { AudioChunk: pcm.subarray(i, i + size) } };
  }
}

export async function POST(req: NextRequest) {
  const refused = limited(req, "transcribe");
  if (refused) return refused;

  const read = await readJsonCapped(req, MAX_BODY_BYTES);
  if (!read.ok) {
    return read.reason === "too-large"
      ? NextResponse.json({ error: "audio too long" }, { status: 413 })
      : NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const body = (read.value ?? {}) as { audio?: string; format?: string };

  const b64 = String(body.audio ?? "");
  if (!b64) return NextResponse.json({ error: "no audio" }, { status: 400 });

  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!region || !accessKeyId || !secretAccessKey) {
    return NextResponse.json(
      { error: "Voice input is not configured on this deployment." },
      { status: 501 },
    );
  }

  const pcm = pcmFromWav(Buffer.from(b64, "base64"));

  // Roughly a third of a second. Anything shorter is a cough or a door.
  if (pcm.length < SAMPLE_RATE * 2 * 0.3) {
    return NextResponse.json({ text: "" });
  }

  const client = new TranscribeStreamingClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  try {
    const res = await client.send(
      new StartStreamTranscriptionCommand({
        // en-IN, because the people this is built for speak Indian English and
        // switch into Hindi mid-sentence.
        // Her ears and her voice must agree: a nurse who speaks one English and
        // listens for another mishears the accent she is talking to.
        LanguageCode: (process.env.TRANSCRIBE_LANGUAGE_CODE ??
          process.env.POLLY_LANGUAGE_CODE ??
          "en-NZ") as LanguageCode,
        MediaSampleRateHertz: SAMPLE_RATE,
        MediaEncoding: "pcm",
        AudioStream: (async function* () {
          for (const c of chunks(pcm)) yield c;
        })(),
      }),
    );

    // Only settled results count. Partials get revised, and a revision landing
    // after the answer was sent would put words in the patient's mouth.
    let text = "";
    if (res.TranscriptResultStream) {
      for await (const event of res.TranscriptResultStream) {
        const results = event.TranscriptEvent?.Transcript?.Results ?? [];
        for (const r of results) {
          if (r.IsPartial) continue;
          const alt = r.Alternatives?.[0]?.Transcript;
          if (alt) text += (text ? " " : "") + alt;
        }
      }
    }

    return NextResponse.json({ text: text.trim() });
  } catch (err) {
    const e = err as { name?: string; message?: string };
    console.error("[transcribe] failed:", e.name, e.message);
    // Still loud — a 502, never an empty transcript — but the AWS detail (which
    // can name the IAM principal and account) stays in the server log.
    return NextResponse.json({ error: "Transcription failed." }, { status: 502 });
  }
}
