const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const { initialLevels, initialQuestions } = require('./seedData');

let pgPool = null;
let supabaseClient = null;
let dbType = 'none'; // 'supabase_rest' | 'postgres' | 'none'
let lastDbError = null;

// Initialize Database Connection
async function initDb() {
  if (pgPool || supabaseClient) return; // Prevent duplicate initialization

  const supabaseUrl = process.env.SUPABASE_URL || 'https://lwtbzjvdczntaxzsdauk.supabase.co';
  const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

  // 1. Try Supabase HTTPS REST SDK first if credentials are provided
  if (supabaseUrl && supabaseKey) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
      dbType = 'supabase_rest';
      lastDbError = null;
      console.log('⚡ Connected to Supabase via HTTPS REST SDK successfully.');
      await seedInitialDataSupabase();
      return;
    } catch (err) {
      console.warn('⚠️ Supabase REST client initialization error:', err.message);
    }
  }

  // 2. Fallback to direct PostgreSQL Pool
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mathcrush';
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
    dbType = 'postgres';
    lastDbError = null;
    console.log('⚡ Connected to PostgreSQL database successfully.');
    await setupPostgresTables();
    await seedInitialDataPostgres();
  } catch (err) {
    lastDbError = err.message;
    console.error('❌ Database connection error:', err.message);
    throw err;
  }
}

// PostgreSQL Table Setup
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

// Seed Initial Data for PostgreSQL
async function seedInitialDataPostgres() {
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

// Seed Initial Data for Supabase REST SDK
async function seedInitialDataSupabase() {
  if (!supabaseClient) return;
  const { data: existingLevels } = await supabaseClient.from('levels').select('id');
  if (!existingLevels || existingLevels.length === 0) {
    console.log('🌱 Seeding initial levels & math questions via Supabase REST SDK...');
    for (const lvl of initialLevels) {
      const { data: insertedLevel, error: lvlErr } = await supabaseClient
        .from('levels')
        .insert({
          order_number: lvl.order_number,
          title: lvl.title,
          topic: lvl.topic,
          difficulty: lvl.difficulty
        })
        .select('id')
        .single();

      if (lvlErr) {
        console.error('Level seed error:', lvlErr.message);
        continue;
      }

      const questions = initialQuestions[lvl.order_number] || [];
      const questionsToInsert = questions.map(q => ({
        level_id: insertedLevel.id,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer,
        explanation: q.explanation
      }));

      await supabaseClient.from('questions').insert(questionsToInsert);
    }
    console.log('✅ Supabase REST Seed completed: 5 Levels with 10 questions each.');
  }
}

// Universal Query Helper
async function query(text, params = []) {
  if (!pgPool && !supabaseClient) {
    await initDb();
  }

  if (dbType === 'postgres') {
    return await pgPool.query(text, params);
  } else if (dbType === 'supabase_rest') {
    // Return mock rows object for query callers if pgPool isn't active
    if (pgPool) return await pgPool.query(text, params);
    throw new Error('Using Supabase REST SDK mode. Please use getSupabaseClient()');
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
  getSupabaseClient: () => supabaseClient,
  getDbType: () => dbType,
  getLastDbError: () => lastDbError
};
