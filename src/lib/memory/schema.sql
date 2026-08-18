-- Nirog — agent memory schema
--
-- One design decision drives this whole file: the embedding lives in the same table
-- as the complaint it belongs to. Not a sidecar table, not a separate vector store.
--
-- A complaint and its embedding are written in one statement, so they cannot disagree.
-- There is no ETL step to fall behind and no window where a complaint exists but is
-- not yet searchable. For agent memory that property matters more than it looks:
-- a memory that is "eventually" searchable is a memory that is intermittently absent,
-- and an agent cannot tell the difference between "not there yet" and "never happened".

CREATE TABLE IF NOT EXISTS patient (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          STRING NOT NULL,
  year_of_birth INT NOT NULL,
  sex           STRING NOT NULL,
  -- Family history is one free-text line. It earns its place because it is the
  -- detail that turns a recurrence flag into a reason to act.
  family_history STRING,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visit (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  channel     STRING NOT NULL DEFAULT 'app',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS visit_patient_time_idx
  ON visit (patient_id, occurred_at DESC);

CREATE TABLE IF NOT EXISTS complaint (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
  visit_id    UUID NOT NULL REFERENCES visit(id) ON DELETE CASCADE,

  -- Exactly what the patient said. Never normalised, never rewritten, never
  -- replaced by a model's paraphrase. The doctor reads the patient's own words,
  -- because how someone describes pain is itself clinical information.
  raw_text    STRING NOT NULL,

  -- Deterministic classification. A lexicon, not a model — see lib/clinical/regions.ts.
  body_region STRING NOT NULL,

  -- How the region was decided.
  --
  --   'lexicon'   — the complaint named a region outright.
  --   'inherited' — it did not, and memory supplied one.
  --   'none'      — it did not, and memory had nothing to offer.
  --
  -- The second case is the reason this system exists. "The ache is back again"
  -- names no body part; the word "back" there means *returned*. Read alone it is
  -- unclassifiable. Read against what this patient said six weeks ago, it is
  -- obviously lumbar. An agent with memory can resolve it; an agent without one
  -- files it under nothing and the recurrence never surfaces.
  --
  -- Stored rather than recomputed so the doctor can see that the link was
  -- inferred, and from which earlier complaint.
  region_source STRING NOT NULL DEFAULT 'lexicon',
  region_inherited_from UUID REFERENCES complaint(id) ON DELETE SET NULL,

  severity    INT,

  -- Titan Text Embeddings V2 returns 1024 dimensions by default.
  -- Nullable on purpose: a complaint is recorded even when the embedding service
  -- is down. Losing the semantic index is degraded service; losing the patient's
  -- words is data loss.
  embedding   VECTOR(1024),
  embed_model STRING,
  embedded_at TIMESTAMPTZ,

  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Additive migration for clusters created before region provenance existed.
-- CREATE TABLE IF NOT EXISTS silently does nothing on an existing table, so new
-- columns need saying twice: once above for a fresh install, once here for an
-- established one. Both forms are idempotent, so `npm run db:migrate` is safe to
-- run against any cluster in any state.
ALTER TABLE complaint ADD COLUMN IF NOT EXISTS region_source STRING NOT NULL DEFAULT 'lexicon';
ALTER TABLE complaint ADD COLUMN IF NOT EXISTS region_inherited_from UUID REFERENCES complaint(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS complaint_patient_time_idx
  ON complaint (patient_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS complaint_region_idx
  ON complaint (patient_id, body_region, occurred_at DESC);

-- The distributed vector index (C-SPANN).
--
-- Two deliberate choices here.
--
-- Cosine, not L2. Titan does not guarantee unit-norm output, and under L2 an
-- unusually long complaint can sit "far" from a short one that means the same
-- thing — magnitude tracks verbosity, not meaning. Cosine compares direction only,
-- which is the property we actually want: "did they describe the same thing",
-- not "did they use a similar number of words".
--
-- patient_id as a prefix column. Every recall in this system is scoped to one
-- patient — there is no cross-patient search, by design. Putting patient_id in
-- front means the index is partitioned by patient and a lookup searches only
-- that person's vectors, so recall latency is governed by one patient's history
-- rather than by the size of the whole clinic. Verified in the query plan:
--
--   • vector search
--       table: complaint@complaint_embedding_idx
--       prefix spans: [/'<patient-uuid>' - /'<patient-uuid>']
--
-- It is also a privacy property, not only a performance one: a query that
-- cannot express "search everyone" cannot accidentally do it.
CREATE VECTOR INDEX IF NOT EXISTS complaint_embedding_idx
  ON complaint (patient_id, embedding vector_cosine_ops);

-- Every recall attempt, including the ones that failed.
--
-- This table is the difference between an agent you can audit and an agent you
-- have to trust. When a doctor asks "why did it not flag this?", the answer is a
-- row: the query ran, it returned nothing above threshold, here is the timestamp.
-- Or: the memory was unreachable, and here is the row that proves the agent knew.
CREATE TABLE IF NOT EXISTS recall_event (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id          UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
  query_complaint_id  UUID REFERENCES complaint(id) ON DELETE CASCADE,
  query_text          STRING NOT NULL,
  matches_found       INT NOT NULL DEFAULT 0,
  top_distance        FLOAT8,
  latency_ms          INT NOT NULL,

  -- true when memory could not be reached. The agent said so out loud rather
  -- than reporting "no history found", which would be a clinical lie.
  degraded            BOOL NOT NULL DEFAULT false,
  degraded_reason     STRING,

  -- Which embedding backend answered. 'bedrock:amazon.titan-embed-text-v2:0'
  -- or 'offline:lexical-v1'. Provenance travels with the result so nobody has to
  -- guess later whether a given recall was backed by a real model.
  embed_provider      STRING NOT NULL,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS recall_event_patient_time_idx
  ON recall_event (patient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS recall_event_degraded_idx
  ON recall_event (degraded, created_at DESC);

-- ---------------------------------------------------------------------------
-- Call signalling
-- ---------------------------------------------------------------------------
--
-- Two browsers cannot start a WebRTC call until they have swapped an offer, an
-- answer and a handful of ICE candidates, and they need somewhere to leave
-- those for each other. The previous web app used Supabase Realtime; this build
-- has no Supabase, and adding a second managed service to relay four small
-- messages would be a strange thing to do while sitting on a distributed
-- database that already holds everything else.
--
-- So the offer sits in CockroachDB with the complaints. Peers append rows and
-- read what the other one appended; the media itself never touches this table,
-- only the introductions. Rows are ephemeral by nature and are swept on read.
CREATE TABLE IF NOT EXISTS call_signal (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room       STRING NOT NULL,
  -- 'doctor' or 'patient'. A peer reads everything it did not write itself.
  from_role  STRING NOT NULL,
  -- The SDP or ICE candidate, verbatim, as the browser produced it.
  payload    JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The only read this table serves: everything in one room since a moment,
-- oldest first, so an answer is never applied before the offer it answers.
CREATE INDEX IF NOT EXISTS call_signal_room_time_idx
  ON call_signal (room, created_at ASC);
