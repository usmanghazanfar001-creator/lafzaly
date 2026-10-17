// /api/captions
// GET    -> list recent caption generations (logged-in user only)
// POST   -> insert a new caption generation, body: { topic, platform, contentType, tone, length, hook, body, cta, hashtags: [] }
// DELETE -> remove one, body or query: { id }
//
// NOTE: there is no real authentication wired up yet, so userId defaults to
// 'demo-user' for everyone. Add real auth before treating this as private data.

const { getDb } = require('./_db');
const { getSessionUser } = require('./_auth');
const crypto = require('crypto');

const NON_LATIN = /[\u0600-\u06FF\u0900-\u097F]/;
const ok = (c) => c && typeof c.hook === 'string' && typeof c.body === 'string' && c.hook && c.body && !NON_LATIN.test(c.hook + c.body);

// POST { action:'generate', topic, platform, type, tone, length, count, language } -> { captions: [{hook, body, cta, hashtags}] }
async function generate(req, res) {
  if (!process.env.GROQ_API_KEY) return res.status(503).json({ error: 'AI generation is not configured.' });
  const b = req.body || {};
  const topic = String(b.topic || '').trim().slice(0, 300);
  if (topic.length < 4) return res.status(400).json({ error: 'Topic is too short.' });
  const clean = (v, d) => String(v || d).replace(/[^\w &/-]/g, '').slice(0, 40);
  const platform = clean(b.platform, 'Instagram'), type = clean(b.type, 'Other'), tone = clean(b.tone, 'Casual');
  const length = ['Short', 'Medium', 'Long'].includes(b.length) ? b.length : 'Medium';
  const count = Math.min(Math.max(parseInt(b.count, 10) || 1, 1), 5);
  const words = { Short: '12-25', Medium: '30-55', Long: '60-110' }[length];
  const english = String(b.language || '').toLowerCase() === 'english';
  const promptEn = `You write social media captions for creators and small businesses in Pakistan, in natural, friendly ENGLISH.
Rules:
- Write ONLY in English (Latin letters). Keep it conversational and scroll-stopping, like a real creator or brand posting on social media. Light emojis are fine but not required.
- Stay strictly on the topic. Do not invent prices, dates, phone numbers, addresses or claims that are not in the topic.
- Platform: ${platform}. Content type: ${type}. Tone: ${tone}. Body length: ${words} words.
- Each caption: "hook" (one scroll-stopping first line), "body", "cta" (one short call to action), "hashtags" (5 to 6 relevant hashtags).
- Write ${count} clearly different captions.
Topic (may be in English, Urdu or Roman Urdu; always answer in English): ${JSON.stringify(topic)}
Reply with JSON only: {"captions":[{"hook":"","body":"","cta":"","hashtags":["#..."]}]}`;
  const promptUr = `You write social media captions for Pakistani creators in ROMAN URDU: Urdu language written with the English/Latin alphabet, exactly how Pakistanis type on WhatsApp and Instagram (e.g. "Aap ka din kaisa guzra? Yeh naya offer miss mat karna!").
STYLE: casual WhatsApp/Instagram texting Roman Urdu, like a Pakistani creator talking to followers. Examples of the exact feel: "Hello guys aj hm captions generate krna sikhy gai", "Yaar ye offer miss mat krna, bht kam time reh gya hai", "Kia aap ne abhi tak try nhi kia?". Use the short everyday spellings people actually type: aj, hm, krna/kr, kia, nhi, bht, hai/hain, ap, ye/wo, kyun, thora, sath, lye, gai/gye. Mix English words naturally (guys, offer, video, follow, link). Keep it light and short-sentenced, not formal and not bookish.
Rules:
- Write ONLY in Latin letters. Never use Urdu/Arabic script or Hindi/Devanagari.
- Natural spoken Pakistani Urdu. Common English words (sale, offer, launch, installments, free) stay as they are. No formal/literary Urdu, no literal translation.
- Stay strictly on the topic. Do not invent prices, dates, phone numbers, addresses or claims that are not in the topic.
- Platform: ${platform}. Content type: ${type}. Tone: ${tone}. Body length: ${words} words.
- Each caption: "hook" (one scroll-stopping first line), "body", "cta" (one short call to action), "hashtags" (5 to 6 relevant hashtags, include #RomanUrdu).
- Write ${count} clearly different captions.
Topic (may be in English, Urdu or Roman Urdu): ${JSON.stringify(topic)}
Reply with JSON only: {"captions":[{"hook":"","body":"","cta":"","hashtags":["#..."]}]}`;
  const prompt = english ? promptEn : promptUr;
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.GROQ_TEXT_MODEL || 'openai/gpt-oss-120b', messages: [{ role: 'user', content: prompt }], temperature: 0.9, reasoning_effort: 'low', max_completion_tokens: 6000, response_format: { type: 'json_object' } })
  });
  if (!r.ok) return res.status(502).json({ error: 'AI service error (' + r.status + ').' });
  const data = await r.json();
  let parsed; try { parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}'); } catch { parsed = {}; }
  const caps = (Array.isArray(parsed.captions) ? parsed.captions : []).filter(ok).slice(0, count).map(c => ({
    hook: c.hook.trim(), body: c.body.trim(), cta: String(c.cta || '').trim(),
    hashtags: (Array.isArray(c.hashtags) ? c.hashtags : []).map(h => '#' + String(h).replace(/[^\w]/g, '')).filter(h => h.length > 1).slice(0, 7)
  }));
  if (!caps.length) return res.status(502).json({ error: 'No usable captions returned.' });
  return res.status(200).json({ captions: caps });
}

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST' && req.body && req.body.action === 'generate') return await generate(req, res);
    const db = getDb();
    // Data is always scoped to the logged-in user from the session cookie — never from the URL.
    const user = await getSessionUser(req);
    const userId = user ? user.id : null;
    if (!userId) {
      // Guests: nothing is stored on the server (the app keeps their session in memory only).
      if (req.method === 'GET') return res.status(200).json({ captions: [] });
      if (req.method === 'POST') return res.status(200).json({ id: null, guest: true });
      if (req.method === 'DELETE') return res.status(200).json({ deleted: null });
      res.setHeader('Allow', 'GET, POST, DELETE');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    if (req.method === 'GET') {
      const result = await db.execute({
        sql: 'SELECT * FROM caption_generations WHERE user_id = ? ORDER BY created_at DESC LIMIT 200',
        args: [userId]
      });
      const rows = result.rows.map(r => ({ ...r, hashtags: JSON.parse(r.hashtags || '[]'), saved: !!r.saved }));
      return res.status(200).json({ captions: rows });
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      if (!b.topic || !b.hook || !b.body) {
        return res.status(400).json({ error: 'topic, hook and body are required' });
      }
      const id = crypto.randomUUID();
      await db.execute({
        sql: `INSERT INTO caption_generations
              (id, user_id, topic, platform, content_type, tone, length, hook, body, cta, hashtags)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [id, userId, b.topic, b.platform || '', b.contentType || '', b.tone || '',
               b.length || '', b.hook, b.body, b.cta || '', JSON.stringify(b.hashtags || [])]
      });
      return res.status(201).json({ id });
    }

    if (req.method === 'DELETE') {
      const id = (req.query && req.query.id) || (req.body && req.body.id);
      if (!id) return res.status(400).json({ error: 'id is required' });
      await db.execute({ sql: 'DELETE FROM caption_generations WHERE id = ? AND user_id = ?', args: [id, userId] });
      return res.status(200).json({ deleted: id });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('captions API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
