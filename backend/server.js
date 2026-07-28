const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDb, getDbType } = require('./db');

const authRoutes = require('./routes/auth');
const levelsRoutes = require('./routes/levels');
const progressRoutes = require('./routes/progress');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure DB is initialized before processing API requests (for Vercel serverless environment)
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
  next();
});

// Health Check with DB diagnostics
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Math Crush API',
    database_type: getDbType(),
    has_database_url: Boolean(process.env.DATABASE_URL),
    time: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/levels', levelsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Start Server locally if run directly via node server.js
if (require.main === module) {
  initDb().then(() => {
    app.listen(PORT, () => {
      console.log(`🍬 Math Crush Backend Server running on http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
