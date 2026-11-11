import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FONT, T } from "../theme";

/**
 * Scene 2 — the real product, both sides. Ken Burns over actual screenshots.
 * Narration: patient side (~0-6.5 s), doctor side (~6.5-13 s).
 */
const SWITCH = 200; // frame where we cut from patient to doctor

const Shot: React.FC<{
  src: string;
  from: number;
  to: number;
  zoomFrom: number;
  zoomTo: number;
  originY?: string;
  caption: string;
  accent: string;
}> = ({ src, from, to, zoomFrom, zoomTo, originY = "40%", caption, accent }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const local = f - from;
  const dur = to - from;

  const zoom = interpolate(local, [0, dur], [zoomFrom, zoomTo]);
  const fade = interpolate(local, [0, 12, dur - 12, dur], [0, 1, 1, 0]);
  const capIn = interpolate(local, [16, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <AbsoluteFill style={{ padding: 56 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 26,
            overflow: "hidden",
            boxShadow: "0 40px 120px rgba(23,26,33,0.38)",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          <Img
            src={staticFile(src)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: `50% ${originY}`,
              transform: `scale(${zoom})`,
              transformOrigin: `50% ${originY}`,
            }}
          />
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 110,
          bottom: 92,
          fontFamily: FONT,
          opacity: capIn,
          transform: `translateY(${(1 - capIn) * 20}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(23,26,33,0.86)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            borderRadius: 16,
            padding: "20px 30px",
            fontSize: 34,
            fontWeight: 650,
            letterSpacing: "-0.01em",
            borderLeft: `6px solid ${accent}`,
          }}
        >
          {caption}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AppTour: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: T.canvas }}>
      <Shot
        src="ui/patient-aria.png"
        from={0}
        to={SWITCH}
        zoomFrom={1.06}
        zoomTo={1.16}
        originY="30%"
        caption="Patients talk to ARIA — she reads their history before she says hello"
        accent={T.aria}
      />
      <Shot
        src="ui/portal-queue.png"
        from={SWITCH}
        to={405}
        zoomFrom={1.1}
        zoomTo={1.02}
        originY="35%"
        caption="Doctors open the same patient — pattern, dates, handover, ready"
        accent={T.blue}
      />
    </AbsoluteFill>
  );
};
