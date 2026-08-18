"use client";

/**
 * The live consultation, shared across tabs.
 *
 * The chat lives on the home screen but the case file (intake checklist, candidate conditions,
 * handover) lives on the symptom tab, so this state cannot belong to either screen. It is a tiny
 * external store rather than a Context because both tabs stay mounted in the tab navigator and a
 * Context provider high enough to cover both would re-render the 3D avatar's host view on every
 * keystroke.
 */
import { useSyncExternalStore } from 'react';
import type { Candidate, Handover, Intake, RedFlag, Turn } from './aria';

export interface CaseState {
  history: Turn[];
  intake: Intake;
  candidates: Candidate[];
  flags: RedFlag[];
  redFlag: boolean;
  complete: boolean;
  summary: string | null;
  handover: Handover | null;
  thinking: boolean;
  error: string | null;
}

const EMPTY: CaseState = {
  history: [],
  intake: {},
  candidates: [],
  flags: [],
  redFlag: false,
  complete: false,
  summary: null,
  handover: null,
  thinking: false,
  error: null,
};

let state: CaseState = EMPTY;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export function setCase(patch: Partial<CaseState>) {
  state = { ...state, ...patch };
  emit();
}

export function appendTurn(turn: Turn) {
  state = { ...state, history: [...state.history, turn] };
  emit();
}

export function resetCase() {
  state = EMPTY;
  emit();
}

export const getCase = () => state;

export function useCase(): CaseState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getCase,
    getCase
  );
}
