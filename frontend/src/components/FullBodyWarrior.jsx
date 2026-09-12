import React from 'react';
import { Sparkles, Flame, Shield, Zap, AlertCircle } from 'lucide-react';

const FullBodyWarrior = ({
  user,
  energy = 85,
  level = 1,
  character = {},
  equippedItems = {},
  tryOnItem = null,
  onCompleteQuestClick = null,
  showStatusBanner = true,
  size = 'large' // 'normal', 'large', 'hero'
}) => {
  // Merge equipped items with tryOnItem if present (for Shop Live Preview)
  const currentArmor = (tryOnItem && (tryOnItem.category === 'armor' || tryOnItem.category === 'shirt')) 
    ? tryOnItem 
    : (equippedItems?.armor || equippedItems?.shirt);
  
  const currentWeapon = (tryOnItem && tryOnItem.category === 'weapon') 
    ? tryOnItem 
    : equippedItems?.weapon;
    
  const currentHelmet = (tryOnItem && tryOnItem.category === 'helmet') 
    ? tryOnItem 
    : equippedItems?.helmet;

  const currentShield = (tryOnItem && tryOnItem.category === 'shield') 
    ? tryOnItem 
    : equippedItems?.shield;

  // Determine Energy Visual State
  let energyState = 'ENERGIZED';
  let bannerColor = 'from-amber-500/20 to-emerald-500/20 text-amber-300 border-amber-500/40';
  let bannerText = '⚡ YOUR WARRIOR IS ENERGIZED! READY FOR ADVENTURE';
  let auraGlow = 'shadow-[0_0_50px_rgba(234,179,8,0.25)]';
  let bodyPosture = 'translate-y-0 scale-100';
  let headTilt = 'rotate-0';
  let eyeColorStyle = '#00F0FF';

  if (energy >= 80) {
    energyState = 'ENERGIZED';
    bannerText = '⚡ YOUR WARRIOR IS ENERGIZED! READY FOR ADVENTURE';
    bannerColor = 'from-amber-500/20 via-emerald-500/20 to-cyan-500/20 text-amber-300 border-amber-500/40';
    auraGlow = 'shadow-[0_0_60px_rgba(245,158,11,0.35)]';
    eyeColorStyle = '#38BDF8';
  } else if (energy >= 60) {
    energyState = 'HEALTHY';
    bannerText = '💚 YOUR WARRIOR IS HEALTHY & READY FOR ADVENTURE';
    bannerColor = 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40';
    auraGlow = 'shadow-[0_0_40px_rgba(16,185,129,0.25)]';
    eyeColorStyle = '#10B981';
  } else if (energy >= 40) {
    energyState = 'TIRED';
    bannerText = '🛡️ WARRIOR STANCE: KEEP GOING';
    bannerColor = 'from-indigo-500/20 to-blue-500/20 text-indigo-300 border-indigo-500/40';
    auraGlow = 'shadow-[0_0_25px_rgba(99,102,241,0.2)]';
    eyeColorStyle = '#818CF8';
  } else if (energy >= 20) {
    energyState = 'WEAK';
    bannerText = '🍂 YOUR WARRIOR IS GETTING TIRED. COMPLETE A QUEST TO RESTORE STRENGTH.';
    bannerColor = 'from-orange-500/20 to-amber-600/20 text-orange-300 border-orange-500/40';
    auraGlow = 'shadow-[0_0_15px_rgba(249,115,22,0.15)] opacity-80';
    bodyPosture = 'translate-y-1 scale-[0.98]';
    headTilt = 'rotate-2';
    eyeColorStyle = '#F97316';
  } else {
    energyState = 'EXHAUSTED';
    bannerText = '💤 YOUR WARRIOR NEEDS YOU. COMPLETE A QUEST TO RESTORE STRENGTH.';
    bannerColor = 'from-rose-500/20 via-red-900/30 to-rose-500/20 text-rose-300 border-rose-500/50';
    auraGlow = 'shadow-[0_0_10px_rgba(225,29,72,0.1)] opacity-70 filter grayscale-[0.2]';
    bodyPosture = 'translate-y-3 scale-[0.96]';
    headTilt = 'rotate-6';
    eyeColorStyle = '#EF4444';
  }

  // Material & Color Tier Styling Helper
  const getMaterialStyle = (item, defaultType = 'cloth') => {
    const mat = (item?.material || defaultType).toLowerCase();
    switch (mat) {
      case 'mythic':
        return { fill: 'url(#mythicGrad)', stroke: '#FF00EA', glow: 'drop-shadow-[0_0_12px_rgba(255,0,234,0.8)]' };
      case 'diamond':
        return { fill: 'url(#diamondGrad)', stroke: '#38BDF8', glow: 'drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]' };
      case 'gold':
        return { fill: 'url(#goldGrad)', stroke: '#F59E0B', glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' };
      case 'silver':
        return { fill: 'url(#silverGrad)', stroke: '#E2E8F0', glow: 'drop-shadow-[0_0_6px_rgba(226,232,240,0.5)]' };
      case 'steel':
        return { fill: '#475569', stroke: '#94A3B8', glow: '' };
      case 'iron':
        return { fill: '#334155', stroke: '#64748B', glow: '' };
      case 'leather':
        return { fill: '#78350F', stroke: '#92400E', glow: '' };
      default:
        return { fill: '#1E293B', stroke: '#334155', glow: '' };
    }
  };

  const armorStyle = getMaterialStyle(currentArmor, 'cloth');
  const weaponStyle = getMaterialStyle(currentWeapon, 'wood');
  const helmetStyle = getMaterialStyle(currentHelmet, 'none');
  const shieldStyle = getMaterialStyle(currentShield, 'iron');

  // Background Realm evolving with level
  const getRealmBackground = (lvl) => {
    if (lvl >= 50) return 'from-purple-900/40 via-indigo-950/60 to-[#090B14] border-purple-500/40';
    if (lvl >= 30) return 'from-amber-900/30 via-slate-900/60 to-[#090B14] border-amber-500/30';
    if (lvl >= 20) return 'from-blue-900/30 via-slate-900/60 to-[#090B14] border-blue-500/30';
    if (lvl >= 10) return 'from-emerald-900/30 via-slate-900/60 to-[#090B14] border-emerald-500/30';
    return 'from-slate-900/50 via-[#111525] to-[#090B14] border-rpg-border';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full relative">
      {/* Energy Condition Status Banner */}
      {showStatusBanner && (
        <div className={`w-full max-w-lg mb-4 px-4 py-2.5 rounded-2xl bg-gradient-to-r ${bannerColor} border backdrop-blur-md text-xs font-fantasy font-bold text-center flex items-center justify-between gap-2 shadow-lg transition-all duration-300`}>
          <span className="truncate">{bannerText}</span>
          {energy < 40 && onCompleteQuestClick && (
            <button
              onClick={onCompleteQuestClick}
              className="px-3 py-1 rounded-xl bg-emerald-500 text-white text-[11px] hover:bg-emerald-400 transition shadow-glow-gold font-sans font-semibold shrink-0"
            >
              + Complete Quest
            </button>
          )}
        </div>
      )}

      {/* Main Full-Body Warrior Canvas Stage */}
      <div className={`relative w-full max-w-md aspect-[3/4] rounded-3xl border bg-gradient-to-b ${getRealmBackground(level)} flex items-center justify-center overflow-hidden transition-all duration-500 ${auraGlow}`}>
        
        {/* Environmental Fantasy Background Layer */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.15)_0,transparent_70%)]"></div>
          {/* Floating magical ambient particles */}
          <div className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-amber-400/60 blur-[1px] animate-ping duration-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-cyan-400/40 blur-[1px] animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-purple-400/50 blur-[1px] animate-bounce"></div>
        </div>

        {/* Hero Pedestal Platform */}
        <div className="absolute bottom-6 w-3/4 h-12 rounded-[100%] bg-gradient-to-r from-emerald-500/20 via-indigo-500/30 to-emerald-500/20 blur-md border-t border-purple-500/30"></div>
        <div className="absolute bottom-8 w-2/3 h-6 rounded-[100%] bg-black/60 blur-sm"></div>

        {/* Animated Full-Body SVG Character Render */}
        <div className={`relative z-10 w-full h-full flex items-center justify-center p-4 transition-transform duration-500 ${bodyPosture}`}>
          <svg
            viewBox="0 0 400 550"
            className="w-full h-full max-h-[460px] filter drop-shadow-2xl overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Material Color Gradients */}
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE259" />
                <stop offset="100%" stopColor="#FFA751" />
              </linearGradient>

              <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>

              <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0F2FE" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>

              <linearGradient id="mythicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF00EA" />
                <stop offset="50%" stopColor="#7928CA" />
                <stop offset="100%" stopColor="#00DFD8" />
              </linearGradient>

              <radialGradient id="auraGlowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.4)" />
                <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
              </radialGradient>
            </defs>

            {/* ENERGIZED Back Aura Ring */}
            {energy >= 80 && (
              <circle cx="200" cy="220" r="160" fill="url(#auraGlowGrad)" className="animate-pulse" />
            )}

            {/* SHADOW BASE */}
            <ellipse cx="200" cy="490" rx="90" ry="18" fill="#000000" opacity="0.6" />

            {/* LEGS / BOOTS */}
            <g id="boots">
              {/* Left Leg */}
              <rect x="155" y="360" width="32" height="110" rx="10" fill="#1E293B" stroke="#334155" strokeWidth="3" />
              {/* Right Leg */}
              <rect x="213" y="360" width="32" height="110" rx="10" fill="#1E293B" stroke="#334155" strokeWidth="3" />
              {/* Boot Armor Plating */}
              <path d="M150 430 H190 V470 C190 475 180 480 150 480 Z" fill={armorStyle.fill} stroke={armorStyle.stroke} strokeWidth="3" />
              <path d="M210 430 H250 V480 C220 480 210 475 210 470 Z" fill={armorStyle.fill} stroke={armorStyle.stroke} strokeWidth="3" />
            </g>

            {/* BODY / CHEST ARMOR */}
            <g id="body">
              {/* Under-tunic */}
              <rect x="140" y="200" width="120" height="170" rx="20" fill="#0F172A" />
              
              {/* Suit / Armor Main Plate */}
              <path
                d="M135 210 L160 190 H240 L265 210 L255 350 H145 Z"
                fill={armorStyle.fill}
                stroke={armorStyle.stroke}
                strokeWidth="4"
                className={armorStyle.glow}
              />
              
              {/* Chestplate Emblem Detail */}
              <path d="M200 220 L220 250 H180 Z" fill={armorStyle.stroke} opacity="0.8" />
              <line x1="200" y1="250" x2="200" y2="330" stroke={armorStyle.stroke} strokeWidth="3" />

              {/* Pauldrons / Shoulder Guards */}
              <path d="M115 195 C115 170 145 175 155 200 L125 230 Z" fill={armorStyle.fill} stroke={armorStyle.stroke} strokeWidth="3" />
              <path d="M285 195 C285 170 255 175 245 200 L275 230 Z" fill={armorStyle.fill} stroke={armorStyle.stroke} strokeWidth="3" />
            </g>

            {/* ARMS */}
            {/* Left Arm holding Shield or at side */}
            <g id="leftArm">
              <rect x="110" y="210" width="28" height="120" rx="12" fill="#1E293B" stroke="#334155" strokeWidth="3" />
              {/* Glove */}
              <rect x="106" y="300" width="34" height="40" rx="8" fill={armorStyle.fill} stroke={armorStyle.stroke} strokeWidth="3" />
            </g>

            {/* Right Arm holding Weapon */}
            <g id="rightArm">
              <rect x="262" y="210" width="28" height="120" rx="12" fill="#1E293B" stroke="#334155" strokeWidth="3" />
              {/* Glove */}
              <rect x="260" y="300" width="34" height="40" rx="8" fill={armorStyle.fill} stroke={armorStyle.stroke} strokeWidth="3" />
            </g>

            {/* WEAPON (Right Hand) */}
            <g id="weapon" className={energy < 40 ? 'rotate-12 origin-bottom-left transition-transform' : ''}>
              {currentWeapon ? (
                <g transform="translate(285, 140)">
                  {/* Blade */}
                  <path d="M0 -80 L14 -60 V160 H-14 V-60 Z" fill={weaponStyle.fill} stroke={weaponStyle.stroke} strokeWidth="3" className={weaponStyle.glow} />
                  {/* Guard */}
                  <rect x="-30" y="160" width="60" height="14" rx="4" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
                  {/* Hilt */}
                  <rect x="-8" y="174" width="16" height="35" rx="4" fill="#78350F" />
                  {/* Pommel */}
                  <circle cx="0" cy="215" r="10" fill="#F59E0B" />
                </g>
              ) : (
                /* Default Starter Sword */
                <g transform="translate(285, 160)">
                  <path d="M0 -60 L10 -40 V140 H-10 V-40 Z" fill="#94A3B8" stroke="#475569" strokeWidth="3" />
                  <rect x="-24" y="140" width="48" height="12" rx="3" fill="#B45309" />
                  <rect x="-6" y="152" width="12" height="30" rx="3" fill="#451A03" />
                  <circle cx="0" cy="187" r="8" fill="#B45309" />
                </g>
              )}
            </g>

            {/* SHIELD (Left Hand) */}
            {currentShield && (
              <g id="shield" transform="translate(90, 240)">
                <path d="M0 0 L40 -20 L80 0 V60 C80 110 40 140 40 140 C40 140 0 110 0 60 Z" fill={shieldStyle.fill} stroke={shieldStyle.stroke} strokeWidth="4" className={shieldStyle.glow} />
                <circle cx="40" cy="50" r="16" fill={shieldStyle.stroke} opacity="0.8" />
              </g>
            )}

            {/* HEAD & FACE */}
            <g id="head" className={`transition-transform duration-300 ${headTilt}`}>
              {/* Neck */}
              <rect x="182" y="165" width="36" height="30" fill="#D97706" />

              {/* Head Base (Skin Tone) */}
              <ellipse cx="200" cy="140" rx="42" ry="48" fill="#F59E0B" stroke="#D97706" strokeWidth="3" />

              {/* Eyes */}
              <ellipse cx="184" cy="140" rx="7" ry="5" fill="#090B14" />
              <ellipse cx="216" cy="140" rx="7" ry="5" fill="#090B14" />
              {/* Glowing Iris */}
              <circle cx="184" cy="140" r="3" fill={eyeColorStyle} />
              <circle cx="216" cy="140" r="3" fill={eyeColorStyle} />

              {/* Eyebrows */}
              <path d="M174 130 Q184 125 192 132" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
              <path d="M226 130 Q216 125 208 132" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />

              {/* Mouth Expression */}
              {energy >= 60 ? (
                <path d="M190 162 Q200 168 210 162" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
              ) : (
                <path d="M190 165 Q200 160 210 165" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
              )}

              {/* Hair Style */}
              <path d="M158 135 C155 90 245 90 242 135 C230 100 170 100 158 135 Z" fill="#3B2512" stroke="#1C1007" strokeWidth="2" />

              {/* Helmet (If Equipped) */}
              {currentHelmet && (
                <g id="helmet">
                  <path d="M152 135 C150 75 250 75 248 135 L255 125 L200 65 L145 125 Z" fill={helmetStyle.fill} stroke={helmetStyle.stroke} strokeWidth="4" className={helmetStyle.glow} />
                  <rect x="155" y="115" width="90" height="15" rx="4" fill={helmetStyle.stroke} />
                  {/* Visor Slit */}
                  <rect x="175" y="120" width="50" height="5" fill="#000000" />
                </g>
              )}
            </g>
          </svg>
        </div>

        {/* Level Tag Overlay */}
        <div className="absolute top-4 left-4 bg-[#090B14]/80 backdrop-blur-md border border-emerald-500/50 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <Shield className="w-4 h-4 text-rpg-gold" />
          <span className="font-fantasy font-bold text-xs text-white">LEVEL {level} WARRIOR</span>
        </div>

        {/* Try-on Watermark Badge (In Shop Preview) */}
        {tryOnItem && (
          <div className="absolute top-4 right-4 bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10px] font-fantasy font-bold px-2.5 py-1 rounded-lg animate-pulse flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> PREVIEWING: {tryOnItem.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default FullBodyWarrior;
