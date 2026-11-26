import { describe, expect, it, vi } from "vitest";
import {
  awsConfigured,
  awsCredentials,
  cached,
  type AwsCredentials,
} from "@/lib/aws/credentials";

const ROLE = "arn:aws:iam::123456789012:role/nirog-vercel";

describe("awsConfigured", () => {
  it("needs a region", () => {
    expect(awsConfigured({ AWS_ROLE_ARN: ROLE })).toBe(false);
  });

  it("accepts a role with no key (Vercel OIDC)", () => {
    expect(awsConfigured({ AWS_REGION: "us-west-2", AWS_ROLE_ARN: ROLE })).toBe(true);
  });

  it("accepts a profile (aws login / SSO)", () => {
    expect(awsConfigured({ AWS_REGION: "us-west-2", AWS_PROFILE: "dev" })).toBe(true);
  });

  it("treats whitespace as absent", () => {
    expect(awsConfigured({ AWS_REGION: "us-west-2", AWS_ROLE_ARN: "  " })).toBe(false);
  });
});

describe("awsCredentials", () => {
  it("defers to the SDK default chain when no role is set", () => {
    expect(awsCredentials({ AWS_REGION: "us-west-2" })).toBeUndefined();
  });

  it("returns one shared provider per role", () => {
    const env = { AWS_REGION: "us-west-2", AWS_ROLE_ARN: ROLE };
    expect(awsCredentials(env)).toBe(awsCredentials(env));
  });
});

describe("cached", () => {
  const creds = (expiresAt: number): AwsCredentials => ({
    accessKeyId: "ASIAEXAMPLE",
    secretAccessKey: "s",
    sessionToken: "t",
    expiration: new Date(expiresAt),
  });

  it("fetches once for concurrent callers and reuses fresh credentials", async () => {
    let t = 0;
    const fetch = vi.fn(async () => creds(t + 900_000));
    const get = cached(fetch, () => t);
    await Promise.all([get(), get(), get()]);
    t = 800_000; // 100 s left, still fresh
    await get();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("refreshes inside the last minute", async () => {
    let t = 0;
    const fetch = vi.fn(async () => creds(t + 900_000));
    const get = cached(fetch, () => t);
    await get();
    t = 850_000; // 50 s left
    await get();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("retries after a failed fetch instead of caching the error", async () => {
    const fetch = vi
      .fn<() => Promise<AwsCredentials>>()
      .mockRejectedValueOnce(new Error("sts down"))
      .mockResolvedValueOnce(creds(Date.now() + 900_000));
    const get = cached(fetch);
    await expect(get()).rejects.toThrow("sts down");
    await expect(get()).resolves.toMatchObject({ accessKeyId: "ASIAEXAMPLE" });
  });
});
