import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        /*
         * The avatar is the largest thing this site serves and it never
         * changes, but Vercel's default for /public is
         * `max-age=0, must-revalidate` — so every visit re-downloaded it in
         * full. On a slow link that download starves every other request on
         * the connection, and for as long as it runs the patient cannot
         * navigate: tapping a tab does nothing, because the tab's own request
         * is queued behind fifteen megabytes of nurse.
         *
         * The file is content-addressed by name in practice (a new avatar
         * ships as a new file), so it can be cached hard.
         */
        source: "/aria/:file*.glb",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
