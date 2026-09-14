// /api/saved
// GET    -> list saved captions (optionally ?userId=)
// POST   -> save a caption, body: { text, platform, tone, captionGenerationId? }
// DELETE -> remove one, body or query: { id }

const { getDb } = require('./_db');
const crypto = require('crypto');

module.exports = async (req, res) => {
  try {
    const db = getDb();
    const userId = (req.query && req.query.userId) || 'demo-user';

    if (req.method === 'GET') {
      const result = await db.execute({
        sql: 'SELECT * FROM saved_captions WHERE user_id = ? ORDER BY created_at DESC LIMIT 200',
        args: [userId]
      });
      return res.status(200).json({ saved: result.rows });
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      if (!b.text) return res.status(400).json({ error: 'text is required' });
      const id = crypto.randomUUID();
      await db.execute({
        sql: `INSERT INTO saved_captions (id, user_id, caption_generation_id, text, platform, tone)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [id, userId, b.captionGenerationId || null, b.text, b.platform || '', b.tone || '']
      });
      return res.status(201).json({ id });
    }

    if (req.method === 'DELETE') {
      const id = (req.query && req.query.id) || (req.body && req.body.id);
      if (!id) return res.status(400).json({ error: 'id is required' });
      await db.execute({ sql: 'DELETE FROM saved_captions WHERE id = ? AND user_id = ?', args: [id, userId] });
      return res.status(200).json({ deleted: id });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('saved API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
