# Anamnesis — build plan

**Deadline: 19 Aug 2026, 02:30 IST** (= 18 Aug, 17:00 ET). Code freeze 20:00 IST 18 Aug.

*Anamnesis* is the clinical term for taking a patient's history. It is also the Greek
word for recollection. That double meaning is the product.

---

## The one question

> **Has this patient told us this before?**

Not "what's wrong with them" — that's diagnosis, and no hackathon project should
pretend to do it. The question is narrower and answerable: *have these words been
said in this room before, in different words?*

## Why it matters

A patient says "my lower back has been aching" in July. In August they say "I keep
getting this pain when I stand up." In September, "it's back again."

Three presentations of one problem. To a doctor with five minutes and a paper chart,
they are three unrelated visits, because **keyword search cannot connect them** —
they share almost no words. The recurrence is the diagnostic signal, and it is
invisible precisely because patients don't repeat themselves verbatim.

That is a memory problem, which is what this hackathon is about.

## Architecture — two layers

Validated across four previous builds: deterministic core, AI on top.

| Layer | What it does | Can it be wrong? |
|---|---|---|
| **Deterministic core** | body-region classification, recurrence rule, timeline assembly | No — pure functions, same input → same output, fully tested offline |
| **AI layer** | Titan embeddings for semantic recall, gpt-oss for SBAR prose | Yes — so it never *decides* anything, it only *finds* and *phrases* |

**No model decides whether a recurrence exists.** The rule is arithmetic: ≥3 complaints
in one body region inside 90 days. The embedding's only job is to *surface candidates*;
the flag itself is deterministic and checkable by hand.

## CockroachDB as the memory layer

Vector and transactional data live in **the same table** — no ETL, no separate vector
store, no consistency gap. This is the sponsor's stated differentiator, so we lean on it.

```sql
complaint (
  id, patient_id, visit_id,
  raw_text,                  -- exactly what the patient said
  body_region,               -- deterministic classification
  embedding VECTOR(1024),    -- Titan Text Embeddings V2
  ...
  VECTOR INDEX (embedding vector_cosine_ops)   -- C-SPANN, verified in use
)
```

Verified against the live cluster (v26.2.5):

```
• vector search
    table: complaint@complaint_embedding_idx
    target count: 5
```

The planner uses the distributed vector index — this is not a brute-force scan, and
the EXPLAIN goes in the README.

### Tools claimed (≥2 required)

1. **Managed MCP Server** — connected to Claude Code, used to inspect schema and
   validate queries during development
2. **Distributed Vector Indexing** — the recall path itself
3. *(bonus)* **ccloud CLI** — JSON cluster output in the README

## AWS (≥1 required — mandatory for validity)

- **Amazon Bedrock** — Titan Text Embeddings V2 (recall), gpt-oss-120b (SBAR prose)

Both sit behind interfaces with deterministic fallbacks, so the app builds, runs and
passes its whole test suite with no AWS access. Swapping in a real key is one env var.

## The Production Readiness beat — memory that dies on camera

The hackathon's own framing:

> *"An agent whose memory goes offline doesn't degrade gracefully, it stops."*

So we demonstrate the opposite, live. `withMemory()` wraps every recall with a timeout.
When the database is unreachable the agent does **not** silently return "no history
found" — that would be a clinical lie, because absence of evidence would read as
evidence of absence. It says:

> *"I can't reach this patient's history right now. Treating this as a first
> presentation — do not read the absence of a recurrence flag as a negative finding."*

Every degradation is written to `recall_event.degraded`, so it is auditable after
the fact rather than invisible.

**On camera we kill the connection mid-demo.** Prove by attack, not by assertion.

## Pages

| Route | Purpose |
|---|---|
| `/` | the one question, stated plainly |
| `/intake` | patient describes a symptom in their own words → embed → recall → show what memory found |
| `/doctor` | patient list |
| `/doctor/[id]` | **the money shot** — recurrence flag, timeline, SBAR handover |
| `/method` | how it works, what it can't do, honest limits |

No video call. It scores on zero of the five criteria, needs a second human to
demonstrate, and judges test alone.

## Demo data

**Anita R., 34** — three lumbar complaints across six weeks, worded differently each
time, plus a family-history detail (father, disc surgery at 40).

**Negative controls that must NOT flag:**
- a one-off headache
- a patient with a single complaint

The tool has to be allowed to say *"no recurrence found"*, or it isn't measuring
anything — it's agreeing with itself.

## Test target

60–90 tests, all offline, all deterministic, no network. Region classification,
recurrence window boundaries, negative cases, degradation behaviour, embedding
determinism.

## Build order

1. ~~Verify cluster + vector index~~ ✅ done
2. Schema + migration
3. Deterministic core (regions → recurrence → SBAR) + tests
4. Embedding interface (Bedrock + offline fallback)
5. DB layer + recall query + degradation wrapper
6. Seed data
7. UI
8. README, LICENSE, architecture diagram

## Handover at 09:00

- `.env.local` needs `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` from the teammate
- If his key fails: upgrading the AWS plan on Shivang's own account takes 60 seconds
  and the $100 credits cover it — **do not let this block the submission**
- Everything else runs offline
