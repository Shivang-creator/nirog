import { describe, it, expect } from "vitest";
import {
  offlineEmbed,
  offlineEmbedder,
  cosineDistance,
  embedderFromEnv,
  EMBED_DIMS,
} from "@/lib/ai/embed";
import { RECALL_THRESHOLD } from "@/lib/memory/recall";

const d = (a: string, b: string) => cosineDistance(offlineEmbed(a), offlineEmbed(b));

describe("offline embedder", () => {
  it("produces the dimension count the schema declares", () => {
    expect(offlineEmbed("lower back pain")).toHaveLength(EMBED_DIMS);
  });

  it("is deterministic across calls", () => {
    const a = offlineEmbed("my lower back has been aching");
    const b = offlineEmbed("my lower back has been aching");
    expect(a).toEqual(b);
  });

  it("is unit length, so cosine behaves", () => {
    const v = offlineEmbed("my lower back has been aching");
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    expect(norm).toBeCloseTo(1, 6);
  });

  it("handles empty and junk input without throwing", () => {
    expect(offlineEmbed("")).toHaveLength(EMBED_DIMS);
    expect(offlineEmbed("!!!???")).toHaveLength(EMBED_DIMS);
    expect(offlineEmbed("   ")).toHaveLength(EMBED_DIMS);
  });

  it("reports its provider honestly", async () => {
    const r = await offlineEmbedder.embed("back pain");
    expect(r.provider).toBe("offline:lexical-v1");
    // The name says "offline" so nobody reading an audit row can mistake it
    // for a real model.
    expect(r.provider).not.toMatch(/titan|bedrock/i);
  });
});

describe("cosine distance", () => {
  it("is zero for identical text", () => {
    expect(d("lower back pain", "lower back pain")).toBeCloseTo(0, 6);
  });

  it("is symmetric", () => {
    expect(d("back ache", "pain standing up")).toBeCloseTo(
      d("pain standing up", "back ache"),
      9,
    );
  });

  it("returns 1 for a zero vector rather than NaN", () => {
    expect(cosineDistance(new Array(8).fill(0), [1, 0, 0, 0, 0, 0, 0, 0])).toBe(1);
  });
});

describe("the recall the product depends on", () => {
  // These three sentences are the demo. If this block fails, the demo fails.
  const visit1 = "my lower back has been aching for a few days";
  const visit2 = "I keep getting this pain when I stand up from my desk";
  const visit3 = "the ache is back again, it's been three weeks now";

  const unrelated = "I've had a splitting headache since Tuesday";
  const alsoUnrelated = "stomach cramps and some nausea after eating";

  it("links two lumbar complaints that share almost no words", () => {
    expect(d(visit1, visit2)).toBeLessThan(RECALL_THRESHOLD);
  });

  it("links the third complaint to the first", () => {
    expect(d(visit1, visit3)).toBeLessThan(RECALL_THRESHOLD);
  });

  it("keeps a headache away from a backache", () => {
    expect(d(visit1, unrelated)).toBeGreaterThan(RECALL_THRESHOLD);
  });

  it("keeps stomach trouble away from a backache", () => {
    expect(d(visit1, alsoUnrelated)).toBeGreaterThan(RECALL_THRESHOLD);
  });

  it("ranks the related complaint above the unrelated one", () => {
    // Ranking is what actually matters — the threshold is a convenience.
    expect(d(visit1, visit2)).toBeLessThan(d(visit1, unrelated));
    expect(d(visit1, visit3)).toBeLessThan(d(visit1, alsoUnrelated));
  });

  it("would not be found by keyword overlap", () => {
    // The justification for using embeddings at all: prove the naive approach
    // genuinely fails on this data, rather than asserting it in the README.
    const words = (s: string) =>
      new Set(
        s.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length > 3),
      );
    const shared = [...words(visit1)].filter((w) => words(visit2).has(w));
    expect(shared).toHaveLength(0);
  });
});

describe("backend selection", () => {
  it("falls back to offline when no AWS key is present", () => {
    expect(embedderFromEnv({}).provider).toBe(
      "offline:lexical-v1",
    );
  });

  it("falls back to offline when the key is only partially configured", () => {
    const partial = {
      AWS_REGION: "us-west-2",
      AWS_ACCESS_KEY_ID: "AKIAEXAMPLE",
      // secret missing
    };
    expect(embedderFromEnv(partial).provider).toBe("offline:lexical-v1");
  });

  it("treats whitespace-only credentials as absent", () => {
    const blank = {
      AWS_REGION: "us-west-2",
      AWS_ACCESS_KEY_ID: "   ",
      AWS_SECRET_ACCESS_KEY: "   ",
    };
    expect(embedderFromEnv(blank).provider).toBe("offline:lexical-v1");
  });

  it("selects Bedrock when a full key is present", () => {
    const full = {
      AWS_REGION: "us-west-2",
      AWS_ACCESS_KEY_ID: "AKIAEXAMPLE",
      AWS_SECRET_ACCESS_KEY: "secret",
      BEDROCK_EMBED_MODEL: "amazon.titan-embed-text-v2:0",
    };
    expect(embedderFromEnv(full).provider).toBe(
      "bedrock:amazon.titan-embed-text-v2:0",
    );
  });

  it("names the model in the provider string, so audit rows are specific", () => {
    const full = {
      AWS_REGION: "us-west-2",
      AWS_ACCESS_KEY_ID: "AKIAEXAMPLE",
      AWS_SECRET_ACCESS_KEY: "secret",
      BEDROCK_EMBED_MODEL: "amazon.titan-embed-text-v1",
    };
    expect(embedderFromEnv(full).provider).toBe("bedrock:amazon.titan-embed-text-v1");
  });
});
