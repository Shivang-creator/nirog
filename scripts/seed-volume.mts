/**
 * Volume seed.
 *
 * The three demo patients are enough to show what the product does and not
 * nearly enough to show that it works. At seven rows CockroachDB's optimizer
 * correctly ignores the vector index — a full scan of seven rows is cheaper
 * than probing a tree, and any claim about "distributed vector search" measured
 * on that table would be a claim about a table scan.
 *
 * So this loads a realistic clinic: a few hundred patients with years of
 * complaint history between them, so latency is measured against something that
 * resembles use.
 *
 * Worth knowing before you read too much into the result: this does *not* make
 * the planner switch to the vector index, and it was written expecting it would.
 * Recall is scoped to one patient, and `complaint_patient_time_idx` reaches one
 * patient's handful of rows so cheaply that a C-SPANN descent never wins. The
 * index earns its place on a single patient with a very long history, or on a
 * cross-patient search this product deliberately does not perform.
 * `npm run db:explain` shows both plans rather than pretending otherwise.
 *
 * Deterministic: a fixed-seed PRNG, so the same command always produces the
 * same clinic and a number quoted in the README can be reproduced.
 */

import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import { classify, type Region } from "../src/lib/clinical/regions.ts";
import { offlineEmbed } from "../src/lib/ai/embed.ts";

const here = dirname(fileURLToPath(import.meta.url));
config({ path: join(here, "..", ".env.local"), quiet: true });

const PATIENTS = Number(process.env.VOLUME_PATIENTS ?? 400);
const DAY = 86_400_000;

/* ---- deterministic PRNG (mulberry32) ---- */
let state = 0x9e3779b9;
function rnd(): number {
  state |= 0;
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const pick = <T,>(a: readonly T[]): T => a[Math.floor(rnd() * a.length)];
const between = (lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));

/* ---- complaint phrasings, several per region ---- */
const BANK: Record<string, readonly string[]> = {
  lower_back: [
    "my lower back has been sore since the weekend",
    "aching in the small of my back, worse when I bend",
    "I get this pain when I stand up from a chair",
    "lumbar pain again, it comes and goes",
    "kamar mein dard, especially in the morning",
    "back is stiff when I get out of bed",
  ],
  head: [
    "headache behind my eyes for three days",
    "migraine came back yesterday afternoon",
    "my head is pounding and light hurts",
    "dull headache that will not shift",
    "sar dard since I woke up",
  ],
  chest: [
    "cough that has lasted two weeks",
    "chest feels tight when I walk uphill",
    "short of breath climbing the stairs",
    "wheezing at night, worse lying down",
  ],
  abdomen: [
    "stomach cramps after eating",
    "bloated and nauseous most mornings",
    "indigestion and heartburn every evening",
    "pet dard, on and off for a week",
  ],
  leg: [
    "my knee gives way going down stairs",
    "ankle swollen since Saturday",
    "calf aches after standing all day",
  ],
  neck: ["stiff neck when I turn my head", "crick in my neck since I slept badly"],
  skin: ["itchy rash on my arm", "spots that will not clear up"],
  systemic: [
    "exhausted all the time lately",
    "fever and chills for two days",
    "no appetite, losing weight",
  ],
  arm: ["wrist hurts when I type", "shoulder aches lifting anything"],
};

const REGION_KEYS = Object.keys(BANK);

const FIRST = [
  "Aarav", "Diya", "Kabir", "Meera", "Rohan", "Ananya", "Vikram", "Sneha",
  "Arjun", "Priya", "Nikhil", "Isha", "Rahul", "Neha", "Aditya", "Kavya",
  "Sameer", "Tara", "Dev", "Riya", "Manav", "Anjali", "Karan", "Pooja",
];
const LAST = [
  "S.", "M.", "K.", "R.", "P.", "V.", "N.", "B.", "G.", "T.", "D.", "J.",
];

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set — add it to .env.local");
  process.exit(1);
}

const client = new pg.Client({ connectionString });
await client.connect();

// Volume patients are tagged in the name so they can be cleared without
// touching the three hand-written demo patients.
const removed = await client.query(`DELETE FROM patient WHERE name LIKE '%(vol)'`);
if (removed.rowCount) console.log(`cleared ${removed.rowCount} previous volume patients`);

console.log(`generating ${PATIENTS} patients...`);

const started = Date.now();
let visits = 0;
let complaints = 0;

for (let p = 0; p < PATIENTS; p++) {
  const name = `${pick(FIRST)} ${pick(LAST)} (vol)`;
  const { rows: [patient] } = await client.query(
    `INSERT INTO patient (name, year_of_birth, sex) VALUES ($1,$2,$3) RETURNING id`,
    [name, between(1945, 2010), pick(["Female", "Male"])],
  );

  // Most patients have a scattering of unrelated complaints. A minority have a
  // genuine recurring theme, which is what makes the flagged cases meaningful —
  // if everybody recurred, the flag would carry no information.
  const hasTheme = rnd() < 0.25;
  const theme = pick(REGION_KEYS);
  const visitCount = between(2, 9);

  const rows: string[] = [];
  const params: unknown[] = [];
  let n = 0;

  for (let v = 0; v < visitCount; v++) {
    const daysAgo = between(1, 700);
    const occurredAt = new Date(Date.now() - daysAgo * DAY);
    const { rows: [visit] } = await client.query(
      `INSERT INTO visit (patient_id, occurred_at) VALUES ($1,$2) RETURNING id`,
      [patient.id, occurredAt],
    );
    visits++;

    const region = hasTheme && rnd() < 0.7 ? theme : pick(REGION_KEYS);
    const text = pick(BANK[region]);
    const resolved = classify(text);
    const vec = offlineEmbed(text);

    rows.push(
      `($${n + 1},$${n + 2},$${n + 3},$${n + 4},'lexicon',$${n + 5},'offline:lexical-v1',now(),$${n + 6})`,
    );
    params.push(
      patient.id,
      visit.id,
      text,
      resolved.region,
      `[${vec.join(",")}]`,
      occurredAt,
    );
    n += 6;
    complaints++;
  }

  await client.query(
    `INSERT INTO complaint
       (patient_id, visit_id, raw_text, body_region, region_source,
        embedding, embed_model, embedded_at, occurred_at)
     VALUES ${rows.join(",")}`,
    params,
  );

  if ((p + 1) % 50 === 0) {
    process.stdout.write(`  ${p + 1}/${PATIENTS} patients\r`);
  }
}

const elapsed = ((Date.now() - started) / 1000).toFixed(1);
console.log(`\ninserted ${PATIENTS} patients, ${visits} visits, ${complaints} complaints in ${elapsed}s`);

const [{ total }] = (
  await client.query(`SELECT count(*)::INT AS total FROM complaint`)
).rows;
console.log(`complaint table now holds ${total} rows`);

// Fresh statistics, so the optimizer's cost model reflects the new size rather
// than the seven-row table it last measured.
console.log("refreshing table statistics...");
await client.query(`ANALYZE complaint`);

await client.end();
console.log("\nrun `npm run db:explain` to see both query plans");
