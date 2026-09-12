import React from 'react';
import { useAuth } from '../context/AuthContext';
import GoldDisplay from './GoldDisplay';
import { Flame, LogOut, Menu, User, Shield } from 'lucide-react';
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
          <span className="text-2xl">⚔️</span>
          <span className="font-fantasy font-extrabold text-xl text-rpg-text tracking-wider">
            LIFEQUEST <span className="text-xs text-rpg-purple font-sans font-semibold">RPG</span>
          </span>
        </Link>
      </div>

      {/* Right User Bar & Stats */}
      {user && (
        <div className="flex items-center gap-3 md:gap-5">
          {/* Gold Counter */}
          <GoldDisplay amount={user.gold || 0} size="sm" />

          {/* Streak Flame Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold font-fantasy shadow-sm">
            <Flame className="w-4 h-4 fill-orange-500/40 text-orange-400 flame-anim" />
            <span>{user.streak?.current || 0} Day Streak</span>
          </div>

          {/* User Profile Avatar Link */}
          <Link
            to="/profile"
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#151A2D] transition border border-transparent hover:border-rpg-border"
          >
            <div className="w-8 h-8 rounded-lg bg-rpg-purple/30 border border-rpg-purple flex items-center justify-center text-sm font-bold font-fantasy text-purple-300">
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="hidden lg:block text-left text-xs">
              <div className="font-bold text-rpg-text leading-tight">{user.name}</div>
              <div className="text-[10px] text-rpg-purple font-semibold">Lv. {user.level || 1} Adventurer</div>
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 text-rpg-muted hover:text-red-400 rounded-xl hover:bg-[#151A2D] transition"
            title="Exit Realm / Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
