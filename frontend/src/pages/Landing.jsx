import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Swords, ShieldCheck, Trophy, ArrowRight, Zap, Flame } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#090B14] text-[#F8FAFC] flex flex-col justify-between relative overflow-hidden">
      {/* Background Radial Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-rpg-purple/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Landing Navigation Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="text-3xl">⚔️</span>
          <span className="font-fantasy font-extrabold text-2xl tracking-wider gold-text">
            LIFEQUEST
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs font-fantasy font-bold text-rpg-muted hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rpg-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-fantasy font-bold text-xs shadow-glow-purple transition active:scale-95"
          >
            Enter Realm ⚔
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 text-center z-10 flex-1 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rpg-purple/10 border border-rpg-purple/30 text-rpg-purple text-xs font-fantasy font-bold mb-6 shadow-glow-purple"
        >
          <Sparkles className="w-4 h-4 text-rpg-gold" />
          <span>GAMIFIED PRODUCTIVITY FOR HEROES & ADVENTURERS</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-fantasy font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight max-w-4xl leading-tight mb-6"
        >
          TURN YOUR REAL LIFE INTO AN <span className="gold-text">ADVENTURE</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-rpg-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Convert workouts, coding projects, studying, and daily habits into RPG quests.
          Earn XP, accumulate Gold, level up your character attributes, and unlock legendary items.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rpg-purple via-indigo-600 to-rpg-blue hover:from-purple-600 hover:to-blue-600 text-white font-fantasy font-extrabold text-sm shadow-glow-purple transition active:scale-95 flex items-center justify-center gap-2"
          >
            START YOUR ADVENTURE <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#151A2D] hover:bg-[#1C2340] border border-rpg-border text-rpg-text font-fantasy font-bold text-sm transition"
          >
            ENTER THE REALM
          </Link>
        </motion.div>

        {/* Real Life vs RPG Mapping Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          <div className="rpg-panel p-6 rounded-2xl border border-rpg-purple/30">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-rpg-blue flex items-center justify-center mb-4">
              <Swords className="w-5 h-5" />
            </div>
            <h3 className="font-fantasy font-bold text-lg text-white mb-2">Real Activity → RPG Quest</h3>
            <p className="text-xs text-rpg-muted leading-relaxed">
              Every coding task, workout, or study session is converted into a quest with server-calculated XP and Gold rewards.
            </p>
          </div>

          <div className="rpg-panel p-6 rounded-2xl border border-rpg-gold/30">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-rpg-gold flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-fantasy font-bold text-lg text-white mb-2">Non-Linear Leveling</h3>
            <p className="text-xs text-rpg-muted leading-relaxed">
              Level up your hero as required XP scales non-linearly (`100 * Level^1.5`). Trigger celebratory level up modals.
            </p>
          </div>

          <div className="rpg-panel p-6 rounded-2xl border border-emerald-500/30">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-fantasy font-bold text-lg text-white mb-2">Economy & Shop</h3>
            <p className="text-xs text-rpg-muted leading-relaxed">
              Spend Gold at the Adventurer's Shop for rare weapons, shields, crowns, and auras stored directly in your inventory.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 border-t border-rpg-border/40 text-center text-xs text-rpg-muted z-10">
        <p className="font-fantasy">LifeQuest RPG — Built for Gamified Productivity</p>
      </footer>
    </div>
  );
};

export default Landing;
