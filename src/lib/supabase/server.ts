import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Runs queries as the signed-in doctor (the `authenticated` role) so RLS
 * policies are enforced by the database on every read and write.
 *
 * When Supabase is not configured this returns a stub that reports "nobody is
 * signed in" rather than throwing.
 *
 * The throwing version took the whole site down on any checkout without
 * secrets: every portal route, the login screen and the marketing landing page
 * returned 500, because the client was constructed eagerly behind non-null
 * assertions. The data layer already falls back to an in-memory source
 * (NIROG_DATA_SOURCE defaults to "mock"), so the app is perfectly capable of
 * running with no backing services — only the auth client stood in the way.
 *
 * The stub answers the small surface the app actually uses, and never pretends
 * anyone is authenticated. An unconfigured deployment is a signed-out one, not
 * an open one.
 */

export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

const NOT_CONFIGURED = {
  message: "Supabase is not configured on this deployment.",
  name: "AuthNotConfigured",
  status: 501,
} as const;

function stubClient() {
  const fail = async () => ({ data: null, error: NOT_CONFIGURED });

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: NOT_CONFIGURED }),
      getSession: async () => ({ data: { session: null }, error: NOT_CONFIGURED }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: NOT_CONFIGURED,
      }),
      signInWithOAuth: fail,
      signOut: async () => ({ error: null }),
      exchangeCodeForSession: async () => ({
        data: { session: null, user: null },
        error: NOT_CONFIGURED,
      }),
      mfa: {
        // aal1 → aal1 means "no step-up required", which is what stops the
        // portal layout redirecting to /verify on a deployment with no auth.
        getAuthenticatorAssuranceLevel: async () => ({
          data: {
            currentLevel: "aal1",
            nextLevel: "aal1",
            currentAuthenticationMethods: [],
          },
          error: null,
        }),
        listFactors: async () => ({
          data: { all: [], totp: [], phone: [] },
          error: null,
        }),
        enroll: fail,
        challenge: fail,
        verify: fail,
        unenroll: fail,
      },
    },
    from() {
      throw new Error(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
          "NEXT_PUBLIC_SUPABASE_ANON_KEY, or leave NIROG_DATA_SOURCE unset to " +
          "use the in-memory source.",
      );
    },
  };
}

async function createRealClient(url: string, anonKey: string) {
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — session refresh happens in
          // middleware, so this can be safely ignored.
        }
      },
    },
  });
}

type SupabaseServerClient = Awaited<ReturnType<typeof createRealClient>>;

export async function createClient(): Promise<SupabaseServerClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return stubClient() as unknown as SupabaseServerClient;
  }
  return createRealClient(url, anonKey);
}
