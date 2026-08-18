import { NextResponse } from "next/server";
import { chatConfigured, CHAT_MODEL } from "@/lib/ai/converse";

export const dynamic = "force-dynamic";

/** Liveness for the ARIA backend — the client pings this before first contact. */
export async function GET() {
  return NextResponse.json({
    ok: chatConfigured(),
    model: CHAT_MODEL,
    backend: "in-app (Amazon Bedrock)",
  });
}
