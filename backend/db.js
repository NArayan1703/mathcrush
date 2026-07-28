const { Pool } = require('pg');
const { initialLevels, initialQuestions } = require('./seedData');

let pgPool = null;
let lastDbError = null;

// Initialize PostgreSQL Connection
async function initDb() {
  if (pgPool) return; // Prevent duplicate initialization

  let connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mathcrush';
  
  // Auto-correct Supabase transaction pooler port 6543 -> session pooler port 5432 for pg compatibility
  if (connectionString.includes('pooler.supabase.com:6543')) {
    connectionString = connectionString.replace(':6543', ':5432');
  }

  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

  try {
    const pool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      max: 10
    });
    
    // Test connection
    const client = await pool.connect();
    client.release();
    
    pgPool = pool;
    lastDbError = null;
    console.log('⚡ Connected to PostgreSQL database successfully.');
    await setupPostgresTables();
    await seedInitialData();
  } catch (err) {
    lastDbError = err.message;
    console.error('❌ PostgreSQL connection error:', err.message);
    throw err;
  }
}

// PostgreSQL Setup
async function setupPostgresTables() {
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      total_points INT DEFAULT 0,
      current_level INT DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS levels (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      topic VARCHAR(255) NOT NULL,
      difficulty VARCHAR(50) NOT NULL,
      order_number INT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      level_id INT REFERENCES levels(id) ON DELETE CASCADE,
      question_text TEXT NOT NULL,
      option_a VARCHAR(255) NOT NULL,
      option_b VARCHAR(255) NOT NULL,
      option_c VARCHAR(255) NOT NULL,
      option_d VARCHAR(255) NOT NULL,
      correct_answer VARCHAR(10) NOT NULL,
      explanation TEXT
    );

    CREATE TABLE IF NOT EXISTS progress (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      level_id INT REFERENCES levels(id) ON DELETE CASCADE,
      stars INT DEFAULT 0,
      score INT DEFAULT 0,
      completed BOOLEAN DEFAULT FALSE,
      completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, level_id)
    );
  `);
}

// Seed Initial Data if empty
async function seedInitialData() {
  const levelsCount = await queryOne('SELECT COUNT(*) as count FROM levels');
  if (parseInt(levelsCount?.count || 0) === 0) {
    console.log('🌱 Seeding initial levels & math questions...');
    for (const lvl of initialLevels) {
      const res = await query(
        'INSERT INTO levels (order_number, title, topic, difficulty) VALUES ($1, $2, $3, $4) RETURNING id',
        [lvl.order_number, lvl.title, lvl.topic, lvl.difficulty]
      );
      const levelId = res.rows[0].id;

      const questions = initialQuestions[lvl.order_number] || [];
      for (const q of questions) {
        await query(
          `INSERT INTO questions (level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [levelId, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.explanation]
        );
      }
    }
    console.log('✅ Seed completed: 5 Levels with 10 questions each.');
  }
}

// PostgreSQL Query Helper
async function query(text, params = []) {
  if (!pgPool) {
    await initDb();
  }
  return await pgPool.query(text, params);
}

async function queryOne(text, params = []) {
  const res = await query(text, params);
  return res.rows[0] || null;
}

module.exports = {
  initDb,
  query,
  queryOne,
  getDbType: () => (pgPool ? 'postgres' : 'none'),
  getLastDbError: () => lastDbError
};
