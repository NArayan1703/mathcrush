const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/leaderboard
router.get('/', authenticateToken, async (req, res) => {
  try {
    const leaderboardRes = await query(
      `SELECT u.id, u.name, u.total_points, u.current_level,
              COALESCE(SUM(p.stars), 0) as total_stars
       FROM users u
       LEFT JOIN progress p ON u.id = p.user_id
       GROUP BY u.id, u.name, u.total_points, u.current_level
       ORDER BY u.total_points DESC, total_stars DESC, u.id ASC
       LIMIT 50`
    );

    const leaderboard = leaderboardRes.rows.map((row, index) => ({
      rank: index + 1,
      id: row.id,
      name: row.name,
      total_points: row.total_points,
      current_level: row.current_level,
      total_stars: parseInt(row.total_stars || 0),
      is_current_user: row.id === req.user.id
    }));

    return res.json({ leaderboard });
  } catch (err) {
    console.error('Leaderboard Error:', err);
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
