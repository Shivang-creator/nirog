import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT, S4, T } from "../theme";

export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 200, stiffness: 80 } });
  const fadeOut = interpolate(f, [S4 - 20, S4], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1000px 700px at 50% 30%, ${T.stageSoft} 0%, ${T.stage} 70%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          textAlign: "center",
          opacity: s,
          transform: `scale(${0.94 + s * 0.06})`,
        }}
      >
        <Img
          src={staticFile("brand/nirog-logo.png")}
          style={{ height: 130, marginBottom: 34 }}
        />
        <div style={{ fontSize: 96, fontWeight: 700, color: "#fff", letterSpacing: "-0.015em" }}>
          Nirog
        </div>
        <div style={{ fontSize: 38, color: "#b9a4ff", marginTop: 12, fontWeight: 550 }}>
          Care that remembers.
        </div>
        <div style={{ fontSize: 25, color: "rgba(255,255,255,0.55)", marginTop: 46 }}>
          nirog-memory.vercel.app · github.com/Shivang-creator/nirog
        </div>
        <div style={{ fontSize: 21, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>
          CockroachDB × AWS Hackathon
        </div>
      </div>
    </AbsoluteFill>
  );
};
