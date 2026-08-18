import type { Metadata } from "next";
import { CallClient } from "./call-client";

export const metadata: Metadata = {
  title: "Consultation",
  robots: { index: false },
};

/**
 * Public patient entry to a consultation.
 *
 * Reached two ways: from the link a doctor shares, and from the patient's own
 * doctor list, which passes who is being called so the ringing screen can name
 * them the way the mobile app always has. Neither route needs an account, and
 * neither goes anywhere near the clinician's workspace.
 */
export default async function CallPage({
  params,
  searchParams,
}: {
  params: Promise<{ room: string }>;
  searchParams: Promise<{ doctor?: string; spec?: string }>;
}) {
  const { room } = await params;
  const { doctor, spec } = await searchParams;
  return <CallClient room={room} doctor={doctor} spec={spec} />;
}
