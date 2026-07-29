import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

  return (
    <footer className="mt-20 border-t border-purple-900/60 bg-slate-950/80 backdrop-blur-md pt-12 pb-8 px-4 text-purple-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center text-xl">
              🍬
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-pink-400 via-amber-300 to-purple-300 bg-clip-text text-transparent">
              MATH CRUSH
            </span>
          </div>
          <p className="text-sm text-purple-300/80 max-w-md leading-relaxed font-medium">
            Making middle school math practice addictive and rewarding. Master Fractions, Decimals, Algebra, and Geometry through fun Candy Crush style levels!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-pink-300 mb-3">Game Navigation</h4>
          <ul className="space-y-2 text-sm font-bold">
            <li>
              <Link to="/map" className="hover:text-amber-300 transition-colors">
                Play 🍬
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="hover:text-amber-300 transition-colors">
                Leaderboard 🏆
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-amber-300 transition-colors">
                Dashboard 🎮
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Privacy Column */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-pink-300 mb-3">Legal & Safety</h4>
          <ul className="space-y-2 text-sm font-bold">
            <li>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Privacy Policy</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-amber-300 transition-colors text-left cursor-pointer"
              >
                Terms of Service
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-purple-900/40 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-400 font-medium gap-3">
        <p>© Math Crush</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="hover:text-pink-300 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <span>Student Data Safe</span>
        </div>
      </div>

      {/* Interactive Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 0 }}
              className="w-full max-w-2xl candy-card-solid p-6 md:p-8 relative max-h-[85vh] overflow-y-auto border-4 border-pink-400/60 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-4 right-4 p-2 text-purple-300 hover:text-white hover:bg-purple-900/60 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Math Crush Privacy Policy</h3>
                  <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Student Safety & Data Protection Guarantee</p>
                </div>
              </div>

              {/* Privacy Policy Content */}
              <div className="space-y-4 text-sm text-purple-100 font-medium leading-relaxed bg-slate-950/70 p-5 rounded-2xl border border-purple-500/30">
                <section className="space-y-1">
                  <h4 className="font-black text-amber-300 text-base">1. Student Privacy First</h4>
                  <p className="text-purple-200/90 text-xs">
                    Math Crush is designed specifically for middle school learners. We prioritize student privacy and strictly comply with student safety guidelines (COPPA).
                  </p>
                </section>

                <section className="space-y-1">
                  <h4 className="font-black text-amber-300 text-base">2. Information We Collect</h4>
                  <p className="text-purple-200/90 text-xs">
                    We only collect basic account information needed for gameplay progression: student display name, email address, password hash, earned points, and level progress stars.
                  </p>
                </section>

                <section className="space-y-1">
                  <h4 className="font-black text-amber-300 text-base">3. Zero Data Sharing & Advertising</h4>
                  <p className="text-purple-200/90 text-xs">
                    We NEVER sell student personal data, show third-party targeted advertisements, or share user details with marketers.
                  </p>
                </section>

                <section className="space-y-1">
                  <h4 className="font-black text-amber-300 text-base">4. Leaderboard Visibility</h4>
                  <p className="text-purple-200/90 text-xs">
                    Only your chosen display name, total points, and earned stars are visible on the public leaderboard to foster healthy academic competition.
                  </p>
                </section>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="btn-candy-primary px-6 py-2.5 rounded-xl text-sm font-black uppercase cursor-pointer"
                >
                  I Understand & Accept 🍬
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </footer>
  );
};
