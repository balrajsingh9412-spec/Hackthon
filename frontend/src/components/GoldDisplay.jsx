import React from 'react';

const GoldDisplay = ({ amount = 0, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3.5 py-1.5',
    lg: 'text-lg px-4 py-2 font-bold'
  };

  return (
    <div className={`inline-flex items-center gap-2 rounded-full bg-[#151A2D] border border-rpg-gold/40 text-rpg-gold shadow-glow-gold ${sizeClasses[size] || sizeClasses.md}`}>
      <span className="text-base animate-bounce">🪙</span>
      <span className="font-semibold tracking-wide font-fantasy text-[#F5B942]">
        {amount.toLocaleString()} <span className="text-xs font-sans font-normal opacity-80 text-amber-200">Gold</span>
      </span>
    </div>
  );
};

export default GoldDisplay;
