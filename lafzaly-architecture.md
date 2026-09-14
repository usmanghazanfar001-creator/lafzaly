# Lafzaly — Production Architecture

This document describes how to turn the Lafzaly frontend prototype into the full SaaS described in the brief: Next.js + TypeScript, Supabase (Auth/DB/Storage), a modular AI/speech-to-text provider layer, and server-side video processing with FFmpeg.

The prototype (`lafzaly-app.html`) implements every screen and interaction with mocked AI calls behind the same shapes described below, so wiring in real providers is additive, not a rewrite.

---

## 1. High-level architecture

```
┌────────────────────┐      ┌───────────────────────────┐      ┌────────────────────┐
│  Next.js Frontend   │ ───► │  Next.js API Routes /      │ ───► │  Supabase           │
│  (React, TS,        │ ◄─── │  Server Actions            │ ◄─── │  Postgres + Auth +  │
│  Tailwind CSS)       │      │  (all AI + FFmpeg calls    │      │  Storage            │
└────────────────────┘      │   live here, server-only)  │      └────────────────────┘
                             │                             │
                             │  ┌───────────────────────┐  │
                             │  │ AI Provider Interface  │  │──► Text-gen LLM (Claude/OpenAI/etc.)
                             │  └───────────────────────┘  │
                             │  ┌───────────────────────┐  │
                             │  │ STT Provider Interface │  │──► Speech-to-text API (Urdu-capable)
                             │  └───────────────────────┘  │
                             │  ┌───────────────────────┐  │
                             │  │ FFmpeg Worker          │  │──► Audio extraction, subtitle burn-in
                             │  └───────────────────────┘  │
                             └───────────────────────────┘
```

**Rule of thumb:** anything that touches an API key or a video file lives in an API route / server action / background worker — never in client components.

---

## 2. Environment variables

```
# AI text generation (captions, hooks, CTAs)
AI_API_KEY=

# Speech-to-text (must support Urdu + word/segment timestamps)
SPEECH_TO_TEXT_API_KEY=
SPEECH_TO_TEXT_PROVIDER=whisper   # whisper | google | azure | assemblyai | local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, never sent to the client

# Storage
SUPABASE_STORAGE_BUCKET=lafzaly-uploads

# Usage limits (see §6) — kept out of code so they can change without a redeploy
FREE_TEXT_CAPTIONS_PER_DAY=10
FREE_VIDEO_MINUTES_PER_DAY=3
```

