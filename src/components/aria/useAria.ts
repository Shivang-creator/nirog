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
    caption: "",
    realistic: false,
    sttBlocked: false,
  });

  /**
   * What the user is saying, updated live from partial transcripts so the dock
   * can show words appearing as they speak rather than after they stop.
   */
  const [heard, setHeard] = useState<string>("");
  const heardResolver = useRef<((text: string) => void) | null>(null);

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
          setState((s) => ({ ...s, listening: !!m.on }));
          // An aborted mic never produces an stt event, so release the waiter here
          // or listen() hangs forever on a cancelled turn.
          if (!m.on && m.aborted) {
            heardResolver.current?.("");
            heardResolver.current = null;
          }
          break;

        // Transcription arrives on its own channel, not on `listening`.
        // Partials (final:false) stream into the dock as the user speaks; only
        // the final one resolves the promise and ends the turn.
        case "stt":
          setHeard(m.text ?? "");
          if (m.final) {
            heardResolver.current?.(m.text ?? "");
            heardResolver.current = null;
          }
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
            sttBlocked: s.sttBlocked || fatal,
          }));
          heardResolver.current?.("");
          heardResolver.current = null;
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

  /** Open the mic and resolve with the final transcript ("" if cancelled). */
  const listen = useCallback((): Promise<string> => {
    const b = bridge();
    if (!b) return Promise.resolve("");
    return new Promise<string>((resolve) => {
      heardResolver.current = resolve;
      b.listen();
    });
  }, [bridge]);

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
    stopListen,
    abortListen,
  };
}
