# Nirog — where things stand

Everything from the planning conversation, moved here so the work and the
context live in one place. Written 18 Aug 2026, 16:10 IST.

**Deadline: 19 Aug 2026, 02:30 IST** (18 Aug, 17:00 US Eastern). About 10 hours
left. Freeze the code at 20:00 IST so there is time for the video and the
writeup, which always take longer than they look.

---

## What this is

**Nirog** — a care platform for rural India, entered into the
[CockroachDB × AWS Hackathon](https://cockroachdb-ai.devpost.com/). The theme is
agentic memory.

Two sides of one product, sharing one database.

| Route | Who it is for |
|---|---|
| `/` | Landing. Two cards: *I'm a patient*, *I'm a doctor*. No sign-in either way. |
| `/patient` | ARIA. Voice-first clinical intake with the 3D avatar. |
| `/patient/case` | The case file: recurrence, timeline, SBAR handover. |
| `/patient/doctors` | Who to call. |
| `/portal` | The clinician's workspace: queue, patients, consult, audit. |
| `/call/[room]` | Teleconsultation room. |

**Live:** https://nirog-memory.vercel.app
**Repo:** https://github.com/Shivang-creator/nirog (public, MIT)

---

## The one idea

ARIA already existed in the Nirog mobile app. Her backend is stateless: the whole
transcript is posted on every turn, so she has perfect recall inside one
conversation and none at all between them. Every visit starts with a stranger.

That is the gap this fills. Before she says hello, we read the patient's history
out of CockroachDB and hand her one line to open with.

The demo case, seeded as patient **Rahul**:

| When | What he said |
|---|---|
| 11 Jul | *"my lower back has been aching for a few days, worse in the mornings"* |
| 22 Jul | *"blocked nose and a bit of a cough, think I caught something"* |
| 2 Aug | *"I keep getting this pain when I stand up from my desk"* |
| 17 Aug | *"the ache is back again, it's been three weeks now"* |

Three of those are the same problem. The first two share no words at all, so no
search over the notes would ever connect them. The last one names no body part
at all: "back" there means *returned*.

The classifier correctly gives up on that fourth sentence. Memory resolves it,
by matching it to the July complaint at cosine distance 0.292 and filing it under
lower back. That is the whole product in one row.

---

## What works right now

- Landing, both entry points, no login needed anywhere
- ARIA renders on the web. Real 14 MB GLB, all 11 facial morphs, full bridge
- She reads the patient's history before greeting them and opens by naming it
- **Amazon Polly** gives her a voice: `Kajal`, en-IN neural, ~400 ms
- **Amazon Transcribe** streaming gives her ears: en-IN, PCM at 16 kHz
- Every turn is written back to CockroachDB with an embedding
- Recurrence detection, region inheritance, SBAR assembly
- Doctor portal runs on in-memory data with zero configuration
- Demo sign-in drops straight into the workspace
- **ARIA takes the whole history with nothing behind her.**
  `src/lib/clinical/interview.ts` asks the OLDCARTS slots in order, adapts the
  wording and the red-flag question to the body region, and fills the same
  intake the model path fills. No network, no key, no model.
- **166 offline tests**, 18 live-cluster checks, and `npm run walk`

## What does not work

**No clinical differential.** The interview is a fixed clinical questionnaire.
It collects a complete history and hands it over; it does not reason about
causes, and nothing on any screen claims otherwise.

`NEXT_PUBLIC_ARIA_API_URL` is still unset. It points at a teammate's Lambda
running gpt-oss-120b with RAG over 13,144 conditions, and when it arrives it
layers a real differential on top of the interview. **It is no longer a
blocker** — with the variable unset the conversation runs end to end on the
deterministic engine, which is the house pattern everywhere else in this repo.
If it does arrive, check the Lambda returns CORS headers for a browser origin;
on React Native that never mattered.

**Two bugs this uncovered, both fixed 18 Aug:** the CockroachDB complaint write
sat *below* the `isConfigured()` early return, so with no Lambda configured
nothing a patient said was ever written — the memory story was dead at N=1
while the seeded data still recalled perfectly. And the configured path
re-appended the user's turn to a history that already contained it, sending the
backend the same sentence twice.

**Bedrock is blocked.** Every model, every region, both APIs:

```
ValidationException: Operation not allowed
```

This is not IAM and not model access. The API reports
`entitlement=AVAILABLE, auth=NOT_AUTHORIZED`, the free-plan upgrade went
through, and the Model access page has been retired in favour of auto-enable on
first invoke. It is an account-level restriction and it probably needs AWS
Support.

**It does not block the submission.** The rules ask for at least one AWS
service. Polly and Transcribe both work and both are load-bearing, so the
requirement is met twice over. Bedrock would be nice, not necessary. Do not let
it eat the day.

---

## Architecture

```
        patient speaks
              │
   Amazon Transcribe (en-IN)  ──▶  text
              │
              ▼
   ┌────────────────────────────────────────────┐
   │  CockroachDB  (project-nirog, Mumbai)      │
   │                                            │
   │  complaint ── raw_text                     │
   │            ├─ body_region                  │
   │            ├─ region_source                │
   │            └─ embedding VECTOR(1024)       │
   │                                            │
   │  VECTOR INDEX (patient_id, embedding        │
   │                vector_cosine_ops)          │
   │  recall_event ── every query, incl. failed │
   └──────────┬─────────────────────────────────┘
              │  what they said before
              ▼
   ┌──────────────────────┐
   │  Deterministic core  │  region resolution
   │  (no model)          │  recurrence rule
   └──────────┬───────────┘  SBAR assembly
              │
              ▼
   ARIA says it out loud  ──  Amazon Polly (Kajal, en-IN)
              │
              ▼
   the doctor opens the same patient
```

### Two layers, kept apart

The embedding **finds** candidates. A fixed rule **decides** what they mean:
three or more separate visits naming one body region within ninety days.

It counts visits, not complaints. Three complaints in one appointment are one
presentation, and counting complaints would let a talkative patient trigger the
flag on their first visit. That is the kind of false alarm that teaches doctors
to ignore banners.

A doctor asking "why did you flag this?" gets a list of dates, not a similarity
score.

### When memory is unreachable

A failed lookup never returns an empty list. On screen, *"no prior complaints"*
and *"could not check"* both render as a chart with no warning on it, and a
doctor reads that absence as reassurance. The agent would have turned an
infrastructure failure into a clinical finding without anyone knowing.

Every read returns a `MemoryOutcome` carrying `degraded`, so it is impossible to
use the result without handling the case where memory was down. The UI goes
amber, the SBAR assessment reads `NOT ASSESSED`, and the event is written to
`recall_event.degraded`.

To see it: point `DATABASE_URL` at a dead host and reload. Verified.

---

## Decisions worth knowing

**The ARIA scene is byte-identical to the mobile app's.** `nurseHtml.ts` is
1,636 lines of working Three.js. Instead of editing it for a new host, the host
it expects is provided: `window.ReactNativeWebView` is shimmed to
`window.parent` and `NIROG_ARIA_API` points at `/api`. Nothing to keep in sync.

**She is mounted above the router.** The root layout also covers the landing and
the portal, and neither needs a 14 MB avatar holding a WebGL context, so she
lives in the patient layout. Navigating between patient screens hides her with
`visibility` rather than unmounting, so the scene and any in-flight speech
survive.

**No LLM in the clinical output.** An earlier plan had gpt-oss rewrite the SBAR
into prose. A model smoothing *"the ache is back again"* into *"recurrent lumbar
pain"* invents a claim the patient never made, and how somebody describes their
pain is itself information. Everything a doctor reads is assembled from rows.

**Cosine, not L2.** Titan does not guarantee unit-norm output, and under L2 a
long complaint sits far from a short one that means the same thing. Magnitude
tracks verbosity.

**`patient_id` as a prefix column.** Recall is always scoped to one patient, so
the index is partitioned that way. It is also a privacy property: a query that
cannot express "search everyone" cannot accidentally do it.

**The vector index is not chosen by the optimizer at demo scale, and that is
correct.** Scoped by patient there are four rows to read, and reading them beats
descending a C-SPANN tree. Loading 400 patients does not change it, because
recall is always per-patient. `npm run db:explain` prints both the planner's
choice and the same query with the index forced, showing identical results. No
index hint was added to production code. Making the demo look better by making
the software slower is not an engineering decision.

**Pre-existing code, which the rules require disclosing:** the ARIA scene and
`lib/aria.ts` come from the Nirog mobile app; the doctor portal comes from
`nirog-care-main`. Both are the team's own work. AI coding assistants are
explicitly permitted by the rules and need no disclosure; this does.

---

## Bugs found and fixed, in case they come back

- **Malformed patient id rendered "memory unreachable."** A bad UUID reached the
  driver, threw, and `withMemory` honestly reported it as a memory failure. So a
  typo produced the same red warning as a real outage, on the one panel a
  clinician has to trust. Bad ids are 404s now.
- **`embedding IS NOT NULL` was hiding a real bug.** The guard was redundant and
  it also made the index ineligible. Removing it exposed the problem underneath:
  `embedding <=> $vec` returns NULL for an unembedded complaint, `Number(null)`
  is `0`, and the mapping was ranking those as perfect matches at the top of a
  doctor's screen.
- **Supabase took the whole site down.** Clients were built eagerly behind
  non-null assertions, in edge middleware matching every route. Without keys the
  constructor threw before any page rendered, including the marketing landing.
  Auth that cannot be configured should degrade to "nobody is signed in".
- **Sign-in was impossible.** The form pre-fills demo credentials but posted them
  to a project that does not exist, returning "that email and password don't
  match our records" — which reads as a wrong password, not an absent backend.
- **The dock was wider than the screen.** Its grid column was implicitly `auto`,
  which sizes to the widest child, and the chip row is max-content by
  definition. It carried the mic and keyboard off the right edge.
- **403 synthetic patients buried the demo.** Anyone testing alone had to hunt
  for Rahul. Demo patients sit first now, filler folded away behind a
  disclosure.

---

## Environment

`.env.local`, not committed:

```
DATABASE_URL=postgresql://...cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
BEDROCK_EMBED_MODEL=amazon.titan-embed-text-v2:0

# missing, and the reason ARIA cannot talk back
NEXT_PUBLIC_ARIA_API_URL=
```

The same variables are set on Vercel for production and preview.

**Cluster:** `project-nirog`, CockroachDB v26.2.5, AWS Mumbai (ap-south-1).
Free trial, $400 credits, expires 17 Sep 2026.

**IAM user `nirog-memory`** holds Bedrock, Polly and Transcribe. It cannot read
service quotas or account details, so deeper AWS diagnosis needs
`ReadOnlyAccess` attached.

---

## Commands

```bash
npm run dev
npm test              # 135 offline tests, no credentials needed
npm run walk          # crawls the live product and reports anything broken
npm run verify        # checks CockroachDB and Bedrock connectivity
npm run test:e2e      # 18 checks against the real cluster
npm run db:migrate    # idempotent
npm run db:seed       # 3 demo patients
npm run db:volume     # ~400 synthetic patients, for realistic query plans
npm run db:explain    # the plan, the distances, the audit count
```

`npm run walk` is the useful one. It follows real links from the landing into
both sides, clicks what a person would click, and reports dead ends and console
errors. It found most of the bugs listed above.

---

## Where things live

| What | Where |
|---|---|
| Recurrence rule | `src/lib/clinical/recurrence.ts` |
| Region inheritance from memory | `src/lib/clinical/resolve.ts` |
| Graceful degradation | `src/lib/memory/degrade.ts` |
| Vector search | `src/lib/memory/recall.ts` |
| Schema and index | `src/lib/memory/schema.sql` |
| Embedding backends | `src/lib/ai/embed.ts` |
| ARIA scene (from the app) | `src/lib/aria/nurseHtml.ts` |
| ARIA bridge | `src/components/aria/` |
| Patient home | `src/components/nirog/Home.tsx` |
| Polly | `src/app/api/speak/route.ts` |
| Transcribe | `src/app/api/transcribe/route.ts` |
| Memory API | `src/app/api/memory/` |

If you change `RECALL_THRESHOLD` (0.55) or `INHERIT_THRESHOLD` (0.40), a test
will fail first. That is deliberate. Read what it was protecting before updating
it.

---

## What is left

1. **Get the ARIA Lambda URL from the teammate.** Everything else is polish.
2. Wire the doctor's patient view to read the same CockroachDB memory, so what
   ARIA hears appears in the clinician's chart. This is the link that makes it
   one product instead of two.
3. Record the video. Under three minutes, and it has to show the memory layer
   working, not just the app.
4. Write the Devpost entry. Two required fields: which CockroachDB tools were
   used and how, which AWS services and how.

### For the video

The strongest twenty seconds is the degraded state. Point `DATABASE_URL` at a
dead host and reload the chart. It does not say "no history found", it says it
could not check, and it tells you not to read the missing flag as reassurance.
Do not cut that for time.

Open Meera for five seconds too. She has one complaint and comes back clean. A
tool that only ever finds patterns is not detecting anything, and every example
being a hit is the thing judges notice.

Check the deploy from a signed-out browser before submitting. Vercel turns on
deployment protection by default and it has hidden live sites from judges
before.
