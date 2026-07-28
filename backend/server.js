const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDb } = require('./db');

const authRoutes = require('./routes/auth');
const levelsRoutes = require('./routes/levels');
const progressRoutes = require('./routes/progress');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Math Crush API', time: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/levels', levelsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Start Server
async function startServer() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`🍬 Math Crush Backend Server running on http://localhost:${PORT}`);
  });
}

startServer();
