-- Run this once against your Turso database (via `turso db shell <db-name>`
-- or the Turso web console) before using the API routes.

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
  hashtags TEXT NOT NULL DEFAULT '[]',   -- JSON-encoded array
  saved INTEGER NOT NULL DEFAULT 0,      -- 0/1 boolean
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS saved_captions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  caption_generation_id TEXT REFERENCES caption_generations(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  platform TEXT,
  tone TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS usage_limits (
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  date TEXT NOT NULL,                    -- 'YYYY-MM-DD'
  text_captions_used INTEGER NOT NULL DEFAULT 0,
  video_minutes_used REAL NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, date)
);
