import React, { useState, useEffect } from 'react';
import DayNightEnvironment from './DayNightEnvironment';
import AnimalCompanion from './AnimalCompanion';
import { Sparkles, Heart, Zap, ArrowUpCircle, RefreshCw, Layers, Award } from 'lucide-react';

// 10 Distinct Tree Growth Stages Definition
export const TREE_STAGES = [
  {
    stage: 1,
    minLevel: 1,
    maxLevel: 1,
    title: '🌱 Seed & Sprout',
    subtitle: 'A tiny seed sowed in rich fertile soil',
    description: 'Every great adventure begins with a single seed. Keep taking small real-life growth steps to nurture your sapling!',
    requiredXP: 100,
    foliageColor: '#34D399',
    trunkHeight: 40,
    canopySize: 20
  },
  {
    stage: 2,
    minLevel: 2,
    maxLevel: 2,
    title: '🌿 Tender Stem',
    subtitle: 'First stem reaching toward the sun',
    description: 'Your stem is breaking through the soil! Fresh green leaves unfold as your daily momentum builds.',
    requiredXP: 250,
    foliageColor: '#10B981',
    trunkHeight: 80,
    canopySize: 40
  },
  {
    stage: 3,
    minLevel: 3,
    maxLevel: 3,
    title: '🌱 Young Sapling',
    subtitle: 'Developing young branches & roots',
    description: 'Slender initial branches split out as your tree establishes deep roots in the sanctuary earth.',
    requiredXP: 450,
    foliageColor: '#059669',
    trunkHeight: 120,
    canopySize: 60
  },
  {
    stage: 4,
    minLevel: 4,
    maxLevel: 4,
    title: '🌳 Branching Young Tree',
    subtitle: 'Sturdy woody trunk with twin branches',
    description: 'Woody bark thickens and twin primary branches spread outward, forming a cozy shelter for wildlife.',
    requiredXP: 700,
    foliageColor: '#047857',
    trunkHeight: 160,
    canopySize: 85
  },
  {
    stage: 5,
    minLevel: 5,
    maxLevel: 5,
    title: '🌳 Flourishing Medium Tree',
    subtitle: 'Multi-layered foliage & strong root flare',
    description: 'A thriving crown of green leaves shades the meadow hill. Your tree is becoming a centerpiece of the sanctuary!',
    requiredXP: 1000,
    foliageColor: '#10B981',
    trunkHeight: 200,
    canopySize: 110
  },
  {
    stage: 6,
    minLevel: 6,
    maxLevel: 6,
    title: '🌸 Blooming Canopy Tree',
    subtitle: 'Rich foliage adorned with flower blossoms',
    description: 'Magical pink flower blossoms bloom on every branch, attracting songbirds and meadow spirits!',
    requiredXP: 1400,
    foliageColor: '#059669',
    trunkHeight: 230,
    canopySize: 135
  },
  {
    stage: 7,
    minLevel: 7,
    maxLevel: 7,
    title: '🍎 Fruitful Spreading Oak',
    subtitle: 'Expansive crown with achievement fruits',
    description: 'Rich achievement fruits hang from heavy branches. Your consistent focus has yielded abundant rewards.',
    requiredXP: 1900,
    foliageColor: '#047857',
    trunkHeight: 260,
    canopySize: 160
  },
  {
    stage: 8,
    minLevel: 8,
    maxLevel: 8,
    title: '🌳 Forest Elder Tree',
    subtitle: 'Deeply textured bark & glowing leaf aura',
    description: 'An elder pillar of nature with deep roots and a luminous green foliage aura visible across the realm.',
    requiredXP: 2500,
    foliageColor: '#065F46',
    trunkHeight: 290,
    canopySize: 185
  },
  {
    stage: 9,
    minLevel: 9,
    maxLevel: 9,
    title: '🌳 Great Ancient Tree',
    subtitle: 'Spreading ancient crown & falling leaves',
    description: 'A majestic ancient landmark. Leaves gently drift on sanctuary breezes as mythical creatures gather underneath.',
    requiredXP: 3200,
    foliageColor: '#064E3B',
    trunkHeight: 320,
    canopySize: 210
  },
  {
    stage: 10,
    minLevel: 10,
    maxLevel: 99,
    title: '✨ Grand Legendary Tree of Life',
    subtitle: 'Colossal golden-infused cosmic sanctuary tree',
    description: 'The ultimate pinnacle of growth! A sacred world tree radiating celestial light, golden leaves, and endless vitality.',
    requiredXP: 4000,
    foliageColor: '#F59E0B',
    trunkHeight: 350,
    canopySize: 240
  }
];

// Helper to get stage details for any level
export const getStageForLevel = (level) => {
  if (level >= 10) return TREE_STAGES[9];
  const stageObj = TREE_STAGES.find(s => level >= s.minLevel && level <= s.maxLevel);
  return stageObj || TREE_STAGES[0];
};

