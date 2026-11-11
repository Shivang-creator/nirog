/** Nirog "Quiet Glass" palette, from the app's globals.css. */
export const T = {
  canvas: "#d9e5f6",
  panel: "#ffffff",
  ink: "#171a21",
  inkSoft: "#5c6a80",
  blue: "#2f7cf6",
  aria: "#8b5cf6",
  green: "#2fc262",
  amber: "#f59e0b",
  red: "#f4485d",
  // Cinematic stage (matches the Blender world)
  stage: "#070a14",
  stageSoft: "#0d1322",
};

export const FONT =
  '"Segoe UI Variable Display", "Segoe UI", Inter, system-ui, sans-serif';
export const MONO = '"Cascadia Mono", Consolas, ui-monospace, monospace';

/** Scene lengths in frames (30 fps). Narration: 10.30 / 12.94 / 34.75 / 3.07 s. */
export const FPS = 30;
export const S1 = 315; // aria cinematic, 10.5 s
export const S2 = 405; // app tour, 13.5 s
export const S3 = 1065; // tech deep-dive, 35.5 s
export const S4 = 135; // outro, 4.5 s
export const TOTAL = S1 + S2 + S3 + S4; // 1920 frames = 64 s
