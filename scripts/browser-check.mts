/**
 * Browser check.
 *
 * The intake form is a React server action, which means it is the one path no
 * amount of curl or unit testing actually exercises — the whole point is the
 * round trip through the form. This drives a real Chromium against a running
 * server and asserts what a judge would see.
 *
 * Usage:  npm run build && npm start &   then   npm run check:browser
 */

import { chromium } from "playwright";
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local", quiet: true });

const BASE = process.env.BASE_URL ?? "http://localhost:3111";

/**
 * The intake test writes a real complaint to a real patient, which would leave
 * the demo chart altered every time this runs. The marker below makes that row
 * findable so it can be removed again — a check that quietly degrades the thing
 * it is checking is worse than no check.
 */
const MARKER = "[browser-check]";

let failures = 0;
const check = (label: string, ok: boolean, detail = "") => {
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// Anything the browser logs is a bug we would otherwise never see.
const consoleErrors: string[] = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

try {
  /* ---------- static pages ---------- */
  console.log("\nPages");
  for (const [path, expected] of [
    ["/", "Has this patient told us this before?"],
    ["/doctor", "Patients"],
    ["/intake", "Say something a patient would say"],
    ["/method", "How it works, and what it cannot do"],
  ] as [string, string][]) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const body = await page.textContent("body");
    check(path, body?.includes(expected) ?? false);
  }

  /* ---------- the chart ---------- */
  console.log("\nDoctor chart");
  await page.goto(BASE + "/doctor", { waitUntil: "networkidle" });
  // Exact-prefix match: the synthetic seed contains names like "Rahul M. (vol)",
  // so a loose regex matches sixteen rows and Playwright refuses to guess.
  await page.locator('a[href^="/doctor/"]').filter({ hasText: "Anita R." }).first().click();
  await page.waitForURL(/\/doctor\/[0-9a-f-]{36}/, { timeout: 15000 });
  await page.waitForSelector("text=Everything on record", { timeout: 15000 });
  const chart = (await page.textContent("body")) ?? "";

  check("recurrence is flagged", chart.includes("Recurrence flagged"));
  check("shows the three lumbar quotes",
    chart.includes("lower back has been aching") &&
    chart.includes("pain when I stand up") &&
    chart.includes("the ache is back again"));
  check("shows the inherited region", chart.includes("region inherited from"));
  check("shows family history", chart.includes("disc surgery"));
  check("SBAR rendered", chart.includes("SBAR handover"));
  check("refuses to diagnose", chart.includes("not a diagnosis"));
  check("no raw error text on the page", !/ValidationException|ECONNREFUSED|Internal Server/i.test(chart));

  /* ---------- negative control ---------- */
  console.log("\nNegative control");
  await page.goto(BASE + "/doctor", { waitUntil: "networkidle" });
  await page.locator('a[href^="/doctor/"]').filter({ hasText: "Rahul M." }).first().click();
  await page.waitForURL(/\/doctor\/[0-9a-f-]{36}/, { timeout: 15000 });
  await page.waitForSelector("text=Everything on record", { timeout: 15000 });
  const rahul = (await page.textContent("body")) ?? "";
  check("no recurrence for a single complaint", rahul.includes("No recurrence"));
  check("says it is a real negative", rahul.includes("real negative result"));

  /* ---------- the intake form, the untested path ---------- */
  console.log("\nIntake form");
  await page.goto(BASE + "/intake", { waitUntil: "networkidle" });

  const demoOptions = await page
    .locator('#patientId optgroup[label="Demo patients"] option')
    .allTextContents();
  check("demo patients grouped at the top of the dropdown",
    demoOptions.length === 3, `${demoOptions.length} demo options`);
  check("demo group is not polluted by synthetic rows",
    demoOptions.every((o) => !o.includes("(vol)")));

  const anita = demoOptions.find((o) => o.includes("Anita"));
  if (anita) await page.selectOption("#patientId", { label: anita });

  await page.fill("#text", `my back is hurting again after sitting all morning ${MARKER}`);
  await page.getByRole("button", { name: /Record it and ask memory/ }).click();

  await page.waitForSelector("text=What memory returned", { timeout: 20000 });
  const result = (await page.textContent("body")) ?? "";

  check("recorded the complaint", result.includes("Recorded"));
  check("memory returned matches", result.includes("What memory returned"));
  check("recalled a prior lumbar complaint", /lower back has been aching|pain when I stand up/.test(result));
  check("shows a body region", result.includes("Body region"));
  check("evaluated the recurrence rule", result.includes("Recurrence rule"));
  check("shows the embedding provider", /offline:lexical-v1|bedrock:amazon\.titan/.test(result));
  check("no error surfaced", !result.includes("Could not write to memory"));

  /* ---------- validation ---------- */
  console.log("\nValidation");
  await page.goto(BASE + "/intake", { waitUntil: "networkidle" });
  await page.fill("#text", "ab"); // under the 3-char floor
  await page.getByRole("button", { name: /Record it and ask memory/ }).click();
  await page.waitForTimeout(2500);
  const short = (await page.textContent("body")) ?? "";
  check("rejects a too-short complaint",
    short.includes("Describe the symptom in a few words") || short.includes("What memory returned") === false);

  /* ---------- audit trail ---------- */
  console.log("\nAudit trail");
  await page.goto(BASE + "/method", { waitUntil: "networkidle" });
  const method = (await page.textContent("body")) ?? "";
  check("recall events are logged", method.includes("Recent recalls"));
  check("the intake we just did appears", method.includes("sitting all morning"));

  /* ---------- responsive ---------- */
  console.log("\nMobile viewport");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + "/doctor", { waitUntil: "networkidle" });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  check("no horizontal overflow at 390px", !overflow);

  await page.goto(BASE + "/method", { waitUntil: "networkidle" });
  const methodOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  check("method page does not overflow (it has wide code blocks)", !methodOverflow);

  /* ---------- console ---------- */
  console.log("\nBrowser console");
  const real = consoleErrors.filter((e) => !/favicon|404 \(Not Found\)/i.test(e));
  check("no console errors", real.length === 0, real.slice(0, 2).join(" | "));
} finally {
  await browser.close();

  // Remove the complaint (and its visit) that the intake test created.
  if (process.env.DATABASE_URL) {
    const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await db.connect();
    const { rowCount } = await db.query(
      `DELETE FROM visit WHERE id IN (
         SELECT visit_id FROM complaint WHERE raw_text LIKE $1
       )`,
      [`%${MARKER}%`],
    );
    await db.query(`DELETE FROM recall_event WHERE query_text LIKE $1`, [`%${MARKER}%`]);
    await db.end();
    console.log(`\ncleaned up ${rowCount} test visit(s)`);
  }
}

console.log(failures === 0 ? "\nAll browser checks passed.\n" : `\n${failures} CHECK(S) FAILED\n`);
process.exit(failures === 0 ? 0 : 1);
