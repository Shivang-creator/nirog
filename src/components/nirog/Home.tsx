"use client";

/**
 * The home screen — ARIA, and nothing else.
 *
 * Ported from app/(tabs)/index.tsx. Four layers over the full-bleed 3D scene:
 * header, transport pills, the dock, and the tab bar. No cards.
 *
 * What is new here, and the reason this project exists: every turn is written
 * to CockroachDB, and before the consultation starts ARIA is told what this
 * patient said on previous visits. The mobile app's backend is stateless — the
 * whole transcript is posted each turn — so she has perfect recall inside one
 * conversation and total amnesia between them. Memory is the missing half.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAriaContext } from "@/components/aria/AriaProvider";
import { Dock } from "./Dock";
import { chat, isConfigured } from "@/lib/nirog/aria";
import { appendTurn, getCase, resetCase, setCase, useCase } from "@/lib/nirog/caseStore";
import {
  beginInterview,
  interviewTurn,
  summarise,
  toIntake,
  type InterviewState,
} from "@/lib/clinical/interview";
import type { Region } from "@/lib/clinical/regions";

const USER = { name: "Rahul", greeting: "Good Morning" };

const ARIA_PROMPTS = [
  "I've had a fever for 3 days.",
  "My stomach has been hurting since yesterday.",
  "I get headaches almost every evening.",
];

/** Once the interview is over she answers questions instead of asking them. */
const QA_PROMPTS = [
  "Should I be worried?",
  "What happens next?",
  "What will the doctor do?",
];

/**
 * What she says when you take the controls.
 *
 * A pause that just goes quiet is indistinguishable from a crash, and a restart
 * that silently wipes the case file is indistinguishable from a bug. So she
 * acknowledges every one out loud — the press is confirmed by the only channel
 * this app really has, which is her voice.
 */
const REACTIONS = {
  start: "Okay, I'm listening. Tell me what's bothering you.",
  resume: "I'm back with you. Please, go on.",
  pause: "Alright, I'll pause here. Tap start whenever you're ready.",
  restart: "Okay, let's start again from the beginning. What's bothering you?",
};

