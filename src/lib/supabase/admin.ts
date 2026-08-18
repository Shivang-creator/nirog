import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — BYPASSES RLS. Server-only. Used strictly for trusted
 * admin operations (creating auth users, seeding). Never expose to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    // Same rule as server.ts/middleware.ts: never construct a Supabase client
    // from missing env. Callers must check isAuthConfigured() before admin work.
    throw new Error(
      "Supabase admin client unavailable: set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY, or gate this call behind isAuthConfigured()."
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
