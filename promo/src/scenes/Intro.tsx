import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FONT, S1, T } from "../theme";

/**
 * Scene 1 — the Blender cinematic of ARIA with titles.
 * Narration: "Every visit to a doctor used to start the same way. With a
 * stranger. I am ARIA — Nirog's intake nurse. And I remember you."
 */
export const Intro: React.FC = () => {
  const f = useCurrentFrame();

  const fadeIn = interpolate(f, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(f, [S1 - 18, S1], [1, 0], {
    extrapolateLeft: "clamp",
  });

  // "a stranger" lands around 4 s; the name card follows at ~6 s.
  const titleIn = interpolate(f, [185, 215], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(f, [185, 215], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: T.stage, opacity: fadeIn * fadeOut }}>
      <OffthreadVideo
        muted
        src={staticFile("footage/aria-intro.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* soft vignette so titles sit on calm pixels */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(7,10,20,0.72) 0%, rgba(7,10,20,0) 34%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "0 0 84px 110px",
          fontFamily: FONT,
          opacity: titleIn,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.42em",
            color: "rgba(255,255,255,0.62)",
            marginBottom: 14,
            textTransform: "uppercase",
          }}
        >
          Meet ARIA
        </div>
        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: "-0.015em",
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          The nurse who <span style={{ color: "#b9a4ff" }}>remembers</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
