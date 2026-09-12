import React from 'react';
import XPBar from './XPBar';
import GoldDisplay from './GoldDisplay';
import { Shield, Sparkles } from 'lucide-react';

const CharacterCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="rpg-panel p-6 rounded-2xl border border-rpg-purple/40 relative overflow-hidden bg-gradient-to-br from-[#151A2D] via-[#111525] to-[#161226]">
      {/* Background glowing orb effect */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-rpg-purple/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar Graphic */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-rpg-purple via-rpg-blue to-indigo-900 p-1 shadow-glow-purple">
            <div className="w-full h-full bg-[#090B14] rounded-xl flex items-center justify-center text-4xl relative overflow-hidden">
              <span className="transform transition-transform group-hover:scale-110 duration-300">🧙</span>
              <div className="absolute inset-0 bg-gradient-to-t from-rpg-purple/30 to-transparent"></div>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-rpg-purple text-white text-xs font-fantasy font-bold px-2 py-0.5 rounded-md border border-purple-300 shadow-md">
            Lv. {user.level || 1}
          </div>
        </div>

        {/* User Stats Summary */}
        <div className="flex-1 w-full text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <div>
              <h2 className="font-fantasy font-extrabold text-2xl text-rpg-text flex items-center justify-center md:justify-start gap-2">
                {user.name}
                <Sparkles className="w-4 h-4 text-rpg-gold animate-pulse" />
              </h2>
              <p className="text-xs font-semibold text-rpg-purple tracking-wider uppercase flex items-center justify-center md:justify-start gap-1">
                <Shield className="w-3.5 h-3.5" />
                {user.title || 'Apprentice Wanderer'}
              </p>
            </div>
            <div className="flex justify-center md:justify-end mt-2 md:mt-0">
              <GoldDisplay amount={user.gold || 0} size="md" />
            </div>
          </div>

          <div className="mt-3">
            <XPBar
              currentXP={user.xp || 0}
              requiredXP={user.requiredXP || 100}
              level={user.level || 1}
              showDetails={true}
              height="h-3.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
