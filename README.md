# Anamnesis

**Has this patient told us this before?**

*Anamnesis* is the clinical term for taking a patient's history. It is also the
Greek word for recollection. That double meaning is the product.

Built for the [CockroachDB × AWS Hackathon](https://cockroachdb-ai.devpost.com/)
— agents that remember.

---

## The problem

In July a patient says:

> *"my lower back has been aching for a few days"*

Three weeks later, to a different clinician:

> *"I keep getting this pain when I stand up from my desk"*

Six weeks after that:

> *"the ache is back again"*

Three presentations of one problem. The first two sentences share **no words at
all**, so no search over the notes will ever connect them. The third names no
body part — "back" there means *returned*, not lumbar.

The recurrence is the diagnostic signal, and it is invisible precisely because
patients never repeat themselves verbatim. That is not a search problem. It is a
memory problem.

## What it does

1. **Remembers.** Every complaint is stored in the patient's own words, with its
   embedding written to the same row in the same statement.
2. **Connects.** Vector search finds what the patient said before, however
   differently they worded it — and can supply a body region a new complaint
   never named.
3. **Flags.** A fixed arithmetic rule decides whether a pattern is worth
   interrupting a doctor for. No model makes that call.
4. **Says when it cannot.** A failed lookup never renders as a clean chart.

---

## Quickstart

```bash
npm install
cp .env.example .env.local     # add your CockroachDB connection string
npm run db:migrate             # apply schema (idempotent)
npm run db:seed                # 3 demo patients
npm run dev                    # http://localhost:3000
```

`DATABASE_URL` is the only variable required to run. AWS credentials are
optional — see [Running without AWS](#running-without-aws).

```bash
npm test                       # 122 tests, offline, ~0.4s
npm run db:volume              # load a realistic clinic (~400 patients)
npm run db:explain             # query plans, distances, audit counts
```

---

## CockroachDB tools used

The hackathon requires at least two. This project uses **three**.

### 1. Distributed Vector Indexing

The recall path itself. Embeddings live in the `complaint` table alongside the
text they describe — no separate vector store, no ETL, and no window in which a
complaint exists but is not yet searchable. That last property matters more than
it looks: an agent cannot tell the difference between *"not indexed yet"* and
*"never happened"*.

```sql
CREATE VECTOR INDEX complaint_embedding_idx
  ON complaint (patient_id, embedding vector_cosine_ops);
```

Two deliberate choices:

**Cosine, not L2.** Titan does not guarantee unit-norm output, and under L2 a
long complaint sits "far" from a short one that means the same thing — magnitude
tracks verbosity, not meaning.

**`patient_id` as a prefix column.** Every recall is scoped to one patient, so
the index is partitioned by patient and a lookup searches only that person's
vectors. Recall latency is governed by one patient's history rather than by the
size of the whole clinic. It is also a privacy property: a query that cannot
express *"search everyone"* cannot accidentally do it.

```
• top-k
│ order: +distance
│ k: 5
└── • lookup join
    └── • vector search
          table: complaint@complaint_embedding_idx
          target count: 5
          prefix spans: [/'<patient-uuid>' - /'<patient-uuid>']
```

**And an honest note about that plan.** The index is real, built, and returns
correct results — but on the demo data CockroachDB's optimizer does not choose
it, and it is right not to. Scoped by `patient_id` there are only a handful of
rows to read, and reading them beats descending a C-SPANN tree. Loading ~400
patients with `npm run db:volume` does not change that, because recall is always
scoped to one patient.

The index earns its place on a patient whose history is long enough that scanning
it stops being free, or on a cross-patient search this product deliberately does
not perform.

`npm run db:explain` prints **both** plans — the one the planner picks, and the
same query with the index forced — showing identical rows and distances either
way. We did not add an index hint to the production query. Making the demo look
better by making the software slower is not an engineering decision.

### 2. Managed MCP Server

Connected to Claude Code during development via the config snippet from the
Cloud Console:

```bash
claude mcp add cockroachdb-cloud https://cockroachlabs.cloud/mcp \
  --transport http --header "mcp-cluster-id: <cluster-id>"
```

Used to inspect the live schema, check index definitions with `SHOW CREATE
TABLE`, and read query plans while iterating on the recall query — read-only,
against the real cluster, with no custom proxy.

That loop produced two real corrections.

**The index definition.** The vector index was first created on `(embedding)`
alone. Reading the plan through MCP showed the `patient_id` filter being applied
*after* the vector search rather than scoping it — the search was ranging over
every patient's vectors and then throwing away all but one person's. Adding
`patient_id` as a prefix column turned that into a `prefix spans:` entry in the
plan.

**A guard that was hiding a bug.** The recall query carried
`AND embedding IS NOT NULL`. It was redundant — the index contains only rows with
embeddings — and it also made the index ineligible for consideration. Removing it
exposed the real problem underneath: `embedding <=> $vec` returns NULL for an
unembedded complaint, `Number(null)` is `0`, and the mapping was therefore
ranking complaints with *no vector at all* as perfect matches, at the top of a
doctor's screen. The guard had been concealing it. `tests/recall-mapping.test.ts`
now pins the behaviour.

### 3. ccloud CLI

Used to confirm cluster topology and version from the terminal:

```bash
ccloud cluster list -o json
```

---

## AWS services used

### Amazon Bedrock — Titan Text Embeddings V2

`amazon.titan-embed-text-v2:0`, 1024 dimensions, `normalize: true`. It produces
every vector in the recall path, and it is the only model in the system.

Region `us-west-2`. Credentials are read from the environment and never
committed.

### Why there is no LLM in the clinical output

An earlier plan had gpt-oss-120b rewriting the SBAR handover into prose. It was
cut, and the reason is worth stating rather than quietly dropping.

Every line of the handover is either something the patient actually said or the
output of a rule you can check by hand. A language model rewriting that text
could smooth *"the ache is back again"* into *"the patient reports recurrent
lumbar pain"* — which is a paraphrase, an interpretation, and a small clinical
claim the patient never made. How somebody describes their pain is itself
information, and a handover that launders it into medical register has destroyed
the thing it was carrying.

So the generative model earns no place here. Bedrock does the one job that cannot
be done by arithmetic — turning language into a vector so that two different
sentences can be recognised as one complaint — and the parts a doctor reads are
assembled deterministically from rows.

Using more of a sponsor's product than the problem needs would score better and
build worse.

---

## Architecture

```
        patient's words
              │
              ▼
   ┌──────────────────────┐
   │  Amazon Bedrock      │   Titan Text Embeddings V2
   │  (embedding)         │   1024-dim, normalized
   └──────────┬───────────┘
              │  vector
              ▼
   ┌────────────────────────────────────────────┐
   │  CockroachDB  (Mumbai, ap-south-1)         │
   │                                            │
   │  complaint ── raw_text                     │
   │            ├─ body_region                  │
   │            ├─ region_source                │
   │            └─ embedding VECTOR(1024)       │
   │                                            │
   │  VECTOR INDEX (patient_id, embedding       │
   │                vector_cosine_ops)          │
   │                                            │
   │  recall_event ── every query, incl. failed │
   └──────────┬─────────────────────────────────┘
              │  matches + distances
              ▼
   ┌──────────────────────┐
   │  Deterministic core  │   region resolution
   │  (no model)          │   recurrence rule
   └──────────┬───────────┘   SBAR assembly
              │
              ▼
          doctor view
```

### Two layers, kept apart

| Layer | Job | Can it be wrong? |
|---|---|---|
| **AI** | *find* candidates, *phrase* prose | Yes — so it never decides |
| **Deterministic core** | *decide* what counts as a recurrence | No — pure functions, 122 tests |

No model decides whether a recurrence exists. The rule is arithmetic: **3 or more
separate visits naming one body region within 90 days**. A doctor asking "why did
you flag this?" gets a list of dates, not a similarity score.

It counts **visits, not complaints**: three complaints logged in one appointment
are one presentation, and counting complaints would let a talkative patient
trigger the flag on their first visit — the kind of false alarm that teaches
doctors to ignore banners.

### Memory resolves what words cannot

`"the ache is back again"` names no body part. Read alone it is unclassifiable.
Read against what this patient said six weeks ago it is obviously lumbar.

```
17 Aug ↰ [lower_back]  "the ache is back again, it's been three weeks now"
         No region named — inherited from
         "my lower back has been aching for a few days" (distance 0.292)
```

Inheritance requires distance ≤ **0.40**, stricter than the 0.55 used to *show* a
match. The bar for acting on a match is higher than the bar for displaying it,
and the chart shows every inheritance and its source so a clinician can overrule
it.

---

## When memory is unreachable

The hackathon's own framing:

> *"An agent whose memory goes offline doesn't degrade gracefully, it stops."*

The obvious implementation of a failed lookup is to return an empty list. It is
also the dangerous one. On screen, *"no prior complaints found"* and *"could not
check for prior complaints"* render identically — a chart with no recurrence
banner. A doctor reads that absence as reassurance. The agent will have converted
an infrastructure failure into a clinical finding, silently, and nobody in the
room will know it happened.

So a failed recall here is never empty:

```ts
export interface MemoryOutcome<T> {
  ok: boolean;
  value: T;
  degraded: boolean;      // callers cannot ignore this
  reason?: string;
  latencyMs: number;
}
```

Every read returns this type, so it is impossible to consume a result without
handling the case where memory was down. The UI renders amber instead of green,
the SBAR assessment reads `NOT ASSESSED` rather than `no pattern found`, and the
event is written to `recall_event.degraded` for audit.

**To see it:** point `DATABASE_URL` at an unreachable host and reload `/doctor`.
The page renders, says what it does not know, and tells you what not to conclude.

---

## Running without AWS

Every vector in this project comes from one of two backends:

| Provider string | What it is |
|---|---|
| `bedrock:amazon.titan-embed-text-v2:0` | Titan Text Embeddings V2 |
| `offline:lexical-v1` | a deterministic lexical embedder, 1024-dim |

The offline backend exists so the app builds, seeds, runs and passes its entire
test suite with no cloud access. It is a hand-written concept lexicon doing a
crude imitation of what a real embedding model learns — good enough to
demonstrate the mechanism, nowhere near good enough to ship as the real recall
path.

**It never pretends to be Titan.** Whichever backend produced a vector is written
to `complaint.embed_model` and `recall_event.embed_provider` on every row, and
shown in the UI. If a screenshot in this repo was produced without Bedrock, the
provenance is in the database.

`embedderFromEnv()` selects Bedrock whenever a full AWS key is present and never
silently downgrades — quietly substituting a lesser model for a configured one is
how a system ends up lying about its own capabilities. `resilientEmbedder()`
wraps it for the seed and intake paths, where a mid-run Bedrock failure falls
back loudly and records which vectors are real.

---

## Tests

```
122 tests · offline · deterministic · ~0.4s
```

| File | Covers |
|---|---|
| `regions.test.ts` | lexicon, negation, code-switching, whole-word matching |
| `recurrence.test.ts` | window boundaries, visits-not-complaints, negative cases |
| `resolve.test.ts` | region inheritance, both thresholds, refusal to guess |
| `embed.test.ts` | determinism, the three demo sentences, backend selection |
| `degrade.test.ts` | timeouts, failure paths, the exact wording of the notice |
| `sbar.test.ts` | handover assembly, refusal to diagnose, degraded output |
| `recall-mapping.test.ts` | null distances, threshold boundaries |

Nothing in the suite touches CockroachDB, Bedrock or the network. A test that
needs a credential to pass is testing the wrong thing.

One test proves the naive approach genuinely fails, rather than asserting it:

```ts
it("would not be found by keyword overlap", () => {
  const shared = [...words(visit1)].filter((w) => words(visit2).has(w));
  expect(shared).toHaveLength(0);
});
```

The demo data includes two negative controls — a patient with one complaint and
a patient at the "watch" threshold — because a tool that only ever finds patterns
is not detecting anything.

---

## Honest limits

- **It does not diagnose and is not a medical device.** It reports that a pattern
  exists in a record. The cause is not assessed.
- **The lexicon is English-first.** It covers some Hindi terms because patients
  code-switch, but a complaint written entirely in another language lands in
  *unclassified* and counts toward nothing.
- **Region inheritance can be wrong.** If a patient's two conditions are described
  in similar language, an elliptical follow-up could attach to the wrong one. The
  chart shows every inheritance so it can be overruled — but it is a real failure
  mode, not a hypothetical one.
- **The thresholds are asserted, not validated.** 0.55 and 0.40 were tuned against
  a handful of sentences, not a clinical corpus. "Three visits in ninety days" is
  a defensible starting point, not a guideline this project can establish.
- **A complaint recorded while embedding was down is invisible to semantic
  recall** until re-embedded. It still counts toward recurrence, because
  recurrence reads the record rather than the index — but it will not surface as
  a match. The chart marks those rows.
- **At small scale the optimizer correctly ignores the vector index.** On seven
  rows a full scan is cheaper than probing a tree. `npm run db:volume` loads a
  realistic clinic so the plan reflects use rather than a demo.

---

## Layout

```
src/
  lib/
    clinical/     regions.ts · recurrence.ts · resolve.ts · sbar.ts
    memory/       schema.sql · db.ts · degrade.ts · recall.ts · queries.ts
    ai/           embed.ts
  app/            / · /intake · /doctor · /doctor/[id] · /method
scripts/          migrate · seed · seed-volume · explain
tests/            122 tests
```

## Licence

MIT — see [LICENSE](./LICENSE).
