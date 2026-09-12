import React from 'react';
import { motion } from 'framer-motion';

const RARITY_BORDER = {
  Common: 'border-slate-500/40',
  Uncommon: 'border-emerald-500/40',
  Rare: 'border-blue-500/40 shadow-glow-blue',
  Epic: 'border-purple-500/40 shadow-glow-purple',
  Legendary: 'border-amber-500/50 glow-border-gold'
};

const InventoryCard = ({ item, onEquip, isEquipping = false }) => {
  const borderStyle = RARITY_BORDER[item.itemRarity] || RARITY_BORDER.Common;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rpg-panel p-4 rounded-2xl border ${borderStyle} flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#151A2D] to-[#111525]`}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rpg-muted">
            {item.itemRarity} {item.itemType}
          </span>
          {item.equipped && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              EQUIPPED
            </span>
          )}
        </div>

        <div className="text-center my-2">
          <div className="w-14 h-14 mx-auto rounded-xl bg-[#111525] border border-rpg-border flex items-center justify-center text-3xl mb-2">
            {item.itemIcon || '🛡️'}
          </div>
          <h4 className="font-fantasy font-bold text-sm text-rpg-text">
            {item.itemName}
          </h4>
          <p className="text-[11px] text-rpg-muted line-clamp-2 mt-1">
            {item.itemDescription}
          </p>
        </div>

        {item.itemEffect && (
          <p className="text-[11px] text-center text-rpg-purple font-semibold mt-1">
            {item.itemEffect}
          </p>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-rpg-border/60 text-center">
        <button
          onClick={() => onEquip(item._id)}
          disabled={isEquipping}
          className={`w-full py-1.5 rounded-xl font-fantasy font-bold text-xs transition-all ${
            item.equipped
              ? 'bg-[#111525] border border-rpg-border text-rpg-muted hover:text-white'
              : 'bg-rpg-purple/20 border border-rpg-purple/40 text-rpg-purple hover:bg-rpg-purple hover:text-white'
          }`}
        >
          {isEquipping ? 'Updating...' : item.equipped ? 'Unequip' : 'Equip Item'}
        </button>
      </div>
    </motion.div>
  );
};

export default InventoryCard;
