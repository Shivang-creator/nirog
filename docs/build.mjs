import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire("c:/Projects/nirog-team/package.json");
const pw = require("playwright");
const chromium = pw.chromium ?? pw.default?.chromium;

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, ""));
const logoDir = path.join(dir, "logos");
const tpl = path.join(dir, "architecture.tpl.html");
const html = path.join(dir, "architecture.html");
const png = process.argv[2] ?? path.join(dir, "nirog-architecture.png");

/*
 * Simple Icons ships monochrome paths with no fill, so each brand's colour is
 * applied here as a presentation attribute on <svg> and inherited by the paths.
 * Full-colour marks (the AWS wordmark, AWS service icons, Playwright) are left
 * exactly as published.
 */
const BRAND = {
  nextdotjs: "#000000",
  react: "#61DAFB",
  typescript: "#3178C6",
  vercel: "#000000",
  threedotjs: "#000000",
  tailwindcss: "#06B6D4",
  prisma: "#2D3748",
  nodedotjs: "#5FA04E",
  vitest: "#6E9F18",
  zod: "#3E67B1",
  cockroachlabs: "#6933FF",
  webrtc: "#333333",
  shadcnui: "#000000",
  radixui: "#161618",
  framer: "#0055FF",
  lucide: "#F56565",
  vite: "#646CFF",
  eslint: "#4B32C3",
};

const uris = {};
for (const file of await fs.readdir(logoDir)) {
  const name = file.replace(/\.(svg|png)$/, "");
  const buf = await fs.readFile(path.join(logoDir, file));

  if (file.endsWith(".png")) {
    uris[name] = `data:image/png;base64,${buf.toString("base64")}`;
    continue;
  }

  let svg = buf.toString("utf8");
  const colour = BRAND[name];
  if (colour) svg = svg.replace(/<svg\b/, `<svg fill="${colour}"`);
  uris[name] = `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
}

let out = await fs.readFile(tpl, "utf8");
const missing = new Set();
out = out.replace(/\{\{logo:([a-z0-9-]+)\}\}/g, (_, name) => {
  if (!uris[name]) { missing.add(name); return ""; }
  return uris[name];
});
if (missing.size) {
  console.error("MISSING LOGOS:", [...missing].join(", "));
  process.exit(1);
}
await fs.writeFile(html, out);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1800, height: 1526 },
  deviceScaleFactor: 2,
});
await page.goto(pathToFileURL(html).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => Promise.all(
  [...document.images].map((i) => i.complete ? null : i.decode().catch(() => null)),
));

await (await page.$(".canvas")).screenshot({ path: png });

const problems = await page.evaluate(() => {
  const bad = [];
  for (const b of document.querySelectorAll(".box, .strip, .stack")) {
    if (b.scrollHeight > b.clientHeight + 1) {
      bad.push(`overflow ${b.querySelector("h4")?.textContent?.trim() ?? b.className}: ${b.scrollHeight} > ${b.clientHeight}`);
    }
  }
  for (const i of document.images) {
    if (!i.naturalWidth) bad.push(`broken image: ${i.alt || i.className}`);
  }
  return bad;
});

await browser.close();
console.log(png);
console.log(problems.length ? problems.join("\n") : "clean — no overflow, all images loaded");
