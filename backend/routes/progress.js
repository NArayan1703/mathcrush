const express = require('express');
const router = express.Router();
const { query, queryOne } = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Helper to calculate star rating based on accuracy percentage:
// 100% = 3 Stars, 80%+ = 2 Stars, 60%+ = 1 Star, <60% = 0 Stars
function calculateStars(correctCount, totalQuestions) {
  const percentage = (correctCount / totalQuestions) * 100;
  if (percentage >= 100) return 3;
  if (percentage >= 80) return 2;
  if (percentage >= 60) return 1;
  return 0;
}

// POST /api/progress/complete
router.post('/complete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { level_id, correct_count, total_questions = 10, score } = req.body;

    if (!level_id || correct_count === undefined) {
      return res.status(400).json({ error: 'level_id and correct_count are required' });
    }

    const level = await queryOne('SELECT * FROM levels WHERE id = $1', [level_id]);
    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }

    const calculatedStars = calculateStars(correct_count, total_questions);
    const earnedScore = score !== undefined ? score : correct_count * 10;
    const isPassed = calculatedStars > 0;

    // Check existing progress for user on this level
    const existingProgress = await queryOne(
      'SELECT * FROM progress WHERE user_id = $1 AND level_id = $2',
      [userId, level_id]
    );

    let previousStars = 0;
    let previousScore = 0;

    if (existingProgress) {
      previousStars = existingProgress.stars || 0;
      previousScore = existingProgress.score || 0;

      // Update progress with higher score & stars
      const newStars = Math.max(previousStars, calculatedStars);
      const newScore = Math.max(previousScore, earnedScore);
      const newCompleted = existingProgress.completed || isPassed;

      await query(
        `UPDATE progress 
         SET stars = $1, score = $2, completed = $3, completed_at = CURRENT_TIMESTAMP
         WHERE user_id = $4 AND level_id = $5`,
        [newStars, newScore, newCompleted ? 1 : 0, userId, level_id]
      );
    } else {
      await query(
        `INSERT INTO progress (user_id, level_id, stars, score, completed)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, level_id, calculatedStars, earnedScore, isPassed ? 1 : 0]
      );
    }

    // Update user's total points: add net point gain
    const pointGain = Math.max(0, earnedScore - previousScore);
    await query('UPDATE users SET total_points = total_points + $1 WHERE id = $2', [pointGain, userId]);

    // Unlock next level if level was passed
    let unlockedNextLevel = false;
    let newCurrentLevel = 1;

    const user = await queryOne('SELECT current_level FROM users WHERE id = $1', [userId]);
    newCurrentLevel = user ? user.current_level : 1;

    if (isPassed) {
      const nextOrderNumber = level.order_number + 1;
      // Check if next level exists
      const nextLevel = await queryOne('SELECT id FROM levels WHERE order_number = $1', [nextOrderNumber]);
      if (nextLevel && newCurrentLevel < nextOrderNumber) {
        await query('UPDATE users SET current_level = $1 WHERE id = $2', [nextOrderNumber, userId]);
        newCurrentLevel = nextOrderNumber;
        unlockedNextLevel = true;
      }
    }

    // Get updated total points and total stars
    const updatedUser = await queryOne('SELECT total_points, current_level FROM users WHERE id = $1', [userId]);
    const starsRes = await queryOne('SELECT COALESCE(SUM(stars), 0) as total_stars FROM progress WHERE user_id = $1', [userId]);

    return res.json({
      message: 'Level completed!',
      stars: calculatedStars,
      score: earnedScore,
      point_gain: pointGain,
      total_points: updatedUser.total_points,
      current_level: updatedUser.current_level,
      total_stars: parseInt(starsRes.total_stars || 0),
      unlocked_next_level: unlockedNextLevel
    });
  } catch (err) {
    console.error('Complete Progress Error:', err);
    return res.status(500).json({ error: 'Failed to record level completion' });
  }
});

// GET /api/progress
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const progressRes = await query(
      `SELECT p.*, l.title, l.topic, l.order_number
       FROM progress p
       JOIN levels l ON p.level_id = l.id
       WHERE p.user_id = $1
       ORDER BY l.order_number ASC`,
      [userId]
    );

    return res.json({ progress: progressRes.rows });
  } catch (err) {
    console.error('Fetch Progress Error:', err);
    return res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

module.exports = router;
