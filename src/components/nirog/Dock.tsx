"use client";

/**
 * The dock — caption, prompt chips, mic, keyboard.
 *
 * Ported from the bottom of app/(tabs)/index.tsx. Geometry is copied rather than
 * re-derived: 44×44 buttons, 999px radii, 13/700 chip text at -0.13 letter
 * spacing. It should be indistinguishable from the phone.
 *
 * The caption is deliberately NOT a card. No fill, no border, no shadow — a
 * white text-shadow is the only legibility device, so ARIA's face is never
 * covered by chrome.
 */

import { useEffect, useRef, useState } from "react";

export interface DockProps {
  caption: { who: "ARIA" | "You"; text: string; dots: "wait" | "live" | null } | null;
  /** 0..1 mic level, drives the ring and the live dots. */
  level: number;
  listening: boolean;
  finalising: boolean;
  handsFree: boolean;
  prompts: string[];
  complete: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onMicToggle: () => void;
  onHandsFreeToggle: () => void;
  onDismissError: () => void;
  onAnalysis: () => void;
  onDoctor: () => void;
}

function LiveDots({ mode, level }: { mode: "wait" | "live"; level: number }) {
  return (
    <span className="flex items-center gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={mode === "wait" ? "dot-wait" : undefined}
          style={{
            width: 5,
            height: 5,
            borderRadius: 2.5,
            background: "var(--gray3)",
            animationDelay: mode === "wait" ? `${i * 160}ms` : undefined,
            // When the mic is open the dots ride the real input level instead of
            // looping — it is the difference between "listening" and "alive".
            opacity: mode === "live" ? 0.3 + level * 0.7 : undefined,
            transform: mode === "live" ? `scale(${0.8 + level * 0.7})` : undefined,
          }}
        />
      ))}
    </span>
  );
}

