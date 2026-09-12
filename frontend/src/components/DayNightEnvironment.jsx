import React from 'react';
import { Sun, Moon, Sunset as SunsetIcon } from 'lucide-react';

const DayNightEnvironment = ({ mode = 'auto', onToggleMode = null }) => {
  // Determine current effective time state
  const currentHour = new Date().getHours();
  let activeMode = mode;

  if (mode === 'auto') {
    if (currentHour >= 6 && currentHour < 20) activeMode = 'day';
    else activeMode = 'night';
  }

  const getSkyGradient = () => {
    switch (activeMode) {
      case 'day':
        return 'from-sky-950/60 via-slate-900/80 to-[#090B14] border-sky-500/30';

      case 'night':
      default:
        return 'from-[#030511] via-[#080B1E] to-[#090B14] border-indigo-500/40';
    }
  };

  return (
    <div className={`absolute inset-0 rounded-3xl border bg-gradient-to-b ${getSkyGradient()} transition-all duration-700 overflow-hidden pointer-events-none`}>
      {/* Sun / Moon Celestial Body */}
      <div className="absolute top-6 right-8 opacity-80">
        {activeMode === 'day' && (
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.6)] animate-pulse"></div>
            <Sun className="w-6 h-6 text-amber-100 absolute inset-0 m-auto" />
          </div>
        )}

        {activeMode === 'night' && (
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-indigo-200 shadow-[0_0_35px_rgba(199,210,254,0.5)]"></div>
            <Moon className="w-6 h-6 text-indigo-900 absolute inset-0 m-auto" />
          </div>
        )}
      </div>

      {/* Starry Sky & Floating Fireflies (Night Mode) */}
      {activeMode === 'night' && (
        <div className="absolute inset-0">
          {/* Stars */}
          {[...Array(15)].map((_, i) => (
            <div 
              key={`star-${i}`} 
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 60 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            />
          ))}
          {/* Fireflies */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047] animate-ping duration-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_#6ee7b7] animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9] animate-bounce"></div>
        </div>
      )}

      {/* Ambient Horizon Glow Line */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#090B14] to-transparent"></div>
    </div>
  );
};

export default DayNightEnvironment;
