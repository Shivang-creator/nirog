# Handover — morning of 18 Aug

**Deadline: 19 Aug 2026, 02:30 IST** (= 18 Aug, 17:00 US Eastern).
Devpost closes hard. Aim to submit by **00:00 IST** and treat **20:00 IST** as
code freeze — the video and the writeup take longer than anyone expects.

---

## State as of 03:00 IST

Working and verified against the live cluster:

- ✅ Schema applied to `project-nirog` (CockroachDB v26.2.5, Mumbai)
- ✅ Vector index `complaint_embedding_idx` with `patient_id` prefix
- ✅ 113 tests passing, offline, ~0.4s
- ✅ `next build` clean
- ✅ All four routes render: `/`, `/intake`, `/doctor`, `/doctor/[id]`, `/method`
- ✅ Demo data seeded — recurrence fires on Anita, both negative controls behave
- ✅ Volume data (~400 patients) so the query plan reflects real use
- ✅ README, LICENSE (MIT), `.env.example`

Not done:

- ⬜ **Real Bedrock embeddings** — blocked, see below. This is the one thing that
  needs a human.
- ⬜ Deploy to Vercel
- ⬜ Video
- ⬜ Devpost writeup

---

## 1. The one blocking task: AWS

**The submission is invalid without an AWS service.** From the official rules:
*"Your Project MUST use at least 1 of these AWS Services."* This is not a bonus
category.

### What is wrong

Shivang's AWS account (`shiv_creator`, 089475198632) is on the **AWS Free Plan**,
which blocks Bedrock inference entirely. Verified by testing 3 models × 3 regions
× 2 APIs — every single call returns:

```
ValidationException: Operation not allowed
```

The credentials themselves are fine (STS confirms the IAM user, and
`ListFoundationModels` works). It is a plan restriction, not a permissions or
region problem.

### Two ways to fix it, either works

**Option A — use the teammate's AWS key.** He set up Bedrock for the original
Nirog backend, so his account already has model access. Put his credentials in
`.env.local`:

```
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

**Option B — upgrade Shivang's plan.** Billing → the orange **Upgrade plan**
button. Takes about a minute, the $100 credits carry over, and total project cost
is roughly $0.40.

### Then re-seed so the vectors are real

```bash
npm run verify      # confirms Bedrock answers before you spend time
npm run db:seed     # re-embeds the 3 demo patients with Titan
```

`npm run verify` prints exactly which models work. If it fails, the message tells
you why — don't guess.

**Important:** the app works *right now* without this, using a deterministic
offline embedder. Every row records which backend produced it
(`complaint.embed_model`), so nothing lies. But the submission needs real Bedrock
calls to satisfy the AWS requirement, so this is the priority.

---

## 2. Deploy to Vercel

```bash
npx vercel --prod
```

Add the environment variables in the Vercel dashboard: `DATABASE_URL`,
`AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`,
`BEDROCK_EMBED_MODEL`, `BEDROCK_CHAT_MODEL`.

> **Check this or the demo is invisible to judges.** Vercel turns on
> **Deployment Protection** by default on team accounts, which puts an SSO login
> in front of the site. Judges will see a login wall and score a zero.
>
> Project → Settings → **Deployment Protection** → set to **Disabled**.
> Then open the URL in a private window and confirm it loads with no login.

---

## 3. Push to GitHub

The repo must be **public** with a **detectable licence** — the rules say it has
to show in the About panel on the repo page. `LICENSE` (MIT) is already committed,
so GitHub will pick it up automatically.

```bash
gh repo create nirog-memory --public --source=. --push
```

Check `.env.local` is not in the commit. It is gitignored (`.env*`), but look
anyway before pushing.

---

## 4. The video (< 3 minutes, hard limit)

The rules require footage that shows **the CockroachDB memory layer at work** —
not just the app. So put the database on screen.

Suggested beats:

| Time | Beat |
|---|---|
| 0:00 | The three sentences. Read them aloud. *"Same problem. No shared words."* |
| 0:30 | `/doctor/anita` — the recurrence flag, the three quotes, the dates |
| 1:00 | Point at the inherited row: *"this one names no body part — 'back' means returned. The region came from memory."* |
| 1:30 | `npm run db:explain` in a terminal — the `• vector search` node and the prefix span |
| 2:10 | **Kill the database.** Change `DATABASE_URL` to a dead host, reload `/doctor`. Show the amber panel |
| 2:40 | *"It doesn't say no history found. It says it couldn't check, and tells you not to read that as reassurance."* |

That last beat is the strongest thing in the project and it is 20 seconds. Do not
cut it for time.

**Do not skip the negative controls.** Open Rahul (no recurrence) for five
seconds. A tool that only ever finds patterns isn't detecting anything, and
judges notice when every example is a hit.

---

## 5. Devpost fields

Two required fields people forget:

- **"Identify which CockroachDB tools you used and how"** — MCP Server,
  Distributed Vector Indexing, ccloud CLI. The README has the exact wording for
  each; the MCP answer should mention the `embedding IS NOT NULL` plan fix,
  because it shows the tool actually did something.
- **"Identify which AWS Services you used and how"** — Bedrock: Titan Text
  Embeddings V2 for the recall path, gpt-oss-120b kept consistent with the
  existing Nirog backend.

Attach the architecture diagram from the README (it is plain ASCII, screenshots
fine).

---

## Commands

```bash
npm install
npm test              # 113 tests, no credentials needed
npm run dev

npm run verify        # check CockroachDB + Bedrock connectivity
npm run db:migrate    # idempotent, safe to re-run
npm run db:seed       # 3 demo patients
npm run db:volume     # ~400 synthetic patients for realistic query plans
npm run db:explain    # evidence: the plan, the distances, the audit count
```

---

## Where things live

| What | Where |
|---|---|
| The recurrence rule | `src/lib/clinical/recurrence.ts` |
| Region inheritance from memory | `src/lib/clinical/resolve.ts` |
| Graceful degradation | `src/lib/memory/degrade.ts` |
| The vector search | `src/lib/memory/recall.ts` |
| Schema + index | `src/lib/memory/schema.sql` |
| Embedding backends | `src/lib/ai/embed.ts` |
| Doctor chart (the money shot) | `src/app/doctor/[id]/page.tsx` |

## If you change the thresholds

`RECALL_THRESHOLD` (0.55) and `INHERIT_THRESHOLD` (0.40) are both asserted in
tests. Changing either breaks a test before it can change a diagnosis — that is
deliberate. If a test fails after you tune one, read what it was protecting
before you update it.
