"use client";

/**
 * React side of the ARIA bridge.
 *
 * The scene runs in a same-origin iframe, which gives us two channels and we use
 * both deliberately:
 *
 *   React → scene   direct calls on iframe.contentWindow.nirog.*
 *                   (same origin, so no serialisation and no round trip)
 *   scene → React   postMessage events, exactly as the mobile app receives them
 *
 * Keeping the inbound direction on postMessage means the scene needs no
 * knowledge of its host, and the contract stays identical to the app's.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export type AriaMood = "neutral" | "warm" | "concerned" | "thinking";

/** Events the scene emits. Mirrors the RN() calls inside nurseHtml. */
export interface AriaEvent {
  type:
    | "ready"
    | "speaking"
    | "idle"
    | "caption"
    | "listening"
    | "stt"
    | "sttError"
    | "log";
  realistic?: boolean;
  text?: string;
  msg?: string;
  error?: string;
  on?: boolean;
  aborted?: boolean;
  /** stt only: false while the user is still talking, true for the transcript. */
  final?: boolean;
}

interface AriaBridge {
  say(text: string): void;
  speak(text: string): void;
  queueLines(lines: string[]): void;
  filler(): void;
  listen(): void;
  stopListen(): void;
  abortListen(): void;
  hush(): void;
  setMood(m: string): void;
  speakAudio(text: string, url: string, enqueue?: boolean): void;
}

export interface AriaState {
  /** The scene booted and the avatar is on screen. */
  ready: boolean;
  /** True while she is talking — used to hold the dock. */
  speaking: boolean;
  /** True while the mic is open. */
  listening: boolean;
  /**
   * The mic has closed and the definitive transcription is still running.
   *
   * This is the state the first web port lost, and losing it broke the whole
   * conversation. The final pass over the audio takes one to three seconds
   * AFTER `listening` goes false, and the hands-free loop treated that window
   * as free: it reopened the mic, micStart() bumped MIC.token, and the
   * in-flight transcription of the sentence just spoken was discarded by its
   * own token check. The patient's words evaporated, nothing was ever sent,
   * and she sat there "listening" forever. The phone gates its loop on
   * exactly this flag (index.tsx: setFinalising(!on && !aborted)).
   */
  finalising: boolean;
  /** The line currently on screen, streamed word by word. */
  caption: string;
  /** Whether the realistic GLB loaded, or we are on the procedural stand-in. */
  realistic: boolean;
  /**
   * The mic is not going to work in this browser, so stop asking for it.
   *
   * Speech recognition is a Chrome/Edge feature. In Safari and Firefox the
   * scene reports "Not supported" the instant the mic is opened, and hands-free
   * mode answers a failed listen by opening the mic again 450ms later. That is
   * a loop with no exit: it re-rendered several times a second, and the churn
   * was enough to stop the tab bar navigating at all — the patient could not
   * leave the page. A microphone that cannot work is a permanent condition, so
   * it is recorded once and the loop is never started again.
   */
  sttBlocked: boolean;
}

/**
 * Errors that mean "not in this browser, not on this visit" rather than
 * "that attempt failed". Retrying any of these produces the same answer.
 */
const FATAL_STT_ERRORS = ["not supported", "not-allowed", "service-not-allowed"];

