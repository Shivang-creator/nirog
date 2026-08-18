/**
 * The cluster, from the control plane rather than from the connection string.
 *
 * `npm run verify` asks the database what it knows about itself over SQL. This
 * asks CockroachDB Cloud what it knows about the database — plan, region,
 * version, and who has been touching it — through the agent-ready `ccloud`
 * CLI, which answers every command in JSON precisely so that something other
 * than a person can read it.
 *
 * Two things worth having in a project whose whole claim is memory:
 *
 * The version and the topology are facts about where the vector index actually
 * lives, and they belong in the submission as output rather than as a sentence
 * somebody typed from memory.
 *
 * The audit log is the control-plane half of the story `recall_event` tells
 * inside the database. One records every read of a patient's history; the
 * other records every administrative action taken against the cluster holding
 * it. A clinical system should be able to answer both questions.
 *
 * Prints nothing secret: no connection strings, no keys.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

async function ccloud(args: string[]): Promise<unknown> {
  try {
    const { stdout } = await run("ccloud", [...args, "-o", "json", "--quiet"], {
      maxBuffer: 8 * 1024 * 1024,
    });
    return JSON.parse(stdout);
  } catch (err) {
    const e = err as { code?: string; stderr?: string; message?: string };
    if (e.code === "ENOENT") {
      throw new Error(
        "ccloud is not installed — `brew install cockroachdb/tap/ccloud`, then `ccloud auth login`",
      );
    }
    const detail = (e.stderr ?? e.message ?? "").trim().split("\n")[0];
    if (/not logged in/i.test(detail)) {
      throw new Error("ccloud is not authenticated — run `ccloud auth login`");
    }
    throw new Error(detail || "ccloud failed");
  }
}

interface Cluster {
  id: string;
  name: string;
  cloud_provider: string;
  cockroach_version: string;
  plan: string;
  state: string;
  regions?: { name: string }[];
  config?: { serverless?: { routing_id?: string } };
}

try {
  const clusters = (await ccloud(["cluster", "list"])) as Cluster[];

  console.log("\nCockroachDB Cloud — control plane\n");
  for (const c of clusters) {
    const regions = (c.regions ?? []).map((r) => r.name).join(", ") || "—";
    console.log(`  ${c.name}`);
    console.log(`    id           ${c.id}`);
    console.log(`    version      ${c.cockroach_version}`);
    console.log(`    plan         ${c.plan} on ${c.cloud_provider}`);
    console.log(`    regions      ${regions}`);
    console.log(`    state        ${c.state}`);
    if (c.config?.serverless?.routing_id) {
      console.log(`    routing id   ${c.config.serverless.routing_id}`);
    }
    console.log();
  }

  /*
   * Who has acted on the cluster lately. `recall_event` answers "who read this
   * patient's history"; this answers "who changed the thing it is stored in".
   */
  const audit = (await ccloud(["audit", "list", "--limit", "5"])) as
    | { entries?: { action?: string; created_at?: string; user_email?: string }[] }
    | { action?: string; created_at?: string; user_email?: string }[];

  const entries = Array.isArray(audit) ? audit : (audit.entries ?? []);
  console.log(`  Recent control-plane activity (${entries.length} shown)`);
  if (entries.length === 0) {
    console.log("    none recorded");
  }
  for (const e of entries) {
    const who = e.user_email ? e.user_email.replace(/(.).*(@.*)/, "$1***$2") : "—";
    console.log(`    ${e.created_at ?? "—"}  ${e.action ?? "—"}  ${who}`);
  }
  console.log();
} catch (err) {
  console.error(`\n  ${err instanceof Error ? err.message : err}\n`);
  process.exit(1);
}
