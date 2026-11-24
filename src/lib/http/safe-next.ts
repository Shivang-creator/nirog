/**
 * Where to send someone after sign-in.
 *
 * `next` arrives in the query string, so it is attacker-controlled: a link to
 * /auth/callback?code=…&next=@evil.example used to be concatenated onto the
 * origin and produced https://this-site@evil.example — a redirect off the site
 * that still looks, at a glance, like it starts with the right host. The same
 * trick works with a leading dot (origin + ".evil.example") or "//host".
 *
 * Only a same-site absolute path is allowed through. Anything else falls back
 * to the portal.
 */
const FALLBACK = "/portal";

export function safeNextPath(next: string | null | undefined): string {
  if (!next) return FALLBACK;
  // Must be a path, and must not be protocol-relative ("//host") or use a
  // backslash, which browsers normalise to a slash.
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return FALLBACK;
  }
  // Control characters (tab, newline) are stripped by URL parsers and can
  // turn "/\t/host" into "//host".
  if (/[\u0000-\u001f\u007f]/.test(next)) return FALLBACK;
  return next;
}