export function Dock(props: DockProps) {
  const {
    caption, level, listening, finalising, handsFree, prompts, complete,
    error, onSend, onMicToggle, onHandsFreeToggle, onDismissError,
    onAnalysis, onDoctor,
  } = props;

  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typing) inputRef.current?.focus();
  }, [typing]);

  function submit() {
    const t = draft.trim();
    if (!t) return;
    setDraft("");
    onSend(t);
  }

  return (
    <div
      className="fixed left-0 right-0 z-20 px-4 no-select"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)",
        display: "grid",
        // minmax(0, 1fr), not the implicit `auto`. An auto grid column sizes to
        // its widest child, so the horizontally-scrolling chip row (which is
        // max-content wide by definition) stretched the whole dock past the
        // viewport — carrying the mic and keyboard off the right edge and
        // pushing the centred caption out with them.
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: 10,
      }}
    >
      {/* ---- caption ---- */}
      <div
        style={{
          height: typing ? 0 : 24,
          opacity: typing ? 0 : 1,
          overflow: "hidden",
          transition: `height 340ms var(--ease), opacity 340ms var(--ease)`,
        }}
      >
        {error ? (
          <button
            onClick={onDismissError}
            className="flex items-center justify-center gap-1.5 w-full px-2"
            style={{ height: 24 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v5M12 16h.01" />
            </svg>
            <span className="cap-shadow" style={{ fontSize: 13, color: "var(--red)" }}>
              {error}
            </span>
          </button>
        ) : caption ? (
          <div
            className="flex items-center justify-center gap-1.5 px-2"
            style={{ height: 24, maxWidth: "100%", minWidth: 0 }}
          >
            <span
              className="cap-shadow-strong shrink-0"
              style={{
                fontSize: 13, fontWeight: 700, letterSpacing: "-0.1px",
                color: caption.who === "ARIA" ? "var(--blue)" : "var(--gray3)",
              }}
            >
              {caption.who}:
            </span>
            {caption.text && (
              <span
                className="cap-shadow truncate"
                // minWidth:0 again — without it the caption refuses to ellipsise
                // and instead stretches the centred row off-screen.
                style={{
                  fontSize: 15, fontWeight: 600, lineHeight: "20px",
                  letterSpacing: "-0.22px", color: "var(--ink)",
                  // ARIA's caption clips from the HEAD so the word she is saying
                  // right now stays on screen. CSS only ellipsises the tail, so
                  // the row is reversed and the text direction flipped back.
                  minWidth: 0,
                  direction: caption.who === "ARIA" ? "rtl" : "ltr",
                  unicodeBidi: "plaintext",
                  textAlign: caption.who === "ARIA" ? "right" : "left",
                }}
              >
                {caption.text}
              </span>
            )}
            {caption.dots && <LiveDots mode={caption.dots} level={level} />}
          </div>
        ) : null}
      </div>

      {/* ---- done row ---- */}
      {complete && !typing && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onAnalysis}
            className="flex items-center gap-1.5 no-select"
            style={{
              padding: "10px 16px", borderRadius: 999,
              background: "var(--ink)", border: "1px solid var(--ink)",
              boxShadow: "var(--shadow-ink)",
              fontSize: 13, fontWeight: 700, letterSpacing: "-0.13px", color: "#fff",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8" />
            </svg>
            My analysis
          </button>
          <button
            onClick={onDoctor}
            className="glass-heavy flex items-center gap-1.5 no-select"
            style={{
              padding: "10px 16px", borderRadius: 999,
              fontSize: 13, fontWeight: 700, letterSpacing: "-0.13px", color: "var(--ink)",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2">
              <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M12 11v5M9.5 13.5h5" />
            </svg>
            See a doctor
          </button>
        </div>
      )}

      {/* ---- prompt row ---- */}
      <div className="flex items-center gap-2">
        {/*
          min-width:0 is load-bearing. A flex child defaults to min-width:auto,
          which means it refuses to shrink below its content — so a row of chips
          wider than the screen shoves the mic and keyboard buttons off the edge
          instead of scrolling.
        */}
        <div
          className="flex-1 flex items-center gap-2 overflow-x-auto"
          style={{ minWidth: 0, paddingBlock: 2, paddingRight: 8, scrollbarWidth: "none" }}
        >
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => onSend(p)}
              className="shrink-0 no-select"
              style={{
                padding: "9px 15px", borderRadius: 999,
                border: "1px solid var(--glass-border)",
                background: "rgba(255,255,255,0.62)",
                backdropFilter: "blur(20px) saturate(150%)",
                WebkitBackdropFilter: "blur(20px) saturate(150%)",
                boxShadow: "var(--shadow-soft)",
                fontSize: 13, fontWeight: 500, letterSpacing: "-0.13px", color: "var(--ink)",
                whiteSpace: "nowrap",
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* mic */}
        <button
          onClick={onMicToggle}
          onContextMenu={(e) => { e.preventDefault(); onHandsFreeToggle(); }}
          title={handsFree ? "Hands-free on — right-click to turn off" : "Right-click for hands-free"}
          className="relative shrink-0 grid place-items-center no-select"
          style={{
            width: 44, height: 44, borderRadius: 22,
            background: listening ? "var(--red)" : "var(--glass-fill-heavy)",
            border: `1px solid ${listening ? "var(--red)" : "var(--glass-border-heavy)"}`,
            boxShadow: "0 5px 16px rgba(30,40,60,0.10)",
            backdropFilter: "blur(20px) saturate(150%)",
            WebkitBackdropFilter: "blur(20px) saturate(150%)",
            opacity: handsFree ? 1 : 0.75,
          }}
        >
          {listening && (
            <span
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                width: 40, height: 40, borderRadius: 20, background: "var(--red)",
                transform: `scale(${1 + level * 0.55})`,
                opacity: 0.25 + level * 0.5,
              }}
            />
          )}
          <svg
            width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2"
            stroke={listening ? "#fff" : handsFree ? "var(--blue)" : "var(--gray)"}
            className="relative"
          >
            {finalising ? (
              <><path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" /></>
            ) : listening ? (
              <rect x="6" y="6" width="12" height="12" rx="2" fill="#fff" stroke="none" />
            ) : (
              <><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4" /></>
            )}
          </svg>
        </button>

        {/* keyboard */}
        <button
          onClick={() => setTyping((t) => !t)}
          className="shrink-0 grid place-items-center no-select"
          style={{
            width: 44, height: 44, borderRadius: 22,
            background: typing ? "rgba(10,132,255,0.12)" : "var(--glass-fill-heavy)",
            border: `1px solid ${typing ? "rgba(10,132,255,0.25)" : "var(--glass-border-heavy)"}`,
            boxShadow: "0 5px 16px rgba(30,40,60,0.10)",
            backdropFilter: "blur(20px) saturate(150%)",
            WebkitBackdropFilter: "blur(20px) saturate(150%)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2"
            stroke={typing ? "var(--blue)" : "var(--gray)"}>
            <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.2A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 0 1 17 0z" />
            <circle cx="8.5" cy="11.5" r=".6" fill="currentColor" />
            <circle cx="12" cy="11.5" r=".6" fill="currentColor" />
            <circle cx="15.5" cy="11.5" r=".6" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* ---- type area ---- */}
      <div
        style={{
          maxHeight: typing ? 72 : 0,
          opacity: typing ? 1 : 0,
          transform: typing ? "translateY(0)" : "translateY(10px)",
          overflow: "hidden",
          transition: `max-height 340ms var(--ease), opacity 340ms var(--ease), transform 340ms var(--ease)`,
        }}
      >
        <div
          className="grad-aura"
          style={{ padding: 1, borderRadius: 999, boxShadow: "0 8px 26px rgba(80,140,245,0.22)" }}
        >
          <div
            className="flex items-center"
            style={{
              gap: 9, height: 50, borderRadius: 999, paddingLeft: 8, paddingRight: 7,
              background: "var(--glass-fill-heavy)",
              backdropFilter: "blur(20px) saturate(150%)",
              WebkitBackdropFilter: "blur(20px) saturate(150%)",
            }}
          >
            <button
              onClick={() => setTyping(false)}
              className="grid place-items-center shrink-0"
              style={{ width: 34, height: 34, borderRadius: 17, background: "rgba(29,29,31,0.05)" }}
              aria-label="Back to voice"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--gray)" strokeWidth="2">
                <rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4" />
              </svg>
            </button>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
              placeholder="Type your message…"
              enterKeyHint="send"
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: 14, letterSpacing: "-0.14px", color: "var(--ink)" }}
            />
            <button
              onClick={submit}
              disabled={!draft.trim()}
              className="grad-send grid place-items-center shrink-0"
              style={{
                width: 36, height: 36, borderRadius: 18,
                boxShadow: "0 4px 12px rgba(80,140,245,0.35)",
                opacity: draft.trim() ? 1 : 0.4,
              }}
              aria-label="Send"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
