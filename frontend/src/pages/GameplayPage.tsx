import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Star, CheckCircle2, XCircle, ArrowRight, RotateCcw, Map, Sparkles, HelpCircle } from 'lucide-react';
import api from '../services/api';
import type { Level, Question } from '../types';

export const GameplayPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { updateUserStats } = useAuth();
  const navigate = useNavigate();

  const [level, setLevel] = useState<Level | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Victory / Completion State
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [completionData, setCompletionData] = useState<any>(null);

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/levels/${id}/questions`);
        setLevel(res.data.level);
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error('Failed to load level questions:', err);
        navigate('/map');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionData();
  }, [id, navigate]);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(optionKey);
    setIsAnswered(true);

    const correct = optionKey === currentQuestion.correct_answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);
      
      // Trigger confetti celebration on correct answer
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
      // Finished all 10 questions -> calculate stars and submit progress!
      finishLevel();
    }
  };

  const finishLevel = async () => {
    setIsGameOver(true);

    const totalQ = questions.length || 10;
    const finalScore = score;

    try {
      const res = await api.post('/progress/complete', {
        level_id: Number(id),
        correct_count: correctCount,
        total_questions: totalQ,
        score: finalScore
      });

      setCompletionData(res.data);
      setEarnedStars(res.data.stars);

      // Trigger grand victory confetti if passed with 1+ stars!
      if (res.data.stars > 0) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 }
        });
      }

      // Update user auth state
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
            <span className="block text-[10px] text-purple-300 font-bold uppercase">SCORE</span>
            <span className="text-xl font-black text-amber-300">{score} PTS</span>
          </div>
        </div>
      </div>

      {/* Question Progress Bar */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-xs font-bold text-purple-200">
          <span>QUESTION {currentIndex + 1} OF {questions.length}</span>
          <span>{correctCount} Correct</span>
        </div>
        <div className="w-full h-3 bg-slate-900/80 rounded-full overflow-hidden border border-purple-500/30 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && !isGameOver && (
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="candy-card-solid p-6 md:p-10 space-y-8 relative shadow-2xl border-4 border-pink-400/50"
        >
          {/* Question Text */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300 bg-purple-950/80 px-3 py-1 rounded-full border border-amber-400/30">
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span>Solve the equation</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white leading-snug">
              {currentQuestion.question_text}
            </h3>
          </div>

          {/* Multiple Choice Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'A', text: currentQuestion.option_a },
              { key: 'B', text: currentQuestion.option_b },
              { key: 'C', text: currentQuestion.option_c },
              { key: 'D', text: currentQuestion.option_d }
            ].map(({ key, text }) => {
              const isSelected = selectedOption === key;
              const isCorrectAnswer = key === currentQuestion.correct_answer;

              let btnStyle = "bg-slate-900/90 border-purple-500/50 text-white hover:border-amber-400 hover:bg-purple-900/60";

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = "bg-gradient-to-r from-emerald-600 to-green-500 border-2 border-green-300 text-white shadow-lg shadow-emerald-600/40";
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = "bg-gradient-to-r from-rose-700 to-red-600 border-2 border-red-300 text-white animate-shake";
                } else {
                  btnStyle = "bg-slate-950/40 border-slate-800 text-slate-500 opacity-50";
                }
              }

              return (
                <button
                  key={key}
                  disabled={isAnswered}
                  onClick={() => handleOptionClick(key as any)}
                  className={`p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 text-left flex items-center justify-between font-extrabold text-lg md:text-xl shadow-md cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-9 h-9 rounded-xl bg-purple-950 flex items-center justify-center text-amber-300 text-sm font-black border border-purple-700">
                      {key}
                    </span>
                    <span>{text}</span>
                  </div>

                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-6 h-6 text-white fill-emerald-800" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-6 h-6 text-white fill-rose-900" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Feedback Banner & Explanation */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border-2 space-y-2 ${
                  isCorrect
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/90 border-rose-500 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-xl">
                    {isCorrect ? (
                      <>
                        <span>SWEET! PERFECT ANSWER! 🍬</span>
                        <span className="text-amber-300 text-sm bg-emerald-900 px-2.5 py-0.5 rounded-full border border-amber-300">+10 PTS</span>
                      </>
                    ) : (
                      <span>OOPS! NOT QUITE RIGHT ❌</span>
                    )}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="btn-candy-yellow px-6 py-2.5 rounded-xl text-base flex items-center gap-2"
                  >
                    <span>{currentIndex + 1 === questions.length ? 'FINISH LEVEL 🏆' : 'NEXT QUESTION'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Explanation text */}
                {currentQuestion.explanation && (
                  <p className="text-sm font-medium pt-1 border-t border-white/10 opacity-90">
                    💡 <span className="font-bold">Explanation:</span> {currentQuestion.explanation}
                  </p>
                )}
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
              {completionData && (
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-purple-950/70 rounded-xl border border-amber-400/30">
                    <span className="block text-[10px] text-purple-300 font-extrabold uppercase">POINTS EARNED</span>
                    <span className="text-2xl font-black text-amber-300">+{score} PTS</span>
                  </div>
                  <div className="p-3 bg-purple-950/70 rounded-xl border border-pink-400/30">
                    <span className="block text-[10px] text-purple-300 font-extrabold uppercase">TOTAL SCORE</span>
                    <span className="text-2xl font-black text-pink-300">{completionData.total_points} PTS</span>
                  </div>
                </div>
              )}

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
