import React from 'react';
import { motion } from 'framer-motion';

const RARITY_STYLES = {
  Common: { border: 'border-slate-500/40', badge: 'bg-slate-500/20 text-slate-300' },
  Uncommon: { border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-300' },
  Rare: { border: 'border-blue-500/40', badge: 'bg-blue-500/20 text-blue-300 shadow-glow-blue' },
  Epic: { border: 'border-purple-500/40', badge: 'bg-purple-500/20 text-purple-300 shadow-glow-gold' },
  Legendary: { border: 'border-amber-500/50', badge: 'bg-amber-500/20 text-amber-300 glow-border-gold' }
};

const RewardCard = ({ item, onBuy, userGold = 0, isBuying = false }) => {
  const style = RARITY_STYLES[item.rarity] || RARITY_STYLES.Common;
  const canAfford = userGold >= item.price;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rpg-panel p-5 rounded-2xl border ${style.border} flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#151A2D] to-[#111525]`}
    >
      <div>
        {/* Rarity & Type */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${style.badge}`}>
            {item.rarity}
          </span>
          <span className="text-[11px] text-rpg-muted uppercase font-semibold">
            {item.type}
          </span>
        </div>

        {/* Icon & Details */}
        <div className="text-center my-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#111525] border border-rpg-border flex items-center justify-center text-3xl shadow-inner mb-3">
            {item.icon}
          </div>
          <h3 className="font-fantasy font-bold text-base text-rpg-text mb-1">
            {item.name}
          </h3>
          <p className="text-xs text-rpg-muted line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {item.effect && (
          <div className="my-2 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center text-xs font-semibold text-emerald-500">
            ✨ {item.effect}
          </div>
        )}
      </div>

      {/* Footer Price & Action */}
      <div className="mt-4 pt-3 border-t border-rpg-border/60 flex items-center justify-between gap-3">
        <div className="text-sm font-fantasy font-bold text-rpg-gold flex items-center gap-1">
          <span>🪙</span> {item.price}
        </div>

        {item.isOwned ? (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            ✓ Purchased
          </span>
        ) : (
          <button
            onClick={() => onBuy(item.id)}
            disabled={!canAfford || isBuying}
            className={`px-4 py-1.5 rounded-xl font-fantasy font-bold text-xs transition-all ${
              canAfford
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 shadow-glow-gold active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {isBuying ? 'Buying...' : canAfford ? 'PURCHASE' : 'Need Gold'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default RewardCard;
