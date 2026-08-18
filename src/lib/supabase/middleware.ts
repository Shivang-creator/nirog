import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request and guards the portal.
 * Must run in middleware so Server Components always see a fresh session.
 */
export async function updateSession(request: NextRequest) {
  const passthrough = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  /*
   * Without Supabase configured, do nothing and let the request through.
   *
   * This previously built the client unconditionally behind non-null
   * assertions, so a missing key threw inside edge middleware — which runs on
   * *every* route. The result was a 500 on the marketing landing page, the
   * login screen and everything else, on any checkout without secrets.
   *
   * An auth layer that cannot be configured should degrade to "nobody is signed
   * in", never to "the site is down". The portal's own pages still decide what
   * an unauthenticated visitor gets; this only declines to refresh a session
   * that cannot exist.
   */
  if (!url || !anonKey) return passthrough;

  let response = passthrough;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Failing to reach Supabase is not a reason to take the site down either.
    // Treat an unreachable auth service as signed out.
    return response;
  }

  const { pathname } = request.nextUrl;

  // Unauthenticated → bounce off the portal to login.
  if (!user && pathname.startsWith("/portal")) {
    const to = request.nextUrl.clone();
    to.pathname = "/login";
    to.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(to);
  }

  // Already signed in → skip the login screen.
  if (user && pathname === "/login") {
    const to = request.nextUrl.clone();
    to.pathname = "/portal";
    return NextResponse.redirect(to);
  }

  return response;
}
