import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/memory/db";

export const dynamic = "force-dynamic";

/**
 * Where two browsers introduce themselves.
 *
 * A WebRTC call needs an offer, an answer and a stream of ICE candidates to
 * cross between the peers before any media can flow. The previous web app
 * passed them over Supabase Realtime. This build has no Supabase, and CockroachDB
 * is already holding everything else, so the introductions go there too: POST
 * appends what a peer has to say, GET returns whatever the *other* peer has said
 * since a given moment.
 *
 * Polled rather than pushed. A consultation is set up in a second or two and
 * then never touches this table again — the media goes peer to peer — so the
 * cost is a handful of small queries at the start of a call, which is not worth
 * a websocket layer to avoid.
 *
 * Nothing clinical passes through here. It is SDP and candidate addresses.
 */

const ROOM = z.string().min(1).max(120).regex(/^[a-zA-Z0-9._-]+$/);
const ROLE = z.enum(["doctor", "patient"]);

const postSchema = z.object({
  room: ROOM,
  from: ROLE,
  // The browser's own shapes, passed through untouched. Validating SDP here
  // would mean re-implementing the spec badly.
  payload: z.record(z.string(), z.unknown()),
});

/** Old rows are litter; a call that needed them finished long ago. */
const SWEEP_AFTER = "10 minutes";

export async function POST(req: NextRequest) {
  let body: z.infer<typeof postSchema>;
  try {
    body = postSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "bad signal" }, { status: 400 });
  }

  try {
    await query(
      `INSERT INTO call_signal (room, from_role, payload) VALUES ($1, $2, $3)`,
      [body.room, body.from, JSON.stringify(body.payload)],
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[call/signal] write failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "signalling unavailable" }, { status: 503 });
  }
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const parsed = z
    .object({ room: ROOM, role: ROLE, since: z.string().optional() })
    .safeParse({
      room: params.get("room") ?? "",
      role: params.get("role") ?? "",
      since: params.get("since") ?? undefined,
    });

  if (!parsed.success) {
    return NextResponse.json({ error: "bad query" }, { status: 400 });
  }
  const { room, role, since } = parsed.data;

  try {
    /*
     * Everything the other side said, oldest first — order matters, because an
     * answer applied before its offer is not an answer to anything.
     */
    const rows = await query<{ payload: unknown; created_at: Date }>(
      `SELECT payload, created_at
         FROM call_signal
        WHERE room = $1
          AND from_role <> $2
          AND created_at > $3::TIMESTAMPTZ
        ORDER BY created_at ASC
        LIMIT 100`,
      [room, role, since ?? new Date(Date.now() - 60_000).toISOString()],
    );

    // Opportunistic sweep. Cheap, and it keeps the table from accumulating the
    // debris of every call ever placed.
    void query(
      `DELETE FROM call_signal WHERE created_at < now() - INTERVAL '${SWEEP_AFTER}'`,
    ).catch(() => {});

    return NextResponse.json({
      signals: rows.map((r) => r.payload),
      // The caller passes this back next time, so it only ever sees new rows.
      cursor:
        rows.length > 0
          ? new Date(rows[rows.length - 1].created_at).toISOString()
          : (since ?? new Date(Date.now() - 60_000).toISOString()),
    });
  } catch (err) {
    console.error("[call/signal] read failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "signalling unavailable" }, { status: 503 });
  }
}
