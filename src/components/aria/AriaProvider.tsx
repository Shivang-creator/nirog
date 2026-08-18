"use client";

/**
 * Mounts ARIA once, for the life of the tab.
 *
 * In the mobile app every tab stays mounted, so the 3D scene simply persists.
 * The App Router unmounts on navigation, which would reboot Three.js, refetch a
 * 14 MB avatar and cut her off mid-sentence every time someone opened their case
 * file. So the scene lives here, above the router, and screens show or hide it
 * rather than creating it.
 *
 * Hidden means `visibility: hidden`, never `display: none` or unmounting — a
 * hidden iframe keeps its WebGL context and its audio; a removed one does not.
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAria } from "./useAria";

type AriaApi = ReturnType<typeof useAria> & {
  /** Show or hide the scene without tearing it down. */
  setVisible: (v: boolean) => void;
  visible: boolean;
  /** True once the user has interacted, which is what unlocks audio. */
  unlocked: boolean;
  unlock: () => void;
};

const Ctx = createContext<AriaApi | null>(null);

export function useAriaContext(): AriaApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAriaContext must be used inside <AriaProvider>");
  return v;
}

export function AriaProvider({ children }: { children: React.ReactNode }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const aria = useAria(iframeRef);
  const [visible, setVisible] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  /*
   * Browsers block audio until a real gesture, exactly as mobile WebViews do.
   * The scene greets itself when it can and otherwise waits for a tap, so all
   * we have to do is make sure a tap anywhere in the page counts.
   */
  useEffect(() => {
    if (unlocked) return;
    const unlock = () => setUnlocked(true);
    const opts = { once: true, passive: true } as const;
    window.addEventListener("pointerdown", unlock, opts);
    window.addEventListener("keydown", unlock, opts);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [unlocked]);

  const api = useMemo<AriaApi>(
    () => ({
      ...aria,
      visible,
      setVisible,
      unlocked,
      unlock: () => setUnlocked(true),
    }),
    [aria, visible, unlocked],
  );

  return (
    <Ctx.Provider value={api}>
      {/*
        Fixed and behind everything. The scene paints its own clear colour
        (#DBE7F9) edge to edge, so there is no page background showing through
        and no seam at the boundary.
      */}
      <div
        aria-hidden
        className="fixed inset-0 z-0"
        style={{
          visibility: visible ? "visible" : "hidden",
          background: "var(--scene)",
        }}
      >
        <iframe
          ref={iframeRef}
          src="/aria/scene"
          title="ARIA"
          // The scene needs the microphone, and it is same-origin so it can be
          // driven by direct calls rather than postMessage.
          allow="microphone; autoplay"
          className="w-full h-full border-0 block"
        />
      </div>

      <div className="relative z-10">{children}</div>
    </Ctx.Provider>
  );
}
