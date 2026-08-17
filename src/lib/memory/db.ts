/**
 * The connection to agent memory.
 *
 * Timeouts are short and deliberate. An agent waiting thirty seconds on a
 * database is an agent that has already failed the person in front of it — a
 * doctor with a patient in the room will have moved on. Better to fail in two
 * seconds and say so than to succeed in thirty and be ignored.
 */

import { Pool, type PoolClient, type QueryResultRow } from "pg";

/** Long enough for a cross-region round trip, short enough to stay in a consultation. */
export const MEMORY_TIMEOUT_MS = 2500;

let pool: Pool | null = null;

export function getPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and add your CockroachDB connection string.",
    );
  }

  pool = new Pool({
    connectionString,
    max: 8,
    connectionTimeoutMillis: MEMORY_TIMEOUT_MS,
    idleTimeoutMillis: 30_000,
    // CockroachDB Cloud terminates TLS with a public CA, so the default
    // verification is correct and we do not disable it. `sslmode=verify-full`
    // in the connection string does the work.
  });

  // A pool that emits an unhandled 'error' takes the process down. Agent memory
  // going away must never crash the agent — that is the failure mode this whole
  // project is arguing against.
  pool.on("error", (err) => {
    console.error("[memory] idle client error:", err.message);
  });

  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await getPool().query<T>(sql, params);
  return res.rows;
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const out = await fn(client);
    await client.query("COMMIT");
    return out;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {
      /* the connection is already gone; the rollback is implicit */
    });
    throw err;
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/** Format a JS number[] as the literal CockroachDB's VECTOR type parses. */
export function toVectorLiteral(v: number[]): string {
  return `[${v.join(",")}]`;
}
