import { NextRequest, NextResponse } from "next/server";
import { query, MEMORY_TIMEOUT_MS } from "@/lib/memory/db";
import { withMemory } from "@/lib/memory/degrade";
import { isPatientId } from "@/lib/memory/ids";
import { detectAll, type ComplaintRecord } from "@/lib/clinical/recurrence";
import { REGION_LABELS, type Region } from "@/lib/clinical/regions";

export const dynamic = "force-dynamic";

/**
 * What ARIA knows about you before she says hello.
 *
 * The mobile app's backend is stateless — the entire transcript is posted on
 * every turn — so ARIA has perfect recall inside one conversation and none at
 * all between them. Every visit starts with a stranger.
 *
 * This is the other half. Before the greeting, we read the patient's history out
 * of CockroachDB and hand her one line to open with. Not a summary of the chart:
 * one thing worth saying out loud, because a nurse who opened with a bulleted
 * history would be worse than one who said nothing.
 */

function shortWhen(d: Date, now: Date): string {
  const days = Math.round((now.getTime() - d.getTime()) / 86_400_000);
  if (days <= 1) return "yesterday";
  if (days < 14) return `${days} days ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 9) return `${weeks} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
}

export async function GET(req: NextRequest) {
  const patientId = req.nextUrl.searchParams.get("patientId") ?? "";

  if (!isPatientId(patientId)) {
    return NextResponse.json({ recall: [], opener: null, degraded: false });
  }

  const now = new Date();

  const outcome = await withMemory(
    async () => {
      const rows = await query<{
        id: string;
        visit_id: string;
        patient_id: string;
        raw_text: string;
        body_region: string;
        occurred_at: Date;
      }>(
        `SELECT id, visit_id, patient_id, raw_text, body_region, occurred_at
           FROM complaint
          WHERE patient_id = $1
          ORDER BY occurred_at ASC`,
        [patientId],
      );
      return rows.map((r) => ({
        id: r.id,
        visitId: r.visit_id,
        patientId: r.patient_id,
        rawText: r.raw_text,
        bodyRegion: r.body_region as Region,
        occurredAt: new Date(r.occurred_at),
      })) satisfies ComplaintRecord[];
    },
    [] as ComplaintRecord[],
    MEMORY_TIMEOUT_MS,
  );

  /*
   * Memory being unreachable is not the same as a patient with no history, and
   * ARIA must not open as though it were. She says she cannot see the file.
   */
  if (outcome.degraded) {
    return NextResponse.json({
      recall: [],
      degraded: true,
      opener:
        "One thing first. I can't get to your records right now, so I won't " +
        "be able to tell you if this has come up before.",
    });
  }

  const history = outcome.value;
  if (history.length === 0) {
    return NextResponse.json({ recall: [], opener: null, degraded: false });
  }

  const recall = history
    .slice(-6)
    .map((c) => ({ text: c.rawText, when: shortWhen(c.occurredAt, now) }));

  /*
   * One line, chosen by the same deterministic rule that drives the doctor's
   * chart. A recurrence is worth naming; a single unrelated visit is not, and
   * reciting it would just prove she can read a database.
   */
  const flag = detectAll(history, now)[0];
  let opener: string | null = null;

  if (flag?.level === "recurrent") {
    const region = REGION_LABELS[flag.region].toLowerCase();
    const first = flag.complaints[0];
    opener =
      `Before we start. You have been in ${flag.visitCount} times about your ` +
      `${region} in the last ${flag.spanDays} days. ` +
      `${shortWhen(first.occurredAt, now).replace(/^./, (c) => c.toUpperCase())} you said “${first.rawText}”. ` +
      `Is this the same thing?`;
  } else if (flag?.level === "watch") {
    const region = REGION_LABELS[flag.region].toLowerCase();
    opener =
      `You were in about your ${region} ${shortWhen(
        flag.complaints[flag.complaints.length - 1].occurredAt,
        now,
      )}. Is that why you are back?`;
  } else {
    const last = history[history.length - 1];
    opener = `${shortWhen(last.occurredAt, now).replace(/^./, (c) => c.toUpperCase())} you told me “${last.rawText}”. What is going on today?`;
  }

  return NextResponse.json({
    recall,
    opener,
    degraded: false,
    latencyMs: outcome.latencyMs,
  });
}
