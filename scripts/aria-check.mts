/**
 * Does the ARIA scene actually run in a browser?
 *
 * It was written for a react-native-webview on a phone. Everything in it is
 * standard web — Three.js, WebGL, Web Speech — but "should work" and "works" are
 * different claims, and a 14 MB rigged avatar with split morph targets is not
 * something to find out about during a recording.
 *
 * Captures every log line the scene emits, waits for its `ready` event, and
 * reports whether the realistic GLB loaded or it fell back to the procedural
 * stand-in.
 */

import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3111";

const browser = await chromium.launch({
  // WebGL in headless Chromium needs a real GL path or it silently gives up.
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });

const events: { type: string; [k: string]: unknown }[] = [];
const logs: string[] = [];

await page.exposeFunction("__ariaEvent", (raw: string) => {
  try {
    const m = JSON.parse(raw);
    events.push(m);
    if (m.type === "log") logs.push(String(m.msg));
  } catch {
    /* ignore */
  }
});

// The scene posts to window.parent; at the top level that is itself.
await page.addInitScript(() => {
  window.addEventListener("message", (e) => {
    if (typeof e.data === "string") {
      (window as unknown as { __ariaEvent: (s: string) => void }).__ariaEvent(e.data);
    }
  });
});

const pageErrors: string[] = [];
page.on("pageerror", (e) => pageErrors.push(e.message));

console.log("\nloading /aria/scene …");
const t0 = Date.now();
await page.goto(BASE + "/aria/scene", { waitUntil: "domcontentloaded" });

// Give the GLB a generous window; it is 14 MB over the network.
let ready: { type: string; realistic?: boolean } | undefined;
for (let i = 0; i < 60; i++) {
  ready = events.find((e) => e.type === "ready") as typeof ready;
  if (ready) break;
  await page.waitForTimeout(1000);
}

const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

console.log("\n--- scene log ---");
for (const l of logs.slice(0, 25)) console.log("  " + l);

console.log("\n--- result ---");
if (!ready) {
  console.log(`  FAIL  no 'ready' event after ${elapsed}s`);
} else {
  console.log(`  ok    ready in ${elapsed}s`);
  console.log(
    ready.realistic
      ? "  ok    realistic GLB avatar loaded"
      : "  warn  fell back to the procedural nurse (GLB did not load)",
  );
}

// Is anything actually painted?
const painted = await page.evaluate(() => {
  const c = document.getElementById("c") as HTMLCanvasElement | null;
  if (!c) return { canvas: false };
  return { canvas: true, w: c.width, h: c.height };
});
console.log(`  ${painted.canvas ? "ok  " : "FAIL"}  canvas ${JSON.stringify(painted)}`);

const bridge = await page.evaluate(() => {
  const n = (window as unknown as { nirog?: Record<string, unknown> }).nirog;
  return n ? Object.keys(n) : null;
});
console.log(
  bridge
    ? `  ok    window.nirog exposes: ${bridge.join(", ")}`
    : "  FAIL  window.nirog missing",
);

if (pageErrors.length) {
  console.log("\n--- page errors ---");
  for (const e of pageErrors.slice(0, 5)) console.log("  " + e);
}

await page.screenshot({ path: "/tmp/aria-scene.png" });
console.log("\nscreenshot: /tmp/aria-scene.png\n");

await browser.close();
