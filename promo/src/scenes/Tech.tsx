import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT, MONO, T } from "../theme";

/**
 * Scene 3 — the 30-second production-tech deep dive, beat-matched to the
 * narration: Transcribe -> Polly -> gpt-oss on Bedrock -> CockroachDB vector
 * memory -> audit trail -> the degradation contract.
 */

// Beat boundaries (frames within this scene, 30 fps)
const B = {
  title: 0,
  transcribe: 105,
  polly: 180,
  bedrock: 285,
  cockroach: 420,
  audit: 765,
  degraded: 855,
};

const useIn = (at: number, delay = 0) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at - delay, fps, config: { damping: 200, stiffness: 90 } });
};

const AwsChip: React.FC<{
  at: number;
  x: number;
  logo: string;
  name: string;
  note: string;
}> = ({ at, x, logo, name, note }) => {
  const s = useIn(at);
  const f = useCurrentFrame();
  const active = f >= at && f < B.cockroach;
  const dim = f >= B.cockroach ? 0.5 : 1;
  return (
    <div
      style={{
        position: "absolute",
        top: 96,
        left: x,
        width: 420,
        opacity: s * dim,
        transform: `translateY(${(1 - s) * 40}px)`,
        background: "rgba(255,255,255,0.055)",
        border: `1px solid ${active ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.14)"}`,
        borderRadius: 20,
        padding: "24px 26px",
        fontFamily: FONT,
        display: "flex",
        gap: 18,
        alignItems: "center",
      }}
    >
      <Img src={staticFile(logo)} style={{ width: 64, height: 64, borderRadius: 12 }} />
      <div>
        <div style={{ color: "#fff", fontSize: 27, fontWeight: 680 }}>{name}</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 20, marginTop: 4 }}>
          {note}
        </div>
      </div>
    </div>
  );
};

const Code: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = "#9fd0ff",
}) => (
  <span style={{ fontFamily: MONO, color, fontSize: "inherit" }}>{children}</span>
);

export const Tech: React.FC = () => {
  const f = useCurrentFrame();

  const titleS = useIn(B.title, 8);
  const titleOut = interpolate(f, [B.transcribe - 20, B.transcribe], [1, 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const crdbS = useIn(B.cockroach, 5);
  const auditS = useIn(B.audit);
  const degradedS = useIn(B.degraded);
  const isDegraded = f >= B.degraded;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1200px 800px at 50% -10%, ${T.stageSoft} 0%, ${T.stage} 62%)`,
        fontFamily: FONT,
      }}
    >
      {/* headline */}
      <div
        style={{
          position: "absolute",
          top: f < B.transcribe ? 420 : 24,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleS * (f < B.transcribe ? 1 : titleOut),
          transform: `translateY(${(1 - titleS) * 30}px)`,
          transition: "top 0.4s",
        }}
      >
        <div
          style={{
            fontSize: f < B.transcribe ? 76 : 30,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.015em",
          }}
        >
          A production agent — not a demo
        </div>
      </div>

      {/* AWS service chips, appearing as she names them */}
      <AwsChip at={B.transcribe} x={156} logo="logos/aws-transcribe.png"
        name="Amazon Transcribe" note="her ears · en-IN streaming" />
      <AwsChip at={B.polly} x={750} logo="logos/aws-polly.png"
        name="Amazon Polly" note="this voice · Kajal, en-IN neural" />
      <AwsChip at={B.bedrock} x={1344} logo="logos/aws-bedrock.png"
        name="Bedrock · gpt-oss-120b" note="holds the conversation" />

      {/* CockroachDB centerpiece */}
      <div
        style={{
          position: "absolute",
          left: 156,
          right: 156,
          top: 300,
          opacity: crdbS,
          transform: `translateY(${(1 - crdbS) * 60}px)`,
        }}
      >
        <div
          style={{
            borderRadius: 26,
            border: `1.5px solid ${isDegraded ? T.amber : "rgba(139,92,246,0.55)"}`,
            background: isDegraded
              ? "rgba(245,158,11,0.07)"
              : "rgba(105,51,255,0.10)",
            padding: "40px 52px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 26 }}>
            <Img src={staticFile("logos/cockroachlabs.svg")} style={{ height: 52 }} />
            <div style={{ color: "#fff", fontSize: 40, fontWeight: 700 }}>
              CockroachDB <span style={{ color: "#b9a4ff", fontWeight: 550 }}>is her memory</span>
            </div>
          </div>

          <div style={{ fontSize: 30, lineHeight: 1.75, color: "rgba(255,255,255,0.86)" }}>
            <div>
              Every complaint embedded with <b>Titan</b> → written with its{" "}
              <Code>VECTOR(1024)</Code> in <b>one statement</b> — no ETL, nothing
              “eventually” searchable.
            </div>
            <div style={{ marginTop: 10 }}>
              Recall: <Code color="#ffd28a">ORDER BY embedding &lt;=&gt; $vec</Code>{" "}
              on a vector index prefixed by <Code>patient_id</Code> — a query that
              cannot say “search everyone”.
            </div>

            {/* audit beat */}
            <div
              style={{
                marginTop: 10,
                opacity: auditS,
                transform: `translateY(${(1 - auditS) * 24}px)`,
              }}
            >
              Every recall lands in <Code color="#8be6b0">recall_event</Code> —
              matches, distance, latency, <b>even the failures</b>.
            </div>
          </div>
        </div>

        {/* degradation beat */}
        <div
          style={{
            marginTop: 26,
            opacity: degradedS,
            transform: `translateY(${(1 - degradedS) * 30}px)`,
            display: "flex",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              flex: 1,
              borderRadius: 20,
              background: "rgba(245,158,11,0.13)",
              border: `1.5px solid ${T.amber}`,
              padding: "26px 34px",
              fontSize: 29,
              color: "#ffd9a0",
              lineHeight: 1.55,
            }}
          >
            Memory unreachable →{" "}
            <Code color="#ffd28a">MemoryOutcome&#123; degraded: true &#125;</Code>{" "}
            — the chart reads <b>NOT ASSESSED</b>, never “no history”.
          </div>
          <div
            style={{
              borderRadius: 20,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "26px 34px",
              fontSize: 29,
              fontWeight: 650,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              maxWidth: 560,
            }}
          >
            Absence of evidence is not evidence of absence.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
