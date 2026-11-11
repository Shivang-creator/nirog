import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { S1, S2, S3, S4 } from "./theme";
import { Intro } from "./scenes/Intro";
import { AppTour } from "./scenes/AppTour";
import { Tech } from "./scenes/Tech";
import { Outro } from "./scenes/Outro";

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#070a14" }}>
    <Sequence durationInFrames={S1}>
      <Intro />
      <Audio src={staticFile("audio/s1-intro.mp3")} />
    </Sequence>

    <Sequence from={S1} durationInFrames={S2}>
      <AppTour />
      <Audio src={staticFile("audio/s2-app.mp3")} />
    </Sequence>

    <Sequence from={S1 + S2} durationInFrames={S3}>
      <Tech />
      <Audio src={staticFile("audio/s3-tech.mp3")} />
    </Sequence>

    <Sequence from={S1 + S2 + S3} durationInFrames={S4}>
      <Outro />
      <Audio src={staticFile("audio/s4-outro.mp3")} />
    </Sequence>
  </AbsoluteFill>
);