`NEXT_PUBLIC_*` values are the only ones safe for the browser (Supabase's anon key is designed for client use and is protected by Row Level Security, not secrecy). Everything else must stay server-side.

---

## 3. Database schema (Postgres / Supabase)

```sql
-- Supabase's built-in auth.users table is the source of truth for identity.

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table caption_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  platform text not null,
  content_type text not null,
  tone text not null,
  length text not null,
  hook text not null,
  body text not null,
  cta text not null,
  hashtags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table saved_captions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  caption_generation_id uuid references caption_generations(id) on delete set null,
  text text not null,
  created_at timestamptz not null default now()
);

create table video_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  original_filename text not null,
  storage_path text not null,          -- path in Supabase Storage
  duration_seconds numeric,
  status text not null default 'uploaded', -- uploaded | processing | ready | failed
  style_preset jsonb,                  -- font/size/position/color/etc.
  created_at timestamptz not null default now()
);

create table transcripts (
  id uuid primary key default gen_random_uuid(),
  video_project_id uuid not null references video_projects(id) on delete cascade,
  detected_language text,              -- urdu | roman_urdu | english | mixed
  segments jsonb not null,             -- [{start, end, text, lang}, ...]
  created_at timestamptz not null default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free',   -- free | pro
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create table usage_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  date date not null default current_date,
  text_captions_used int not null default 0,
  video_minutes_used numeric not null default 0
);
```

**Row Level Security:** enable RLS on every table and add a policy of the form
`using (auth.uid() = user_id)` for select/insert/update/delete, so a user can only ever
read or write their own rows. `video_projects` storage objects should live under a
per-user folder (`{user_id}/{project_id}/...`) with a matching Storage RLS policy.

---

## 4. AI provider interface (text generation)

Keep one interface so the underlying LLM can be swapped without touching UI code:

```ts
// lib/ai/caption-provider.ts
export interface CaptionRequest {
  topic: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube Shorts' | 'Facebook' | 'LinkedIn' | 'X';
  contentType: string;
  tone: string;
  length: 'Short' | 'Medium' | 'Long';
  count: number;
}

export interface CaptionResult {
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
}

export interface CaptionProvider {
  generate(req: CaptionRequest): Promise<CaptionResult[]>;
}
```

Implement one class per backend (e.g. `ClaudeCaptionProvider`, `OpenAICaptionProvider`),
each doing prompt construction + parsing, and select the active one from
`AI_API_KEY` / a config flag. The system prompt should encode the same rules as the
brief: natural Pakistani Roman Urdu, no literal translation, no invented claims beyond
what the user provided, varied sentence structure, minimal emoji use.

---

## 5. Speech-to-text provider interface (video pipeline)

```ts
// lib/stt/speech-provider.ts
export interface TranscriptSegment {
  start: number;   // seconds
  end: number;     // seconds
  text: string;
  language: 'urdu' | 'roman_urdu' | 'english' | 'mixed';
}

export interface SpeechToTextProvider {
  transcribe(audioFilePath: string): Promise<TranscriptSegment[]>;
}
```

Pipeline (server-side, e.g. a queued background job so uploads don't block the request):

1. **Upload** — client uploads to Supabase Storage; API route creates a `video_projects` row (`status: uploaded`).
2. **Extract audio** — FFmpeg (`ffmpeg -i input.mp4 -vn -acodec pcm_s16le audio.wav`) run in a worker.
3. **Speech-to-text** — send the audio to the configured `SpeechToTextProvider` (a Whisper-based API or similar Urdu-capable STT with timestamps).
4. **Language detection** — per-segment: classify Urdu / Roman Urdu / English / mixed (many STT APIs return this, or run a lightweight classifier over the text).
5. **Roman Urdu conversion** — if a segment is in Urdu script or mixed, pass it through the `CaptionProvider`'s transliteration/rewrite prompt to produce natural Roman Urdu (not a literal transliteration — same "Pakistani vocabulary" rules as caption generation).
6. **Timestamp alignment** — keep the provider's word/segment timing; merge very short segments for readability.
7. **Persist** — write segments to `transcripts`, set `video_projects.status = 'ready'`.
8. **Export** — SRT/VTT are generated from `segments` (pure string formatting, no external call). Burned-in MP4 export runs FFmpeg with a generated `.ass`/`.srt` subtitle filter (`ffmpeg -i input.mp4 -vf subtitles=captions.srt output.mp4`), applying the user's chosen style (font/size/color/position map cleanly to ASS style tags).

Because step 8's MP4 export is CPU-heavy, run it as a background job (e.g. a queue + worker, or a serverless function with an extended timeout) and notify the client via polling or a realtime Supabase channel when it's done.

---

## 6. Usage limits

Store limits as environment/config values, not hard-coded numbers, and check them
server-side on every generation/transcription request against `usage_limits` (reset
daily via a scheduled job or a `date` column check). This lets you change the Free
plan's limits, or introduce a Pro plan with different limits, without a code change —
only a config or `subscriptions.plan` check.

---

## 7. Error handling contract

Every server route should return a small, user-safe error shape and never leak
provider errors or stack traces:

```ts
type ApiError = { code: 'unsupported_file' | 'file_too_large' | 'no_voice_detected'
  | 'poor_audio_quality' | 'unsupported_language' | 'transcription_failed'
  | 'limit_reached' | 'network_error'; message: string };
```

The frontend maps each `code` to the plain-language messages already implemented in
the prototype (e.g. "No voice was detected in this video. Please upload a video
containing spoken audio.").

---

## 8. What's mocked in the prototype vs. what's real

| Area | Prototype | Production |
|---|---|---|
| Text caption generation | Rule/template engine in the browser | `CaptionProvider` calling a real LLM, server-side |
| Video upload & playback | Real — uses the actual uploaded file via `URL.createObjectURL` | Same, plus persisted to Supabase Storage |
| Audio extraction / transcription | Simulated pipeline + canned demo transcript | Real FFmpeg + `SpeechToTextProvider` |
| Subtitle sync, editing, SRT/VTT export | Real — actual file generation and download | Same |
| Burned-in MP4 export | Disabled with an explanatory message | Real FFmpeg subtitle burn-in job |
| Auth | In-memory mock (resets on refresh) | Supabase Auth (email/password, reset flow) |
| History/Saved/Usage | In-memory mock | Backed by the Postgres tables above |
