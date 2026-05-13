CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  submitted_at TIMESTAMP NOT NULL,
  source_url TEXT,
  poster_identifier TEXT,
  poster_named_publicly INTEGER DEFAULT 0,
  raw_text TEXT NOT NULL,
  screenshot_r2_key TEXT,
  submitter_ip_hash TEXT,
  status TEXT NOT NULL
);

CREATE TABLE claims (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES submissions(id),
  verbatim TEXT NOT NULL,
  paraphrased TEXT NOT NULL,
  claim_type TEXT NOT NULL,
  subject_domain TEXT NOT NULL,
  entities_mentioned TEXT,
  figures_mentioned TEXT,
  assumptions TEXT,
  embedding_id TEXT,
  cluster_id TEXT REFERENCES clusters(id)
);

CREATE TABLE verdicts (
  id TEXT PRIMARY KEY,
  claim_id TEXT NOT NULL REFERENCES claims(id),
  verdict TEXT NOT NULL,
  confidence REAL NOT NULL,
  reasoning TEXT NOT NULL,
  assumptions_required TEXT,
  alternative_framings TEXT,
  verification_method TEXT,
  calculator_script_r2_key TEXT,
  generated_at TIMESTAMP NOT NULL,
  generated_by TEXT NOT NULL
);

CREATE TABLE verdict_sources (
  verdict_id TEXT NOT NULL REFERENCES verdicts(id),
  source_id TEXT NOT NULL REFERENCES sources(id),
  relevant_passage TEXT,
  page_number INTEGER,
  supports TEXT,
  PRIMARY KEY (verdict_id, source_id)
);

CREATE TABLE sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  section TEXT,
  publisher TEXT NOT NULL,
  publication_date DATE,
  url TEXT NOT NULL,
  source_type TEXT NOT NULL,
  r2_key TEXT,
  embedding_id TEXT
);

CREATE TABLE clusters (
  id TEXT PRIMARY KEY,
  canonical_paraphrase TEXT NOT NULL,
  subject_domain TEXT NOT NULL,
  first_seen TIMESTAMP NOT NULL,
  last_seen TIMESTAMP NOT NULL,
  instance_count INTEGER NOT NULL DEFAULT 0,
  verdict_distribution TEXT,
  common_missing_assumptions TEXT,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE corrections (
  id TEXT PRIMARY KEY,
  verdict_id TEXT NOT NULL REFERENCES verdicts(id),
  requested_at TIMESTAMP NOT NULL,
  requester_identifier TEXT,
  reason TEXT NOT NULL,
  resolution TEXT,
  resolved_at TIMESTAMP,
  status TEXT NOT NULL
);

