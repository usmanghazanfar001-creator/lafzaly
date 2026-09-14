# Lafzaly — Roman Urdu Caption Generator

A frontend prototype of Lafzaly: an AI-powered Roman Urdu caption and subtitle
generator for Pakistani creators on TikTok, Instagram Reels, YouTube Shorts and
Facebook — now with real, persistent history/saved-captions storage via
Turso (SQLite-compatible, serverless-friendly).

## What's in this repo

- `index.html` — the full static app (landing page, dashboard, text generator,
  video captioning workspace with real playback/sync/SRT-VTT export, history,
  saved captions, settings, mock auth). No build step.
- `api/captions.js`, `api/saved.js`, `api/_db.js` — Vercel serverless functions
  that read/write a Turso database.
- `sql/schema.sql` — the database schema to run once against your Turso DB.
- `package.json` — declares the one dependency (`@libsql/client`) so Vercel
  installs it when building the serverless functions.

## Setting up Turso (one-time)

1. Install the Turso CLI and sign up: see https://docs.turso.tech/quickstart
2. Create a database:
   ```
   turso db create lafzaly
   ```
3. Get its URL and an auth token:
   ```
   turso db show lafzaly --url
   turso db tokens create lafzaly
   ```
4. Run the schema against it:
   ```
   turso db shell lafzaly < sql/schema.sql
   ```
5. In your Vercel project: Settings → Environment Variables, add:
   - `TURSO_DATABASE_URL` = the URL from step 3
   - `TURSO_AUTH_TOKEN` = the token from step 3
6. Redeploy (Vercel → Deployments → Redeploy, or just push a commit) so the
   functions pick up the new env vars.

Once those two variables are set, caption history and saved captions persist
in Turso automatically — no frontend changes needed. Until then, the app
quietly falls back to in-memory storage for the current browser session and
shows a one-time notice.

## Known limitation: no real authentication yet

The API routes default every request to a single `demo-user` — there's no
login system wired into the database yet, so **all visitors currently share
the same history**. The mock login/signup modal in the UI does not create
real accounts. Before treating this as private, per-user data, add a real
auth provider (Supabase Auth, Clerk, Auth.js, etc.), pass the authenticated
user's ID to the API routes instead of `'demo-user'`, and restrict each query
to that ID.

## AI generation & transcription

Caption generation is a rule/template engine that runs entirely in the
browser (see `lafzaly-architecture.md`). Video transcription uses a canned
demo transcript. Swapping in a real LLM and a real Urdu-capable
speech-to-text API is the next step described in that document — the API
route pattern here (`api/*.js` + env vars) is the same pattern to follow.

## Local preview

Just open `index.html` in a browser for the frontend. The `/api/*` routes
only run once deployed on Vercel (or via `vercel dev` locally).

## Deploy

Push to GitHub, import the repo at vercel.com/new (Framework Preset:
"Other"), add the two Turso env vars above, and deploy. Every future push to
`main` redeploys automatically.
