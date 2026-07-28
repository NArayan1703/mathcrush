const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDb, getDbType, getLastDbError } = require('./db');

const authRoutes = require('./routes/auth');
const levelsRoutes = require('./routes/levels');
const progressRoutes = require('./routes/progress');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check with DB diagnostics
app.get('/api/health', async (req, res) => {
  let dbStatus = getDbType();
  let dbError = getLastDbError();
  
  if (dbStatus === 'none' && !dbError) {
    try {
      await initDb();
      dbStatus = getDbType();
    } catch (err) {
      dbError = err.message;
    }
  }

  res.json({
    status: 'ok',
    app: 'Math Crush API',
    database_type: dbStatus,
    has_database_url: Boolean(process.env.DATABASE_URL),
    database_error: dbError,
    time: new Date().toISOString()
  });
});

// Ensure DB is initialized before processing API requests (for Vercel serverless environment)
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDb();
      dbInitialized = true;
    } catch (err) {
      console.error('Middleware DB init error:', err.message);
      return res.status(500).json({ error: 'Database Connection Error: ' + err.message });
    }
  }
  next();
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
