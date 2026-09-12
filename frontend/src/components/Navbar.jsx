import React from 'react';
import { useAuth } from '../context/AuthContext';
import GoldDisplay from './GoldDisplay';
import { Flame, LogOut, Menu, User, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onOpenMobileMenu }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[#090B14]/90 backdrop-blur-md border-b border-rpg-border sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      {/* Left Branding & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-rpg-muted hover:text-white rounded-lg hover:bg-[#151A2D]"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-fantasy font-extrabold text-xl text-rpg-text tracking-wider">
            LIFEQUEST <span className="text-xs text-emerald-400 font-sans font-semibold">ECO RPG</span>
          </span>
        </Link>
      </div>

      {/* Right User Bar & Top Game HUD */}
      {user && (
        <div className="flex items-center gap-2 md:gap-4">
          {/* Level Badge */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-white text-xs font-fantasy font-bold shadow-sm">
            <Shield className="w-3.5 h-3.5 text-rpg-gold" />
            <span>LVL {user.level || 1}</span>
          </div>

          {/* Compact XP Progress Bar */}
          <div className="hidden lg:flex flex-col w-28 text-[10px] font-fantasy font-semibold">
            <div className="flex justify-between text-rpg-blue mb-0.5">
              <span>XP</span>
              <span>{user.xp || 0}/{user.requiredXP || 100}</span>
            </div>
            <div className="w-full h-2 bg-[#111525] rounded-full overflow-hidden border border-rpg-blue/30 p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300 shadow-glow-blue"
                style={{ width: `${Math.min(100, Math.round(((user.xp || 0) / (user.requiredXP || 100)) * 100))}%` }}
              ></div>
            </div>
          </div>

          {/* Gold Counter */}
          <GoldDisplay amount={user.gold || 0} size="sm" />

          {/* Energy Gauge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-fantasy font-bold shadow-sm">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>⚡ {user.energy !== undefined ? user.energy : 85}/100</span>
          </div>

          {/* Streak Flame Pill */}
          <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold font-fantasy shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-orange-500/40 text-orange-400" />
            <span>{user.streak?.current || 0}D</span>
          </div>

          {/* User Profile Avatar Link */}
          <Link
            to="/profile"
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#151A2D] transition border border-transparent hover:border-rpg-border"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/30 border border-emerald-500 flex items-center justify-center text-sm font-bold font-fantasy text-purple-300 shadow-glow-gold">
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-1.5 text-rpg-muted hover:text-red-400 rounded-xl hover:bg-[#151A2D] transition"
            title="Exit Realm / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
