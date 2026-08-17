import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    // Every test in this suite is offline and deterministic. Nothing here
    // touches CockroachDB, Bedrock or the network — if a test ever needs a
    // credential to pass, it is testing the wrong thing.
    environment: "node",
    include: ["tests/**/*.test.ts"],
    reporters: ["default"],
  },
});
