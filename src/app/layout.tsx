import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AriaProvider } from "@/components/aria/AriaProvider";
import { TabBar } from "@/components/nirog/TabBar";

export const metadata: Metadata = {
  title: "Nirog — ARIA remembers",
  description:
    "Clinical intake with ARIA. She asks, reasons over a 13,144-condition knowledge base, hands a doctor an SBAR — and remembers what you told her last time.",
};

export const viewport: Viewport = {
  themeColor: "#DBE7F9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // The avatar is full-bleed; the chrome positions itself off the safe-area insets.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        {/*
          ARIA is mounted here, above the router, and never unmounts. Navigating
          to the case file and back would otherwise reboot Three.js, refetch a
          14 MB avatar and cut her off mid-sentence.
        */}
        <AriaProvider>
          {children}
          <TabBar />
        </AriaProvider>
      </body>
    </html>
  );
}
