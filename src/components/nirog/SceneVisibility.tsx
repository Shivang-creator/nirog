"use client";

import { useEffect } from "react";
import { useAriaContext } from "@/components/aria/AriaProvider";

/**
 * Hides ARIA without unmounting her.
 *
 * The case file and the doctor list are documents — reading them over a
 * full-bleed portrait of somebody's face is unusable. But tearing the scene
 * down to get it out of the way would refetch a 14 MB avatar on the way back
 * and cut her off mid-sentence, so the provider only toggles `visibility` and
 * the WebGL context and any in-flight speech survive the trip.
 */
export function HideScene() {
  const { setVisible } = useAriaContext();
  useEffect(() => {
    setVisible(false);
    return () => setVisible(true);
  }, [setVisible]);
  return null;
}
