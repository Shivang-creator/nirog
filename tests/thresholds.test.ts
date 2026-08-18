/**
 * Distances are only comparable within one embedding space.
 *
 * The offline lexical embedder and Titan produce different distance scales for
 * the same pair of sentences (measured: related pairs 0.15–0.45 offline,
 * 0.54–0.82 under Titan). A threshold tuned for one space applied to the other
 * either recalls everything or nothing — switching AWS accounts made region
 * inheritance silently fail until the thresholds became provider-aware. These
 * tests pin that selection.
 */
import { describe, it, expect } from "vitest";
import {
  RECALL_THRESHOLD,
  BEDROCK_RECALL_THRESHOLD,
  recallThresholdFor,
} from "@/lib/memory/recall";
import {
  INHERIT_THRESHOLD,
  BEDROCK_INHERIT_THRESHOLD,
  inheritThresholdFor,
  resolveRegion,
} from "@/lib/clinical/resolve";
import type { RecallMatch } from "@/lib/memory/recall";

describe("provider-aware thresholds", () => {
  it("selects the Titan scale for bedrock providers", () => {
    expect(recallThresholdFor("bedrock:amazon.titan-embed-text-v2:0")).toBe(
      BEDROCK_RECALL_THRESHOLD,
    );
    expect(inheritThresholdFor("bedrock:amazon.titan-embed-text-v2:0")).toBe(
      BEDROCK_INHERIT_THRESHOLD,
    );
  });

  it("selects the offline scale for the fallback embedder and unknown providers", () => {
    expect(recallThresholdFor("offline:lexical-v1")).toBe(RECALL_THRESHOLD);
    expect(inheritThresholdFor("offline:lexical-v1")).toBe(INHERIT_THRESHOLD);
    expect(recallThresholdFor("none")).toBe(RECALL_THRESHOLD);
  });

  it("keeps inheritance stricter than recall in both spaces", () => {
    expect(INHERIT_THRESHOLD).toBeLessThan(RECALL_THRESHOLD);
    expect(BEDROCK_INHERIT_THRESHOLD).toBeLessThan(BEDROCK_RECALL_THRESHOLD);
  });

  it("resolveRegion honours a caller-supplied inherit threshold", () => {
    const match: RecallMatch = {
      id: "m1",
      visitId: "v1",
      patientId: "p1",
      rawText: "my lower back has been aching",
      bodyRegion: "lower_back",
      occurredAt: new Date(),
      // A legitimate Titan-scale inheritance distance, far past the offline cut.
      distance: 0.63,
    };
    const text = "the ache is back again"; // names no body part

    const offline = resolveRegion(text, [match]);
    expect(offline.source).toBe("none");

    const titan = resolveRegion(text, [match], BEDROCK_INHERIT_THRESHOLD);
    expect(titan.source).toBe("inherited");
    expect(titan.region).toBe("lower_back");
  });
});
