/**
 * End-to-end smoke test against the real cluster.
 *
 * The unit suite is offline by design, which leaves one thing untested: the
 * actual write path, where an embedding, a vector search, a region inheritance
 * and a recurrence rule have to agree with each other through SQL. Every piece
 * of that is covered individually and the seam between them is not.
 *
 * This walks a patient through three visits the way the intake form does, and
 * asserts what should be true after each one. It creates its own patient and
 * deletes it afterwards, so it is safe to run against a populated cluster.
 *
 * `npm run test:e2e`
 */

import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import { resolveRegion, inheritThresholdFor } from "../src/lib/clinical/resolve.ts";
import { detectAll, type ComplaintRecord } from "../src/lib/clinical/recurrence.ts";
import { buildSbar } from "../src/lib/clinical/sbar.ts";
import { recallThresholdFor } from "../src/lib/memory/recall.ts";
import { embedderFromEnv, resilientEmbedder } from "../src/lib/ai/embed.ts";

const here = dirname(fileURLToPath(import.meta.url));
config({ path: join(here, "..", ".env.local"), quiet: true });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

let failures = 0;
function check(label: string, condition: boolean, detail = "") {
  console.log(`  ${condition ? "ok  " : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!condition) failures++;
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const configured = embedderFromEnv();
let usedFallback = false;
const embedder = resilientEmbedder(configured, () => {
  usedFallback = true;
});
console.log(`\nembedder: ${configured.provider}\n`);

const NAME = "SMOKE TEST PATIENT (delete me)";
await client.query(`DELETE FROM patient WHERE name = $1`, [NAME]);

const { rows: [patient] } = await client.query(
  `INSERT INTO patient (name, year_of_birth, sex, family_history)
   VALUES ($1, 1992, 'Female', 'Father — lumbar disc surgery at 40') RETURNING id`,
  [NAME],
);

const DAY = 86_400_000;

/**
 * One visit, following exactly the order the intake action uses:
 * embed → recall → resolve region → write.
 */
async function visit(text: string, daysAgo: number) {
  const occurredAt = new Date(Date.now() - daysAgo * DAY);
  const { vector, provider } = await embedder.embed(text);
  const vec = `[${vector.join(",")}]`;

  const { rows } = await client.query(
    `SELECT id, visit_id, patient_id, raw_text, body_region, occurred_at,
            embedding <=> $2 AS distance
       FROM complaint
      WHERE patient_id = $1 AND occurred_at < $3
      ORDER BY embedding <=> $2
      LIMIT 5`,
    [patient.id, vec, occurredAt],
  );

  const matches = rows
    .map((r) => ({
      id: r.id,
      visitId: r.visit_id,
      patientId: r.patient_id,
      rawText: r.raw_text,
      bodyRegion: r.body_region,
      occurredAt: new Date(r.occurred_at),
      distance: r.distance === null ? Infinity : Number(r.distance),
    }))
    .filter((m) => Number.isFinite(m.distance) && m.distance <= recallThresholdFor(provider));

  const resolved = resolveRegion(text, matches, inheritThresholdFor(provider));

  const { rows: [v] } = await client.query(
    `INSERT INTO visit (patient_id, occurred_at) VALUES ($1,$2) RETURNING id`,
    [patient.id, occurredAt],
  );
  await client.query(
    `INSERT INTO complaint
       (patient_id, visit_id, raw_text, body_region, region_source,
        region_inherited_from, embedding, embed_model, embedded_at, occurred_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now(),$9)`,
    [
      patient.id, v.id, text, resolved.region, resolved.source,
      resolved.inheritedFrom ?? null, vec, provider, occurredAt,
    ],
  );

  return { resolved, matches };
}

async function history(): Promise<ComplaintRecord[]> {
  const { rows } = await client.query(
    `SELECT id, visit_id, patient_id, raw_text, body_region, occurred_at
       FROM complaint WHERE patient_id = $1 ORDER BY occurred_at ASC`,
    [patient.id],
  );
  return rows.map((r) => ({
    id: r.id,
    visitId: r.visit_id,
    patientId: r.patient_id,
    rawText: r.raw_text,
    bodyRegion: r.body_region,
    occurredAt: new Date(r.occurred_at),
  }));
}

try {
  /* ---- Visit 1 ---- */
  console.log("Visit 1 — 38 days ago");
  const v1 = await visit("my lower back has been aching for a few days", 38);
  check("region classified from the text", v1.resolved.source === "lexicon", v1.resolved.region);
  check("nothing recalled — this is the first complaint", v1.matches.length === 0);
  check("no recurrence yet", detectAll(await history(), new Date()).length === 0);

  /* ---- An unrelated complaint in between ---- */
  console.log("\nVisit 2 — 27 days ago, unrelated");
  const v2 = await visit("blocked nose and a cough, think I caught something", 27);
  check("classified away from the back", v2.resolved.region !== "lower_back", v2.resolved.region);
  check(
    "the lumbar complaint was not recalled as similar",
    !v2.matches.some((m) => m.rawText.includes("lower back")),
  );

  /* ---- Visit 3 — different words, same problem ---- */
  console.log("\nVisit 3 — 16 days ago, same problem in different words");
  const v3 = await visit("I keep getting this pain when I stand up from my desk", 16);
  check("recalled the first lumbar complaint", v3.matches.some((m) => m.rawText.includes("lower back")),
    v3.matches[0] ? `nearest ${v3.matches[0].distance.toFixed(3)}` : "none");
  check("classified as lower back", v3.resolved.region === "lower_back");
  // Two lumbar visits now exist, at 38 and 16 days ago — but the watch window is
  // 30 days, so only one of them is inside it. No flag is the correct answer,
  // and the fact that it looks surprising is the point of asserting it: the
  // windows are absolute, not relative to the gap between visits.
  const afterThree = detectAll(await history(), new Date());
  check("still no flag — only one lumbar visit falls inside the 30-day window",
    afterThree.length === 0, afterThree[0]?.level ?? "none");

  /* ---- Visit 4 — names no body part at all ---- */
  console.log("\nVisit 4 — yesterday, names no body part");
  const v4 = await visit("the ache is back again, it's been three weeks now", 1);
  check("region had to be inherited from memory", v4.resolved.source === "inherited",
    v4.resolved.inheritedFromText ? `from "${v4.resolved.inheritedFromText.slice(0, 40)}…"` : "");
  check("inherited the right region", v4.resolved.region === "lower_back", v4.resolved.region);

  /* ---- The flag ---- */
  console.log("\nAfter four visits");
  const flags = detectAll(await history(), new Date());
  const lumbar = flags.find((f) => f.region === "lower_back");
  check("recurrence flagged", lumbar?.level === "recurrent", lumbar?.level ?? "none");
  check("counted three lumbar visits", lumbar?.visitCount === 3, String(lumbar?.visitCount));
  check("the unrelated complaint did not flag", flags.length === 1, `${flags.length} flags`);

  /* ---- The handover ---- */
  console.log("\nSBAR");
  const sbar = buildSbar({
    patient: { id: patient.id, name: NAME, yearOfBirth: 1992, sex: "Female",
      familyHistory: "Father — lumbar disc surgery at 40" },
    complaints: await history(), flags, now: new Date(), degraded: false,
  });
  check("quotes the patient verbatim", sbar.background.join(" ").includes("the ache is back again"));
  check("includes family history", sbar.background.join(" ").includes("disc surgery"));
  check("refuses to diagnose", sbar.assessment.join(" ").includes("not a diagnosis"));

  /* ---- Degraded handover ---- */
  const down = buildSbar({
    patient: { id: patient.id, name: NAME, yearOfBirth: 1992, sex: "Female" },
    complaints: [], flags: [], now: new Date(), degraded: true,
  });
  check("degraded handover refuses to assess", down.assessment.join(" ").includes("NOT ASSESSED"));
  check("degraded handover never reports a clean record",
    !down.assessment.join(" ").includes("No recurring pattern found"));
} finally {
  await client.query(`DELETE FROM patient WHERE id = $1`, [patient.id]);
  await client.end();
}

if (usedFallback) {
  console.log(
    `\nnote: ${configured.provider} was unavailable, so this ran on the offline embedder.`,
  );
}
console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} CHECK(S) FAILED\n`);
process.exit(failures === 0 ? 0 : 1);
