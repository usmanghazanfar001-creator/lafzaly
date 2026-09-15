# Lafzaly — Roman Urdu Caption Generator

A working prototype of Lafzaly: an AI-powered Roman Urdu caption and subtitle
generator for Pakistani creators. Includes **real** automatic voiceover
transcription — upload a video, Lafzaly detects the speech, transcribes it,
and rewrites it as natural Roman Urdu with timestamps — plus a real,
persistent caption history/saved-captions store.

## What's in this repo

- `index.html` — the full app (landing page, dashboard, text generator,
  video captioning workspace, history, saved captions, settings, mock auth).
  No build step.
- `api/blob-upload.js` — issues short-lived tokens so the browser can upload
  large video files directly to Vercel Blob storage.
- `api/transcribe.js` — downloads the uploaded file, sends it to Groq's
  hosted Whisper for transcription with timestamps, then rewrites each line
  into natural Roman Urdu via a Groq-hosted LLM.
- `api/captions.js`, `api/saved.js`, `api/_db.js` — Turso (SQLite) storage for
  caption history and saved captions.
- `sql/schema.sql` — database schema, run once against your Turso DB.
- `package.json` — declares `@libsql/client` and `@vercel/blob`.

## One-time setup

### 1. Vercel Blob (for video uploads)
In your Vercel project: **Storage → Create Database → Blob → Create**.
Vercel automatically adds a `BLOB_READ_WRITE_TOKEN` environment variable —
nothing else to configure.

### 2. Groq (for transcription + Roman Urdu conversion) — free to start
1. Sign up at https://console.groq.com (no card required for the free tier).
2. Create an API key under **API Keys**.
3. In Vercel: **Settings → Environment Variables**, add:
   - `GROQ_API_KEY` = your key
4. Free tier covers roughly 2,000 transcription requests and ~8 hours of
   audio per day — plenty for testing and early users. When you outgrow it,
   Groq's paid tier is the same API with no code changes, or swap in another
   provider using the same `api/transcribe.js` shape.

### 3. Turso (for caption history)
See the "Setting up Turso" steps below — unchanged from before.

1. Install the Turso CLI and sign up: https://docs.turso.tech/quickstart
2. `turso db create lafzaly`
3. `turso db show lafzaly --url` and `turso db tokens create lafzaly`
4. `turso db shell lafzaly < sql/schema.sql`
5. In Vercel, add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.

### 4. Redeploy
Push a commit (or click Redeploy in Vercel) so the functions pick up the new
environment variables.

## How the video pipeline actually works now

```
Browser                          Vercel                         Groq
--------                         ------                         ----
Select file
  → upload() [Blob client] ───→ /api/blob-upload (issues token)
  → file bytes go straight to Vercel Blob storage (not through your function)
  → gets back a blob URL
  → POST /api/transcribe {blobUrl} ───→ downloads file from Blob
                                        ───→ Whisper large-v3-turbo (transcription + timestamps)
                                        ───→ per-segment rewrite into Roman Urdu (Llama 3.3 70B)
  ← segments [{start, end, text, lang}] ←───
  → renders synced captions over the real <video> preview
```

If `GROQ_API_KEY` isn't set yet, or the Blob upload fails for any reason, the
app automatically falls back to a labeled demo transcript so the UI still
works end-to-end while you're setting things up — you'll see a toast telling
you it's in demo mode.

## Known limitations

- **No real per-user accounts yet.** The API routes default every request to
  a single `demo-user`, so all visitors share one history. The login/signup
  modal is still a UI mock. Add real auth (Supabase Auth, Clerk, Auth.js,
  etc.) before treating this as private data.
- **Whisper's 25MB file-size limit.** Longer or higher-resolution videos may
  exceed this — `api/transcribe.js` returns a clear error in that case rather
  than failing silently. Audio-only exports of long content will fit more
  reliably than full video files.
- **Burned-in MP4 export** still requires a separate FFmpeg rendering step
  (see `lafzaly-architecture.md`) — SRT/VTT export works today.
- **Text caption generation** (the "Generate" tab, separate from video
  captioning) is still a rule-based template engine, not a live LLM call.
  Swapping that in follows the same `api/*.js` pattern as `transcribe.js`.

## Local preview

Open `index.html` directly for the frontend. The `/api/*` routes only run
once deployed on Vercel (or via `vercel dev` locally with your env vars
pulled: `vercel env pull .env.development.local`).

## Deploy

Push to GitHub, import the repo at vercel.com/new (Framework Preset:
"Other"), add the environment variables above, and deploy. Every push to
`main` redeploys automatically.
