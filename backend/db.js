const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mathcrush';
const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

// Configure clean PostgreSQL connection pool
const pool = new Pool({
  connectionString: connectionString.includes(':6543') ? connectionString.replace(':6543', ':5432') : connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  max: 10
});

async function initDb() {
  // Database tables are managed via Supabase SQL Editor
  return Promise.resolve();
}

async function query(text, params = []) {
  return await pool.query(text, params);
}

async function queryOne(text, params = []) {
  const res = await query(text, params);
  return res.rows[0] || null;
}

module.exports = {
  initDb,
  query,
  queryOne,
  getDbType: () => 'postgres',
  getLastDbError: () => null
};
