const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, queryOne } = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user exists
    const existingUser = await queryOne('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const newUserRes = await query(
      `INSERT INTO users (name, email, password_hash, total_points, current_level)
       VALUES ($1, $2, $3, 0, 1) RETURNING id, name, email, total_points, current_level, created_at`,
      [name.trim(), email.toLowerCase().trim(), passwordHash]
    );

    const user = newUserRes.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        total_points: user.total_points || 0,
        current_level: user.current_level || 1,
        total_stars: 0
      }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await queryOne('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Fetch total stars earned
    const starsRes = await queryOne(
      'SELECT COALESCE(SUM(stars), 0) as total_stars FROM progress WHERE user_id = $1',
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        total_points: user.total_points || 0,
        current_level: user.current_level || 1,
        total_stars: parseInt(starsRes?.total_stars || 0)
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await queryOne('SELECT id, name, email, total_points, current_level FROM users WHERE id = $1', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const starsRes = await queryOne(
      'SELECT COALESCE(SUM(stars), 0) as total_stars FROM progress WHERE user_id = $1',
      [user.id]
    );

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        total_points: user.total_points || 0,
        current_level: user.current_level || 1,
        total_stars: parseInt(starsRes?.total_stars || 0)
      }
    });
  } catch (err) {
    console.error('Me Auth Error:', err);
    return res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;
