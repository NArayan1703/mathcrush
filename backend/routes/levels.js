const express = require('express');
const router = express.Router();
const { query, queryOne } = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/levels (Get all levels with user's progress and unlock state)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current user's current_level
    const user = await queryOne('SELECT current_level FROM users WHERE id = $1', [userId]);
    const userMaxLevel = user ? user.current_level : 1;

    // Get all levels sorted by order_number
    const levelsRes = await query('SELECT * FROM levels ORDER BY order_number ASC');
    const levels = levelsRes.rows;

    // Get user progress
    const progressRes = await query('SELECT level_id, stars, score, completed FROM progress WHERE user_id = $1', [userId]);
    const progressMap = {};
    progressRes.rows.forEach(p => {
      progressMap[p.level_id] = p;
    });

    const enrichedLevels = levels.map(lvl => {
      const p = progressMap[lvl.id];
      // Level 1 is always unlocked. Other levels are unlocked if order_number <= userMaxLevel
      const isUnlocked = lvl.order_number === 1 || lvl.order_number <= userMaxLevel;
      const isCompleted = p ? Boolean(p.completed) : false;
      const stars = p ? p.stars : 0;
      const score = p ? p.score : 0;

      return {
        id: lvl.id,
        order_number: lvl.order_number,
        title: lvl.title,
        topic: lvl.topic,
        difficulty: lvl.difficulty,
        is_unlocked: isUnlocked,
        is_completed: isCompleted,
        stars,
        score
      };
    });

    return res.json({ levels: enrichedLevels });
  } catch (err) {
    console.error('Fetch Levels Error:', err);
    return res.status(500).json({ error: 'Failed to fetch levels' });
  }
});

// GET /api/levels/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const levelId = req.params.id;
    const level = await queryOne('SELECT * FROM levels WHERE id = $1', [levelId]);
    
    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }

    const userId = req.user.id;
    const user = await queryOne('SELECT current_level FROM users WHERE id = $1', [userId]);
    const userMaxLevel = user ? user.current_level : 1;
    const isUnlocked = level.order_number === 1 || level.order_number <= userMaxLevel;

    if (!isUnlocked) {
      return res.status(403).json({ error: 'Level is locked' });
    }

    return res.json({ level });
  } catch (err) {
    console.error('Fetch Level Error:', err);
    return res.status(500).json({ error: 'Failed to fetch level details' });
  }
});

// GET /api/levels/:id/questions
router.get('/:id/questions', authenticateToken, async (req, res) => {
  try {
    const levelId = req.params.id;
    const level = await queryOne('SELECT * FROM levels WHERE id = $1', [levelId]);
    
    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }

    const questionsRes = await query(
      'SELECT id, level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation FROM questions WHERE level_id = $1 ORDER BY id ASC',
      [levelId]
    );

    // Deduplicate questions by question_text to guarantee exactly 10 unique questions per level
    const uniqueQuestionsMap = new Map();
    (questionsRes.rows || []).forEach(q => {
      if (!uniqueQuestionsMap.has(q.question_text)) {
        uniqueQuestionsMap.set(q.question_text, q);
      }
    });
    const distinctQuestions = Array.from(uniqueQuestionsMap.values()).slice(0, 10);

    return res.json({
      level,
      questions: distinctQuestions
    });
  } catch (err) {
    console.error('Fetch Questions Error:', err);
    return res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

module.exports = router;
