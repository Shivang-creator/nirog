import { describe, it, expect } from "vitest";
import { clientKey, createLimiter, readJsonCapped } from "@/lib/http/rate-limit";

/**
 * The routes that call Bedrock, Polly and Transcribe take no session, so the
 * only thing between a curl loop and the AWS bill is this counter.
 */
describe("createLimiter", () => {
  it("allows up to the limit inside one window, then refuses", () => {
    const l = createLimiter({ limit: 3, windowMs: 60_000 });
    expect(l.check("a", 0).ok).toBe(true);
    expect(l.check("a", 1).ok).toBe(true);
    expect(l.check("a", 2).ok).toBe(true);
    const refused = l.check("a", 3);
    expect(refused.ok).toBe(false);
    expect(refused.retryAfterSec).toBe(60);
  });

  it("lets the client back in once the window has slid past", () => {
    const l = createLimiter({ limit: 2, windowMs: 1000 });
    l.check("a", 0);
    l.check("a", 500);
    expect(l.check("a", 900).ok).toBe(false);
    // The request at t=0 has left the window; the one at t=500 has not.
    expect(l.check("a", 1001).ok).toBe(true);
    expect(l.check("a", 1002).ok).toBe(false);
  });

  it("a refused request does not extend the wait", () => {
    const l = createLimiter({ limit: 1, windowMs: 1000 });
    l.check("a", 0);
    for (let t = 100; t < 1000; t += 100) expect(l.check("a", t).ok).toBe(false);
    expect(l.check("a", 1001).ok).toBe(true);
  });

  it("counts each client separately", () => {
    const l = createLimiter({ limit: 1, windowMs: 1000 });
    expect(l.check("a", 0).ok).toBe(true);
    expect(l.check("b", 0).ok).toBe(true);
    expect(l.check("a", 1).ok).toBe(false);
  });

  it("cannot be made to track an unbounded number of clients", () => {
    const l = createLimiter({ limit: 1, windowMs: 60_000, maxKeys: 3 });
    for (let i = 0; i < 100; i++) l.check(`ip-${i}`, i);
    // The earliest client was evicted, so it is counted afresh — the cost of a
    // bounded map — while a recent one is still limited.
    expect(l.check("ip-0", 200).ok).toBe(true);
    expect(l.check("ip-99", 201).ok).toBe(false);
  });
});

describe("clientKey", () => {
  const h = (o: Record<string, string>) => ({ get: (k: string) => o[k] ?? null });

  it("prefers the platform's x-real-ip", () => {
    expect(clientKey(h({ "x-real-ip": "1.2.3.4", "x-forwarded-for": "9.9.9.9" }))).toBe("1.2.3.4");
  });

  it("falls back to the first forwarded hop", () => {
    expect(clientKey(h({ "x-forwarded-for": "5.6.7.8, 10.0.0.1" }))).toBe("5.6.7.8");
  });

  it("groups clients it cannot identify rather than exempting them", () => {
    expect(clientKey(h({}))).toBe("unknown");
  });
});

describe("readJsonCapped", () => {
  const req = (body: string, headers: Record<string, string> = {}) => ({
    text: async () => body,
    headers: { get: (k: string) => headers[k] ?? null },
  });

  it("parses a body under the cap", async () => {
    expect(await readJsonCapped(req('{"a":1}'), 100)).toEqual({ ok: true, value: { a: 1 } });
  });

  it("refuses on the declared length without reading the body", async () => {
    let read = false;
    const r = {
      text: async () => {
        read = true;
        return "{}";
      },
      headers: { get: (k: string) => (k === "content-length" ? "5000" : null) },
    };
    expect(await readJsonCapped(r, 100)).toEqual({ ok: false, reason: "too-large" });
    expect(read).toBe(false);
  });

  it("refuses an oversized body that lied about, or omitted, its length", async () => {
    const big = JSON.stringify({ text: "x".repeat(500) });
    expect(await readJsonCapped(req(big), 100)).toEqual({ ok: false, reason: "too-large" });
    expect(await readJsonCapped(req(big, { "content-length": "10" }), 100)).toEqual({
      ok: false,
      reason: "too-large",
    });
  });

  it("reports malformed JSON as such", async () => {
    expect(await readJsonCapped(req("{nope"), 100)).toEqual({ ok: false, reason: "bad-json" });
  });
});
