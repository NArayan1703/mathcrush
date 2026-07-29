const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://lwtbzjvdczntaxzsdauk.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

// Create Supabase HTTPS REST Client (Port 443 - zero IPv6 socket errors)
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Universal Query Helper converting SQL queries to Supabase REST calls over HTTPS Port 443
async function query(text, params = []) {
  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();

  try {
    // 1. SELECT COUNT(*) FROM table
    if (/SELECT\s+COUNT\(\*\)\s+as\s+count\s+FROM\s+([a-zA-Z0-9_]+)/i.test(cleanText)) {
      const match = cleanText.match(/FROM\s+([a-zA-Z0-9_]+)/i);
      const tableName = match[1];
      const { count, error } = await supabaseClient.from(tableName).select('*', { count: 'exact', head: true });
      if (error) throw new Error(error.message);
      return { rows: [{ count: count || 0 }], rowCount: 1 };
    }

    // 2. SELECT COALESCE(SUM(stars), 0) as total_stars FROM progress WHERE user_id = $1
    if (lowerText.includes('sum(stars)') || lowerText.includes('total_stars')) {
      const rawUserId = params[0];
      const userId = isNaN(Number(rawUserId)) ? rawUserId : Number(rawUserId);
      const { data, error } = await supabaseClient.from('progress').select('stars').eq('user_id', userId);
      if (error) throw new Error(error.message);
      const total = (data || []).reduce((acc, curr) => acc + (curr.stars || 0), 0);
      return { rows: [{ total_stars: total }], rowCount: 1 };
    }

    // 3. Leaderboard query
    if (lowerText.includes('from users') && (lowerText.includes('progress') || lowerText.includes('join'))) {
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
    if (lowerText.includes('from users') && lowerText.includes('email')) {
      const email = params[0];
      const { data, error } = await supabaseClient.from('users').select('*').eq('email', email);
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 5. SELECT * FROM users WHERE id = $1
    if (lowerText.includes('from users') && lowerText.includes('where id')) {
      const rawId = params[0];
      const id = isNaN(Number(rawId)) ? rawId : Number(rawId);
      const { data, error } = await supabaseClient.from('users').select('*').eq('id', id);
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 6. INSERT INTO users ... RETURNING ...
    if (lowerText.startsWith('insert into users')) {
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

    // 7. SELECT * FROM levels WHERE order_number = $1
    if (lowerText.includes('from levels') && lowerText.includes('where') && lowerText.includes('order_number')) {
      const rawOrder = params[0];
      const orderNum = isNaN(Number(rawOrder)) ? rawOrder : Number(rawOrder);
      const { data, error } = await supabaseClient.from('levels').select('*').eq('order_number', orderNum);
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 8. SELECT * FROM levels WHERE id = $1
    if (lowerText.includes('from levels') && lowerText.includes('where id')) {
      const rawId = params[0];
      const levelId = isNaN(Number(rawId)) ? rawId : Number(rawId);
      const { data, error } = await supabaseClient.from('levels').select('*').eq('id', levelId);
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 9. SELECT * FROM levels (all levels)
    if (lowerText.includes('from levels')) {
      const { data, error } = await supabaseClient.from('levels').select('*').order('order_number', { ascending: true });
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 10. SELECT * FROM questions WHERE level_id = $1
    if (lowerText.includes('from questions') && lowerText.includes('level_id')) {
      const rawId = params[0];
      const levelId = isNaN(Number(rawId)) ? rawId : Number(rawId);
      const { data, error } = await supabaseClient.from('questions').select('*').eq('level_id', levelId).order('id', { ascending: true });
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 11. SELECT * FROM progress WHERE user_id = $1 AND level_id = $2
    if (lowerText.includes('from progress') && lowerText.includes('where') && params.length >= 2) {
      const rawUserId = params[0];
      const rawLevelId = params[1];
      const userId = isNaN(Number(rawUserId)) ? rawUserId : Number(rawUserId);
      const levelId = isNaN(Number(rawLevelId)) ? rawLevelId : Number(rawLevelId);
      const { data, error } = await supabaseClient.from('progress').select('*').eq('user_id', userId).eq('level_id', levelId);
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 12. SELECT * FROM progress WHERE user_id = $1
    if (lowerText.includes('from progress') && lowerText.includes('where') && params.length === 1) {
      const rawUserId = params[0];
      const userId = isNaN(Number(rawUserId)) ? rawUserId : Number(rawUserId);
      const { data: progressData, error: progErr } = await supabaseClient.from('progress').select('*').eq('user_id', userId);
      if (progErr) throw new Error(progErr.message);

      return { rows: progressData || [], rowCount: (progressData || []).length };
    }

    // 13. UPDATE users SET current_level = $1 WHERE id = $2
    if (lowerText.includes('set current_level')) {
      const nextLevel = params[0];
      const rawUserId = params[1];
      const userId = isNaN(Number(rawUserId)) ? rawUserId : Number(rawUserId);
      const { data, error } = await supabaseClient
        .from('users')
        .update({ current_level: nextLevel })
        .eq('id', userId)
        .select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 14. UPDATE users SET total_points = total_points + $1 WHERE id = $2
    if (lowerText.includes('set total_points')) {
      const pointGain = params[0];
      const rawUserId = params[1];
      const userId = isNaN(Number(rawUserId)) ? rawUserId : Number(rawUserId);
      const { data: user } = await supabaseClient.from('users').select('total_points').eq('id', userId).single();
      const currentPts = user?.total_points || 0;
      const { data, error } = await supabaseClient
        .from('users')
        .update({ total_points: currentPts + pointGain })
        .eq('id', userId)
        .select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 15. UPDATE progress SET stars = $1, score = $2, completed = $3... WHERE user_id = $4 AND level_id = $5
    if (lowerText.includes('update progress')) {
      const newStars = params[0];
      const newScore = params[1];
      const newCompleted = Boolean(params[2]);
      const rawUserId = params[3];
      const rawLevelId = params[4];
      const userId = isNaN(Number(rawUserId)) ? rawUserId : Number(rawUserId);
      const levelId = isNaN(Number(rawLevelId)) ? rawLevelId : Number(rawLevelId);
      const { data, error } = await supabaseClient
        .from('progress')
        .update({ stars: newStars, score: newScore, completed: newCompleted })
        .eq('user_id', userId)
        .eq('level_id', levelId)
        .select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 16. INSERT INTO progress (user_id, level_id, stars, score, completed)
    if (lowerText.includes('insert into progress')) {
      const rawUserId = params[0];
      const rawLevelId = params[1];
      const userId = isNaN(Number(rawUserId)) ? rawUserId : Number(rawUserId);
      const levelId = isNaN(Number(rawLevelId)) ? rawLevelId : Number(rawLevelId);
      const stars = params[2];
      const score = params[3];
      const completed = Boolean(params[4]);
      const { data, error } = await supabaseClient
        .from('progress')
        .insert({ user_id: userId, level_id: levelId, stars, score, completed })
        .select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

  } catch (err) {
    console.error('Supabase REST Query Error:', err.message);
    throw err;
  }

  return { rows: [], rowCount: 0 };
}

async function queryOne(text, params = []) {
  const res = await query(text, params);
  return res.rows[0] || null;
}

module.exports = {
  initDb: async () => {},
  query,
  queryOne,
  getSupabaseClient: () => supabaseClient,
  getDbType: () => 'supabase_rest',
  getLastDbError: () => null
};
