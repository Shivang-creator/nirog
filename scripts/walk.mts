/**
 * Walk the product the way a reviewer would, and report everything broken.
 *
 * Not assertions about what should exist — a crawl. It follows real links from
 * the landing page into both sides of the app, clicks the things a person would
 * click, and records any route that errors, any dead link, and anything the
 * browser logged. The bugs that matter are the ones nobody thought to assert.
 */

import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3111";

const problems: string[] = [];
const note = (s: string) => {
  problems.push(s);
  console.log("  ✗ " + s);
};
const ok = (s: string) => console.log("  ✓ " + s);

const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const consoleErrors: string[] = [];
page.on("pageerror", (e) => consoleErrors.push(`${page.url()} :: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error" && !/favicon|404 \(Not Found\)/i.test(m.text())) {
    consoleErrors.push(`${page.url()} :: ${m.text()}`);
  }
});

async function visit(path: string, label = path) {
  const res = await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  const status = res?.status() ?? 0;
  const body = (await page.textContent("body")) ?? "";
  /*
   * "This page could not be found" ships inside Next's shared client chunk on
   * every page, so matching it in the body reported a crash on all of them.
   * Judge the real 404 by its visible heading, not by a string that is always
   * present.
   */
  const crashed =
    /Application error: a .*exception|Internal Server Error|Unhandled Runtime Error/i.test(body) ||
    /^404\b/.test(body.trim());
  if (status >= 400) note(`${label} → HTTP ${status}`);
  else if (crashed) note(`${label} → rendered an error page`);
  else ok(`${label} → ${status}`);
  return { status, body };
}

/* ---------------- landing ---------------- */
console.log("\nLanding");
await visit("/");
await page.waitForTimeout(1200);

// Every internal link on the landing must resolve.
const hrefs = await page.$$eval("a[href^='/']", (as) =>
  Array.from(new Set(as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!))),
);
console.log(`  landing links: ${hrefs.join(", ")}`);

const wantsPatient = hrefs.some((h) => h.startsWith("/patient"));
const wantsDoctor = hrefs.some((h) => h.startsWith("/portal"));
if (!wantsPatient) note("landing has no link into the patient app");
else ok("landing links to /patient");
if (!wantsDoctor) note("landing has no link into the doctor portal");
else ok("landing links to /portal");

console.log("\nLanding links resolve");
for (const h of hrefs) {
  const res = await page.goto(BASE + h, { waitUntil: "domcontentloaded" });
  const s = res?.status() ?? 0;
  if (s >= 400) note(`link ${h} → HTTP ${s}`);
  else ok(`link ${h} → ${s}`);
}

/* ---------------- doctor side ---------------- */
console.log("\nDoctor portal");
for (const p of [
  "/portal",
  "/portal/patients",
  "/portal/audit",
  "/portal/settings",
  "/login",
  "/signup",
]) {
  await visit(p);
}

// Can a reviewer actually get in from the login screen?
console.log("\nDemo sign-in");
await page.goto(BASE + "/login", { waitUntil: "domcontentloaded" });
const submit = page.getByRole("button", { name: /Enter workspace/i });
if ((await submit.count()) === 0) note("login has no submit button");
else {
  await submit.click();
  await page.waitForTimeout(3500);
  const url = page.url();
  if (url.includes("/portal")) ok(`sign-in landed on ${new URL(url).pathname}`);
  else {
    const body = (await page.textContent("body")) ?? "";
    const err = body.match(/don't match our records|not configured|error[^.]*/i)?.[0];
    note(`sign-in did not reach the portal (still ${new URL(url).pathname}${err ? ` — "${err}"` : ""})`);
  }
}

// Open a patient from the doctor's list.
console.log("\nDoctor opens a patient");
await page.goto(BASE + "/portal/patients", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(800);
const patientLink = page.locator('a[href^="/portal/patients/"]').first();
if ((await patientLink.count()) === 0) note("no patient rows link anywhere");
else {
  await patientLink.click();
  await page.waitForTimeout(2500);
  const body = (await page.textContent("body")) ?? "";
  if (/Application error: a .*exception|^404\b/i.test(body.trim())) note("patient detail page errored");
  else ok(`patient detail → ${new URL(page.url()).pathname}`);
}

/* ---------------- patient side ---------------- */
console.log("\nPatient app");
await page.setViewportSize({ width: 430, height: 932 });
const { body: patientBody } = await visit("/patient");
await page.waitForTimeout(15000);
const after = (await page.textContent("body")) ?? patientBody;

if (!/Good Morning/.test(after)) note("patient home missing the greeting");
else ok("greeting renders");
if (!/earlier visits? on file/.test(after)) note("memory banner did not appear");
else ok(`memory: ${after.match(/\d+ earlier visits? on file/)?.[0]}`);

const bridge = await page.evaluate(
  () => !!(document.querySelector("iframe") as HTMLIFrameElement | null)?.contentWindow?.[
    "nirog" as keyof Window
  ],
);
if (!bridge) note("ARIA bridge not exposed");
else ok("ARIA bridge live");

// Does her voice come from Polly?
const speak = await page.evaluate(async () => {
  const r = await fetch("/api/speak", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: "Testing." }),
  });
  if (!r.ok) return { ok: false, status: r.status };
  const j = await r.json();
  return { ok: true, voice: j.voice, engine: j.engine, bytes: (j.audio ?? "").length };
});
if (!speak.ok) note(`/api/speak → HTTP ${speak.status}`);
else ok(`voice: ${speak.voice}/${speak.engine}, ${speak.bytes} b64 chars`);

// The tab bar must actually navigate.
console.log("\nPatient tab bar");
const tabs = await page.$$eval("nav a[href]", (as) =>
  as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!),
);
for (const t of tabs) {
  const res = await page.goto(BASE + t, { waitUntil: "domcontentloaded" });
  const s = res?.status() ?? 0;
  const b = (await page.textContent("body")) ?? "";
  if (s >= 400 || /^404\b/.test(b.trim())) note(`tab ${t} → ${s === 200 ? "404 page" : s}`);
  else ok(`tab ${t} → ${s}`);
}

/* ---------------- console ---------------- */
console.log("\nBrowser console");
if (consoleErrors.length) {
  for (const e of [...new Set(consoleErrors)].slice(0, 8)) note(`console: ${e.slice(0, 160)}`);
} else ok("no console errors");

await browser.close();

console.log(
  problems.length
    ? `\n${problems.length} problem(s) found.\n`
    : "\nNo problems found.\n",
);
process.exit(problems.length ? 1 : 0);
