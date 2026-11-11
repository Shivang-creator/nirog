/**
 * Capture the real product UI for the promo — patient side and doctor side.
 * Headed-quality WebGL via Playwright chromium with GPU-friendly flags so the
 * ARIA scene actually renders (SwiftShader fallback otherwise).
 */
import path from "node:path";
import fs from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire("c:/Projects/nirog-team/package.json");
const { chromium } = require("playwright");

const outDir = path.resolve("c:/Projects/nirog-team/promo/public/ui");
await fs.mkdir(outDir, { recursive: true });

const BASE = "http://localhost:3000";

const SHOTS = [
  // [name, url, settle-ms]. domcontentloaded + settle, because the ARIA page
  // and the portal keep sockets open and networkidle never fires.
  ["patient-aria", "/patient", 25000], // GLB download + scene boot + greeting
  ["patient-case", "/patient/case", 8000],
  ["portal-queue", "/portal", 8000],
  ["portal-patients", "/portal/patients", 8000],
];

const browser = await chromium.launch({
  headless: true,
  args: [
    "--use-angle=d3d11",
    "--enable-webgl",
    "--enable-gpu",
    "--ignore-gpu-blocklist",
  ],
});

const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1.5,
});

for (const [name, url, settle] of SHOTS) {
  try {
    await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForTimeout(settle);
    await page.screenshot({ path: path.join(outDir, `${name}.png`) });
    console.log(`ok  ${name}`);
  } catch (err) {
    console.log(`FAIL ${name}: ${err.message.split("\n")[0]}`);
  }
}

await browser.close();
