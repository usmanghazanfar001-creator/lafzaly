// POST { blobUrl, durationSeconds, originalFilename }
//
// 1. Requires a logged-in user (session cookie). Determines their plan:
//    - admin: unlimited videos/day, still capped at MAX_VIDEO_SECONDS each
//    - pro (active subscription): up to PRO_DAILY_VIDEOS videos/day
//    - free: no video-count cap, but a running FREE_DAILY_MINUTES/day budget
//      (this matches the existing free plan; Pro is what unlocks "N full
//      videos/day" as its own allowance)
// 2. Rejects up front if the client-reported duration exceeds the 4-minute
//    cap or would exceed the day's remaining budget for their plan — before
//    any paid transcription call is made.
// 3. Downloads the file from Blob, sends it to Groq Whisper for
//    transcription with WORD-level timestamps (not just per-segment), then
//    groups words into short, tightly-synced caption chunks (<=2 lines,
//    breaking at natural pauses/punctuation) so captions track the actual
//    speech instead of floating over long fixed blocks.
// 4. Rewrites the whole transcript into natural Roman Urdu in ONE batched
//    LLM call (not one call per line) — faster, cheaper, and the chunk
//    boundaries/timestamps are untouched by the rewrite.
// 5. Records the job in `generations` (processing -> completed/failed) so
//    usage limits and the admin dashboard are backed by real data, not the
//    client's word.
//
// NOTE on the 4-minute limit: we trust the client-reported duration to
// reject obviously-too-long files before spending anything. We also check
// Whisper's own reported duration afterward and refuse to return/count a
// result that turns out to exceed the cap — but by then the transcription
// cost has already been spent. A fully tamper-proof pre-check would need a
// server-side ffprobe-style duration read, which isn't practical to run in
// a Vercel serverless function without a much heavier dependency; this is a
// known, documented gap rather than a silent one.

const crypto = require('crypto');
const { getSessionUser, hasProAccess } = require('./_auth');
const { getDb } = require('./_db');

const MAX_VIDEO_SECONDS = 4 * 60;
const PRO_DAILY_VIDEOS = 3;
const FREE_DAILY_MINUTES = 3;
const MAX_CHUNK_CHARS = 42;   // roughly 2 short lines
const MAX_CHUNK_WORDS = 9;
const PAUSE_BREAK_SECONDS = 0.6; // a gap this long between words forces a new chunk

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Speech-to-text is not configured on the server yet.' });
  }

  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: 'Please log in to generate video captions.' });

  const { blobUrl, durationSeconds, originalFilename } = req.body || {};
  if (!blobUrl) return res.status(400).json({ error: 'blobUrl is required' });

  const declaredDuration = Number(durationSeconds) || 0;
  if (declaredDuration > MAX_VIDEO_SECONDS) {
    return res.status(400).json({ error: `Video too long. Please upload a video up to ${MAX_VIDEO_SECONDS / 60} minutes long.` });
  }

  const db = getDb();
  const isAdmin = user.role === 'admin';
  const isPro = hasProAccess(user);
  const today = new Date().toISOString().slice(0, 10); // UTC calendar day, documented in README

  try {
    if (!isAdmin) {
      if (isPro) {
        const countRes = await db.execute({
          sql: `SELECT COUNT(*) as c FROM generations WHERE user_id = ? AND status != 'failed' AND substr(created_at,1,10) = ?`,
          args: [user.id, today]
        });
        const used = Number(countRes.rows[0].c);
        if (used >= PRO_DAILY_VIDEOS) {
          return res.status(429).json({ error: `Daily limit reached. You've used all ${PRO_DAILY_VIDEOS} video generations for today. Please come back tomorrow.` });
        }
      } else {
        const minsRes = await db.execute({
          sql: `SELECT COALESCE(SUM(duration_seconds),0) as s FROM generations WHERE user_id = ? AND status != 'failed' AND substr(created_at,1,10) = ?`,
          args: [user.id, today]
        });
        const usedMinutes = Number(minsRes.rows[0].s) / 60;
        if (usedMinutes + declaredDuration / 60 > FREE_DAILY_MINUTES) {
          return res.status(429).json({ error: `This would use more than your ${FREE_DAILY_MINUTES} free video minutes for today. Upgrade to Lafzaly Pro for full videos every day.` });
        }
      }
    }
  } catch (err) {
    console.error('usage check failed:', err);
    return res.status(500).json({ error: 'Could not verify your usage limit. Please try again.' });
  }

  const jobId = crypto.randomUUID();
  try {
    await db.execute({
      sql: 'INSERT INTO generations (id, user_id, original_filename, duration_seconds, status) VALUES (?, ?, ?, ?, ?)',
      args: [jobId, user.id, originalFilename || null, declaredDuration, 'processing']
    });
  } catch (err) {
    console.error('could not create generation record:', err); // non-fatal, continue
  }

  async function markFailed(message) {
    try {
      await db.execute({ sql: 'UPDATE generations SET status = ?, error = ? WHERE id = ?', args: ['failed', message, jobId] });
    } catch {}
  }

  try {
    const fileRes = await fetch(blobUrl);
    if (!fileRes.ok) throw new Error('Could not read the uploaded file from storage.');
    const fileBuffer = Buffer.from(await fileRes.arrayBuffer());
    const contentType = fileRes.headers.get('content-type') || 'video/mp4';

    if (fileBuffer.byteLength > 25 * 1024 * 1024) {
      await markFailed('File exceeded 25MB transcription limit.');
      return res.status(400).json({
        error: 'This file is too large to transcribe right now (25MB limit). Try a shorter clip, or an audio-only export of it.'
      });
    }

    const form = new FormData();
    form.append('file', new Blob([fileBuffer], { type: contentType }), 'audio-input');
    form.append('model', 'whisper-large-v3-turbo');
    form.append('response_format', 'verbose_json');
    form.append('timestamp_granularities[]', 'word');
    form.append('timestamp_granularities[]', 'segment');

    const whisperRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: form
    });

    if (!whisperRes.ok) {
      const errText = await whisperRes.text();
      console.error('Groq Whisper error:', errText);
      await markFailed('Transcription API error.');
      return res.status(502).json({ error: 'Transcription failed. Please try again in a moment.' });
    }

    const whisperData = await whisperRes.json();

    // Post-hoc real-duration check: refuse to count/return a result that
    // turns out to actually exceed the cap, even if the declared duration
    // (or a missing one) got past the earlier check.
    const actualDuration = Number(whisperData.duration) || declaredDuration;
    if (actualDuration > MAX_VIDEO_SECONDS + 2) { // +2s grace for encoder rounding
      await markFailed('Actual duration exceeded the 4-minute limit.');
      return res.status(400).json({ error: `Video too long. Please upload a video up to ${MAX_VIDEO_SECONDS / 60} minutes long.` });
    }

    const words = whisperData.words && whisperData.words.length
      ? whisperData.words
      : flattenSegmentsToWords(whisperData.segments || []);

    if (!words.length) {
      await markFailed('No speech detected.');
      return res.status(422).json({
        error: 'No voice was detected in this file. Please upload a video or audio file containing spoken audio.'
      });
    }

    const chunks = chunkWordsIntoCaptions(words);
    const romanTexts = await toRomanUrduBatch(chunks.map(c => c.text));

    const segments = chunks.map((c, i) => ({
      start: +c.start.toFixed(2),
      end: +c.end.toFixed(2),
      text: (romanTexts[i] || c.text).trim(),
      lang: classifyLang(c.text)
    }));

    await db.execute({
      sql: 'UPDATE generations SET status = ?, duration_seconds = ? WHERE id = ?',
      args: ['completed', actualDuration, jobId]
    });

    return res.status(200).json({ segments, detectedLanguage: whisperData.language || 'unknown', jobId });
  } catch (err) {
    console.error('transcribe error:', err);
    await markFailed(err.message || 'Unknown error');
    return res.status(500).json({ error: 'Something went wrong while transcribing. Please try again.' });
  }
};

