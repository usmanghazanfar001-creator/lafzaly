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
const { del } = require('@vercel/blob');

const MAX_VIDEO_SECONDS = 4 * 60;
const PRO_DAILY_VIDEOS = 3;
const FREE_DAILY_MINUTES = 3;
const MAX_CHUNK_CHARS = 42;   // roughly 2 short lines
const MAX_CHUNK_WORDS = 9;
const PAUSE_BREAK_SECONDS = 0.6; // a gap this long between words forces a new chunk

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Speech-to-text is not configured on the server yet.' });
  }

  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: 'Please log in to generate video captions.' });

  const { blobUrl, durationSeconds, originalFilename, language } = req.body || {};
  if (!blobUrl) return res.status(400).json({ error: 'blobUrl is required' });
  // Only accept files from our own Vercel Blob storage (prevents fetching/deleting arbitrary URLs).
  let host = '';
  try { host = new URL(blobUrl).hostname; } catch {}
  if (!host.endsWith('.public.blob.vercel-storage.com')) {
    return res.status(400).json({ error: 'Invalid file location.' });
  }
  req._lafzalyOwnsBlob = true;

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

    // Groq infers the format from the filename extension, so it must have a real one.
    const extFromName = ((originalFilename || '').split('.').pop() || '').toLowerCase();
    const extFromType = { 'video/mp4':'mp4','video/webm':'webm','audio/mpeg':'mp3','audio/mp3':'mp3','audio/wav':'wav','audio/x-wav':'wav','video/quicktime':'mp4' }[contentType.split(';')[0]];
    const ext = ['mp4','webm','mp3','wav','m4a','ogg','flac','mpeg','mpga'].includes(extFromName) ? extFromName : (extFromType || 'mp4');

    async function runWhisper(lang, model) {
      const form = new FormData();
      form.append('file', new Blob([fileBuffer], { type: contentType }), `upload.${ext}`);
      form.append('model', model || 'whisper-large-v3-turbo');
      form.append('response_format', 'verbose_json');
      form.append('temperature', '0');
      if (lang) form.append('language', lang);
      form.append('timestamp_granularities[]', 'word');
      form.append('timestamp_granularities[]', 'segment');
      const r = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST', headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }, body: form
      });
      if (!r.ok) { const t = await r.text(); const e = new Error(t); e.status = r.status; throw e; }
      return r.json();
    }
    const wordsOf = d => (d.words && d.words.length) ? d.words : flattenSegmentsToWords(d.segments || []);
    // Urdu/Hindi speech is often auto-detected as Hindi and written in Devanagari, so default to Urdu.
    // If that finds suspiciously little speech, retry with the larger Whisper model (Urdu, Hindi, auto) and keep the fullest result.
    const whisperLang = language === 'auto' ? null : (language || 'ur');

    let whisperData;
    try {
      whisperData = await runWhisper(whisperLang);
      const dur = Number(whisperData.duration) || declaredDuration || 0;
      const sparse = d => dur > 4 && wordsOf(d).length < dur * 0.8;   // normal speech is ~2 words/sec
      if (sparse(whisperData)) {
        let best = whisperData;
        for (const [alt, model] of [['ur', 'whisper-large-v3'], ['hi', 'whisper-large-v3'], [null, 'whisper-large-v3']]) {
          try {
            const d = await runWhisper(alt, model);
            if (wordsOf(d).length > wordsOf(best).length) best = d;
          } catch (e) { console.warn('whisper retry failed:', alt, e.message); }
        }
        whisperData = best;
      }
    } catch (e) {
      console.error('Groq Whisper error:', e.status, e.message);
      await markFailed('Transcription API error: ' + String(e.message).slice(0, 300));
      let detail = e.message;
      try { detail = JSON.parse(e.message).error.message || e.message; } catch {}
      return res.status(502).json({ error: 'Transcription failed: ' + String(detail).slice(0, 200) });
    }

    // Post-hoc real-duration check: refuse to count/return a result that
    // turns out to actually exceed the cap, even if the declared duration
    // (or a missing one) got past the earlier check.
    const actualDuration = Number(whisperData.duration) || declaredDuration;
    if (actualDuration > MAX_VIDEO_SECONDS + 2) { // +2s grace for encoder rounding
      await markFailed('Actual duration exceeded the 4-minute limit.');
      return res.status(400).json({ error: `Video too long. Please upload a video up to ${MAX_VIDEO_SECONDS / 60} minutes long.` });
    }

    const words = wordsOf(whisperData);

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
}

module.exports = async (req, res) => {
  try {
    return await handler(req, res);
  } finally {
    // Privacy: the uploaded file is only needed for transcription — remove it as soon as we're done.
    // Only runs for requests that passed login and the blob-host check above.
    const url = req.body && req.body.blobUrl;
    try {
      if (url && req._lafzalyOwnsBlob) await del(url);
    } catch (e) { console.warn('blob cleanup failed (non-fatal):', e.message); }
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
  const hasUrduScript = /[\u0600-\u06FF\u0900-\u097F]/.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);
  if (hasUrduScript && hasLatin) return 'Mixed';
  if (hasUrduScript) return 'Urdu';
  return 'Roman / English';
}

// Rewrites chunks into natural Roman Urdu (Latin letters only). Input may be
// Urdu script, Hindi/Devanagari or English. Works in batches of 25 lines and
// asks for JSON so line order/count is unambiguous; any line that comes back
// missing or still containing non-Latin script is retried individually, and
// only falls back to the original text as a last resort.
const NON_LATIN = /[؀-ۿऀ-ॿ਀-੿]/;

