import React from 'react';
import { Flame, Check } from 'lucide-react';

const StreakCard = ({ streak = { current: 0, longest: 0, lastCompletedDate: null } }) => {
  const currentStreak = streak.current || 0;
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Determine active checkmarks for the current streak up to today
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday=0 ... Sunday=6
  const completedDays = daysOfWeek.map((day, idx) => {
    if (currentStreak === 0) return false;
    // Check if idx is within streak window ending at today
    const diff = todayIndex - idx;
    return diff >= 0 && diff < currentStreak;
  });

  return (
    <div className="rpg-panel p-5 rounded-2xl border border-amber-500/30 relative overflow-hidden bg-gradient-to-br from-[#151A2D] to-[#1a1528]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 flame-anim">
            <Flame className="w-7 h-7 fill-orange-500/40 text-orange-400" />
          </div>
          <div>
            <h3 className="font-fantasy font-bold text-lg text-orange-300">
              {currentStreak} DAY STREAK
            </h3>
            <p className="text-xs text-rpg-muted">
              Longest Streak: <span className="text-white font-semibold">{streak.longest || currentStreak} days</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-rpg-border/60">
        <div className="flex justify-between items-center text-center">
          {daysOfWeek.map((day, idx) => {
            const isDone = completedDays[idx];
            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <span className="text-xs font-semibold text-rpg-muted">{day}</span>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 ring-1 ring-orange-400'
                      : 'bg-[#111525] border border-rpg-border text-rpg-muted'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : '•'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StreakCard;
