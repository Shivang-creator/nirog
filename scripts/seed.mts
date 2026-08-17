/**
 * Demo data.
 *
 * Three patients, chosen so the app has something to be *wrong* about.
 *
 * Anita is the demonstration: three lumbar presentations across six weeks,
 * worded completely differently each time. Rahul and Priya exist because a tool
 * that only ever finds patterns is not detecting anything — Rahul must come back
 * clean, and Priya must come back as "watch" rather than being rounded up to a
 * recurrence. If a change to the rule makes all three light up, the seed will
 * show it immediately.
 *
 * The complaint wordings are the demo script. They are meant to read like a
 * person talking, because that is the whole difficulty: nobody describes the
 * same ache the same way twice.
 */

import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import { resolveRegion, explainResolution } from "../src/lib/clinical/resolve.ts";
import { RECALL_THRESHOLD } from "../src/lib/memory/recall.ts";
import {
  embedderFromEnv,
  resilientEmbedder,
  EMBED_DIMS,
} from "../src/lib/ai/embed.ts";

const here = dirname(fileURLToPath(import.meta.url));
config({ path: join(here, "..", ".env.local"), quiet: true });

const DAY = 86_400_000;
const now = Date.now();
const daysAgo = (n: number) => new Date(now - n * DAY);

interface SeedVisit {
  daysAgo: number;
  complaints: string[];
}

interface SeedPatient {
  name: string;
  yearOfBirth: number;
  sex: string;
  familyHistory?: string;
  note: string;
  visits: SeedVisit[];
}

const PATIENTS: SeedPatient[] = [
  {
    name: "Anita R.",
    yearOfBirth: 1992,
    sex: "Female",
    familyHistory: "Father — lumbar disc surgery at 40",
    note: "the demonstration: three lumbar visits, no shared keywords",
    visits: [
      {
        daysAgo: 38,
        complaints: ["my lower back has been aching for a few days, worse in the mornings"],
      },
      {
        // A decoy in the middle. An unrelated complaint between the lumbar ones
        // proves the grouping is by meaning and not merely by recency.
        daysAgo: 27,
        complaints: ["blocked nose and a bit of a cough, think I caught something"],
      },
      {
        daysAgo: 16,
        complaints: ["I keep getting this pain when I stand up from my desk"],
      },
      {
        daysAgo: 1,
        complaints: ["the ache is back again, it's been three weeks now"],
      },
    ],
  },
  {
    name: "Rahul M.",
    yearOfBirth: 1985,
    sex: "Male",
    note: "negative control: one complaint, must not flag",
    visits: [
      { daysAgo: 2, complaints: ["sharp headache behind my eyes since yesterday"] },
    ],
  },
  {
    name: "Priya S.",
    yearOfBirth: 1997,
    sex: "Female",
    note: "boundary case: two visits, must read as watch and not recurrence",
    visits: [
      { daysAgo: 19, complaints: ["headache that won't shift, third day now"] },
      { daysAgo: 3, complaints: ["my head is pounding again, same as last time"] },
    ],
  },
];

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set — add it to .env.local");
  process.exit(1);
}

const configured = embedderFromEnv();
const embedder = resilientEmbedder(configured, (err) => {
  console.warn(
    `\n  !! ${configured.provider} is unavailable: ${err.message}` +
      `\n     Falling back to the offline embedder for the rest of this seed.` +
      `\n     Rows written from here on record provider 'offline:lexical-v1',` +
      `\n     so the database says which vectors are real.\n`,
  );
});

console.log(`embedding provider: ${configured.provider}`);
if (configured.provider.startsWith("offline:")) {
  console.log(
    "  (no AWS key present — seeding with the offline embedder.\n" +
      "   Add AWS credentials to .env.local and re-run to seed with Titan.)",
  );
}

const client = new pg.Client({ connectionString });
await client.connect();

// Idempotent: wipe the demo patients and rebuild. Cascades clear visits,
// complaints and recall events.
const names = PATIENTS.map((p) => p.name);
const { rowCount: removed } = await client.query(
  `DELETE FROM patient WHERE name = ANY($1)`,
  [names],
);
if (removed) console.log(`cleared ${removed} existing demo patient(s)\n`);

let complaintCount = 0;

for (const p of PATIENTS) {
  const { rows: [patient] } = await client.query(
    `INSERT INTO patient (name, year_of_birth, sex, family_history)
     VALUES ($1,$2,$3,$4) RETURNING id`,
    [p.name, p.yearOfBirth, p.sex, p.familyHistory ?? null],
  );

  console.log(`${p.name} — ${p.note}`);

  for (const v of p.visits) {
    const occurredAt = daysAgo(v.daysAgo);
    const { rows: [visit] } = await client.query(
      `INSERT INTO visit (patient_id, occurred_at, channel)
       VALUES ($1,$2,'app') RETURNING id`,
      [patient.id, occurredAt],
    );

    for (const text of v.complaints) {
      const { vector, provider } = await embedder.embed(text);

      if (vector.length !== EMBED_DIMS) {
        throw new Error(`embedder returned ${vector.length} dims, expected ${EMBED_DIMS}`);
      }

      // Seeding runs chronologically, so by the time a follow-up complaint is
      // written its predecessors are already in memory and can be inherited
      // from — the same path the live intake takes.
      const { rows: prior } = await client.query(
        `SELECT id, visit_id, patient_id, raw_text, body_region, occurred_at,
                embedding <=> $2 AS distance
           FROM complaint
          WHERE patient_id = $1 AND embedding IS NOT NULL AND occurred_at < $3
          ORDER BY embedding <=> $2
          LIMIT 5`,
        [patient.id, `[${vector.join(",")}]`, occurredAt],
      );

      const matches = prior
        .map((r) => ({
          id: r.id,
          visitId: r.visit_id,
          patientId: r.patient_id,
          rawText: r.raw_text,
          bodyRegion: r.body_region,
          occurredAt: new Date(r.occurred_at),
          distance: Number(r.distance),
        }))
        .filter((m) => m.distance <= RECALL_THRESHOLD);

      const resolved = resolveRegion(text, matches);

      await client.query(
        `INSERT INTO complaint
           (patient_id, visit_id, raw_text, body_region, region_source,
            region_inherited_from, embedding, embed_model, embedded_at, occurred_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now(),$9)`,
        [
          patient.id,
          visit.id,
          text,
          resolved.region,
          resolved.source,
          resolved.inheritedFrom ?? null,
          `[${vector.join(",")}]`,
          provider,
          occurredAt,
        ],
      );

      complaintCount++;
      const when = String(v.daysAgo).padStart(2, " ");
      const tag = resolved.source === "inherited" ? "↰" : " ";
      console.log(
        `  ${when}d ago ${tag} [${resolved.region}]  "${text}"` +
          `\n            ${explainResolution(resolved)}`,
      );
    }
  }
  console.log("");
}

console.log(`seeded ${PATIENTS.length} patients, ${complaintCount} complaints`);
await client.end();
