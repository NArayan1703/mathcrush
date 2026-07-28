const { Pool } = require('pg');
const Database = require('better-sqlite3');
const path = require('path');
const { initialLevels, initialQuestions } = require('./seedData');

let dbType = 'sqlite'; // 'postgres' or 'sqlite'
let pgPool = null;
let sqliteDb = null;

// Initialize Database Connection
async function initDb() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mathcrush';

  try {
    // Attempt Postgres connection
    const testPool = new Pool({
      connectionString,
      connectionTimeoutMillis: 2000
    });
    
    // Quick test query
    const client = await testPool.connect();
    client.release();
    
    pgPool = testPool;
    dbType = 'postgres';
    console.log('⚡ Connected to PostgreSQL database successfully.');
    await setupPostgresTables();
  } catch (err) {
    console.log('ℹ️ PostgreSQL not available, using embedded SQLite database for seamless demo setup.');
    dbType = 'sqlite';
    const dbPath = path.join(__dirname, 'mathcrush.db');
    sqliteDb = new Database(dbPath);
    setupSqliteTables();
  }

  await seedInitialData();
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

// SQLite Setup
function setupSqliteTables() {
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      total_points INTEGER DEFAULT 0,
      current_level INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS levels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      topic TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      order_number INTEGER UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level_id INTEGER REFERENCES levels(id) ON DELETE CASCADE,
      question_text TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      explanation TEXT
    );

    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      level_id INTEGER REFERENCES levels(id) ON DELETE CASCADE,
      stars INTEGER DEFAULT 0,
      score INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, level_id)
    );
  `);
}

// Seed Initial Data if empty
async function seedInitialData() {
  const levelsCount = await queryOne('SELECT COUNT(*) as count FROM levels');
  if (parseInt(levelsCount.count) === 0) {
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

// Universal Query Helper
async function query(text, params = []) {
  if (dbType === 'postgres') {
    const result = await pgPool.query(text, params);
    return result;
  } else {
    // Convert $1, $2, $3... to ? for better-sqlite3
    let sql = text.replace(/\$(\d+)/g, '?');
    
    let isInsertReturning = false;
    if (/RETURNING\s+/i.test(sql)) {
      isInsertReturning = true;
      sql = sql.replace(/RETURNING\s+.*$/i, '');
    }

    const stmt = sqliteDb.prepare(sql);
    let rows = [];

    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      rows = stmt.all(...params);
    } else {
      const info = stmt.run(...params);
      if (isInsertReturning) {
        // Fetch inserted row by lastInsertRowid
        const tableMatch = sql.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)/i);
        if (tableMatch && tableMatch[1]) {
          const insertedRow = sqliteDb.prepare(`SELECT * FROM ${tableMatch[1]} WHERE id = ?`).get(info.lastInsertRowid);
          if (insertedRow) {
            rows = [insertedRow];
          } else {
            rows = [{ id: info.lastInsertRowid }];
          }
        } else {
          rows = [{ id: info.lastInsertRowid }];
        }
      }
    }

    return { rows, rowCount: rows.length };
  }
}

async function queryOne(text, params = []) {
  const res = await query(text, params);
  return res.rows[0] || null;
}

module.exports = {
  initDb,
  query,
  queryOne
};
