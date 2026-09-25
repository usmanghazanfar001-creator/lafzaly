// POST { email, password } -> creates a user, starts a session.
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getDb } = require('./_db');
const { signSession, sessionCookie } = require('./_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  const { email, password } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'A valid email is required.' });
  if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  try {
    const db = getDb();
    const existing = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email.toLowerCase()] });
    if (existing.rows.length) return res.status(409).json({ error: 'An account with this email already exists.' });

    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    await db.execute({
      sql: 'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
      args: [id, email.toLowerCase(), passwordHash]
    });

    const token = signSession(id);
    res.setHeader('Set-Cookie', sessionCookie(token));
    return res.status(201).json({ id, email: email.toLowerCase(), role: 'user', subscriptionStatus: 'inactive' });
  } catch (err) {
    console.error('signup error:', err);
    return res.status(500).json({ error: 'Something went wrong creating your account. Please try again.' });
  }
};
