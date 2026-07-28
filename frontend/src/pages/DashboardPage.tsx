import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Star, Sparkles, Map, Play, BookOpen, Target } from 'lucide-react';
import api from '../services/api';
import type { Level } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await api.get('/levels');
        setLevels(res.data.levels || []);
      } catch (err) {
        console.error('Failed to load levels:', err);
      }
    };
    fetchLevels();
  }, []);

  if (!user) return null;

  const totalLevels = levels.length || 5;
  const completedLevelsCount = levels.filter(l => l.is_completed).length;
  const progressPercentage = Math.round((completedLevelsCount / totalLevels) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="candy-card-solid p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
      >
        <div className="space-y-2 text-center md:text-left z-10">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Hello, <span className="text-amber-300">{user.name}</span>! 🍬
          </h1>
          <p className="text-purple-200 text-sm sm:text-base font-medium max-w-xl">
            You are currently on <span className="text-pink-300 font-extrabold">Level {user.current_level}</span>. Keep completing questions to earn stars and top the leaderboard!
          </p>
        </div>

        {/* Start Playing CTA */}
        <button
          onClick={() => navigate('/map')}
          className="btn-candy-yellow px-8 py-5 text-xl rounded-2xl flex items-center gap-3 animate-candy-bounce shadow-xl z-10 shrink-0"
        >
          <Play className="w-7 h-7 fill-slate-950 text-slate-950" />
          <span>START PLAYING! 🎮</span>
        </button>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        
        {/* Total Points */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="candy-card p-5 text-center flex flex-col items-center justify-center border-amber-500/40"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 mb-3 shadow-md">
            <Sparkles className="w-6 h-6 fill-amber-400" />
          </div>
          <span className="text-3xl font-black text-amber-300">{user.total_points}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-200 mt-1">Total Points</span>
        </motion.div>

        {/* Current Level */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="candy-card p-5 text-center flex flex-col items-center justify-center border-pink-500/40"
        >
          <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400 flex items-center justify-center text-2xl mb-3 shadow-md">
            🍬
          </div>
          <span className="text-3xl font-black text-pink-400">Level {user.current_level}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-200 mt-1">Current Level</span>
        </motion.div>

        {/* Total Stars */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="candy-card p-5 text-center flex flex-col items-center justify-center border-yellow-500/40"
        >
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-400 flex items-center justify-center text-yellow-300 mb-3 shadow-md">
            <Star className="w-6 h-6 fill-yellow-400" />
          </div>
          <span className="text-3xl font-black text-yellow-300">{user.total_stars} ⭐</span>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-200 mt-1">Stars Earned</span>
        </motion.div>

        {/* Progress Percentage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="candy-card p-5 text-center flex flex-col items-center justify-center border-emerald-500/40"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 mb-3 shadow-md">
            <Target className="w-6 h-6" />
          </div>
          <span className="text-3xl font-black text-emerald-400">{progressPercentage}%</span>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-200 mt-1">Map Completion</span>
        </motion.div>

      </div>

      {/* Progress Bar Component */}
      <div className="candy-card p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Map className="w-6 h-6 text-pink-400" />
            <h3 className="text-xl font-black text-white">Your Game Progress</h3>
          </div>
          <span className="text-sm font-extrabold text-amber-300">
            {completedLevelsCount} of {totalLevels} Levels Completed
          </span>
        </div>

        {/* Multi-segmented Progress Bar */}
        <div className="w-full h-5 bg-slate-900/80 rounded-full overflow-hidden p-1 border border-purple-500/40 relative">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 rounded-full transition-all duration-700 shadow-md"
            style={{ width: `${Math.max(5, progressPercentage)}%` }}
          />
        </div>
      </div>

      {/* Levels Quick List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>Math Levels & Topics</span>
          </h3>
          <button
            onClick={() => navigate('/map')}
            className="text-sm font-bold text-amber-300 hover:text-white transition-colors"
          >
            View Full Level Map →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {levels.map((lvl) => (
            <div
              key={lvl.id}
              onClick={() => lvl.is_unlocked && navigate(`/play/${lvl.id}`)}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between cursor-pointer ${
                lvl.is_completed
                  ? 'bg-purple-950/60 border-emerald-500/60 hover:border-emerald-400'
                  : lvl.is_unlocked
                  ? 'bg-purple-900/40 border-pink-500/60 hover:border-amber-400 hover:scale-[1.02]'
                  : 'bg-slate-950/50 border-purple-950/60 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">
                  {lvl.is_completed ? '⭐' : lvl.is_unlocked ? '🍬' : '🔒'}
                </div>
                <div>
                  <h4 className="font-black text-white text-base">{lvl.title}</h4>
                  <p className="text-xs text-purple-300 font-bold">{lvl.topic} • {lvl.difficulty}</p>
                </div>
              </div>

              {lvl.is_completed && (
                <div className="flex items-center gap-1 text-amber-300 font-black text-sm">
                  <span>{lvl.stars} / 3</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
