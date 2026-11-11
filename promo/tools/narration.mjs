/**
 * Generate the promo narration with Amazon Polly — Kajal, en-IN neural.
 *
 * This is deliberately the same voice ARIA speaks with in the product
 * (src/app/api/speak/route.ts), so the promo is narrated by the nurse herself.
 * One mp3 per scene, plus a manifest.json with measured durations so the
 * Remotion timeline can be driven by the audio rather than guessed.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire("c:/Projects/nirog-team/package.json");
const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");

// Read .env.local by hand — no dotenv dependency needed.
const envText = await fs.readFile("c:/Projects/nirog-team/.env.local", "utf8");
const env = {};
for (const line of envText.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, "").trim();
}

const SCENES = [
  {
    id: "s1-intro",
    ssml: `<speak>Every visit to a doctor used to start the same way. <break time="400ms"/> With a stranger. <break time="500ms"/> I am ARIA — Nirog's intake nurse. <break time="300ms"/> And I remember you.</speak>`,
  },
  {
    id: "s2-app",
    ssml: `<speak>Patients talk to me in their own words — I listen, I ask, and I write every word to memory. <break time="350ms"/> Doctors open the same patient and see what I heard: the pattern, the dates, the handover — ready before the consult begins.</speak>`,
  },
  {
    id: "s3-tech",
    ssml: `<speak>Under the hood, this is a production agent. <break time="300ms"/> Amazon Transcribe is my ears. Amazon Polly is the voice you are hearing right now. <break time="300ms"/> My conversation runs on g p t oss, on Amazon Bedrock. <break time="350ms"/> And my memory lives in CockroachDB — every complaint embedded with Titan, written with its vector in a single statement, and recalled through a vector index scoped to one patient. <break time="350ms"/> Every recall is audited. Even the failures. <break time="400ms"/> And when my memory is unreachable, I say so. <break time="300ms"/> Absence of evidence is not evidence of absence.</speak>`,
  },
  {
    id: "s4-outro",
    ssml: `<speak>Nirog. <break time="400ms"/> Care that remembers.</speak>`,
  },
];

const outDir = path.resolve("c:/Projects/nirog-team/promo/public/audio");
await fs.mkdir(outDir, { recursive: true });

const polly = new PollyClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

// Remotion bundles a full ffprobe in its compositor package.
const ffprobe =
  "c:/Projects/nirog-team/promo/node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe";

function durationOf(file) {
  const out = execFileSync(ffprobe, [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    file,
  ]).toString().trim();
  return Number(out);
}

const manifest = [];
for (const scene of SCENES) {
  const res = await polly.send(
    new SynthesizeSpeechCommand({
      Text: scene.ssml,
      TextType: "ssml",
      OutputFormat: "mp3",
      VoiceId: "Kajal",
      Engine: "neural",
      LanguageCode: "en-IN",
    }),
  );
  const bytes = await res.AudioStream.transformToByteArray();
  const file = path.join(outDir, `${scene.id}.mp3`);
  await fs.writeFile(file, Buffer.from(bytes));
  const duration = durationOf(file);
  manifest.push({ id: scene.id, file: `audio/${scene.id}.mp3`, duration });
  console.log(`${scene.id}  ${duration.toFixed(2)}s  ${bytes.length} bytes`);
}

await fs.writeFile(
  path.join(outDir, "..", "audio-manifest.json"),
  JSON.stringify(manifest, null, 2),
);
const total = manifest.reduce((a, m) => a + m.duration, 0);
console.log(`total narration: ${total.toFixed(2)}s`);
