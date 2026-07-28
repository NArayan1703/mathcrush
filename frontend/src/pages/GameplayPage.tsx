import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Level, Question } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, Map, Star, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GameplayPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateUserStats } = useAuth();

  const [level, setLevel] = useState<Level | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [completionData, setCompletionData] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLevelAndQuestions();
  }, [id]);

  const fetchLevelAndQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/levels/${id}/questions`);
      setLevel(res.data.level);
      setQuestions(res.data.questions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      navigate('/map');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (optionKey: string) => {
    if (isAnswered) return;

    setSelectedOption(optionKey);
    setIsAnswered(true);

    const correct = optionKey === currentQuestion.correct_answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);

      // Trigger micro confetti pop for correct answer
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      finishLevel();
    }
  };

  const finishLevel = async () => {
    const totalQ = questions.length || 10;
    const finalCorrect = isCorrect ? correctCount : correctCount;
    const finalScore = score;
    const pct = (finalCorrect / totalQ) * 100;

    // Star threshold: 100% = 3 Stars, 80%+ = 2 Stars, 60%+ = 1 Star, <60% = 0 Stars
    const localStars = pct >= 100 ? 3 : pct >= 80 ? 2 : pct >= 60 ? 1 : 0;

    // Set stars immediately BEFORE showing modal so the modal never flashes 0 stars or failure!
    setEarnedStars(localStars);
    setIsGameOver(true);

    // Trigger grand victory confetti if passed with 1+ stars!
    if (localStars > 0) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });
    }

    try {
      const res = await api.post('/progress/complete', {
        level_id: Number(id),
        correct_count: finalCorrect,
        total_questions: totalQ,
        score: finalScore
      });

      setCompletionData(res.data);
      if (res.data.stars !== undefined) {
        setEarnedStars(res.data.stars);
      }

      // Update global user state (stars, total points, unlocked level)
      updateUserStats(res.data.total_points, res.data.current_level, res.data.total_stars);
    } catch (err) {
      console.error('Failed to submit progress:', err);
    }
  };

  if (loading || !level) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-purple-200 font-bold">Loading Math Arena...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-950 text-pink-300 font-extrabold text-xs border border-pink-500/40">
            Level {level.order_number} • {level.topic}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">{level.title}</h2>
        </div>

        {/* Live Score Counter */}
        <div className="flex items-center gap-3 bg-purple-950/80 border border-amber-400/50 rounded-2xl px-5 py-2.5 shadow-lg">
          <Sparkles className="w-5 h-5 text-amber-300 fill-amber-400 animate-pulse" />
          <div className="text-right">
            <span className="block text-[10px] text-purple-300 font-extrabold uppercase">SCORE</span>
            <span className="text-xl font-black text-amber-300">{score} PTS</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-purple-200 mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% Completed</span>
        </div>
        <div className="w-full h-3 bg-slate-900/80 rounded-full overflow-hidden border border-purple-500/30 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-gradient-to-r from-pink-500 via-amber-400 to-emerald-400 rounded-full shadow-md"
          />
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="candy-card-solid p-6 sm:p-10 relative overflow-hidden shadow-2xl border-2 border-purple-500/40"
        >
          {/* Question Text */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300 bg-purple-950/80 px-3 py-1 rounded-full border border-amber-400/30 mb-3">
              <HelpCircle className="w-4 h-4" />
              <span>Solve the Challenge</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white leading-relaxed">
              {currentQuestion.question_text}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'A', text: currentQuestion.option_a },
              { key: 'B', text: currentQuestion.option_b },
              { key: 'C', text: currentQuestion.option_c },
              { key: 'D', text: currentQuestion.option_d }
            ].map((opt) => {
              const isSelected = selectedOption === opt.key;
              const isCorrectOpt = opt.key === currentQuestion.correct_answer;

              let btnStyle = "bg-slate-900/90 border-purple-500/40 text-purple-100 hover:border-amber-400 hover:bg-purple-900/50";

              if (isAnswered) {
                if (isCorrectOpt) {
                  btnStyle = "bg-gradient-to-r from-emerald-600 to-teal-600 border-2 border-emerald-300 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]";
                } else if (isSelected && !isCorrect) {
                  btnStyle = "bg-gradient-to-r from-rose-700 to-red-600 border-2 border-red-300 text-white animate-shake";
                } else {
                  btnStyle = "bg-slate-950/40 border-slate-800 text-slate-500 opacity-50";
                }
              }

              return (
                <button
                  key={opt.key}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(opt.key)}
                  className={`p-5 rounded-2xl border-2 text-left font-extrabold transition-all duration-200 flex items-center justify-between text-lg shadow-md ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-purple-950 flex items-center justify-center text-amber-300 text-sm font-black border border-purple-700">
                      {opt.key}
                    </span>
                    <span>{opt.text}</span>
                  </div>

                  {isAnswered && isCorrectOpt && (
                    <CheckCircle2 className="w-6 h-6 text-white fill-emerald-800" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-6 h-6 text-white fill-red-800" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Solution Explanation Box */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-purple-800/60"
              >
                <div className={`p-4 rounded-2xl border ${isCorrect ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/60 border-rose-500/40 text-rose-200'}`}>
                  <div className="flex items-center gap-2 font-black text-sm uppercase mb-1">
                    {isCorrect ? '🎉 Correct Answer!' : '❌ Solution Explanation:'}
                  </div>
                  <p className="text-sm font-semibold leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>

                {/* Next Question Button */}
                <div className="mt-6 text-right">
                  <button
                    onClick={handleNextQuestion}
                    className="btn-candy-primary px-8 py-3.5 text-lg rounded-full inline-flex items-center gap-2 shadow-xl"
                  >
                    <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'Complete Level 🏆'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Victory / Level Complete Modal */}
      <AnimatePresence>
        {isGameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg candy-card-solid p-8 text-center space-y-6 border-4 border-amber-400 shadow-2xl"
            >
              {/* Header Icon */}
              <div className="text-6xl animate-bounce">
                {earnedStars > 0 ? '🏆' : '💔'}
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-purple-950 text-pink-300 font-extrabold text-xs uppercase tracking-wider border border-pink-500/40">
                  Level {level.order_number} Completed
                </span>
                <h3 className="text-4xl font-black text-white mt-2">
                  {earnedStars > 0 ? 'VICTORY!' : 'KEEP TRYING!'}
                </h3>
                <p className="text-sm text-purple-200 font-bold mt-1">
                  You scored {correctCount} out of {questions.length} correct ({Math.round((correctCount / questions.length) * 100)}%)
                </p>
              </div>

              {/* Animated Stars Banner */}
              <div className="flex items-center justify-center gap-3 py-4 bg-slate-950/80 rounded-2xl border border-purple-500/40">
                {[1, 2, 3].map((starIndex) => (
                  <motion.div
                    key={starIndex}
                    initial={{ scale: 0 }}
                    animate={{ scale: starIndex <= earnedStars ? 1.2 : 0.9 }}
                    transition={{ delay: starIndex * 0.2 }}
                  >
                    <Star
                      className={`w-12 h-12 ${
                        starIndex <= earnedStars
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]'
                          : 'text-slate-700 fill-slate-800'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Points Earned Details */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-purple-950/70 rounded-xl border border-amber-400/30">
                  <span className="block text-[10px] text-purple-300 font-extrabold uppercase">POINTS EARNED</span>
                  <span className="text-2xl font-black text-amber-300">+{score} PTS</span>
                </div>
                <div className="p-3 bg-purple-950/70 rounded-xl border border-pink-400/30">
                  <span className="block text-[10px] text-purple-300 font-extrabold uppercase">TOTAL SCORE</span>
                  <span className="text-2xl font-black text-pink-300">{completionData ? completionData.total_points : score} PTS</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => navigate('/map')}
                  className="flex-1 py-4 btn-candy-blue text-lg rounded-xl font-black flex items-center justify-center gap-2"
                >
                  <Map className="w-5 h-5" />
                  <span>LEVEL MAP</span>
                </button>

                <button
                  onClick={() => {
                    // Reset game state to replay level
                    setIsGameOver(false);
                    setCurrentIndex(0);
                    setSelectedOption(null);
                    setIsAnswered(false);
                    setIsCorrect(null);
                    setScore(0);
                    setCorrectCount(0);
                    setEarnedStars(0);
                    setCompletionData(null);
                  }}
                  className="flex-1 py-4 btn-candy-yellow text-lg rounded-xl font-black flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>REPLAY 🔄</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
