/**
 * Apply the schema. Idempotent — every statement is IF NOT EXISTS, so running
 * this against a populated cluster is safe and is the normal way to pick up a
 * new index.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { config } from "dotenv";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));
config({ path: join(here, "..", ".env.local"), quiet: true });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set — add it to .env.local");
  process.exit(1);
}

const sql = readFileSync(join(here, "..", "src", "lib", "memory", "schema.sql"), "utf8");

// Split on semicolons at end-of-line, so the comment blocks survive intact.
const statements = sql
  .split(/;\s*$/m)
  .map((s) => s.trim())
  .filter((s) => s && !s.split("\n").every((l) => l.trim().startsWith("--")));

const client = new pg.Client({ connectionString });
await client.connect();

let applied = 0;
for (const stmt of statements) {
  const label = stmt
    .split("\n")
    .find((l) => /^\s*CREATE/i.test(l))
    ?.trim()
    .slice(0, 72) ?? stmt.slice(0, 72);
  try {
    await client.query(stmt);
    console.log("  ok   " + label);
    applied++;
  } catch (err) {
    console.error("  FAIL " + label);
    console.error("       " + err.message.split("\n")[0]);
    await client.end();
    process.exit(1);
  }
}

const { rows } = await client.query(`
  SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public' ORDER BY table_name
`);

console.log(`\n${applied} statements applied.`);
console.log("tables: " + rows.map((r) => r.table_name).join(", "));

await client.end();