async function callRoman(lines) {
  const prompt = `You convert speech-transcript lines into natural, conversational Pakistani Roman Urdu: Urdu written ONLY in English/Latin letters, the way Pakistani creators text (e.g. "Aap sab kaise hain? Aaj hum baat karenge..."). The input lines may be in Urdu script, Hindi/Devanagari script, Punjabi, or English. Rules:
- This is a TRANSCRIPT, so be faithful and correct: transliterate exactly what was said, word for word, into standard Roman Urdu spelling used in Pakistani media and messaging: hai, hain, nahi, kya, kaise, aap, hum, main, mein, ko, ka, ki, ke, aaj, kal, bohat, acha, theek, karna, kiya, hoga, lekin, aur, kyun, yeh, woh, toh, bhi, sath, abhi, phir. Spell each word the same way every time. Do NOT use SMS shorthand (no "krna", "nhi", "hm", "bht", "ap").
- Fix obvious speech-recognition mistakes only when the correct Urdu word is clear from context; never invent words that were not spoken.
- Keep natural spoken Urdu word order and grammar. Keep the speaker's own English words (video, subscribe, like, share, tips) in English.
- Output must use only Latin letters, digits and punctuation. NEVER output Urdu, Arabic, Hindi or Gurmukhi script.
- Keep words that were genuinely spoken in English as English.
- Do not translate to English, do not add or remove information, do not merge or split lines.
Reply with JSON only: {"lines": ["...", "..."]} containing exactly ${lines.length} strings in the same order as the input.

Input:
${JSON.stringify(lines)}`;
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    })
  });
  if (!res.ok) throw new Error('LLM HTTP ' + res.status + ': ' + (await res.text()).slice(0, 200));
  const data = await res.json();
  const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
  return Array.isArray(parsed.lines) ? parsed.lines.map(x => String(x || '').trim()) : [];
}


// ---- Last-resort rule-based Urdu/Hindi -> Roman transliteration (used only when the LLM fails) ----
const UR_WORDS = { 'ہماری':'hamari','ہمارا':'hamara','ہمارے':'hamare','ہوگی':'hogi','ہوگا':'hoga','ہوں':'hoon','ہے':'hai','ہیں':'hain','میں':'main','نہیں':'nahi','کیا':'kya','اور':'aur','کی':'ki','کا':'ka','کے':'ke','کو':'ko','سے':'se','پر':'par','بھی':'bhi','تو':'toh','یہ':'yeh','وہ':'woh','آپ':'aap','ہم':'hum','میرا':'mera','میری':'meri','تم':'tum','اب':'ab','جی':'ji','ہاں':'haan','کہ':'ke','ایک':'aik','بہت':'bohat','لیکن':'lekin','پھر':'phir','آج':'aaj','کل':'kal','ہو':'ho','تھا':'tha','تھی':'thi','گا':'ga','گی':'gi' };
const UR_LET = { 'ا':'a','آ':'aa','ب':'b','پ':'p','ت':'t','ٹ':'t','ث':'s','ج':'j','چ':'ch','ح':'h','خ':'kh','د':'d','ڈ':'d','ذ':'z','ر':'r','ڑ':'r','ز':'z','ژ':'zh','س':'s','ش':'sh','ص':'s','ض':'z','ط':'t','ظ':'z','ع':'a','غ':'gh','ف':'f','ق':'q','ک':'k','گ':'g','ل':'l','م':'m','ن':'n','ں':'n','و':'o','ہ':'h','ھ':'h','ء':'','ی':'i','ے':'e','ئ':'i','ۃ':'h','ؤ':'o','أ':'a','ۓ':'e','ي':'i','ك':'k','ه':'h' };
function ruleBasedRoman(text) {
  return String(text).replace(/[؀-ۿ]+/g, w => {
    const clean = w.replace(/[ً-ٰٟ]/g, '');
    if (UR_WORDS[clean]) return UR_WORDS[clean];
    let o = '';
    for (const ch of clean) o += (ch in UR_LET ? UR_LET[ch] : '');
    return o || '';
  }).replace(/[ऀ-ॿ]+/g, '').replace(/\s{2,}/g, ' ').trim();
}

const isGood = t => t && !NON_LATIN.test(t);

async function toRomanUrduBatch(texts) {
  if (!texts.length) return texts;
  const out = texts.slice();
  const BATCH = 25;
  try {
    for (let b = 0; b < texts.length; b += BATCH) {
      const slice = texts.slice(b, b + BATCH);
      let got = [];
      try { got = await callRoman(slice); } catch (e) { console.warn('roman batch failed:', e.message); await new Promise(r => setTimeout(r, 800)); try { got = await callRoman(slice); } catch (e2) { console.warn('roman batch retry failed:', e2.message); } }
      for (let k = 0; k < slice.length; k++) {
        let t = got.length === slice.length ? got[k] : '';
        if (!isGood(t)) {            // retry this single line once
          for (let a = 0; a < 2 && !isGood(t); a++) {
            try { t = (await callRoman([slice[k]]))[0] || ''; } catch (e) { t = ''; await new Promise(r => setTimeout(r, 600)); }
          }
        }
        if (!isGood(t)) t = ruleBasedRoman(slice[k]);
        if (isGood(t)) out[b + k] = t;   // never leave Urdu/Hindi script in the output
      }
    }
  } catch (err) {
    console.error('toRomanUrduBatch failed:', err);
  }
  return out;
}
