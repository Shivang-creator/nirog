/**
 * A brake on the routes that spend money.
 *
 * /api/aria/chat, /api/aria/handover, /api/speak, /api/transcribe and
 * /api/memory/complaint each call a paid AWS API (Bedrock, Polly, Transcribe)
 * on behalf of whoever sends the request, and none of them needs a session —
 * the patient side has no accounts. Left as they were, a loop of curl against
 * the public URL is billed to this project's AWS account for as long as it runs.
 *
 * This is a sliding-window counter per client address, held in memory.
 *
 * It is deliberately honest about what it is NOT. Memory is per server
 * instance: on a serverless host each warm instance counts separately and a
 * cold start forgets everything, so this slows a single abusive client down
 * rather than capping total spend. The durable controls are a platform rate
 * limit (Vercel WAF) or a counter in CockroachDB, plus an AWS budget alarm.
 * This is the floor underneath those, not a replacement for them.
 *
 * Pure and clock-injectable so the behaviour is tested offline.
 */

export interface LimitResult {
  ok: boolean;
  /** Whole seconds until the oldest counted request leaves the window. */
  retryAfterSec: number;
}

export interface Limiter {
  check(key: string, now?: number): LimitResult;
}

export function createLimiter(opts: {
  limit: number;
  windowMs: number;
  /** Hard cap on tracked clients, so the map itself cannot be used to exhaust memory. */
  maxKeys?: number;
}): Limiter {
  const { limit, windowMs } = opts;
  const maxKeys = opts.maxKeys ?? 5000;
  const hits = new Map<string, number[]>();

  return {
    check(key: string, now: number = Date.now()): LimitResult {
      const cutoff = now - windowMs;
      const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);

      if (recent.length >= limit) {
        hits.set(key, recent);
        return {
          ok: false,
          retryAfterSec: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)),
        };
      }

      recent.push(now);
      // Re-insert so Map iteration order is least-recently-seen first.
      hits.delete(key);
      hits.set(key, recent);

      if (hits.size > maxKeys) {
        const oldest = hits.keys().next().value;
        if (oldest !== undefined) hits.delete(oldest);
      }
      return { ok: true, retryAfterSec: 0 };
    },
  };
}

/**
 * Who is asking, as well as a proxy header can say.
 *
 * On Vercel `x-real-ip` and the first hop of `x-forwarded-for` are set by the
 * platform. Off it they can be forged, which is one more reason this is a
 * brake and not a lock.
 */
export function clientKey(headers: { get(name: string): string | null }): string {
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "unknown";
}

/**
 * Read a JSON body, refusing one larger than `maxBytes`.
 *
 * The model routes turn the request body into a prompt, so the size of the
 * body is the size of the bill. Returns null for a body that is too large or
 * is not JSON; the caller answers 400/413.
 */
export async function readJsonCapped(
  req: { text(): Promise<string>; headers: { get(name: string): string | null } },
  maxBytes: number,
): Promise<{ ok: true; value: unknown } | { ok: false; reason: "too-large" | "bad-json" }> {
  const declared = Number(req.headers.get("content-length") ?? "");
  if (Number.isFinite(declared) && declared > maxBytes) {
    return { ok: false, reason: "too-large" };
  }
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return { ok: false, reason: "bad-json" };
  }
  // Length in UTF-16 units never exceeds length in UTF-8 bytes, so this is a
  // lower bound on the byte size: anything it rejects is genuinely too large.
  if (raw.length > maxBytes) return { ok: false, reason: "too-large" };
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false, reason: "bad-json" };
  }
}
