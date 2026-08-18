/**
 * Resolving a complaint's body region, using memory when the words alone
 * are not enough.
 *
 * Some complaints are self-describing: "my lower back has been aching" names
 * its own region and the lexicon handles it.
 *
 * Others are not. "The ache is back again" contains the word *back*, but as an
 * adverb — it means *returned*. There is no body part in that sentence. A
 * classifier that guessed "lumbar" from the letters would be right here by
 * accident and wrong the moment someone says "the headache is back".
 *
 * A follow-up complaint is elliptical *because* the patient assumes you
 * remember. That assumption is reasonable when talking to a person and false
 * when talking to most software. Closing that gap is the product:
 *
 *   1. Try the lexicon.
 *   2. If it comes back unknown, ask memory what this patient's most similar
 *      previous complaint was about, and adopt that region.
 *   3. If memory has nothing close enough, leave it unknown. Do not guess.
 *
 * Step 3 matters as much as step 2. Inheriting from a distant match would let
 * an unrelated complaint absorb a region and manufacture a recurrence.
 */

import { classify, type Region } from "./regions";
import type { RecallMatch } from "../memory/recall";

/**
 * How close a prior complaint must be before its region can be inherited.
 *
 * Stricter than RECALL_THRESHOLD (0.55) on purpose. Surfacing a loosely related
 * complaint to a doctor costs a glance; silently adopting its region changes
 * what gets counted, and therefore what gets flagged. The bar for acting on a
 * match should be higher than the bar for showing it.
 */
export const INHERIT_THRESHOLD = 0.4;

/**
 * The same rule on Titan's distance scale (see recall.ts for the measured
 * battery). Legitimate inheritance cases — "the ache is back again" against a
 * named lumbar history — measure 0.63–0.65; the closest cross-region trap
 * ("the ache is back again" against a headache history) measures 0.70. The
 * margin is thin because Titan compresses short sentences; 0.68 sits inside
 * it, and the miss direction is the safe one: too far to inherit leaves the
 * region unknown rather than guessing.
 */
export const BEDROCK_INHERIT_THRESHOLD = 0.68;

/** The inheritance cut-off for the embedding space the matches came from. */
export function inheritThresholdFor(provider: string): number {
  return provider.startsWith("bedrock:")
    ? BEDROCK_INHERIT_THRESHOLD
    : INHERIT_THRESHOLD;
}

export type RegionSource = "lexicon" | "inherited" | "none";

export interface ResolvedRegion {
  region: Region;
  source: RegionSource;
  /** The complaint whose region was adopted, when source is "inherited". */
  inheritedFrom?: string;
  /** Its text, for showing the doctor *why* this was linked. */
  inheritedFromText?: string;
  distance?: number;
  matchedTerms: string[];
}

/**
 * Resolve a region from the text alone, plus whatever memory returned.
 *
 * Pure: `matches` is passed in rather than fetched, so this is fully testable
 * without a database and the caller controls the degradation story.
 */
export function resolveRegion(
  text: string,
  matches: RecallMatch[],
  inheritThreshold: number = INHERIT_THRESHOLD,
): ResolvedRegion {
  const lexical = classify(text);
  if (lexical.region !== "unknown") {
    return {
      region: lexical.region,
      source: "lexicon",
      matchedTerms: lexical.matchedTerms,
    };
  }

  const candidate = matches
    .filter((m) => m.bodyRegion !== "unknown" && m.distance <= inheritThreshold)
    .sort((a, b) => a.distance - b.distance)[0];

  if (!candidate) {
    return { region: "unknown", source: "none", matchedTerms: [] };
  }

  return {
    region: candidate.bodyRegion,
    source: "inherited",
    inheritedFrom: candidate.id,
    inheritedFromText: candidate.rawText,
    distance: candidate.distance,
    matchedTerms: [],
  };
}

/** One line explaining the decision, shown in the UI next to the complaint. */
export function explainResolution(r: ResolvedRegion): string {
  switch (r.source) {
    case "lexicon":
      return `Named directly (${r.matchedTerms.join(", ")})`;
    case "inherited":
      return `No region named — inherited from “${r.inheritedFromText}” (distance ${r.distance?.toFixed(3)})`;
    case "none":
      return "No region named, and nothing similar in memory";
  }
}
