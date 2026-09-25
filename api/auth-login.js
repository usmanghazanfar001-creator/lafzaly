// POST { email, password } -> verifies credentials, starts a session.
const bcrypt = require('bcryptjs');
const { getDb } = require('./_db');
const { signSession, sessionCookie } = require('./_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const db = getDb();
    const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email.toLowerCase()] });
    const user = result.rows[0];
    // Same generic message whether the email or the password was wrong —
    // never reveal which one, that leaks which emails have accounts.
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }
    const token = signSession(user.id);
    res.setHeader('Set-Cookie', sessionCookie(token));
    return res.status(200).json({
      id: user.id, email: user.email, role: user.role, subscriptionStatus: user.subscription_status
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: 'Something went wrong logging you in. Please try again.' });
  }
};
