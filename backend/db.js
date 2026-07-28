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

// Universal Query Helper transparently mapping SQL to Supabase REST SDK or PostgreSQL
async function query(text, params = []) {
  if (!pgPool && !supabaseClient) {
    await initDb();
  }

  if (dbType === 'postgres') {
    return await pgPool.query(text, params);
  }

  if (dbType === 'supabase_rest') {
    const cleanText = text.trim();

    // 1. SELECT COUNT(*) FROM table
    if (/SELECT\s+COUNT\(\*\)\s+as\s+count\s+FROM\s+([a-zA-Z0-9_]+)/i.test(cleanText)) {
      const match = cleanText.match(/FROM\s+([a-zA-Z0-9_]+)/i);
      const tableName = match[1];
      const { count, error } = await supabaseClient.from(tableName).select('*', { count: 'exact', head: true });
      if (error) throw new Error(error.message);
      return { rows: [{ count: count || 0 }], rowCount: 1 };
    }

    // 2. SELECT COALESCE(SUM(stars), 0) as total_stars FROM progress WHERE user_id = $1
    if (cleanText.includes('SUM(stars)') || cleanText.includes('total_stars')) {
      const userId = params[0];
      const { data, error } = await supabaseClient.from('progress').select('stars').eq('user_id', userId);
      if (error) throw new Error(error.message);
      const total = (data || []).reduce((acc, curr) => acc + (curr.stars || 0), 0);
      return { rows: [{ total_stars: total }], rowCount: 1 };
    }

    // 3. Leaderboard query
    if (cleanText.includes('FROM users u') && cleanText.includes('LEFT JOIN progress')) {
      const { data: users, error: userErr } = await supabaseClient
        .from('users')
        .select('id, name, total_points, current_level')
        .order('total_points', { ascending: false })
        .limit(50);
      if (userErr) throw new Error(userErr.message);

      const { data: allProgress } = await supabaseClient.from('progress').select('user_id, stars');
      const starsMap = {};
      (allProgress || []).forEach(p => {
        starsMap[p.user_id] = (starsMap[p.user_id] || 0) + (p.stars || 0);
      });

      const rows = (users || []).map(u => ({
        id: u.id,
        name: u.name,
        total_points: u.total_points || 0,
        current_level: u.current_level || 1,
        total_stars: starsMap[u.id] || 0
      })).sort((a, b) => b.total_points - a.total_points || b.total_stars - a.total_stars);

      return { rows, rowCount: rows.length };
    }

    // 4. SELECT * FROM users WHERE email = $1
    if (cleanText.includes('FROM users WHERE email')) {
      const email = params[0];
      const { data, error } = await supabaseClient.from('users').select('*').eq('email', email);
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 5. SELECT * FROM users WHERE id = $1
    if (cleanText.includes('FROM users WHERE id')) {
      const id = params[0];
      const { data, error } = await supabaseClient.from('users').select('*').eq('id', id);
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 6. INSERT INTO users ... RETURNING ...
    if (cleanText.startsWith('INSERT INTO users')) {
      const name = params[0];
      const email = params[1];
      const password_hash = params[2];
      const { data, error } = await supabaseClient
        .from('users')
        .insert({ name, email, password_hash, total_points: 0, current_level: 1 })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return { rows: [data], rowCount: 1 };
    }

    // 7. SELECT * FROM levels ORDER BY order_number ASC
    if (cleanText.includes('FROM levels') && !cleanText.includes('WHERE')) {
      const { data, error } = await supabaseClient.from('levels').select('*').order('order_number', { ascending: true });
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 8. SELECT * FROM levels WHERE id = $1
    if (cleanText.includes('FROM levels WHERE id')) {
      const levelId = params[0];
      const { data, error } = await supabaseClient.from('levels').select('*').eq('id', levelId);
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 9. SELECT * FROM questions WHERE level_id = $1
    if (cleanText.includes('FROM questions WHERE level_id')) {
      const levelId = params[0];
      const { data, error } = await supabaseClient.from('questions').select('*').eq('level_id', levelId).order('id', { ascending: true });
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 10. SELECT level_id, stars, score, completed FROM progress WHERE user_id = $1
    if (cleanText.includes('FROM progress WHERE user_id')) {
      const userId = params[0];
      const { data, error } = await supabaseClient.from('progress').select('*').eq('user_id', userId);
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 11. UPDATE users SET total_points, current_level
    if (cleanText.startsWith('UPDATE users SET')) {
      const pointsAdded = params[0];
      const nextLevel = params[1];
      const userId = params[2];

      const { data: user } = await supabaseClient.from('users').select('total_points, current_level').eq('id', userId).single();
      const currentPts = user?.total_points || 0;
      const currentLvl = user?.current_level || 1;

      const newPts = currentPts + pointsAdded;
      const newLvl = Math.max(currentLvl, nextLevel);

      const { data, error } = await supabaseClient
        .from('users')
        .update({ total_points: newPts, current_level: newLvl })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { rows: [data], rowCount: 1 };
    }

    // 12. INSERT INTO progress ... ON CONFLICT / UPSERT
    if (cleanText.includes('progress')) {
      const userId = params[0];
      const levelId = params[1];
      const stars = params[2];
      const score = params[3];

      const { data, error } = await supabaseClient
        .from('progress')
        .upsert({
          user_id: userId,
          level_id: levelId,
          stars,
          score,
          completed: true
        }, { onConflict: 'user_id,level_id' })
        .select();

      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }
  }

  return { rows: [], rowCount: 0 };
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
