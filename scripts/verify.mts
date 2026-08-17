/**
 * Pre-flight check.
 *
 * Answers one question — "will this actually work right now?" — and says
 * precisely what is wrong when the answer is no. Written because diagnosing a
 * Bedrock failure by reading a stack trace at 9am is a bad use of the last
 * hours before a deadline.
 *
 * Prints no credentials.
 */

import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import { EMBED_DIMS } from "../src/lib/ai/embed.ts";

const here = dirname(fileURLToPath(import.meta.url));
config({ path: join(here, "..", ".env.local"), quiet: true });

let fatal = false;
const ok = (s: string) => console.log(`  ok    ${s}`);
const bad = (s: string) => {
  console.log(`  FAIL  ${s}`);
  fatal = true;
};
const warn = (s: string) => console.log(`  warn  ${s}`);

/* ------------------------------------------------------------------ */
console.log("\nCockroachDB");

if (!process.env.DATABASE_URL) {
  bad("DATABASE_URL is not set — copy .env.example to .env.local");
} else {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 8000,
  });
  try {
    const t0 = Date.now();
    await client.connect();
    const latency = Date.now() - t0;
    const [{ version }] = (await client.query("SELECT version()")).rows;
    ok(`connected in ${latency}ms — ${version.split(" (")[0]}`);

    const tables = (
      await client.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`,
      )
    ).rows.map((r) => r.table_name);

    for (const t of ["patient", "visit", "complaint", "recall_event"]) {
      if (tables.includes(t)) ok(`table ${t}`);
      else bad(`table ${t} missing — run \`npm run db:migrate\``);
    }

    const create: string = (await client.query(`SHOW CREATE TABLE complaint`))
      .rows[0].create_statement;
    if (create.includes("VECTOR INDEX")) ok("vector index present");
    else bad("vector index missing — run `npm run db:migrate`");

    const counts = (
      await client.query(
        `SELECT (SELECT count(*)::INT FROM patient) AS patients,
                (SELECT count(*)::INT FROM complaint) AS complaints,
                (SELECT count(*)::INT FROM complaint WHERE embedding IS NULL) AS unembedded`,
      )
    ).rows[0];
    ok(`${counts.patients} patients, ${counts.complaints} complaints`);
    if (counts.complaints === 0) {
      warn("no data — run `npm run db:seed`");
    }
    if (counts.unembedded > 0) {
      warn(
        `${counts.unembedded} complaints have no embedding and are invisible to recall`,
      );
    }
    if (counts.complaints > 0 && counts.complaints < 200) {
      warn(
        "few rows — the optimizer will prefer a scan over the vector index.\n" +
          "        run `npm run db:volume` for a realistic query plan",
      );
    }

    const providers = (
      await client.query(
        `SELECT embed_model, count(*)::INT AS n FROM complaint
          WHERE embed_model IS NOT NULL GROUP BY embed_model ORDER BY n DESC`,
      )
    ).rows;
    for (const p of providers) ok(`${p.n} vectors from ${p.embed_model}`);

    await client.end();
  } catch (err) {
    bad(`connection failed: ${err instanceof Error ? err.message : err}`);
  }
}

/* ------------------------------------------------------------------ */
console.log("\nAmazon Bedrock");

const region = process.env.AWS_REGION?.trim();
const keyId = process.env.AWS_ACCESS_KEY_ID?.trim();
const secret = process.env.AWS_SECRET_ACCESS_KEY?.trim();
const embedModel = process.env.BEDROCK_EMBED_MODEL?.trim() ?? "amazon.titan-embed-text-v2:0";

if (!region || !keyId || !secret) {
  warn("no AWS credentials — the app will use the offline embedder");
  warn("the hackathon REQUIRES at least one AWS service, so this must be fixed");
  console.log("        see HANDOVER.md §1");
} else {
  ok(`credentials present (region ${region})`);
  try {
    const { BedrockRuntimeClient, InvokeModelCommand } = await import(
      "@aws-sdk/client-bedrock-runtime"
    );
    const client = new BedrockRuntimeClient({
      region,
      credentials: { accessKeyId: keyId, secretAccessKey: secret },
    });

    const t0 = Date.now();
    const res = await client.send(
      new InvokeModelCommand({
        modelId: embedModel,
        contentType: "application/json",
        body: JSON.stringify({
          inputText: "lower back pain",
          dimensions: EMBED_DIMS,
          normalize: true,
        }),
      }),
    );
    const body = JSON.parse(new TextDecoder().decode(res.body));
    ok(`${embedModel} → ${body.embedding.length} dims in ${Date.now() - t0}ms`);
  } catch (err) {
    const e = err as { name?: string; message?: string };
    bad(`${embedModel}: ${e.name} — ${e.message}`);
    if (e.message?.includes("Operation not allowed")) {
      console.log(
        "\n        This is the AWS Free Plan blocking Bedrock, not a key problem.\n" +
          "        Fix: Billing → Upgrade plan (credits carry over), or use a\n" +
          "        teammate's key from an account already on a paid plan.\n" +
          "        See HANDOVER.md §1.",
      );
    }
  }
}

console.log(
  fatal
    ? "\nNOT READY — fix the failures above.\n"
    : "\nReady.\n",
);
process.exit(fatal ? 1 : 0);
