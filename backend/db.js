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
      const userId = params[0];
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
      const id = params[0];
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

    // 7. SELECT * FROM levels ORDER BY order_number ASC
    if (lowerText.includes('from levels') && !lowerText.includes('where')) {
      const { data, error } = await supabaseClient.from('levels').select('*').order('order_number', { ascending: true });
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 8. SELECT * FROM levels WHERE order_number = $1 OR id = $1
    if (lowerText.includes('from levels') && lowerText.includes('order_number')) {
      const orderNum = params[0];
      const { data, error } = await supabaseClient.from('levels').select('*').eq('order_number', orderNum);
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }
    if (lowerText.includes('from levels') && lowerText.includes('where id')) {
      const levelId = params[0];
      const { data, error } = await supabaseClient.from('levels').select('*').eq('id', levelId);
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 9. SELECT * FROM questions WHERE level_id = $1
    if (lowerText.includes('from questions') && lowerText.includes('level_id')) {
      const levelId = params[0];
      const { data, error } = await supabaseClient.from('questions').select('*').eq('level_id', levelId).order('id', { ascending: true });
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 10. SELECT * FROM progress WHERE user_id = $1 AND level_id = $2
    if (lowerText.includes('from progress') && lowerText.includes('user_id') && lowerText.includes('level_id')) {
      const userId = params[0];
      const levelId = params[1];
      const { data, error } = await supabaseClient.from('progress').select('*').eq('user_id', userId).eq('level_id', levelId);
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 11. SELECT p.*, l.title... FROM progress p JOIN levels l ... WHERE p.user_id = $1
    if (lowerText.includes('from progress') && lowerText.includes('user_id')) {
      const userId = params[0];
      const { data: progressData, error: progErr } = await supabaseClient.from('progress').select('*').eq('user_id', userId);
      if (progErr) throw new Error(progErr.message);

      const { data: levelsData, error: lvlErr } = await supabaseClient.from('levels').select('*');
      if (lvlErr) throw new Error(lvlErr.message);

      const levelMap = {};
      (levelsData || []).forEach(l => { levelMap[l.id] = l; });

      const rows = (progressData || []).map(p => {
        const lvl = levelMap[p.level_id] || {};
        return {
          ...p,
          title: lvl.title || '',
          topic: lvl.topic || '',
          order_number: lvl.order_number || 1
        };
      }).sort((a, b) => a.order_number - b.order_number);

      return { rows, rowCount: rows.length };
    }

    // 12. UPDATE users SET current_level = $1 WHERE id = $2
    if (lowerText.includes('set current_level')) {
      const nextLevel = params[0];
      const userId = params[1];
      const { data, error } = await supabaseClient
        .from('users')
        .update({ current_level: nextLevel })
        .eq('id', userId)
        .select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 13. UPDATE users SET total_points = total_points + $1 WHERE id = $2
    if (lowerText.includes('set total_points')) {
      const pointGain = params[0];
      const userId = params[1];
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

    // 14. UPDATE progress SET stars = $1, score = $2, completed = $3... WHERE user_id = $4 AND level_id = $5
    if (lowerText.includes('update progress')) {
      const newStars = params[0];
      const newScore = params[1];
      const newCompleted = Boolean(params[2]);
      const userId = params[3];
      const levelId = params[4];
      const { data, error } = await supabaseClient
        .from('progress')
        .update({ stars: newStars, score: newScore, completed: newCompleted })
        .eq('user_id', userId)
        .eq('level_id', levelId)
        .select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // 15. INSERT INTO progress (user_id, level_id, stars, score, completed)
    if (lowerText.includes('insert into progress')) {
      const userId = params[0];
      const levelId = params[1];
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
