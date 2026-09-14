// /api/captions
// GET    -> list recent caption generations (optionally ?userId=)
// POST   -> insert a new caption generation, body: { topic, platform, contentType, tone, length, hook, body, cta, hashtags: [] }
// DELETE -> remove one, body or query: { id }
//
// NOTE: there is no real authentication wired up yet, so userId defaults to
// 'demo-user' for everyone. Add real auth before treating this as private data.

const { getDb } = require('./_db');
const crypto = require('crypto');

module.exports = async (req, res) => {
  try {
    const db = getDb();
    const userId = (req.query && req.query.userId) || 'demo-user';

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