function flattenSegmentsToWords(segments) {
  // Fallback if the API doesn't return word-level data for some reason —
  // treat each segment as one long "word" so chunking still runs safely.
  return segments.map(s => ({ word: s.text.trim(), start: s.start, end: s.end }));
}

function chunkWordsIntoCaptions(words) {
  const chunks = [];
  let current = [];
  let currentChars = 0;

  function flush() {
    if (!current.length) return;
    chunks.push({
      text: current.map(w => w.word).join(' ').replace(/\s+/g, ' ').trim(),
      start: current[0].start,
      end: current[current.length - 1].end
    });
    current = [];
    currentChars = 0;
  }

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const prev = words[i - 1];
    const gap = prev ? w.start - prev.end : 0;
    const endsClause = prev && /[.!?۔،,]$/.test((prev.word || '').trim());

    if (current.length && (gap > PAUSE_BREAK_SECONDS || endsClause ||
        current.length >= MAX_CHUNK_WORDS || currentChars + w.word.length > MAX_CHUNK_CHARS)) {
      flush();
    }
    current.push(w);
    currentChars += (w.word || '').length + 1;
  }
  flush();
  return chunks;
}

function classifyLang(text) {
  const hasUrduScript = /[\u0600-\u06FF]/.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);
  if (hasUrduScript && hasLatin) return 'Mixed';
  if (hasUrduScript) return 'Urdu';
  return 'English';
}

// Rewrites every chunk into natural Roman Urdu in a single LLM call, sent as
// a numbered list so the model can't merge/reorder/drop lines — the reply is
// parsed back into the same array shape and length, or padded with the
// originals if anything doesn't line up (chunk timing must never depend on
// the model returning a well-formed reply).
async function toRomanUrduBatch(texts) {
  if (!texts.length) return texts;
  const numbered = texts.map((t, i) => `${i + 1}. ${t}`).join('\n');
  const prompt = `Convert each numbered line below from speech transcript into natural, conversational Pakistani Roman Urdu (Urdu written in Latin/English letters, the way Pakistani creators actually text) — not formal Urdu, not a stiff literal transliteration. Keep any words that were genuinely spoken in English as English. Do not add information that wasn't said. Reply with exactly the same number of numbered lines, same order, nothing else — no preamble, no extra commentary.

${numbered}`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000
      })
    });
    if (!res.ok) return texts;
    const data = await res.json();
    const reply = (data.choices?.[0]?.message?.content || '').trim();
    const lines = reply.split('\n').map(l => l.replace(/^\s*\d+[\.\)]\s*/, '').trim()).filter(Boolean);
    if (lines.length !== texts.length) {
      console.warn(`Roman Urdu batch rewrite line-count mismatch: expected ${texts.length}, got ${lines.length}. Falling back to originals for safety.`);
      return texts;
    }
    return lines;
  } catch (err) {
    console.error('toRomanUrduBatch failed:', err);
    return texts; // fall back to raw transcript text rather than fail the whole job
  }
}
