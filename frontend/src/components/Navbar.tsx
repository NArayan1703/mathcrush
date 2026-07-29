import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Play, LayoutDashboard, LogOut, Sparkles, Star } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-pink-500/30 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-amber-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-xl sm:text-2xl">
              🍬
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-wider bg-gradient-to-r from-pink-400 via-amber-300 to-purple-400 bg-clip-text text-transparent drop-shadow-md">
              MATH CRUSH
            </span>
          </div>
        </Link>

        {/* Authenticated Header Content */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Desktop Player Stats Bar */}
            <div className="hidden md:flex items-center gap-3 bg-purple-950/80 border border-purple-500/40 rounded-full px-4 py-1.5 shadow-inner">
              
              {/* Points */}
              <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{user.total_points} Pts</span>
              </div>

              <div className="h-4 w-px bg-purple-700/60" />

              {/* Stars */}
              <div className="flex items-center gap-1.5 text-yellow-300 font-extrabold text-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{user.total_stars} ⭐</span>
              </div>

              <div className="h-4 w-px bg-purple-700/60" />

              {/* Level */}
              <div className="flex items-center gap-1 text-pink-300 font-extrabold text-sm">
                <span>Lvl {user.current_level} 🍬</span>
              </div>
            </div>

            {/* Navigation Links: Dashboard, Play, Leaderboard */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive('/dashboard')
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40'
                    : 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/map"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive('/map')
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                    : 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                }`}
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Play</span>
              </Link>

              <Link
                to="/leaderboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive('/leaderboard')
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40'
                    : 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Leaderboard</span>
              </Link>

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-1.5 sm:gap-2 ml-1 sm:ml-2 pl-1.5 sm:pl-2 border-l border-purple-800/60">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-xs sm:text-sm shadow-md border border-white/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 sm:p-2 text-purple-300 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/?modal=login"
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-pink-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/?modal=register"
              className="btn-candy-primary text-xs px-4 sm:px-5 py-2 sm:py-2.5 rounded-full"
            >
              Play Now 🍬
            </Link>
          </div>
        )}

      </div>

      {/* Mobile Stats Ribbon */}
      {isAuthenticated && user && (
        <div className="flex md:hidden items-center justify-around bg-purple-950/90 border-t border-purple-800/40 px-3 py-1.5 text-xs font-black">
          <div className="flex items-center gap-1 text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{user.total_points} PTS</span>
          </div>
          <div className="w-px h-3 bg-purple-800" />
          <div className="flex items-center gap-1 text-yellow-300">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>{user.total_stars} ⭐</span>
          </div>
          <div className="w-px h-3 bg-purple-800" />
          <div className="text-pink-300">
            <span>Level {user.current_level} 🍬</span>
          </div>
        </div>
      )}
    </nav>
  );
};
