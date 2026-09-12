import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle } from 'lucide-react';

const QuestCompleteModal = ({ rewardData, onClose }) => {
  if (!rewardData) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full p-1 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className="rpg-panel p-4 rounded-2xl border border-rpg-purple shadow-glow-purple bg-gradient-to-r from-[#151A2D] to-[#1a1733] pointer-events-auto flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-rpg-purple/20 border border-rpg-purple/50 flex items-center justify-center text-rpg-purple">
            <CheckCircle className="w-7 h-7 text-emerald-400" />
          </div>

          <div className="flex-1">
            <h4 className="font-fantasy font-bold text-sm text-rpg-text flex items-center gap-1.5">
              QUEST COMPLETE! <Sparkles className="w-4 h-4 text-rpg-gold" />
            </h4>
            <div className="flex items-center gap-3 text-xs font-fantasy font-bold mt-1">
              <span className="text-rpg-blue">+{rewardData.xp} XP</span>
              <span className="text-rpg-gold">+{rewardData.gold} 🪙</span>
              <span className="text-emerald-400">+{rewardData.statPoints} {rewardData.attribute?.toUpperCase()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuestCompleteModal;
