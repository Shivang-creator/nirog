import { describe, it, expect, vi, afterEach } from "vitest";
import {
  withMemory,
  MemoryTimeout,
  DEGRADED_NOTICE,
} from "@/lib/memory/degrade";

afterEach(() => vi.restoreAllMocks());

/** Silence the intentional console.error inside withMemory during failure tests. */
function quiet() {
  return vi.spyOn(console, "error").mockImplementation(() => {});
}

describe("withMemory", () => {
  it("passes the value through when memory answers", async () => {
    const r = await withMemory(async () => [1, 2, 3], [], 1000);
    expect(r.ok).toBe(true);
    expect(r.degraded).toBe(false);
    expect(r.value).toEqual([1, 2, 3]);
    expect(r.reason).toBeUndefined();
  });

  it("reports latency on success", async () => {
    const r = await withMemory(async () => "x", "", 1000);
    expect(r.latencyMs).toBeGreaterThanOrEqual(0);
    expect(r.latencyMs).toBeLessThan(1000);
  });

  it("marks a thrown error as degraded rather than propagating it", async () => {
    quiet();
    const r = await withMemory(
      async () => {
        throw new Error("connection refused");
      },
      [] as number[],
      1000,
    );
    expect(r.ok).toBe(false);
    expect(r.degraded).toBe(true);
    expect(r.reason).toBe("connection refused");
  });

  it("never throws, whatever the inner function does", async () => {
    quiet();
    await expect(
      withMemory(
        async () => {
          throw new Error("boom");
        },
        null,
        50,
      ),
    ).resolves.toBeTruthy();
  });

  it("handles a non-Error rejection", async () => {
    quiet();
    const r = await withMemory(async () => Promise.reject("just a string"), 0, 100);
    expect(r.degraded).toBe(true);
    expect(r.reason).toBe("just a string");
  });

  it("times out a hung read", async () => {
    quiet();
    const r = await withMemory(
      () => new Promise<string>(() => {}), // never settles
      "fallback",
      60,
    );
    expect(r.degraded).toBe(true);
    expect(r.value).toBe("fallback");
    expect(r.reason).toMatch(/did not respond within 60ms/);
  });

  it("returns the fallback, and the fallback is the caller's neutral value", async () => {
    quiet();
    const r = await withMemory(
      async () => {
        throw new Error("down");
      },
      [] as string[],
      50,
    );
    expect(r.value).toEqual([]);
  });

  it("does not wait for the timeout when the read succeeds quickly", async () => {
    const started = Date.now();
    await withMemory(async () => "fast", "", 5000);
    expect(Date.now() - started).toBeLessThan(1000);
  });

  it("logs the failure so an operator can find it", async () => {
    const spy = quiet();
    await withMemory(
      async () => {
        throw new Error("connection refused");
      },
      null,
      50,
    );
    expect(spy).toHaveBeenCalled();
    expect(String(spy.mock.calls[0])).toMatch(/degraded/);
  });
});

describe("MemoryTimeout", () => {
  it("names itself and states the budget it exceeded", () => {
    const e = new MemoryTimeout(2500);
    expect(e.name).toBe("MemoryTimeout");
    expect(e.message).toMatch(/2500ms/);
    expect(e).toBeInstanceOf(Error);
  });
});

describe("the degraded notice", () => {
  // The wording is the safety property, so it is asserted rather than trusted.
  it("says the history was not checked", () => {
    expect(DEGRADED_NOTICE).toMatch(/could not be reached/i);
    expect(DEGRADED_NOTICE).toMatch(/nobody has checked it/i);
  });

  it("tells the reader what they must not conclude", () => {
    // The wording changed but the obligation did not: it has to explain that
    // the missing flag means nobody looked, rather than that nothing is there.
    expect(DEGRADED_NOTICE).toMatch(/none was looked for/i);
  });

  it("never says no history was found", () => {
    // The whole point: an unreachable database must not read as a clean record.
    expect(DEGRADED_NOTICE).not.toMatch(/no (prior |recurring )?(history|complaints) found/i);
    expect(DEGRADED_NOTICE).not.toMatch(/all clear/i);
  });
});