export function useAria(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const [state, setState] = useState<AriaState>({
    ready: false,
    speaking: false,
    listening: false,
    finalising: false,
    caption: "",
    realistic: false,
    sttBlocked: false,
  });

  /**
   * What the user is saying, updated live from partial transcripts so the dock
   * can show words appearing as they speak rather than after they stop.
   */
  const [heard, setHeard] = useState<string>("");
  /**
   * Where a finished sentence goes. One mutable slot, registered by the screen
   * that owns the conversation — the phone passes this as the onStt prop.
   *
   * The first port wrapped this in a promise instead, and a promise is a thing
   * that can be lost: every listen() overwrote the previous resolver, so two
   * calls racing meant a transcript with nobody waiting for it. A handler that
   * is simply *called* cannot be stranded.
   */
  const onSttRef = useRef<((text: string, final: boolean) => void) | null>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (typeof e.data !== "string") return;

      let m: AriaEvent;
      try {
        m = JSON.parse(e.data);
      } catch {
        return;
      }

      switch (m.type) {
        case "ready":
          setState((s) => ({ ...s, ready: true, realistic: !!m.realistic }));
          break;
        case "speaking":
          setState((s) => ({ ...s, speaking: true }));
          break;
        case "idle":
          setState((s) => ({ ...s, speaking: false }));
          break;
        case "caption":
          setState((s) => ({ ...s, caption: m.text ?? "" }));
          break;
        case "listening":
          setState((s) => ({
            ...s,
            listening: !!m.on,
            // Closed without "aborted" means the final pass is running and the
            // definitive stt event is on its way; hold the loop for it. An
            // aborted mic was thrown away and will never answer — don't wait.
            finalising: !m.on && !m.aborted,
          }));
          break;

        // Transcription arrives on its own channel, not on `listening`.
        // Partials (final:false) stream into the dock as the user speaks; the
        // final one ends the turn, through whoever registered onStt.
        case "stt":
          setHeard(m.text ?? "");
          if (m.final) setState((s) => ({ ...s, finalising: false }));
          onSttRef.current?.(m.text ?? "", !!m.final);
          break;

        case "sttError": {
          const fatal = FATAL_STT_ERRORS.some((e) =>
            (m.error ?? "").toLowerCase().includes(e),
          );
          console.warn(
            "[aria] speech recognition failed:",
            m.error,
            fatal ? "(giving up on the mic for this visit)" : "",
          );
          setState((s) => ({
            ...s,
            listening: false,
            finalising: false,
            sttBlocked: s.sttBlocked || fatal,
          }));
          break;
        }
        case "log":
          if (process.env.NODE_ENV !== "production") {
            console.debug("[aria]", m.msg);
          }
          break;
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  /*
   * A final that never arrives must not wedge the conversation forever. The
   * transcription request inside the scene is already bounded at 20s; this is
   * the belt to that suspender, and the phone carries the same watchdog.
   */
  useEffect(() => {
    if (!state.finalising) return;
    const t = setTimeout(
      () => setState((s) => ({ ...s, finalising: false })),
      25_000,
    );
    return () => clearTimeout(t);
  }, [state.finalising]);

  const bridge = useCallback((): AriaBridge | null => {
    const w = iframeRef.current?.contentWindow as
      | (Window & { nirog?: AriaBridge })
      | null
      | undefined;
    return w?.nirog ?? null;
  }, [iframeRef]);

  const say = useCallback(
    (text: string) => {
      bridge()?.say(text);
    },
    [bridge],
  );

  const queue = useCallback(
    (lines: string[]) => {
      bridge()?.queueLines(lines);
    },
    [bridge],
  );

  /**
   * A holding line while the model thinks.
   *
   * gpt-oss takes a few seconds. A real nurse fills that gap without thinking
   * about it, and silence from a face that is clearly listening reads as a
   * freeze rather than a pause.
   */
  const filler = useCallback(() => {
    bridge()?.filler();
  }, [bridge]);

  const hush = useCallback(() => {
    bridge()?.hush();
  }, [bridge]);

  const setMood = useCallback(
    (m: AriaMood) => {
      bridge()?.setMood(m);
    },
    [bridge],
  );

  /** Open the mic. What is heard arrives through the onStt handler. */
  const listen = useCallback(() => {
    bridge()?.listen();
  }, [bridge]);

  /** Register the one place a finished sentence is delivered to. */
  const onStt = useCallback(
    (cb: ((text: string, final: boolean) => void) | null) => {
      onSttRef.current = cb;
    },
    [],
  );

  const stopListen = useCallback(() => {
    bridge()?.stopListen();
  }, [bridge]);

  const abortListen = useCallback(() => {
    bridge()?.abortListen();
  }, [bridge]);

  return {
    ...state,
    heard,
    say,
    queue,
    filler,
    hush,
    setMood,
    listen,
    onStt,
    stopListen,
    abortListen,
  };
}
