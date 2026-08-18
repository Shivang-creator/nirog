import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components (browser). Used for Storage uploads,
 * realtime queue updates, MFA enrolment and WebRTC signalling.
 *
 * Returns null when Supabase is not configured, rather than throwing.
 *
 * `createBrowserClient` throws on construction if the URL or key is missing,
 * and every caller runs inside render — so an unconfigured deployment threw
 * during the React render pass and took the route down with it. That is how
 * /portal/settings became a 500, and why the console filled with the same
 * error on every portal page.
 *
 * Callers must handle null. The features behind it are exactly the ones that
 * genuinely need a backend — live updates, file uploads, call signalling — and
 * each can say "unavailable" far more usefully than a blank screen can.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey);
}

/** True when a browser client can actually be created. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
