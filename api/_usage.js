// Server-side daily usage for TEXT captions (video usage lives in the `generations` table).
// Free users and guests are limited; admins and active Pro subscribers are unlimited.
// Guests are keyed by IP so clearing the browser or opening a new tab doesn't reset the limit.
const { getDb } = require('./_db');
const { hasProAccess } = require('./_auth');

const FREE_DAILY_TEXT = 10;
let ready;

function ensureTable() {
  if (!ready) {
    ready = getDb().execute({
      sql: `CREATE TABLE IF NOT EXISTS text_usage (
              usage_key TEXT NOT NULL,
              day TEXT NOT NULL,
              used INTEGER NOT NULL DEFAULT 0,
              PRIMARY KEY (usage_key, day)
            )`
    }).catch(e => { ready = null; throw e; });
  }
  return ready;
}

const today = () => new Date().toISOString().slice(0, 10);   // UTC day, same as video usage

function usageKey(req, user) {
  if (user) return 'u:' + user.id;
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  return 'ip:' + ip;
}

// limit === null means unlimited
function limitFor(user) {
  if (user && (user.role === 'admin' || hasProAccess(user))) return null;
  return FREE_DAILY_TEXT;
}

async function getTextUsed(key) {
  await ensureTable();
  const r = await getDb().execute({ sql: 'SELECT used FROM text_usage WHERE usage_key = ? AND day = ?', args: [key, today()] });
  return r.rows[0] ? Number(r.rows[0].used) : 0;
}

async function addTextUsed(key, n) {
  await ensureTable();
  await getDb().execute({
    sql: `INSERT INTO text_usage (usage_key, day, used) VALUES (?, ?, ?)
          ON CONFLICT (usage_key, day) DO UPDATE SET used = text_usage.used + EXCLUDED.used`,
    args: [key, today(), n]
  });
}

module.exports = { FREE_DAILY_TEXT, usageKey, limitFor, getTextUsed, addTextUsed };
