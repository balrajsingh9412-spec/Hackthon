import React from 'react';
import { Sword, Brain, Heart, Target, BookOpen } from 'lucide-react';

const STAT_CONFIG = {
  strength: {
    label: 'Strength',
    icon: Sword,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    barColor: 'bg-red-500',
    description: 'Physical prowess & workouts'
  },
  intellect: {
    label: 'Intellect',
    icon: Brain,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    barColor: 'bg-blue-500',
    description: 'Coding, logic & engineering'
  },
  vitality: {
    label: 'Vitality',
    icon: Heart,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    barColor: 'bg-emerald-500',
    description: 'Health, sleep & endurance'
  },
  discipline: {
    label: 'Discipline',
    icon: Target,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    barColor: 'bg-purple-500',
    description: 'Habits & focus execution'
  },
  wisdom: {
    label: 'Wisdom',
    icon: BookOpen,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    barColor: 'bg-amber-500',
    description: 'Reading, learning & reflection'
  }
};

const StatCard = ({ statKey = 'intellect', value = 10, max = 100 }) => {
  const config = STAT_CONFIG[statKey.toLowerCase()] || STAT_CONFIG.intellect;
  const Icon = config.icon;
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={`rpg-panel p-4 rounded-xl border ${config.borderColor} transition-all hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-lg ${config.bgColor} border ${config.borderColor} flex items-center justify-center ${config.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-fantasy font-bold text-sm text-rpg-text">{config.label}</h4>
            <p className="text-[10px] text-rpg-muted">{config.description}</p>
          </div>
        </div>
        <span className={`font-fantasy font-extrabold text-lg ${config.color}`}>
          {value}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#111525] h-2 rounded-full overflow-hidden border border-rpg-border/40 mt-1">
        <div
          className={`h-full rounded-full ${config.barColor} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatCard;
