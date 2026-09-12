import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LifeTree, { TREE_STAGES, getStageForLevel } from '../components/LifeTree';
import XPBar from '../components/XPBar';
import { Sprout, Compass, Sparkles, Award, ArrowRight, Shield, Zap, Layers, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const TreeProgression = () => {
  const { user, updateUser } = useAuth();
  const [activeTabStage, setActiveTabStage] = useState(user?.level || 1);

  const handleLevelUpdate = (newLevel) => {
    setActiveTabStage(newLevel);
    if (user) {
      updateUser({ ...user, level: newLevel });
    }
  };

  const currentStageInfo = getStageForLevel(activeTabStage);

  return (
    <div className="space-y-6 pb-16">
      {/* TOP HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0d2218] via-[#111525] to-[#161226] p-6 rounded-2xl border border-emerald-500/30 shadow-xl">
        <div>
          <span className="text-[11px] font-bold font-fantasy text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-rpg-gold" /> TREE GROWTH & LEVEL PROGRESSION
          </span>
          <h1 className="font-fantasy font-extrabold text-2xl text-rpg-text mt-0.5">
            LIVING LIFE TREE: <span className="gold-text uppercase">LEVEL {activeTabStage}</span>
          </h1>
          <p className="text-xs text-rpg-muted mt-1 max-w-xl">
            Watch your single Life Tree evolve organically from a tiny seed into a sacred legendary world tree as you level up!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/quests"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-fantasy font-bold text-xs shadow-glow-gold flex items-center gap-2 active:scale-95 transition"
          >
            <Sprout className="w-4 h-4" /> Earn XP on Growth Board
          </Link>
        </div>
      </div>

      {/* STAGE PROGRESSION PIPELINE TIMELINE (STAGES 1 TO 10) */}
      <div className="rpg-panel p-5 rounded-2xl border border-emerald-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-fantasy font-bold text-sm text-rpg-text flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" /> 10-STAGE EVOLUTION PATHWAY
          </h3>
          <span className="text-xs font-fantasy text-emerald-400 font-bold">
            Current Stage: {currentStageInfo.stage} / 10
          </span>
        </div>

        {/* Timeline Stage Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {TREE_STAGES.map((stage) => {
            const isCurrent = activeTabStage === stage.stage;
            const isUnlocked = activeTabStage >= stage.stage;

            return (
              <button
                key={stage.stage}
                onClick={() => setActiveTabStage(stage.stage)}
                className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-glow-gold scale-105'
                    : isUnlocked
                    ? 'bg-[#111525] border-emerald-500/40 text-white hover:border-emerald-400'
                    : 'bg-[#090B14] border-rpg-border text-rpg-muted opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-fantasy font-bold">
                  <span className={isCurrent ? 'text-amber-300' : 'text-rpg-muted'}>L{stage.stage}</span>
                  {isUnlocked && <span className="text-emerald-400">✓</span>}
                </div>
                <div className="text-base my-1">{stage.title.split(' ')[0]}</div>
                <div className="text-[9px] font-fantasy font-bold truncate leading-tight">
                  {stage.title.split(' ').slice(1).join(' ')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT GRID: CENTER IS THE MAIN PROMINENT LIFE TREE VISUAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: GROWTH BEHAVIOR & ANIMATION SEQUENCE GUIDE (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Stage Info Card */}
          <div className="rpg-panel p-5 rounded-2xl border border-emerald-500/40 space-y-3 bg-gradient-to-b from-[#0d2218] via-[#111525] to-[#090B14]">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{currentStageInfo.title.split(' ')[0]}</span>
              <div>
                <span className="text-[10px] font-bold font-fantasy text-emerald-400 tracking-wider uppercase">
                  STAGE {currentStageInfo.stage} ARCHETYPE
                </span>
                <h3 className="font-fantasy font-bold text-base text-white">
                  {currentStageInfo.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-rpg-muted leading-relaxed">
              {currentStageInfo.description}
            </p>

            <div className="p-3 rounded-xl bg-[#090B14] border border-rpg-border text-xs space-y-1 font-fantasy">
              <div className="flex justify-between text-rpg-muted">
                <span>Required Level XP:</span>
                <span className="text-emerald-400 font-bold">{currentStageInfo.requiredXP} XP</span>
              </div>
              <div className="flex justify-between text-rpg-muted">
                <span>Canopy Spread:</span>
                <span className="text-rpg-gold font-bold">{currentStageInfo.canopySize} meters</span>
              </div>
            </div>
          </div>

          {/* Organic Growth Sequence Details */}
          <div className="rpg-panel p-5 rounded-2xl border border-rpg-border space-y-3">
            <h4 className="font-fantasy font-bold text-xs text-rpg-gold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rpg-gold" /> ORGANIC GROWTH ANIMATION PHASES
            </h4>
            
            <div className="space-y-2 text-xs font-fantasy">
              <div className="p-2.5 rounded-xl bg-[#090B14] border border-emerald-500/30 flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs">1</div>
                <div>
                  <div className="text-white font-bold">Trunk Grows</div>
                  <div className="text-[10px] text-rpg-muted">Trunk stretches upward & bark texture thickens</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#090B14] border border-emerald-500/30 flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs">2</div>
                <div>
                  <div className="text-white font-bold">Branches Extend</div>
                  <div className="text-[10px] text-rpg-muted">Organic wood branches open outward</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#090B14] border border-emerald-500/30 flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-xs">3</div>
                <div>
                  <div className="text-white font-bold">Leaves Bloom</div>
                  <div className="text-[10px] text-rpg-muted">Foliage clusters pop in with elastic bounce</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#090B14] border border-emerald-500/30 flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs">4</div>
                <div>
                  <div className="text-white font-bold">Tree Settles & Particles</div>
                  <div className="text-[10px] text-rpg-muted">Subtle falling leaves & glowing magic sparkles float</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: THE PROMINENT INTERACTIVE LIFE TREE (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <LifeTree
            user={user}
            level={activeTabStage}
            xp={user?.xp || 0}
            streak={user?.streak?.current || 0}
            companions={user?.purchasedCompanions || []}
            onLevelChange={handleLevelUpdate}
          />
        </div>

      </div>
    </div>
  );
};

export default TreeProgression;
