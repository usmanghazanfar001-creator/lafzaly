// Shared authentication helpers used by every protected API route.
//
// Sessions are a signed JWT stored in an httpOnly cookie named `lafzaly_session`.
// The JWT itself only carries { userId }, never role/subscription — those are
// always re-read from the database on every request, so a stale or forged
// claim in the token can't grant access it shouldn't. Never trust anything
// about role or subscription that didn't come from a fresh DB read.
//
// Requires JWT_SECRET as an environment variable (any long random string —
// e.g. `openssl rand -hex 32`). Never exposed to the browser.

const jwt = require('jsonwebtoken');
const { getDb } = require('./_db');

const COOKIE_NAME = 'lafzaly_session';
const SESSION_DAYS = 30;

function getSecret() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
  return process.env.JWT_SECRET;
}

function signSession(userId) {
  return jwt.sign({ userId }, getSecret(), { expiresIn: `${SESSION_DAYS}d` });
}

function sessionCookie(token) {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function clearCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  header.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    out[pair.slice(0, idx).trim()] = decodeURIComponent(pair.slice(idx + 1).trim());
  });
  return out;
}

// Returns the full, fresh user row from the database for the current
// session, or null if there's no valid session. Use this (not the raw JWT)
// wherever a route needs to know role or subscription status.
async function getSessionUser(req) {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  let payload;
  try {
    payload = jwt.verify(token, getSecret());
  } catch {
    return null;
  }
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT id, email, role, subscription_status, subscription_plan, subscription_end_date FROM users WHERE id = ?',
    args: [payload.userId]
  });
  return result.rows[0] || null;
}

// True if this user currently has paid or admin-level access.
// subscription_end_date is checked here too, so an expired-but-not-yet-synced
// subscription doesn't grant access just because the status column is stale.
function hasProAccess(user) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.subscription_status !== 'active') return false;
  if (user.subscription_end_date && new Date(user.subscription_end_date) < new Date()) return false;
  return true;
}

module.exports = { signSession, sessionCookie, clearCookie, parseCookies, getSessionUser, hasProAccess, COOKIE_NAME };