const LifeTree = ({
  user = null,
  level: externalLevel = 1,
  xp: externalXP = 0,
  streak = 0,
  companions = [],
  onLevelChange = null
}) => {
  // Local state to support both props and interactive demo buttons
  const [currentLevel, setCurrentLevel] = useState(externalLevel);
  const [currentXP, setCurrentXP] = useState(externalXP);
  const [timeMode, setTimeMode] = useState('auto');
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Growth Animation Phase State: 'idle' | 'trunk' | 'branches' | 'leaves' | 'settled'
  const [growthPhase, setGrowthPhase] = useState('idle');
  const [isGrowing, setIsGrowing] = useState(false);
  const [growthAnnouncement, setGrowthAnnouncement] = useState('');
  const [showBurst, setShowBurst] = useState(false);

  // Sync external props if updated upstream
  useEffect(() => {
    if (externalLevel && externalLevel !== currentLevel) {
      triggerGrowthSequence(externalLevel);
    }
  }, [externalLevel]);

  useEffect(() => {
    if (externalXP !== undefined) {
      setCurrentXP(externalXP);
    }
  }, [externalXP]);

  const currentStageInfo = getStageForLevel(currentLevel);
  const reqXP = currentStageInfo.requiredXP;

  const currentHour = new Date().getHours();
  let activeMode = timeMode;
  if (timeMode === 'auto') {
    if (currentHour >= 6 && currentHour < 20) activeMode = 'day';
    else activeMode = 'night';
  }

  // Trigger organic growth sequence when leveling up
  const triggerGrowthSequence = (targetLevel) => {
    setIsGrowing(true);
    setShowBurst(true);

    const newStage = getStageForLevel(targetLevel);
    setGrowthAnnouncement(`LEVEL UP! Your tree grew into: ${newStage.title}`);

    // Step 1: Trunk grows upward (0ms - 300ms)
    setGrowthPhase('trunk');

    // Step 2: Branches extend (300ms - 600ms)
    setTimeout(() => {
      setGrowthPhase('branches');
    }, 350);

    // Step 3: Leaves pop in / bloom (600ms - 900ms)
    setTimeout(() => {
      setGrowthPhase('leaves');
    }, 700);

    // Step 4: Tree settles & particles float (900ms+)
    setTimeout(() => {
      setGrowthPhase('settled');
      setCurrentLevel(targetLevel);
      if (onLevelChange) onLevelChange(targetLevel);
    }, 1050);

    // End growth sequence
    setTimeout(() => {
      setIsGrowing(false);
      setGrowthPhase('idle');
      setShowBurst(false);
    }, 2800);
  };

  // Interactive Demo Handler: Level Up
  const handleLevelUpClick = () => {
    const nextLvl = Math.min(10, currentLevel + 1);
    if (nextLvl !== currentLevel) {
      triggerGrowthSequence(nextLvl);
    } else {
      // Loop or boost
      triggerGrowthSequence(10);
    }
  };

  // Interactive Demo Handler: Add XP
  const handleAddXPClick = () => {
    const addedXP = currentXP + 250;
    setCurrentXP(addedXP);

    if (addedXP >= reqXP && currentLevel < 10) {
      triggerGrowthSequence(currentLevel + 1);
    }
  };

  // Interactive Demo Handler: Direct Level Jump
  const handleSetLevel = (lvl) => {
    if (lvl !== currentLevel) {
      triggerGrowthSequence(lvl);
    }
  };

  const allCompanions = companions || [];

  const companionPositions = [
    { top: '74%', left: '16%' }, // Cozy Cat roaming in left meadow grass
    { top: '76%', left: '68%' }, // Fluffy Rabbit hopping in right meadow grass
    { top: '24%', left: '26%' }, // Meadow Songbird on left branch
    { top: '72%', left: '46%' }, // Red Fox near center tree roots
    { top: '18%', left: '68%' }, // Sunwing Phoenix on right upper branch
    { top: '12%', left: '46%' }  // Celestial Dragon soaring top canopy
  ];

  // Achievement fruits hanging on branches (unlock progressively per level)
  const sampleFruits = [
    { id: 'seed_sown', title: 'First Growth Seed', icon: '🌱', color: 'bg-emerald-500', pos: { top: '48%', left: '38%' } },
    { id: 'stem_sprout', title: 'Stem Blooming', icon: '🌿', color: 'bg-teal-500', pos: { top: '42%', left: '58%' } },
    { id: 'streak_3', title: '3-Day Sun Streak', icon: '🌸', color: 'bg-pink-500', pos: { top: '35%', left: '32%' } },
    { id: 'level_5', title: 'Master Arborist V', icon: '🍎', color: 'bg-rose-500', pos: { top: '32%', left: '64%' } },
    { id: 'gold_1000', title: 'Golden Canopy Harvest', icon: '🪙', color: 'bg-amber-400', pos: { top: '24%', left: '46%' } },
    { id: 'legend_10', title: 'Sacred World Blossom', icon: '✨', color: 'bg-purple-500', pos: { top: '18%', left: '54%' } }
  ];

  const activeFruits = sampleFruits.slice(0, Math.min(sampleFruits.length, Math.ceil(currentLevel / 2)));

  // Calculate XP percentage for progress bar
  const xpPercent = Math.min(100, Math.round((currentXP / reqXP) * 100));

  return (
    <div className="w-full flex flex-col items-center justify-center relative space-y-4">

      {/* TOP HEADER: CURRENT LEVEL, XP PROGRESS BAR & STAGE MESSAGE */}
      <div className="w-full max-w-xl p-4 rounded-2xl bg-[#090B14]/90 border border-emerald-500/40 backdrop-blur-md space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-fantasy font-extrabold text-xs border border-emerald-500/40">
                STAGE {currentStageInfo.stage} OF 10
              </span>
              <span className="font-fantasy font-bold text-xs text-rpg-gold">
                LEVEL {currentLevel}
              </span>
            </div>
            <h2 className="font-fantasy font-extrabold text-lg text-white mt-1 flex items-center gap-2">
              {currentStageInfo.title}
            </h2>
          </div>

          {/* Time of Day Switcher */}
          <div className="flex items-center gap-1 bg-[#111525] p-1 rounded-xl border border-rpg-border self-start sm:self-auto">
            <button
              onClick={() => setTimeMode('day')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${timeMode === 'day' ? 'bg-amber-500 text-black' : 'text-rpg-muted hover:text-white'}`}
            >
              ☀️ DAY
            </button>

            <button
              onClick={() => setTimeMode('night')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${timeMode === 'night' ? 'bg-teal-600 text-white' : 'text-rpg-muted hover:text-white'}`}
            >
              🌙 NIGHT
            </button>
          </div>
        </div>

        {/* Dynamic Status Text Banner */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-emerald-300 font-fantasy font-semibold flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-4 h-4 text-rpg-gold" />
            {isGrowing ? '⚡ Your tree is growing organically!' : '🌱 Your tree is growing with every task!'}
          </span>
          <span className="text-rpg-muted font-fantasy text-[11px]">
            {currentXP} / {reqXP} XP ({xpPercent}%)
          </span>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full h-3.5 bg-[#111525] rounded-full overflow-hidden border border-emerald-500/30 p-[2px] relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 rounded-full transition-all duration-500 shadow-glow-gold"
            style={{ width: `${xpPercent}%` }}
          />
        </div>

        {/* GROWTH SEQUENCE PHASE INDICATOR STEPS */}
        {isGrowing && (
          <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-around text-[10px] font-fantasy font-bold text-emerald-200 animate-in fade-in">
            <span className={`transition-all ${growthPhase === 'trunk' ? 'text-amber-300 scale-110 underline' : 'opacity-60'}`}>
              1. 🪵 Trunk Grows
            </span>
            <span>→</span>
            <span className={`transition-all ${growthPhase === 'branches' ? 'text-amber-300 scale-110 underline' : 'opacity-60'}`}>
              2. 🌿 Branches Extend
            </span>
            <span>→</span>
            <span className={`transition-all ${growthPhase === 'leaves' ? 'text-amber-300 scale-110 underline' : 'opacity-60'}`}>
              3. 🍃 Leaves Bloom
            </span>
            <span>→</span>
            <span className={`transition-all ${growthPhase === 'settled' ? 'text-emerald-300 scale-110 underline' : 'opacity-60'}`}>
              4. ✨ Tree Settles
            </span>
          </div>
        )}
      </div>

      {/* MAIN TREE VISUAL CANVAS */}
      <div className="relative w-full max-w-xl aspect-[4/5] rounded-3xl overflow-hidden flex items-center justify-center border-2 border-emerald-500/40 shadow-2xl group bg-[#090B14]">

        {/* Environment Background Sky */}
        <DayNightEnvironment mode={timeMode} />

        {/* SOFT NATURAL SUNLIGHT BEAM RAYS OVERLAY */}
        {activeMode === 'day' && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-40 sunbeam-overlay">
            <svg viewBox="0 0 500 500" className="w-full h-full preserve-3d">
              <linearGradient id="sunbeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
              <rect width="500" height="500" fill="url(#sunbeamGrad)" />
            </svg>
          </div>
        )}

        {/* ANIMATED BUTTERFLIES FLUTTERING OVER MEADOW FLOWERS */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className="absolute top-[62%] left-[16%] anim-butterfly">
            <span className="inline-block text-base anim-wing drop-shadow-md">🦋</span>
          </div>
          <div className="absolute top-[58%] right-[20%] anim-butterfly" style={{ animationDelay: '2.5s' }}>
            <span className="inline-block text-sm anim-wing drop-shadow-md">🦋</span>
          </div>
          {currentLevel >= 3 && (
            <div className="absolute top-[52%] left-[45%] anim-butterfly" style={{ animationDelay: '5s' }}>
              <span className="inline-block text-xs anim-wing drop-shadow-md">✨</span>
            </div>
          )}
          {currentLevel >= 6 && (
            <div className="absolute top-[48%] right-[38%] anim-butterfly" style={{ animationDelay: '1.8s' }}>
              <span className="inline-block text-base anim-wing drop-shadow-md">🦋</span>
            </div>
          )}
        </div>

        {/* LEVEL UP SHOCKWAVE BURST AURA */}
        {showBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-64 h-64 rounded-full border-4 border-emerald-400/80 levelup-ring" />
            <div className="w-96 h-96 rounded-full border-2 border-amber-300/60 levelup-ring" style={{ animationDelay: '0.2s' }} />
          </div>
        )}

        {/* FLOATING LEAF & SPARKLE PARTICLES ON LEVEL UP / SETTLED */}
        {(isGrowing || currentLevel >= 8) && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            <span className="absolute top-10 left-16 text-lg particle-leaf">🍃</span>
            <span className="absolute top-14 right-20 text-base particle-leaf" style={{ animationDelay: '1s' }}>🌿</span>
            <span className="absolute top-24 left-1/3 text-sm particle-leaf" style={{ animationDelay: '1.8s' }}>🍃</span>
            <span className="absolute top-20 right-1/3 text-xs particle-sparkle">✨</span>
            <span className="absolute top-36 left-1/4 text-sm particle-sparkle" style={{ animationDelay: '1.2s' }}>⭐</span>
            <span className="absolute top-44 right-1/4 text-xs particle-sparkle" style={{ animationDelay: '2.2s' }}>✨</span>
          </div>
        )}

        {/* MEADOW TERRAIN & HILL */}
        <div className="absolute bottom-0 inset-x-0 h-44 z-0 overflow-hidden">
          <svg viewBox="0 0 500 150" className="w-full h-full preserve-3d" preserveAspectRatio="none">
            <path d="M0,80 Q150,40 300,70 Q420,90 500,60 V150 H0 Z" fill="#064e3b" opacity="0.8" />
            <path d="M0,95 Q200,65 380,85 Q460,95 500,75 V150 H0 Z" fill="#047857" opacity="0.9" />
            <path d="M0,110 Q120,85 260,105 Q400,90 500,100 V150 H0 Z" fill="#10b981" opacity="0.95" />
          </svg>
        </div>

        {/* DYNAMIC SVG TREE STAGE CANVAS */}
        <div
          onClick={() => setShowStatsModal(true)}
          className={`relative z-10 w-full h-full flex items-center justify-center p-4 translate-y-6 cursor-pointer transition-all duration-700 ease-out origin-bottom ${growthPhase === 'trunk' ? 'tree-trunk-anim' : ''
            }`}
          title="Click the Life Tree to view stage details & growth chronicles!"
        >
          <svg
            viewBox="0 0 500 600"
            className="w-full h-full max-h-[520px] filter overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="barkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78350F" />
                <stop offset="50%" stopColor="#451A03" />
                <stop offset="100%" stopColor="#1C0A00" />
              </linearGradient>

              <linearGradient id="legendaryBark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="40%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>

              <radialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={currentLevel >= 10 ? "rgba(245, 158, 11, 0.6)" : "rgba(52, 211, 153, 0.45)"} />
                <stop offset="70%" stopColor="rgba(16, 185, 129, 0.15)" />
                <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
              </radialGradient>
            </defs>

            {/* Tree Background Ambient Glow */}
            <circle cx="250" cy="280" r={100 + currentStageInfo.canopySize * 0.6} fill="url(#stageGlow)" className="animate-pulse" />

            {/* ------------------------------------------------------------- */}
            {/* RENDER SPECIFIC TREE STAGE GRAPHICS BASED ON CURRENT LEVEL    */}
            {/* ------------------------------------------------------------- */}

            {/* STAGE 1: SEED & SPROUT (LEVEL 1) */}
            {currentLevel === 1 && (
              <g id="stage-1-sprout" className={growthPhase === 'leaves' ? 'tree-leaf-pop-anim' : ''}>
                {/* Soil Mound */}
                <ellipse cx="250" cy="510" rx="45" ry="16" fill="#451A03" />
                <ellipse cx="250" cy="505" rx="35" ry="12" fill="#78350F" />
                {/* Glowing Seed Pod */}
                <ellipse cx="242" cy="508" rx="8" ry="5" fill="#F59E0B" className="animate-pulse" />
                {/* Sprout Stem */}
                <path d="M250 505 C248 480 252 460 250 440" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
                {/* Twin Tiny Sprout Leaves */}
                <path d="M250 440 C235 425 210 435 225 448 C240 455 250 440 250 440 Z" fill="#34D399" />
                <path d="M250 440 C265 425 290 435 275 448 C260 455 250 440 250 440 Z" fill="#10B981" />
              </g>
            )}

            {/* STAGE 2: TENDER STEM (LEVEL 2) */}
            {currentLevel === 2 && (
              <g id="stage-2-stem">
                <ellipse cx="250" cy="520" rx="55" ry="18" fill="#451A03" />
                {/* Slender Stem */}
                <path d="M250 515 C245 460 255 400 250 350" stroke="#78350F" strokeWidth="10" strokeLinecap="round" className={growthPhase === 'trunk' ? 'tree-trunk-anim' : ''} />
                {/* 4 Leaves */}
                <g className={growthPhase === 'leaves' ? 'tree-leaf-pop-anim' : ''}>
                  <path d="M250 440 C220 430 200 450 220 460 Z" fill="#34D399" />
                  <path d="M250 410 C280 400 300 420 280 430 Z" fill="#10B981" />
                  <path d="M250 370 C220 350 200 380 225 385 Z" fill="#059669" />
                  <path d="M250 350 C265 330 290 335 275 355 Z" fill="#34D399" />
                </g>
              </g>
            )}

            {/* STAGE 3: YOUNG SAPLING (LEVEL 3) */}
            {currentLevel === 3 && (
              <g id="stage-3-sapling">
                <ellipse cx="250" cy="525" rx="65" ry="20" fill="#451A03" />
                {/* Sapling Trunk */}
                <path d="M250 520 C242 430 258 350 250 280" stroke="url(#barkGrad)" strokeWidth="14" strokeLinecap="round" />
                {/* Initial Branches */}
                <g className={growthPhase === 'branches' ? 'tree-branch-anim' : ''}>
                  <path d="M248 380 C220 350 190 340 170 335" stroke="url(#barkGrad)" strokeWidth="7" strokeLinecap="round" />
                  <path d="M252 350 C280 320 310 310 330 305" stroke="url(#barkGrad)" strokeWidth="7" strokeLinecap="round" />
                </g>
                {/* Sapling Foliage Clusters */}
                <g className={growthPhase === 'leaves' ? 'tree-leaf-pop-anim' : ''}>
                  <circle cx="165" cy="330" r="32" fill="#10B981" opacity="0.95" />
                  <circle cx="335" cy="300" r="32" fill="#059669" opacity="0.95" />
                  <circle cx="250" cy="265" r="45" fill="#34D399" opacity="0.95" />
                </g>
              </g>
            )}

            {/* STAGE 4: BRANCHING YOUNG TREE (LEVEL 4) */}
            {currentLevel === 4 && (
              <g id="stage-4-young-tree">
                {/* Roots */}
                <path d="M200 525 C230 490 240 430 250 360 C260 430 270 490 300 525 Z" fill="url(#barkGrad)" />
                {/* Trunk */}
                <path d="M250 515 C240 400 260 300 250 220" stroke="url(#barkGrad)" strokeWidth="22" strokeLinecap="round" />
                {/* Primary Branches */}
                <g className={growthPhase === 'branches' ? 'tree-branch-anim' : ''}>
                  <path d="M248 340 C190 300 150 270 120 260" stroke="url(#barkGrad)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M252 320 C310 280 350 250 380 240" stroke="url(#barkGrad)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M250 260 C220 200 190 170 170 160" stroke="url(#barkGrad)" strokeWidth="9" strokeLinecap="round" />
                </g>
                {/* Foliage Clouds */}
                <g className={growthPhase === 'leaves' ? 'tree-leaf-pop-anim' : ''}>
                  <circle cx="115" cy="255" r="50" fill="#059669" opacity="0.92" />
                  <circle cx="385" cy="235" r="50" fill="#047857" opacity="0.92" />
                  <circle cx="165" cy="155" r="42" fill="#10B981" opacity="0.95" />
                  <circle cx="250" cy="190" r="68" fill="#34D399" opacity="0.95" />
                </g>
              </g>
            )}

            {/* STAGE 5: MEDIUM FLOURISHING TREE (LEVEL 5) */}
            {currentLevel === 5 && (
              <g id="stage-5-medium-tree">
                <path d="M180 530 C220 480 235 400 245 320 C255 400 270 480 320 530 Z" fill="url(#barkGrad)" />
                <path d="M245 520 C235 380 265 260 250 180" stroke="url(#barkGrad)" strokeWidth="30" strokeLinecap="round" />

                <g className={growthPhase === 'branches' ? 'tree-branch-anim' : ''}>
                  <path d="M242 320 C180 270 130 240 95 230" stroke="url(#barkGrad)" strokeWidth="15" strokeLinecap="round" />
                  <path d="M255 300 C320 250 370 220 405 210" stroke="url(#barkGrad)" strokeWidth="15" strokeLinecap="round" />
                  <path d="M245 220 C210 160 175 130 155 120" stroke="url(#barkGrad)" strokeWidth="11" strokeLinecap="round" />
                  <path d="M255 220 C290 160 325 130 345 120" stroke="url(#barkGrad)" strokeWidth="11" strokeLinecap="round" />
                </g>

                <g className={growthPhase === 'leaves' ? 'tree-leaf-pop-anim' : ''}>
                  <circle cx="250" cy="140" r="82" fill="#10B981" opacity="0.95" />
                  <circle cx="150" cy="190" r="68" fill="#059669" opacity="0.92" />
                  <circle cx="350" cy="180" r="68" fill="#047857" opacity="0.92" />
                  <circle cx="250" cy="90" r="58" fill="#34D399" opacity="0.95" />
                  <circle cx="90" cy="225" r="52" fill="#10B981" opacity="0.9" />
                  <circle cx="410" cy="205" r="52" fill="#059669" opacity="0.9" />
                </g>
              </g>
            )}

            {/* STAGE 6: BLOOMING CANOPY TREE (LEVEL 6) */}
            {currentLevel === 6 && (
              <g id="stage-6-blooming-tree">
                <path d="M170 535 C215 480 230 390 245 300 C260 390 275 480 330 535 Z" fill="url(#barkGrad)" />
                <path d="M245 520 C230 360 265 240 250 160" stroke="url(#barkGrad)" strokeWidth="36" strokeLinecap="round" />

                <g className={growthPhase === 'branches' ? 'tree-branch-anim' : ''}>
                  <path d="M240 300 C170 250 115 220 80 210" stroke="url(#barkGrad)" strokeWidth="17" strokeLinecap="round" />
                  <path d="M255 280 C330 230 385 200 420 190" stroke="url(#barkGrad)" strokeWidth="17" strokeLinecap="round" />
                  <path d="M242 200 C200 140 160 110 135 100" stroke="url(#barkGrad)" strokeWidth="13" strokeLinecap="round" />
                  <path d="M258 200 C300 140 340 110 365 100" stroke="url(#barkGrad)" strokeWidth="13" strokeLinecap="round" />
                </g>

                <g className={growthPhase === 'leaves' ? 'tree-leaf-pop-anim' : ''}>
                  <circle cx="250" cy="130" r="92" fill="#10B981" opacity="0.95" />
                  <circle cx="140" cy="180" r="76" fill="#059669" opacity="0.92" />
                  <circle cx="360" cy="170" r="76" fill="#047857" opacity="0.92" />
                  <circle cx="250" cy="75" r="68" fill="#34D399" opacity="0.95" />
                  <circle cx="75" cy="205" r="58" fill="#10B981" opacity="0.9" />
                  <circle cx="425" cy="185" r="58" fill="#059669" opacity="0.9" />

                  {/* Pink Flower Blossoms */}
                  <circle cx="200" cy="140" r="9" fill="#EC4899" className="animate-pulse" />
                  <circle cx="290" cy="120" r="9" fill="#F472B6" className="animate-pulse" />
                  <circle cx="130" cy="200" r="8" fill="#F472B6" />
                  <circle cx="370" cy="190" r="8" fill="#EC4899" />
                  <circle cx="250" cy="80" r="10" fill="#F472B6" className="animate-pulse" />
                </g>
              </g>
            )}

            {/* STAGE 7: FRUITFUL SPREADING OAK (LEVEL 7) */}
            {currentLevel === 7 && (
              <g id="stage-7-oak">
                <path d="M150 540 C205 480 225 380 245 280 C265 380 285 480 345 540 Z" fill="url(#barkGrad)" />
                <path d="M245 525 C225 340 270 220 250 140" stroke="url(#barkGrad)" strokeWidth="44" strokeLinecap="round" />

                <g className={growthPhase === 'branches' ? 'tree-branch-anim' : ''}>
                  <path d="M235 280 C155 230 95 200 60 190" stroke="url(#barkGrad)" strokeWidth="20" strokeLinecap="round" />
                  <path d="M260 260 C340 210 400 180 435 170" stroke="url(#barkGrad)" strokeWidth="20" strokeLinecap="round" />
                  <path d="M240 180 C190 120 145 90 115 80" stroke="url(#barkGrad)" strokeWidth="15" strokeLinecap="round" />
                  <path d="M260 180 C310 120 355 90 385 80" stroke="url(#barkGrad)" strokeWidth="15" strokeLinecap="round" />
                </g>

                <g className={growthPhase === 'leaves' ? 'tree-leaf-pop-anim' : ''}>
                  <circle cx="250" cy="115" r="108" fill="#10B981" opacity="0.95" />
                  <circle cx="130" cy="165" r="88" fill="#059669" opacity="0.92" />
                  <circle cx="370" cy="155" r="88" fill="#047857" opacity="0.92" />
                  <circle cx="250" cy="55" r="78" fill="#34D399" opacity="0.95" />
                  <circle cx="60" cy="185" r="65" fill="#10B981" opacity="0.9" />
                  <circle cx="440" cy="165" r="65" fill="#059669" opacity="0.9" />
                </g>
              </g>
            )}

            {/* STAGE 8: FOREST ELDER TREE (LEVEL 8) */}
            {currentLevel === 8 && (
              <g id="stage-8-elder">
                <path d="M130 545 C195 480 220 360 245 250 C270 360 295 480 365 545 Z" fill="url(#barkGrad)" />
                <path d="M245 530 C220 320 275 190 250 120" stroke="url(#barkGrad)" strokeWidth="52" strokeLinecap="round" />

                <g className={growthPhase === 'branches' ? 'tree-branch-anim' : ''}>
                  <path d="M230 260 C140 210 75 180 40 170" stroke="url(#barkGrad)" strokeWidth="22" strokeLinecap="round" />
                  <path d="M265 240 C355 190 420 160 455 150" stroke="url(#barkGrad)" strokeWidth="22" strokeLinecap="round" />
                  <path d="M235 160 C175 100 125 70 95 60" stroke="url(#barkGrad)" strokeWidth="17" strokeLinecap="round" />
                  <path d="M265 160 C325 100 375 70 405 60" stroke="url(#barkGrad)" strokeWidth="17" strokeLinecap="round" />
                </g>

                <g className={growthPhase === 'leaves' ? 'tree-leaf-pop-anim' : ''}>
                  <circle cx="250" cy="100" r="122" fill="#10B981" opacity="0.95" />
                  <circle cx="115" cy="150" r="98" fill="#059669" opacity="0.92" />
                  <circle cx="385" cy="140" r="98" fill="#047857" opacity="0.92" />
                  <circle cx="250" cy="40" r="88" fill="#34D399" opacity="0.95" />
                  <circle cx="45" cy="165" r="72" fill="#10B981" opacity="0.9" />
                  <circle cx="455" cy="145" r="72" fill="#059669" opacity="0.9" />
                </g>
              </g>
            )}

            {/* STAGE 9: GREAT ANCIENT TREE (LEVEL 9) */}
            {currentLevel === 9 && (
              <g id="stage-9-ancient">
                <path d="M110 550 C185 480 215 340 245 220 C275 340 305 480 385 550 Z" fill="url(#barkGrad)" />
                <path d="M245 535 C215 300 280 170 250 100" stroke="url(#barkGrad)" strokeWidth="60" strokeLinecap="round" />

                <g className={growthPhase === 'branches' ? 'tree-branch-anim' : ''}>
                  <path d="M225 240 C125 190 55 160 20 150" stroke="url(#barkGrad)" strokeWidth="26" strokeLinecap="round" />
                  <path d="M270 220 C370 170 440 140 475 130" stroke="url(#barkGrad)" strokeWidth="26" strokeLinecap="round" />
                  <path d="M230 140 C160 80 110 50 75 40" stroke="url(#barkGrad)" strokeWidth="20" strokeLinecap="round" />
                  <path d="M270 140 C340 80 390 50 425 40" stroke="url(#barkGrad)" strokeWidth="20" strokeLinecap="round" />
                </g>

                <g className={growthPhase === 'leaves' ? 'tree-leaf-pop-anim' : ''}>
                  <circle cx="250" cy="85" r="135" fill="#10B981" opacity="0.95" />
                  <circle cx="100" cy="135" r="110" fill="#059669" opacity="0.92" />
                  <circle cx="400" cy="125" r="110" fill="#047857" opacity="0.92" />
                  <circle cx="250" cy="25" r="98" fill="#34D399" opacity="0.95" />
                  <circle cx="30" cy="145" r="82" fill="#10B981" opacity="0.9" />
                  <circle cx="470" cy="125" r="82" fill="#059669" opacity="0.9" />
                </g>
              </g>
            )}

            {/* STAGE 10+: GRAND LEGENDARY TREE OF LIFE (LEVEL 10+) */}
            {currentLevel >= 10 && (
              <g id="stage-10-legendary">
                {/* Celestial Aura Ring */}
                <ellipse cx="250" cy="160" rx="220" ry="140" fill="url(#stageGlow)" className="animate-pulse" />

                {/* Massive Root System */}
                <path d="M90 555 C175 480 210 320 245 200 C280 320 315 480 405 555 Z" fill="url(#legendaryBark)" />
                <path d="M245 540 C210 280 285 150 250 80" stroke="url(#legendaryBark)" strokeWidth="70" strokeLinecap="round" />

                {/* Spreading Golden Branches */}
                <g className={growthPhase === 'branches' ? 'tree-branch-anim' : ''}>
                  <path d="M220 220 C110 170 35 140 5 130" stroke="url(#legendaryBark)" strokeWidth="30" strokeLinecap="round" />
                  <path d="M275 200 C385 150 460 120 495 110" stroke="url(#legendaryBark)" strokeWidth="30" strokeLinecap="round" />
                  <path d="M225 120 C145 60 90 30 55 20" stroke="url(#legendaryBark)" strokeWidth="24" strokeLinecap="round" />
                  <path d="M275 120 C355 60 410 30 445 20" stroke="url(#legendaryBark)" strokeWidth="24" strokeLinecap="round" />
                </g>

                {/* Multi-Hued Sacred Crown (Emerald, Cyan, Gold) */}
                <g className={growthPhase === 'leaves' ? 'tree-leaf-pop-anim' : ''}>
                  <circle cx="250" cy="70" r="148" fill="#10B981" opacity="0.95" />
                  <circle cx="85" cy="120" r="120" fill="#06B6D4" opacity="0.92" />
                  <circle cx="415" cy="110" r="120" fill="#047857" opacity="0.92" />
                  <circle cx="250" cy="10" r="110" fill="#F59E0B" opacity="0.85" className="animate-pulse" />
                  <circle cx="20" cy="130" r="90" fill="#34D399" opacity="0.9" />
                  <circle cx="480" cy="110" r="90" fill="#FBBF24" opacity="0.8" />

                  {/* Floating Gold Orbs & Magic Sparkles */}
                  <circle cx="180" cy="80" r="12" fill="#F59E0B" className="animate-bounce" />
                  <circle cx="320" cy="60" r="14" fill="#FBBF24" className="animate-pulse" />
                  <circle cx="110" cy="140" r="10" fill="#F59E0B" />
                  <circle cx="390" cy="130" r="12" fill="#FBBF24" />
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* ACHIEVEMENT FRUITS HANGING ON BRANCHES */}
        {activeFruits.map((fruit) => (
          <div
            key={fruit.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFruit(fruit);
            }}
            className={`absolute z-30 w-8 h-8 rounded-full ${fruit.color} border border-white/70 flex items-center justify-center text-sm shadow-glow-gold cursor-pointer hover:scale-130 transition animate-bounce`}
            style={{ top: fruit.pos.top, left: fruit.pos.left }}
            title={`Achievement Fruit: ${fruit.title}`}
          >
            <span>{fruit.icon}</span>
          </div>
        ))}

        {/* LIVING ANIMAL COMPANIONS */}
        {allCompanions.map((comp, idx) => {
          const pos = companionPositions[idx % companionPositions.length];
          return (
            <AnimalCompanion
              key={comp.id || idx}
              companion={comp}
              position={pos}
            />
          );
        })}

        {/* Stage Tag Badge Overlay */}
        <div className="absolute top-4 left-4 z-20 bg-[#090B14]/90 border border-emerald-500/50 px-3 py-1.5 rounded-xl flex items-center gap-2 backdrop-blur-md">
          <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400/40 animate-pulse" />
          <span className="font-fantasy font-bold text-xs text-white">
            {currentStageInfo.title}
          </span>
        </div>
      </div>



      {/* ACHIEVEMENT FRUIT MODAL POPUP */}
      {selectedFruit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="rpg-panel p-6 rounded-3xl border border-rpg-gold max-w-sm w-full text-center space-y-4 shadow-glow-gold animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-rpg-gold mx-auto flex items-center justify-center text-3xl">
              {selectedFruit.icon}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rpg-gold">ACHIEVEMENT FRUIT</span>
              <h3 className="font-fantasy font-extrabold text-lg text-rpg-text mt-0.5">{selectedFruit.title}</h3>
            </div>
            <p className="text-xs text-rpg-muted leading-relaxed">
              This magical fruit bloomed on your Life Tree branch when you sowed & completed this milestone!
            </p>
            <button
              onClick={() => setSelectedFruit(null)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-fantasy font-bold text-xs hover:bg-emerald-500 transition shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* LIFE TREE STATS MODAL */}
      {showStatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="rpg-panel p-6 rounded-3xl border border-emerald-500 max-w-md w-full text-left space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-rpg-border pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌳</span>
                <div>
                  <h3 className="font-fantasy font-extrabold text-lg text-rpg-text">LIFE TREE CHRONICLES</h3>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">STAGE {currentStageInfo.stage}: {currentStageInfo.title}</p>
                </div>
              </div>
              <button onClick={() => setShowStatsModal(false)} className="text-rpg-muted hover:text-white font-bold">✕</button>
            </div>

            <p className="text-xs text-emerald-300 font-fantasy leading-relaxed italic bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30">
              "{currentStageInfo.description}"
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-fantasy">
              <div className="p-3 rounded-xl bg-[#090B14] border border-rpg-border">
                <span className="text-rpg-muted block">Tree Level</span>
                <span className="text-emerald-400 font-extrabold text-base">Level {currentLevel}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090B14] border border-rpg-border">
                <span className="text-rpg-muted block">Current XP</span>
                <span className="text-rpg-blue font-extrabold text-base">{currentXP} XP</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090B14] border border-rpg-border">
                <span className="text-rpg-muted block">Flowering Streak</span>
                <span className="text-orange-400 font-extrabold text-base">{streak} Days</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090B14] border border-rpg-border">
                <span className="text-rpg-muted block">Active Companions</span>
                <span className="text-rpg-gold font-extrabold text-base">{allCompanions.length} Animals</span>
              </div>
            </div>

            <button
              onClick={() => setShowStatsModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-fantasy font-bold text-xs hover:bg-emerald-500 transition shadow-lg"
            >
              Return to Sanctuary World
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifeTree;
