-- Run this against your Neon (Postgres) database — paste it into the SQL
-- editor on your Neon project dashboard, or run it via psql. Safe to re-run
-- (IF NOT EXISTS everywhere).
--
-- Note on created_at: formatted as 'YYYY-MM-DD HH:MI:SS' text (UTC),
-- deliberately matching what the app's date-parsing and day-boundary
-- comparisons (substr(created_at,1,10) for "today", .replace(' ','T')+'Z'
-- on the frontend) already expect — this is why it's TEXT with an explicit
-- to_char() format rather than a native Postgres TIMESTAMPTZ default.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',              -- 'user' | 'admin'
  subscription_status TEXT NOT NULL DEFAULT 'inactive', -- 'inactive' | 'active'
  subscription_plan TEXT,                          -- e.g. 'pro_monthly'
  subscription_start_date TEXT,
  subscription_end_date TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  payment_id TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now() at time zone 'utc', 'YYYY-MM-DD HH24:MI:SS'))
);

CREATE TABLE IF NOT EXISTS generations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_filename TEXT,
  duration_seconds REAL,
  status TEXT NOT NULL DEFAULT 'processing',       -- 'processing' | 'completed' | 'failed'
  error TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now() at time zone 'utc', 'YYYY-MM-DD HH24:MI:SS'))
);

CREATE TABLE IF NOT EXISTS caption_generations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  topic TEXT NOT NULL,
  platform TEXT NOT NULL,
  content_type TEXT,
  tone TEXT NOT NULL,
  length TEXT,
  hook TEXT NOT NULL,
  body TEXT NOT NULL,
  cta TEXT,
  hashtags TEXT NOT NULL DEFAULT '[]',
  saved BOOLEAN NOT NULL DEFAULT false,
  created_at TEXT NOT NULL DEFAULT (to_char(now() at time zone 'utc', 'YYYY-MM-DD HH24:MI:SS'))
);

CREATE TABLE IF NOT EXISTS saved_captions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  caption_generation_id TEXT REFERENCES caption_generations(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  platform TEXT,
  tone TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now() at time zone 'utc', 'YYYY-MM-DD HH24:MI:SS'))
);
