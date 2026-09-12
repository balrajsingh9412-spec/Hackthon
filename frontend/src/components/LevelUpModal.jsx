import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowUpRight } from 'lucide-react';

const LevelUpModal = ({ isOpen, onClose, levelData }) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log('Confetti burst');
      }
    }
  }, [isOpen]);

  if (!isOpen || !levelData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="rpg-panel w-full max-w-md p-8 rounded-3xl border-2 border-rpg-gold text-center relative overflow-hidden shadow-glow-gold bg-gradient-to-b from-[#151A2D] via-[#111525] to-[#1a122e]"
        >
          {/* Animated Background Rays */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent animate-pulse pointer-events-none"></div>

          {/* Trophy Icon */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-glow-gold flex items-center justify-center">
            <div className="w-full h-full bg-[#090B14] rounded-2xl flex items-center justify-center text-amber-400">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>
          </div>

          <span className="text-xs font-bold font-fantasy text-rpg-gold tracking-widest uppercase mb-1 block flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" /> LEVEL UP! <Sparkles className="w-4 h-4" />
          </span>

          <h1 className="font-fantasy font-extrabold text-5xl gold-text mb-2">
            LEVEL {levelData.newLevel || 2}
          </h1>

          <p className="text-sm text-purple-300 font-semibold mb-6 flex items-center justify-center gap-1">
            Title Unlocked: <span className="text-white font-bold">{levelData.newTitle || 'Novice Traveler'}</span>
          </p>

          <div className="p-4 rounded-2xl bg-[#111525] border border-rpg-border/80 mb-6 space-y-2 text-left text-xs">
            <div className="flex justify-between items-center text-emerald-400 font-semibold">
              <span className="flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" /> Attributes Increased
              </span>
              <span>+Stats Earned</span>
            </div>
            <div className="flex justify-between items-center text-rpg-muted">
              <span>Max Level Capacity</span>
              <span className="text-white font-bold">Expanded</span>
            </div>
            <div className="flex justify-between items-center text-rpg-muted">
              <span>Adventures & Quests</span>
              <span className="text-rpg-gold font-bold">Higher Tier Available</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-fantasy font-black text-sm uppercase tracking-wider shadow-glow-gold transition-all duration-200 active:scale-95"
          >
            CONTINUE ADVENTURE ⚔
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LevelUpModal;
