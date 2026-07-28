import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, Sparkles, X, ChevronRight, RefreshCw } from 'lucide-react';
import api from '../services/api';
import type { Level } from '../types';

export const LevelMapPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const res = await api.get('/levels');
      setLevels(res.data.levels || []);
    } catch (err) {
      console.error('Failed to load level map:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  // Calculate winding zigzag positions for 5 levels (Candy Crush style path)
  const getLevelPosition = (index: number) => {
    // Zigzag X offsets: center, right, center, left, center
    const xOffsets = [0, 110, 0, -110, 0];
    return {
      x: xOffsets[index % xOffsets.length],
      y: index * 140
    };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative min-h-screen pb-32">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 font-extrabold text-xs shadow-md"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Candy Crush Math Adventure</span>
        </motion.div>
        <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-pink-400 via-amber-300 to-purple-300 bg-clip-text text-transparent drop-shadow-md">
          LEVEL MAP 🍬
        </h1>
        <p className="text-purple-200 text-sm font-semibold max-w-md mx-auto">
          Tap on an unlocked candy node to start playing math questions!
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 text-pink-400 animate-spin" />
          <span className="text-purple-200 font-bold">Loading Candy Map...</span>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center min-h-[700px] my-4">
          
          {/* SVG Winding Path Background Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minHeight: '750px' }}>
            <path
              d="M 50% 70 C 65% 140, 65% 180, 50% 210 C 35% 260, 35% 320, 50% 350 C 65% 400, 65% 460, 50% 490 C 35% 540, 35% 600, 50% 630"
              fill="none"
              stroke="rgba(244, 114, 182, 0.4)"
              strokeWidth="12"
              strokeLinecap="round"
              className="map-path-line"
            />
          </svg>

          {/* Level Nodes */}
          <div className="relative z-10 w-full flex flex-col items-center gap-14 py-6">
            {levels.map((lvl, index) => {
              const pos = getLevelPosition(index);
              const isCurrentActive = user && user.current_level === lvl.order_number;

              return (
                <motion.div
                  key={lvl.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                  style={{ transform: `translateX(${pos.x}px)` }}
                  className="relative flex flex-col items-center"
                >
                  {/* Floating Current Player Avatar Banner */}
                  {isCurrentActive && (
                    <motion.div
                      animate={{ y: [-6, 2, -6] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -top-12 z-30 flex flex-col items-center"
                    >
                      <div className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs rounded-full shadow-lg border-2 border-white flex items-center gap-1">
                        <span>YOU ARE HERE! 🏃</span>
                      </div>
                      <div className="w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-8 border-t-amber-400 -mt-0.5" />
                    </motion.div>
                  )}

                  {/* Level Node Button */}
                  <button
                    onClick={() => {
                      if (lvl.is_unlocked) {
                        setSelectedLevel(lvl);
                      }
                    }}
                    disabled={!lvl.is_unlocked}
                    className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
                      lvl.is_completed
                        ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-4 border-amber-200 shadow-[0_10px_0_#995c00,0_15px_25px_rgba(0,0,0,0.5)] text-slate-950 hover:scale-110 cursor-pointer'
                        : lvl.is_unlocked
                        ? 'bg-gradient-to-b from-pink-400 via-pink-500 to-pink-700 border-4 border-pink-200 shadow-[0_10px_0_#800b38,0_15px_25px_rgba(0,0,0,0.5)] text-white hover:scale-110 animate-pulse-glow cursor-pointer'
                        : 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-4 border-slate-600 shadow-[0_8px_0_#1e293b] text-slate-400 opacity-80 cursor-not-allowed'
                    }`}
                  >
                    {/* Node Icon */}
                    <div className="text-3xl mb-1">
                      {lvl.is_completed ? '⭐' : lvl.is_unlocked ? '🍬' : '🔒'}
                    </div>

                    {/* Level Number */}
                    <span className="font-black text-lg tracking-wider drop-shadow-md">
                      Level {lvl.order_number}
                    </span>

                    {/* Stars Badge on Node */}
                    {lvl.is_completed && (
                      <div className="absolute -bottom-3 bg-purple-950 border border-amber-400 px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
                        {[1, 2, 3].map((starIndex) => (
                          <Star
                            key={starIndex}
                            className={`w-3.5 h-3.5 ${
                              starIndex <= lvl.stars
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-slate-600 fill-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>

                  {/* Level Title Label */}
                  <div className="mt-2 text-center max-w-[140px]">
                    <span className="text-xs font-black text-white bg-slate-950/80 border border-purple-500/40 px-2.5 py-1 rounded-full shadow-sm block truncate">
                      {lvl.title}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      )}

      {/* Selected Level Preview Modal */}
      <AnimatePresence>
        {selectedLevel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="w-full max-w-lg candy-card-solid p-8 relative border-4 border-amber-400/80 shadow-2xl"
            >
              <button
                onClick={() => setSelectedLevel(null)}
                className="absolute top-4 right-4 p-2 text-purple-300 hover:text-white hover:bg-purple-900/60 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-5xl mx-auto shadow-lg">
                  {selectedLevel.is_completed ? '⭐' : '🍬'}
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-purple-950 text-pink-300 font-extrabold text-xs uppercase tracking-wider border border-pink-500/40">
                    Level {selectedLevel.order_number} • {selectedLevel.topic}
                  </span>
                  <h3 className="text-3xl font-black text-white mt-2">{selectedLevel.title}</h3>
                  <p className="text-sm text-purple-200 font-medium mt-1">Difficulty: {selectedLevel.difficulty}</p>
                </div>

                {/* Level Details */}
                <div className="bg-slate-950/70 rounded-2xl p-4 border border-purple-500/30 flex items-center justify-around text-center">
                  <div>
                    <span className="block text-xs text-purple-300 font-bold uppercase">Questions</span>
                    <span className="text-xl font-black text-amber-300">10 Questions</span>
                  </div>
                  <div className="h-8 w-px bg-purple-800" />
                  <div>
                    <span className="block text-xs text-purple-300 font-bold uppercase">Best Stars</span>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      {[1, 2, 3].map((starIndex) => (
                        <Star
                          key={starIndex}
                          className={`w-4 h-4 ${
                            starIndex <= selectedLevel.stars
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Start Game CTA */}
                <button
                  onClick={() => {
                    navigate(`/play/${selectedLevel.id}`);
                  }}
                  className="w-full py-4 btn-candy-yellow text-xl rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl"
                >
                  <Play className="w-6 h-6 fill-slate-950 text-slate-950" />
                  <span>PLAY THIS LEVEL NOW!</span>
                  <ChevronRight className="w-6 h-6 text-slate-950" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
