import { AriaProvider } from "@/components/aria/AriaProvider";
import { TabBar } from "@/components/nirog/TabBar";

/**
 * The patient side.
 *
 * ARIA is mounted here rather than in the root layout, and the distinction
 * matters: the root layout also covers the marketing landing page and the
 * doctor portal, neither of which has any use for a 14 MB rigged avatar and a
 * live WebGL context. Scoping it here means the clinician's workspace stays a
 * fast document, and the patient's scene still survives navigation between
 * their own screens.
 *
 * `.patient-theme` re-points the design tokens to the mobile app's palette —
 * see globals.css. The two products are both Quiet Glass but tuned for
 * different rooms, and averaging them would suit neither.
 */
export default function PatientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="patient-theme min-h-dvh">
      <AriaProvider>
        {children}
        <TabBar />
      </AriaProvider>
    </div>
  );
}
