// GET -> admin-only dashboard data: users, their usage, and recent jobs.
// Role is re-checked server-side against the database on every request —
// never trust a role claim from the frontend.
const { getSessionUser } = require('./_auth');
const { getDb } = require('./_db');

module.exports = async (req, res) => {
  const user = await getSessionUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  try {
    const db = getDb();
    const today = new Date().toISOString().slice(0, 10);

    const users = await db.execute({
      sql: `SELECT u.id, u.email, u.role, u.subscription_status, u.subscription_plan, u.created_at,
                   COALESCE(g.videos_today, 0) as videos_today,
                   COALESCE(g.minutes_today, 0) as minutes_today
            FROM users u
            LEFT JOIN (
              SELECT user_id, COUNT(*) as videos_today, SUM(duration_seconds)/60.0 as minutes_today
              FROM generations
              WHERE status != 'failed' AND substr(created_at,1,10) = ?
              GROUP BY user_id
            ) g ON g.user_id = u.id
            ORDER BY u.created_at DESC LIMIT 200`,
      args: [today]
    });

    const jobs = await db.execute({
      sql: `SELECT g.id, g.user_id, u.email, g.original_filename, g.duration_seconds, g.status, g.error, g.created_at
            FROM generations g LEFT JOIN users u ON u.id = g.user_id
            ORDER BY g.created_at DESC LIMIT 100`
    });

    const failedCount = await db.execute({
      sql: `SELECT COUNT(*) as c FROM generations WHERE status = 'failed' AND substr(created_at,1,10) = ?`,
      args: [today]
    });

    return res.status(200).json({
      users: users.rows,
      jobs: jobs.rows,
      failedToday: Number(failedCount.rows[0].c)
    });
  } catch (err) {
    console.error('admin-stats error:', err);
    return res.status(500).json({ error: 'Something went wrong loading admin data.' });
  }
};
