// GET -> returns the current session's user + today's usage, or null if not logged in.
// Both counters (video count for Pro/admin, minutes for Free) are always
// computed and returned together, since the frontend picks whichever one
// applies to the user's actual plan.
const { getSessionUser, hasProAccess } = require('./_auth');
const { getDb } = require('./_db');

module.exports = async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) return res.status(200).json({ user: null });

    const db = getDb();
    const today = new Date().toISOString().slice(0, 10); // UTC calendar day — see README for why
    const result = await db.execute({
      sql: `SELECT
              COUNT(*) as videoCount,
              COALESCE(SUM(duration_seconds),0) as totalSeconds
            FROM generations
            WHERE user_id = ? AND status != 'failed' AND substr(created_at, 1, 10) = ?`,
      args: [user.id, today]
    });
    const row = result.rows[0];
    const isPro = hasProAccess(user);

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscription_status,
        subscriptionPlan: user.subscription_plan,
        isPro,
        videosToday: Number(row.videoCount),
        videoDailyLimit: user.role === 'admin' ? null : (isPro ? 3 : 0),
        minutesToday: Number(row.totalSeconds) / 60
      }
    });
  } catch (err) {
    console.error('auth-me error:', err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
