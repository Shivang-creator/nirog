import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * The ICE servers a call should use, fetched at call time rather than baked in.
 *
 * STUN is enough on most home and office networks: the peers discover their own
 * public addresses and connect directly. It is not enough on carrier-grade NAT
 * or a restrictive mobile network, which is the normal case for the patients
 * this is built for — there the media has to be relayed by a TURN server.
 *
 * Metered issue short-lived TURN credentials from an API key. The key is a
 * secret and stays on the server; the browser gets only the credentials it
 * needs, which expire on their own. Without a key configured this answers with
 * STUN alone and the call still works wherever a direct path exists, which is
 * the honest degradation: fewer networks, not a broken feature.
 */

const STUN = [
  { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
];

interface IceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export async function GET() {
  const key = process.env.METERED_API_KEY?.trim();
  const app = process.env.METERED_APP_NAME?.trim();

  /*
   * Static credentials, if that is how the dashboard handed them over. Checked
   * first because they need no round trip and no app name.
   */
  const staticUrls = process.env.TURN_URLS?.trim();
  if (staticUrls) {
    return NextResponse.json({
      iceServers: [
        ...STUN,
        {
          urls: staticUrls.split(",").map((u) => u.trim()).filter(Boolean),
          username: process.env.TURN_USERNAME ?? "",
          credential: process.env.TURN_CREDENTIAL ?? "",
        },
      ],
      relay: "turn (static)",
    });
  }

  if (!key || !app) {
    return NextResponse.json({
      iceServers: STUN,
      relay: "stun-only",
      // Said plainly so a call that cannot cross a hard NAT is diagnosable
      // rather than mysterious.
      note: key
        ? "METERED_APP_NAME is not set, so TURN credentials cannot be fetched."
        : "No TURN configured — direct connections only.",
    });
  }

  try {
    const res = await fetch(
      `https://${app}.metered.live/api/v1/turn/credentials?apiKey=${encodeURIComponent(key)}`,
      { cache: "no-store", signal: AbortSignal.timeout(6000) },
    );
    if (!res.ok) throw new Error(`metered ${res.status}`);
    const servers = (await res.json()) as IceServer[];
    if (!Array.isArray(servers) || servers.length === 0) {
      throw new Error("metered returned no servers");
    }
    return NextResponse.json({
      iceServers: [...STUN, ...servers],
      relay: "turn (metered)",
    });
  } catch (err) {
    // A relay we could not reach is a smaller problem than no call at all.
    console.warn("[call/ice] TURN unavailable, falling back to STUN:", err instanceof Error ? err.message : err);
    return NextResponse.json({ iceServers: STUN, relay: "stun-only (turn fetch failed)" });
  }
}
