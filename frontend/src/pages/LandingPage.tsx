import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, ArrowRight, X } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const modalParam = searchParams.get('modal');
    if (modalParam === 'login' || modalParam === 'register') {
      setAuthModal(modalParam);
    }
  }, [searchParams]);

  const closeModal = () => {
    setAuthModal(null);
    setError('');
    setSearchParams({});
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      closeModal();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to sign in. Check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
      closeModal();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      
      {/* Decorative Floating Candies Background */}
      <div className="absolute top-10 left-10 text-6xl opacity-30 animate-float pointer-events-none">🍬</div>
      <div className="absolute top-40 right-16 text-7xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '1s' }}>🍭</div>
      <div className="absolute bottom-20 left-20 text-6xl opacity-25 animate-float pointer-events-none" style={{ animationDelay: '2s' }}>⭐</div>
      <div className="absolute top-1/2 right-1/4 text-5xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '1.5s' }}>🍫</div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 max-w-7xl mx-auto text-center">

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl sm:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-tight"
        >
          Crush Math Problems, <br />
          <span className="bg-gradient-to-r from-pink-400 via-amber-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
            Unlock New Candy Levels! 🍬
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-purple-200/90 max-w-2xl mx-auto font-medium"
        >
          Transform boring math homework into a Candy Crush style game. Earn stars, climb the leaderboard, and master Grade 6–8 Fractions, Decimals, Algebra, and Geometry!
        </motion.p>

        {/* Hero Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => setAuthModal('register')}
            className="btn-candy-primary px-8 py-4 text-xl rounded-full flex items-center gap-3 animate-candy-bounce shadow-2xl"
          >
            <Gamepad2 className="w-7 h-7 text-yellow-200" />
            <span>Play Math Crush Free!</span>
            <ArrowRight className="w-6 h-6" />
          </button>

          <button
            onClick={() => setAuthModal('login')}
            className="btn-candy-blue px-7 py-4 text-lg rounded-full"
          >
            I Already Have an Account
          </button>
        </motion.div>

        {/* Hero Banner Showcase Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-14 max-w-5xl mx-auto candy-card-solid p-4 md:p-6 relative overflow-hidden group shadow-2xl border-4 border-pink-400/80"
        >
          <div className="relative rounded-2xl overflow-hidden border-2 border-purple-400/40">
            <img
              src="/hero-banner.jpg"
              alt="Math Crush Candy Game World"
              className="w-full h-auto object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-left">
                <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full uppercase">Interactive Gameplay Preview</span>
                <h3 className="text-2xl md:text-3xl font-black text-white mt-1 drop-shadow-md">Candy Map • Star Rewards • Math Arena</h3>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-amber-300 tracking-tight">
            Why Students Love Math Crush 🏆
          </h2>
          <p className="text-purple-200 mt-2 font-medium">Designed to make math addictive, rewarding, and fun.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="candy-card p-8 text-center hover:border-pink-400 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 rounded-3xl bg-pink-500/20 border-2 border-pink-400 flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
              🍬
            </div>
            <h3 className="text-2xl font-black text-white mb-3">Candy Crush Map</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              Progress through floating island level maps. Complete questions to unlock the next level and watch your score soar!
            </p>
          </div>

          {/* Card 2 */}
          <div className="candy-card p-8 text-center hover:border-amber-400 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
              ⭐
            </div>
            <h3 className="text-2xl font-black text-white mb-3">Star Rating System</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              Earn 1, 2, or 3 stars based on accuracy. Replay levels anytime to perfect your score and collect all 15 stars!
            </p>
          </div>

          {/* Card 3 */}
          <div className="candy-card p-8 text-center hover:border-purple-400 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 rounded-3xl bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
              🏆
            </div>
            <h3 className="text-2xl font-black text-white mb-3">Live Leaderboard</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              Compete with classmates and students nationwide. Claim the top position on the podium with maximum points!
            </p>
          </div>

        </div>
      </section>

      {/* Curriculum Topics */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="candy-card-solid p-8 md:p-12 text-center">
          <h2 className="text-3xl font-black text-white mb-6">Covering Middle School Math Curriculum</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Fractions 🍕', 'Decimals 🪙', 'Percentages 📊', 'Ratios & Proportions ⚖️', 'Basic Algebra 📐', 'Geometry 📏'].map((topic, i) => (
              <span key={i} className="px-5 py-2.5 rounded-full bg-purple-950/80 border-2 border-pink-400/50 text-amber-300 font-extrabold text-sm shadow-md">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modals */}
      <AnimatePresence>
        {authModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md candy-card-solid p-8 relative shadow-2xl border-4 border-pink-400/60"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 text-purple-300 hover:text-white hover:bg-purple-900/60 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🍬</div>
                <h3 className="text-3xl font-black text-amber-300">
                  {authModal === 'login' ? 'Welcome Back!' : 'Start Playing Math Crush'}
                </h3>
                <p className="text-xs text-purple-200 font-bold uppercase tracking-wider mt-1">
                  {authModal === 'login' ? 'Sign in to continue your adventure' : 'Create your student account'}
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-sm font-bold text-center">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={authModal === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
                {authModal === 'register' && (
                  <div>
                    <label className="block text-xs font-black uppercase text-pink-200 mb-1">Student Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-purple-500/50 text-white placeholder-purple-400 focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black uppercase text-pink-200 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@school.edu"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-purple-500/50 text-white placeholder-purple-400 focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-pink-200 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-purple-500/50 text-white placeholder-purple-400 focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 mt-2 btn-candy-primary text-lg rounded-xl font-black uppercase tracking-wider shadow-lg"
                >
                  {submitting
                    ? 'Processing...'
                    : authModal === 'login'
                    ? 'Log In & Play 🚀'
                    : 'Create Student Account 🍬'}
                </button>
              </form>

              {/* Toggle modal type */}
              <div className="mt-6 text-center text-xs font-bold text-purple-200">
                {authModal === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setAuthModal('register')}
                      className="text-amber-300 underline font-black hover:text-white"
                    >
                      Register Now
                    </button>
                  </p>
                ) : (
                  <p>
                    Already registered?{' '}
                    <button
                      onClick={() => setAuthModal('login')}
                      className="text-amber-300 underline font-black hover:text-white"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
