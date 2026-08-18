import { HideScene } from "@/components/nirog/SceneVisibility";
import { ProfileClient } from "./profile-client";

export const dynamic = "force-dynamic";

/**
 * The patient's own record.
 *
 * The phone keeps this in `data/dummy.ts` — one account holder plus the
 * household who share it, which is how care actually works in a village: one
 * person owns the handset and books for their mother, their father and their
 * child. The web version keeps that shape rather than inventing a single-user
 * account, because the household is the reason the memory layer has to be
 * scoped per patient in the first place.
 *
 * Edits are held in the browser. There is no account behind this deployment and
 * this screen does not pretend otherwise — it says where the changes went.
 */
export default function ProfilePage() {
  return (
    <div className="min-h-dvh" style={{ background: "var(--bg)" }}>
      <HideScene />
      <ProfileClient />
    </div>
  );
}
