# Lafzaly — Roman Urdu Caption Generator

Real per-user accounts, server-enforced daily/duration limits, an admin role,
Stripe-billed Lafzaly Pro ($1/month), and word-timestamp-based caption sync
that actually tracks the speech instead of floating fixed-length blocks.

## ⚠️ This update requires new setup before video captioning works again

Video captioning now **requires login** (it didn't before), because per-user
limits are meaningless without real accounts. If you don't complete the auth
setup below, uploading a video will show "Please log in" instead of working.

## What's new in this update

- **Real authentication** — signup/login/logout backed by a `users` table in
  Neon (Postgres), sessions via signed httpOnly cookies (not localStorage, not a mock).
- **4-minute video cap**, enforced both in the UI and in `api/transcribe.js`
  (with a documented limitation — see "Known limitations" below).
- **Daily limits enforced server-side**:
  - Free: existing 3-minutes-of-video/day budget (unchanged), account required
  - Pro ($1/mo): 3 full videos/day, 4 minutes each
  - Admin: unlimited videos/day
  - None of this can be bypassed by refreshing, logging out/in, or calling
    the API directly — every check re-reads the database on every request.
- **Admin role and dashboard** — `/api/admin-stats` + a new "Admin" sidebar
  tab (hidden unless `role = 'admin'` — checked server-side, not just hidden
  in the UI) showing users, their usage, and recent generation jobs including
  failures.
- **Lafzaly Pro billing via Stripe** — `api/billing-checkout.js` starts a
  Checkout session; `api/billing-webhook.js` is the *only* place subscription
  status is ever written. A successful redirect back to your site never
  grants Pro access by itself — only a verified webhook event does.
- **Real caption-sync fix** — `api/transcribe.js` now requests word-level
  timestamps from Whisper (not just segment-level), groups words into short
  (≤2-line) chunks that break at natural pauses/punctuation, and rewrites the
  whole transcript into Roman Urdu in **one** batched call instead of one
  call per line (faster, cheaper, and the timing is untouched by the rewrite
  step).
- **Google AdSense**: verification script in `<head>` and `ads.txt` at the
  root, using the client ID you provided.

## One-time setup (in order)

### 1. Create a Neon database and run the schema
1. Create a project/database at neon.tech, copy its connection string.
2. Add it to Vercel as `DATABASE_URL`.
3. Paste the contents of `sql/schema.sql` into Neon's built-in SQL editor
   (on your project dashboard) and run it. This creates `users`,
   `generations`, `caption_generations`, and `saved_captions` — nothing
   existing is dropped.

### 2. Generate a session secret
```
openssl rand -hex 32
```
Add it to Vercel as `JWT_SECRET`. This signs login sessions — treat it like a
password; changing it later logs everyone out.

### 3. Promote yourself to admin
There's no signup-time admin flag by design (so nobody can self-promote).
After you sign up once through the app, open Neon's SQL editor and run:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### 4. Set up Stripe for Lafzaly Pro
1. Create a Stripe account (or use an existing one) at stripe.com.
2. **Products → Add product** — name it "Lafzaly Pro", price **$1.00**,
   billing period **Monthly**, recurring. Copy the **Price ID** (starts `price_`).
3. **Developers → API keys** — copy your **Secret key**.
4. **Developers → Webhooks → Add endpoint**:
   - URL: `https://<your-domain>/api/billing-webhook`
   - Events to send: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Signing secret** (starts `whsec_`).
5. In Vercel, add:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID`
   - `STRIPE_WEBHOOK_SECRET`

Until these three are set, the "Get Pro" button will show a clear
"Billing is not configured yet" error rather than failing silently.

### 5. Everything from before still applies
`GROQ_API_KEY` and `BLOB_READ_WRITE_TOKEN` (via a Blob store) — see the setup
steps in earlier versions of this README if you haven't done these yet.
`DATABASE_URL` (Neon) replaces the old Turso variables entirely — remove
`TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` from Vercel if they're still there,
they're no longer used.

### 6. Redeploy
Push a commit so all the new environment variables and the new `api/*`
files take effect.

## How the new pieces work

**Auth**: `api/auth-signup.js` and `api/auth-login.js` issue a signed JWT in
an httpOnly cookie. `api/_auth.js`'s `getSessionUser()` re-reads the user's
row from the database on every request — role and subscription are never
trusted from the token itself, only from a fresh DB read, so a stale or
tampered claim can't grant access.

**Daily limits & the 4-minute cap**: enforced in `api/transcribe.js` before
any transcription is attempted, using `SELECT COUNT`/`SUM` against the
`generations` table for the current UTC calendar day. **Timezone note**: "day"
means the UTC calendar date, consistently, everywhere — documented here so
it's a deliberate choice, not an accident.

**Admin**: `role` lives only in the database and is set by you directly via
SQL (see step 3 above) — there is no UI path to grant it, on purpose.

**Stripe**: `checkout.session.completed`, `customer.subscription.updated`,
and `customer.subscription.deleted` are the three events that update
`subscription_status`/`subscription_plan`/`subscription_end_date` in the
`users` table. If a subscription lapses, the next matching webhook event
flips the user back to free automatically — nothing polls for this.

**Caption sync fix**: previously every segment was Whisper's own
(coarser) segment boundary, individually rewritten. Now: word-level
timestamps → grouped into short chunks at real pauses/punctuation → the
*entire* transcript rewritten into Roman Urdu in one call, with a safety
fallback to the original English/mixed text if the rewrite ever comes back
malformed (checked by line count) rather than risk breaking the timing.

## Known limitations (stated plainly, not hidden)

- **The 4-minute check has a real gap**: we trust the client-reported
  duration to reject obviously-too-long files *before* paying for
  transcription, and we double-check Whisper's own reported duration
  afterward and refuse to count/return an over-limit result — but by then
  the transcription cost has already been spent once. A fully tamper-proof
  pre-check would need a server-side ffprobe-style duration read, which
  isn't practical to run in a Vercel serverless function without a much
  heavier dependency. This is a deliberate, documented trade-off.
- **Burned-in MP4 export is still not implemented.** Server-side FFmpeg
  doesn't fit Vercel's serverless execution limits well for video encoding.
  SRT/VTT export and the live styled preview work today; in-browser burn-in
  (via ffmpeg.wasm) is the realistic next step and is a separate follow-up.
- **Text caption generation (the "Generate" tab) is intentionally NOT gated**
  by the new auth/limits — it's a separate, lower-cost feature and was out of
  scope for this update. Only video captioning requires login now.
- **Password reset isn't wired up** — the "Forgot password?" link shows a
  placeholder message. Needs an email-sending provider to implement properly.
- **Free-plan enforcement re-derives from `generations` rows**, so a failed
  job never counts against the daily budget — but a job that succeeds and is
  later deleted from history is still counted (history deletion doesn't
  delete the underlying generation record, by design, to keep usage honest).

## Testing checklist (mirrors the original spec's scenarios)

1. Sign up, confirm you land in the dashboard.
2. Upload a <30s video as a Free user → should work, using minutes budget.
3. Upload a video that would push you over 3 free minutes → clear error, no charge to Groq (rejected pre-flight).
4. Upload a video over 4 minutes → clear "Video too long" error, rejected before transcription.
5. Subscribe to Pro via the $1/month button → Stripe Checkout → on success, `/api/auth-me` should show `isPro: true` within a few seconds (webhook-driven).
6. As Pro, generate 3 full videos in a day → 4th attempt should show the daily-limit error.
7. Promote your account to admin via SQL → generate more than 3 videos same day → should never be blocked.
8. Check the Admin tab → your test users and jobs (including any failed ones) should be listed.
9. Cancel the Stripe subscription in the Stripe dashboard → next webhook delivery should flip you back to Free (may take a minute).
10. Try calling `/api/transcribe` directly (e.g. via curl) without a session cookie → should get a 401, not a transcription.
