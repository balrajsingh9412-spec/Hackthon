import React from 'react';
import { motion } from 'framer-motion';

const XPBar = ({ currentXP = 0, requiredXP = 100, level = 1, showDetails = true, height = 'h-4' }) => {
  const percentage = Math.min(100, Math.max(0, Math.round((currentXP / requiredXP) * 100)));

  return (
    <div className="w-full">
      {showDetails && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          <span className="text-rpg-blue flex items-center gap-1 font-semibold">
            ⚡ Level {level} Experience
          </span>
          <span className="text-rpg-muted">
            {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP ({percentage}%)
          </span>
        </div>
      )}
      <div className={`w-full bg-[#111525] rounded-full p-0.5 border border-rpg-border overflow-hidden ${height}`}>
        <motion.div
          className="h-full rounded-full xp-bar-fill shadow-glow-blue relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-30 rounded-full"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default XPBar;
