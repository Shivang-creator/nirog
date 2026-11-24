import { NextResponse, type NextRequest } from "next/server";
import { clientKey, createLimiter, type Limiter } from "./rate-limit";

/**
 * Per-route budgets, per client address, per minute.
 *
 * Set well above what one consultation uses — a turn is one chat call, one
 * complaint write, one transcription and a few spoken lines, and a clinic or a
 * demo room can sit behind a single address — and far below what a script
 * would send. See rate-limit.ts for what this does and does not protect.
 */
const WINDOW_MS = 60_000;

const LIMITERS = {
  chat: createLimiter({ limit: 40, windowMs: WINDOW_MS }),
  handover: createLimiter({ limit: 10, windowMs: WINDOW_MS }),
  speak: createLimiter({ limit: 120, windowMs: WINDOW_MS }),
  transcribe: createLimiter({ limit: 60, windowMs: WINDOW_MS }),
  complaint: createLimiter({ limit: 60, windowMs: WINDOW_MS }),
} satisfies Record<string, Limiter>;

export type PaidRoute = keyof typeof LIMITERS;

/**
 * Null when the request may proceed; otherwise the 429 to return.
 *
 * Every caller already treats a non-OK answer as "fall back": the scene drops
 * to the browser's voice, the interview carries on without the model, and the
 * memory write is fire-and-forget. So a limited client degrades, it does not
 * break.
 */
export function limited(req: NextRequest, route: PaidRoute): NextResponse | null {
  const r = LIMITERS[route].check(clientKey(req.headers));
  if (r.ok) return null;
  return NextResponse.json(
    { error: "Too many requests. Please wait a moment and try again." },
    { status: 429, headers: { "retry-after": String(r.retryAfterSec) } },
  );
}
