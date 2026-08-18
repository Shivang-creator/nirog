/**
 * ARIA — the clinical intake assistant backend.
 *
 * Talks to a Lambda (behind a Function URL) that runs openai.gpt-oss-120b on Amazon Bedrock with
 * RAG over a 13,144-condition disease knowledge base. AWS credentials live only in the Lambda's
 * execution role — nothing secret is shipped in the app, so this module is safe to OTA-update.
 *
 * The backend is stateless: we post the whole conversation each turn and it replays the tool calls
 * to rebuild the case state. That means the case can never silently drift out of sync with the
 * transcript, and there is no session to expire mid-consultation.
 */

const BASE = (process.env.NEXT_PUBLIC_ARIA_API_URL ?? '').trim().replace(/\/$/, '');

export interface Turn {
  role: 'user' | 'assistant';
  text: string;
}

export interface Profile {
  name?: string;
  age?: string | number;
  sex?: string;
  conditions?: string;
}

export interface Candidate {
  id: string;
  name: string;
  source: string;
  symptoms: string;
  score: number;
}

export interface RedFlag {
  id: string;
  label: string;
  advice: string;
}

/** OLDCARTS / history slots, keyed by slot name -> the findings recorded against it. */
export type Intake = Record<string, string[]>;

export interface ChatResult {
  reply: string;
  intake: Intake;
  candidates: Candidate[];
  complete: boolean;
  summary: string | null;
  redFlag: boolean;
  flags: RedFlag[];
  /** `intake` while she is still interviewing; `qa` once the summary is written. */
  phase: 'intake' | 'qa';
  /** How many questions she has left in her budget. */
  questionsLeft: number;
}

export interface Handover {
  situation: {
    chief_complaint: string;
    duration?: string;
    severity?: string;
    summary: string;
  };
  background: {
    history_of_presenting_complaint: string[];
    associated_symptoms?: string[];
    past_medical_history?: string[];
    medications?: string[];
    allergies?: string[];
    family_social_history?: string[];
  };
  assessment: {
    candidate_conditions: {
      condition: string;
      rationale: string;
      supporting_symptoms?: string[];
      evidence_id?: string;
      evidence_source?: string;
      match_score?: number;
    }[];
    red_flags: string[];
    not_established: string[];
  };
  recommendation: {
    triage_level: 'emergency' | 'urgent' | 'routine' | 'self_care';
    triage_rationale: string;
    suggested_investigations?: string[];
    questions_for_clinician?: string[];
  };
  meta: {
    generated_at: string;
    generated_by: string;
    knowledge_base: string;
    disclaimer: string;
  };
}

export const isConfigured = () => BASE.length > 0;

async function post<T>(path: string, body: unknown, timeoutMs = 45000): Promise<T> {
  if (!BASE) throw new Error('NEXT_PUBLIC_ARIA_API_URL is not set');

  // React Native's fetch has no default timeout — a hung request would leave the avatar silent
  // forever, so we bound it ourselves.
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: abort.signal,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(
        (json as { error?: string }).error ?? `ARIA ${path} failed (${res.status})`,
      );
    return json as T;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * One conversational turn. Pass the FULL history including the message just typed, plus the case
 * state from the previous turn.
 *
 * The intake/candidates round-trip is load-bearing, not an optimisation. The transcript is plain
 * text, so ARIA's earlier `record_finding` tool calls aren't in it — without carrying the case state
 * back she has no memory of what she already established and will loop on the same question.
 */
export function chat(
  history: Turn[],
  profile: Profile = {},
  intake: Intake = {},
  candidates: Candidate[] = [],
  complete = false
) {
  return post<ChatResult>('/chat', { history, profile, intake, candidates, complete });
}

/**
 * Transcribe a recorded clip. Runs mistral.voxtral-mini on Bedrock — see lib/voice.ts for why the
 * microphone does not use the ElevenLabs key that is already in the app.
 */
export async function transcribeAudio(audioBase64: string, format = 'm4a') {
  const res = await post<{ text: string }>('/transcribe', { audio: audioBase64, format }, 60000);
  return res.text ?? '';
}

/** Generate the SBAR clinical handover document for a doctor to verify. */
export function handover(args: {
  history: Turn[];
  intake: Intake;
  candidates: Candidate[];
  profile?: Profile;
  flags?: RedFlag[];
}) {
  return post<Handover>('/handover', args, 90000);
}

export async function health() {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}/health`);
    return await res.json();
  } catch {
    return null;
  }
}
