import fs from "node:fs/promises";
import path from "node:path";

const dir = path.join(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "")),
  "logos",
);
await fs.mkdir(dir, { recursive: true });

// Simple Icons is CC0 — monochrome SVG paths, colored by us.
const SI = "https://cdn.jsdelivr.net/npm/simple-icons@15/icons";
// IcePanel mirrors the official AWS Architecture Icons as individual SVGs.
const AWS = "https://icon.icepanel.io/AWS/svg";

const targets = [
  ["nextdotjs",      `${SI}/nextdotjs.svg`],
  ["react",          `${SI}/react.svg`],
  ["typescript",     `${SI}/typescript.svg`],
  ["vercel",         `${SI}/vercel.svg`],
  ["threedotjs",     `${SI}/threedotjs.svg`],
  ["tailwindcss",    `${SI}/tailwindcss.svg`],
  ["prisma",         `${SI}/prisma.svg`],
  ["nodedotjs",      `${SI}/nodedotjs.svg`],
  ["vitest",         `${SI}/vitest.svg`],
  ["playwright",     `${SI}/playwright.svg`],
  ["zod",            `${SI}/zod.svg`],
  ["cockroachlabs",  `${SI}/cockroachlabs.svg`],
  ["amazonwebservices", `${SI}/amazonwebservices.svg`],
  ["webrtc",         `${SI}/webrtc.svg`],

  ["aws-bedrock",    `${AWS}/Machine-Learning/Amazon-Bedrock.svg`],
  ["aws-polly",      `${AWS}/Machine-Learning/Amazon-Polly.svg`],
  ["aws-transcribe", `${AWS}/Machine-Learning/Amazon-Transcribe.svg`],
];

const results = [];
for (const [name, url] of targets) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      results.push(`FAIL ${name}  ${res.status}  ${url}`);
      continue;
    }
    const body = await res.text();
    if (!body.includes("<svg")) {
      results.push(`FAIL ${name}  not svg  ${url}`);
      continue;
    }
    await fs.writeFile(path.join(dir, `${name}.svg`), body);
    results.push(`ok   ${name}  ${body.length}B`);
  } catch (err) {
    results.push(`FAIL ${name}  ${err.message}`);
  }
}
console.log(results.join("\n"));
