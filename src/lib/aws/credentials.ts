/**
 * Where every AWS SDK client in this app gets its credentials.
 *
 * Before: Polly, Transcribe and Bedrock each read AWS_ACCESS_KEY_ID and
 * AWS_SECRET_ACCESS_KEY, the long-lived key of an IAM user. One key sat on every
 * laptop and in Vercel prod and preview. It never expired, and nothing could
 * tell one holder from another (Well-Architected SEC02-BP02, flagged Critical).
 *
 * Now:
 *   On Vercel  AWS_ROLE_ARN is set. The function exchanges its Vercel OIDC token
 *              (signed per project and environment) for STS credentials that last
 *              15 minutes, via AssumeRoleWithWebIdentity. Vercel holds no AWS
 *              secret at all.
 *   Locally    AWS_ROLE_ARN is unset, and the SDK's default chain is used. That
 *              means `aws login` or an SSO profile (AWS_PROFILE), which are also
 *              temporary.
 *
 * The STS credentials are cached per function instance and refreshed a minute
 * before they expire. Without the cache, every request would pay an extra STS
 * round trip, because the routes build a new SDK client per call.
 */

type Env = Record<string, string | undefined>;

export interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  expiration?: Date;
}

/** Requested STS session length. 15 minutes is the shortest STS allows. */
export const SESSION_SECONDS = 900;
const REFRESH_MARGIN_MS = 60_000;

export function awsRegion(env: Env = process.env): string | undefined {
  return env.AWS_REGION?.trim() || undefined;
}

/**
 * True when some credential source is configured: a role to federate into, a
 * named profile, or (still accepted, never required) a key in the environment.
 * Whitespace-only values count as absent.
 */
export function awsConfigured(env: Env = process.env): boolean {
  if (!awsRegion(env)) return false;
  const has = (k: string) => Boolean(env[k]?.trim());
  return (
    has("AWS_ROLE_ARN") ||
    has("AWS_PROFILE") ||
    (has("AWS_ACCESS_KEY_ID") && has("AWS_SECRET_ACCESS_KEY"))
  );
}

/** Memoise a credential source so concurrent callers share one fetch. */
export function cached(
  fetch: () => Promise<AwsCredentials>,
  now: () => number = Date.now,
): () => Promise<AwsCredentials> {
  let current: AwsCredentials | undefined;
  let inflight: Promise<AwsCredentials> | undefined;
  return async () => {
    const fresh =
      current &&
      (!current.expiration ||
        current.expiration.getTime() - now() > REFRESH_MARGIN_MS);
    if (fresh) return current!;
    inflight ??= fetch()
      .then((c) => (current = c))
      .finally(() => (inflight = undefined));
    return inflight;
  };
}

let federated: { roleArn: string; get: () => Promise<AwsCredentials> } | undefined;

/**
 * The `credentials` value to pass to an SDK client. `undefined` means the SDK
 * default chain decides (local development).
 */
export function awsCredentials(
  env: Env = process.env,
): (() => Promise<AwsCredentials>) | undefined {
  const roleArn = env.AWS_ROLE_ARN?.trim();
  if (!roleArn) return undefined;
  if (federated?.roleArn !== roleArn) {
    federated = {
      roleArn,
      get: cached(async () => {
        // Lazy, so paths and tests that never call AWS never load the SDK.
        const { awsCredentialsProvider } = await import(
          "@vercel/oidc-aws-credentials-provider"
        );
        return awsCredentialsProvider({
          roleArn,
          roleSessionName: "nirog-vercel",
          durationSeconds: SESSION_SECONDS,
        })();
      }),
    };
  }
  return federated.get;
}
