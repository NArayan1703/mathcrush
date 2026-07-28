import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Award, RefreshCw } from 'lucide-react';
import api from '../services/api';
import type { LeaderboardEntry } from '../types';

export const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leaderboard');
      setLeaderboard(res.data.leaderboard || []);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs shadow-md"
        >
          <Trophy className="w-4 h-4 text-amber-300 fill-amber-400" />
          <span>Hall of Fame</span>
        </motion.div>
        <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-amber-300 via-yellow-400 to-pink-400 bg-clip-text text-transparent drop-shadow-md">
          LEADERBOARD 🏆
        </h1>
        <p className="text-purple-200 text-sm font-semibold max-w-md mx-auto">
          See who is crushing math problems with the highest scores & stars!
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <span className="text-purple-200 font-bold">Loading Champions...</span>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 items-end">
              
              {/* 2nd Place (Silver) */}
              {topThree[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="candy-card p-6 text-center border-slate-300/60 relative flex flex-col items-center order-2 md:order-1"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-300 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg border-4 border-white mb-3">
                    🥈
                  </div>
                  <span className="px-3 py-0.5 rounded-full bg-slate-800 text-slate-200 font-extrabold text-xs uppercase mb-2">
                    #2 Rank
                  </span>
                  <h3 className="text-xl font-black text-white">{topThree[1].name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-amber-300 font-extrabold text-base">
                    <Sparkles className="w-4 h-4 fill-amber-400" />
                    <span>{topThree[1].total_points} Pts</span>
                  </div>
                  <span className="text-xs text-yellow-300 font-bold mt-1">
                    {topThree[1].total_stars} ⭐ Stars
                  </span>
                </motion.div>
              )}

              {/* 1st Place (Gold Champion) */}
              {topThree[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="candy-card-solid p-8 text-center border-4 border-amber-400 relative flex flex-col items-center shadow-2xl order-1 md:order-2 md:-translate-y-4"
                >
                  <div className="absolute -top-6 text-4xl animate-bounce">👑</div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black text-4xl flex items-center justify-center shadow-xl border-4 border-white mb-3 mt-2">
                    🥇
                  </div>
                  <span className="px-4 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase mb-2 shadow-md">
                    #1 CHAMPION
                  </span>
                  <h3 className="text-2xl font-black text-white">{topThree[0].name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-amber-300 font-black text-xl">
                    <Sparkles className="w-5 h-5 fill-amber-400 animate-pulse" />
                    <span>{topThree[0].total_points} Pts</span>
                  </div>
                  <span className="text-sm text-yellow-300 font-extrabold mt-1">
                    {topThree[0].total_stars} ⭐ Stars Earned
                  </span>
                </motion.div>
              )}

              {/* 3rd Place (Bronze) */}
              {topThree[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="candy-card p-6 text-center border-amber-700/60 relative flex flex-col items-center order-3"
                >
                  <div className="w-16 h-16 rounded-full bg-amber-700 text-amber-100 font-black text-2xl flex items-center justify-center shadow-lg border-4 border-white mb-3">
                    🥉
                  </div>
                  <span className="px-3 py-0.5 rounded-full bg-amber-950 text-amber-200 font-extrabold text-xs uppercase mb-2">
                    #3 Rank
                  </span>
                  <h3 className="text-xl font-black text-white">{topThree[2].name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-amber-300 font-extrabold text-base">
                    <Sparkles className="w-4 h-4 fill-amber-400" />
                    <span>{topThree[2].total_points} Pts</span>
                  </div>
                  <span className="text-xs text-yellow-300 font-bold mt-1">
                    {topThree[2].total_stars} ⭐ Stars
                  </span>
                </motion.div>
              )}

            </div>
          )}

          {/* Full Rank Table */}
          <div className="candy-card p-6 md:p-8 space-y-4">
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <span>Full Student Leaderboard</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-800 text-purple-300 text-xs font-black uppercase tracking-wider">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Total Points</th>
                    <th className="py-3 px-4">Stars Earned</th>
                    <th className="py-3 px-4">Max Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/60 font-bold">
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`transition-colors ${
                        entry.is_current_user
                          ? 'bg-gradient-to-r from-pink-900/80 to-purple-900/80 text-amber-300 border-l-4 border-amber-400'
                          : 'hover:bg-purple-900/40 text-purple-100'
                      }`}
                    >
                      <td className="py-4 px-4 font-black">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black ${
                          entry.rank === 1 ? 'bg-amber-400 text-slate-950' :
                          entry.rank === 2 ? 'bg-slate-300 text-slate-950' :
                          entry.rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-purple-950 text-purple-300'
                        }`}>
                          #{entry.rank}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-black flex items-center gap-2">
                        <span>{entry.name}</span>
                        {entry.is_current_user && (
                          <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] uppercase font-black">
                            YOU
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-amber-300 font-black">
                        {entry.total_points} Pts
                      </td>

                      <td className="py-4 px-4 text-yellow-300 font-black">
                        {entry.total_stars} ⭐
                      </td>

                      <td className="py-4 px-4 text-pink-300 font-black">
                        Level {entry.current_level} 🍬
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