export function Home({ patientId }: { patientId: string | null }) {
  const router = useRouter();
  const aria = useAriaContext();
  const kase = useCase();

  const [session, setSession] = useState<"live" | "paused">("live");
  const [handsFree, setHandsFree] = useState(true);
  const [youSaid, setYouSaid] = useState("");
  const [level] = useState(0);
  const [finalising, setFinalising] = useState(false);
  const [recall, setRecall] = useState<{ text: string; when: string }[] | null>(null);
  const [opener, setOpener] = useState<string | null>(null);
  const [remembered, setRemembered] = useState<Region | null>(null);
  /** Dismissable once — she should say the mic is dead, not nag about it. */
  const [micNoticeSeen, setMicNoticeSeen] = useState(false);
  const spokeOpener = useRef(false);
  const turnRef = useRef(0);
  /** The history she is taking herself. Null until she has a complaint to work from. */
  const interviewRef = useRef<InterviewState | null>(null);

  useEffect(() => {
    aria.setVisible(true);
  }, [aria]);

  /*
   * Memory, before the first word.
   *
   * We ask CockroachDB what this patient has told us
   * before. If anything comes back, ARIA opens by naming it instead of greeting
   * a stranger — which is the entire difference between an assistant and a
   * receptionist who has your file open.
   */
  useEffect(() => {
    if (!patientId || recall !== null) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/memory/context?patientId=${patientId}`);
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as {
          recall: { text: string; when: string }[];
          opener: string | null;
          region: Region | null;
        };
        if (cancelled) return;
        setRecall(data.recall);
        setOpener(data.opener);
        setRemembered(data.region ?? null);
      } catch {
        if (!cancelled) setRecall([]);
      }
    })();

    return () => { cancelled = true; };
  }, [patientId, recall]);

  /*
   * Speak the recalled line once she is actually able to speak.
   *
   * The read and the speaking are separate on purpose. The banner is just text
   * and should appear as soon as the database answers; the spoken opener has to
   * wait for the scene to boot and for audio to be unlocked, which on a cold
   * load is several seconds later. Gating the fetch on the avatar — as this did
   * at first — meant a slow GLB download also delayed the memory lookup, and on
   * production it simply had not happened yet by the time the page settled.
   */
  useEffect(() => {
    if (!aria.ready || !opener || spokeOpener.current) return;
    spokeOpener.current = true;
    // Behind her own greeting, so it chains rather than talks over it.
    const t = setTimeout(() => aria.say(opener), 2600);
    return () => clearTimeout(t);
  }, [aria, opener]);

  const react = useCallback(
    (line: string) => {
      aria.hush();
      aria.say(line);
    },
    [aria],
  );

  /**
   * She takes the history herself.
   *
   * A structured history is a fixed list of questions asked in a fixed order, so
   * lib/clinical/interview.ts can ask them with nothing behind it. That is the
   * same split as everywhere else in this project: the deterministic layer holds
   * on its own, and the model is the layer that makes it better.
   *
   * Nothing here is announced to the patient. She asks the next question, which
   * from the other side of the screen is all she was ever doing.
   */
  const ask = useCallback(
    (text: string) => {
      const c = getCase();
      // The complaint is the first thing they said, not the most recent — this
      // reads correctly whether she has been asking from the start or has just
      // picked the interview up mid-conversation.
      const complaint = c.history.find((h) => h.role === "user")?.text ?? text;
      const state = interviewRef.current ?? beginInterview(complaint, remembered);
      const step = interviewTurn(state, text);
      interviewRef.current = step.state;

      appendTurn({ role: "assistant", text: step.reply });
      setCase({
        thinking: false,
        error: null,
        intake: toIntake(step.state),
        complete: step.done,
        summary: step.done ? summarise(step.state) : null,
      });
      aria.say(step.reply);

      if (step.done && !c.complete) {
        setHandsFree(false);
        setSession("paused");
        aria.abortListen();
      }
    },
    [aria, remembered],
  );

  /** One turn: say it, ask the model, record it, speak the answer. */
  const send = useCallback(
    async (text: string) => {
      const t = text.trim();
      if (!t || getCase().thinking) return;

      const turn = ++turnRef.current;
      setYouSaid(t);
      appendTurn({ role: "user", text: t });
      setCase({ thinking: true, error: null });

      // Write it to memory in parallel — the consultation must not wait on it.
      //
      // This used to sit below the clinical-service check, so with no service
      // configured the turn returned before it and the row was never written.
      // What the patient said goes to CockroachDB whoever ends up answering them.
      if (patientId) {
        void fetch("/api/memory/complaint", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ patientId, text: t }),
        }).catch(() => {});
      }

      if (!isConfigured()) {
        ask(t);
        return;
      }

      // Fires instantly and covers the 2–8s the model takes. A face that is
      // clearly listening and silent reads as a freeze, not a pause.
      aria.filler();

      try {
        const c = getCase();
        const res = await chat(
          // appendTurn above already added this turn and the store mutates
          // synchronously, so re-appending it here sent the backend the
          // patient's last sentence twice.
          c.history,
          { name: USER.name },
          c.intake,
          c.candidates,
          c.complete,
        );

        // A reply from a superseded turn must never land — pausing mid-flight
        // bumps the counter precisely so this check drops it.
        if (turnRef.current !== turn) return;

        const justFinished = res.complete && !c.complete;
        appendTurn({ role: "assistant", text: res.reply });
        setCase({
          thinking: false,
          intake: res.intake,
          candidates: res.candidates,
          complete: res.complete,
          summary: res.summary,
          redFlag: res.redFlag,
          flags: res.flags,
        });
        aria.say(res.reply);

        if (justFinished) {
          setHandsFree(false);
          setSession("paused");
          aria.abortListen();
        }
        if (res.redFlag) setTimeout(() => router.push("/patient/case"), 1200);
      } catch (err) {
        if (turnRef.current !== turn) return;
        // The service is down or slow. She carries on with the interview rather
        // than telling a patient about our infrastructure.
        console.warn("[aria] clinical service unavailable, taking the history here", err);
        ask(t);
      }
    },
    [aria, ask, patientId, router],
  );

  /*
   * Hands-free: reopen the mic 450ms after she stops talking.
   *
   * Gated on `speaking` going false rather than on the reply arriving —
   * otherwise she transcribes her own voice.
   */
  useEffect(() => {
    if (session !== "live" || !handsFree) return;
    // No microphone in this browser. Reopening it would fail again in 450ms,
    // for as long as the page is open. She waits for typing instead.
    if (aria.sttBlocked) return;
    if (aria.speaking || aria.listening || kase.thinking || finalising) return;
    const t = setTimeout(() => {
      void (async () => {
        const heard = await aria.listen();
        setFinalising(false);
        if (heard) void send(heard);
      })();
    }, 450);
    return () => clearTimeout(t);
  }, [aria, session, handsFree, kase.thinking, finalising, send]);

  // Caption precedence, exactly as the app resolves it.
  const caption = aria.speaking
    ? { who: "ARIA" as const, text: aria.caption, dots: aria.caption ? null : ("wait" as const) }
    : aria.listening
      ? { who: "You" as const, text: aria.heard || youSaid, dots: "live" as const }
      : finalising
        ? { who: "You" as const, text: youSaid, dots: "wait" as const }
        : youSaid
          ? { who: "You" as const, text: youSaid, dots: null }
          : kase.thinking
            ? { who: "ARIA" as const, text: "", dots: "wait" as const }
            : null;

  const paused = session === "paused";

  return (
    <>
      {/* ---- header ---- */}
      <div
        className="fixed left-6 right-6 z-20 pointer-events-none no-select"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 10px)" }}
      >
        <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.14px", color: "var(--gray)" }}>
          Nirog
        </p>
        <h1
          style={{
            fontSize: 32, fontWeight: 700, color: "var(--ink)",
            letterSpacing: "-0.96px", lineHeight: "35px", marginTop: 10,
          }}
        >
          {USER.greeting},<br />
          <span style={{ color: "var(--gray3)" }}>{USER.name}.</span>
        </h1>

        {/* What memory brought back, stated before she says a word. */}
        {recall && recall.length > 0 && (
          <p
            className="cap-shadow"
            style={{ marginTop: 10, fontSize: 12.5, fontWeight: 600, color: "var(--blue)" }}
          >
            {recall.length} earlier {recall.length === 1 ? "visit" : "visits"} on file
          </p>
        )}
      </div>

      {/* ---- transport pills ---- */}
      <div
        className="fixed right-4 z-20 flex gap-1.5 no-select"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 8px)" }}
      >
        <Pill
          label="Start"
          icon="play"
          dim={!paused}
          primary={paused}
          onClick={() => {
            if (!paused) return;
            setSession("live");
            setHandsFree(true);
            react(kase.history.length ? REACTIONS.resume : REACTIONS.start);
          }}
        />
        <Pill
          label="Pause"
          icon="pause"
          dim={paused}
          onClick={() => {
            if (paused) return;
            turnRef.current++; // orphan any in-flight reply
            setSession("paused");
            setHandsFree(false);
            aria.abortListen();
            setCase({ thinking: false });
            react(REACTIONS.pause);
          }}
        />
        <Pill
          label="Restart"
          icon="refresh"
          onClick={() => {
            turnRef.current++;
            resetCase();
            interviewRef.current = null;
            setYouSaid("");
            setSession("live");
            setHandsFree(true);
            react(REACTIONS.restart);
          }}
        />
      </div>

      <Dock
        caption={caption}
        level={level}
        listening={aria.listening}
        finalising={finalising}
        handsFree={handsFree}
        prompts={kase.complete ? QA_PROMPTS : ARIA_PROMPTS}
        complete={kase.complete}
        error={
          kase.error ??
          (aria.sttBlocked && !micNoticeSeen
            ? "This browser will not open the microphone. Type your answers instead — everything else works the same."
            : null)
        }
        onSend={(t) => void send(t)}
        onMicToggle={() => {
          if (aria.listening) aria.stopListen();
          else
            void (async () => {
              const heard = await aria.listen();
              if (heard) void send(heard);
            })();
        }}
        onHandsFreeToggle={() => setHandsFree((h) => !h)}
        onDismissError={() => {
          setCase({ error: null });
          setMicNoticeSeen(true);
        }}
        onAnalysis={() => router.push("/patient/case")}
        onDoctor={() => router.push("/patient/doctors")}
      />
    </>
  );
}

function Pill({
  label, icon, dim, primary, onClick,
}: {
  label: string;
  icon: "play" | "pause" | "refresh";
  dim?: boolean;
  primary?: boolean;
  onClick: () => void;
}) {
  const colour = primary ? "var(--blue)" : dim ? "var(--gray)" : "var(--ink)";
  return (
    <button
      onClick={onClick}
      className="flex items-center no-select"
      style={{
        height: 30, padding: "0 10px", gap: 4, borderRadius: 999,
        border: `1px solid ${primary ? "rgba(10,132,255,0.25)" : "var(--glass-border)"}`,
        background: primary ? "rgba(10,132,255,0.12)" : "var(--glass-fill-heavy)",
        backdropFilter: "blur(20px) saturate(150%)",
        WebkitBackdropFilter: "blur(20px) saturate(150%)",
        boxShadow: "0 3px 10px rgba(30,40,60,0.08)",
        opacity: dim ? 0.45 : 1,
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill={icon === "refresh" ? "none" : colour} stroke={colour} strokeWidth="2">
        {icon === "play" && <path d="M6 4l14 8-14 8z" />}
        {icon === "pause" && <><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>}
        {icon === "refresh" && <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />}
      </svg>
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "-0.12px", color: colour }}>
        {label}
      </span>
    </button>
  );
}
