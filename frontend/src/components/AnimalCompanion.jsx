import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';

const ANIMAL_SPEECH = {
  bird: ['Chirp chirp! The Life Tree canopy is thriving today! 🎵', 'Sunwing chirps a cheerful melody for your quest goal! 🎶'],
  cat: ['Purrrr... Whiskers loves resting in the soft green meadow grass! 🐾', 'Meow! Keep completing quests to make the flowers bloom brighter! 🐱', 'Purr... The warm sunlight feels amazing under your Life Tree! ☀️'],
  dog: ['Woof woof! Barnaby wags his tail at your high streak! 🐶', 'Bark! Ready to explore the sanctuary garden with you! 🐾'],
  rabbit: ['Hop hop! Nibbles loves munching the fresh clover tufts! 🐇', 'Wiggle wiggle! The garden flowers smell so sweet today! 🌸', 'Boing! High jump celebration for your tree level progress! 🌿'],
  fox: ['Rustle! The Red Fox guards your ancient roots with ancient wisdom. 🦊'],
  phoenix: ['Flashes of flame! The Phoenix blesses your heroic perseverance! 🦅'],
  dragon: ['Roar! Celestial Dragon Spirit hovers gracefully around your legendary canopy! 🐉']
};

const AnimalCompanion = ({ companion, position = { top: '70%', left: '25%' } }) => {
  const [clicked, setClicked] = useState(false);
  const [speech, setSpeech] = useState(null);
  const [showHeart, setShowHeart] = useState(false);

  const species = companion.species || 'bird';

  const handleClick = (e) => {
    e.stopPropagation();
    setClicked(true);
    setShowHeart(true);

    const quotes = ANIMAL_SPEECH[species] || ANIMAL_SPEECH.cat;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setSpeech(randomQuote);

    setTimeout(() => setClicked(false), 900);
    setTimeout(() => setShowHeart(false), 2200);
    setTimeout(() => setSpeech(null), 4500);
  };

  // Determine roaming animation class based on animal species
  let roamClass = '';
  if (species === 'cat') {
    roamClass = 'anim-cat-roam';
  } else if (species === 'rabbit') {
    roamClass = 'anim-rabbit-hop';
  } else if (species === 'bird' || species === 'phoenix' || species === 'dragon') {
    roamClass = 'animate-bounce';
  }

  return (
    <div
      onClick={handleClick}
      className={`absolute cursor-pointer z-20 group transition-transform duration-300 ${roamClass}`}
      style={{ top: position.top, left: position.left }}
      title={`${companion.name} (${companion.rarity || 'Common'}) — Click to pet & interact!`}
    >
      {/* Interactive Heart Burst Popup */}
      {showHeart && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none z-30 animate-bounce">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 drop-shadow-md animate-ping" />
        </div>
      )}

      {/* Speech Bubble Popup */}
      {speech && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#090B14]/95 border border-rpg-gold text-amber-300 text-[10px] font-fantasy font-bold px-3 py-1.5 rounded-xl shadow-glow-gold whitespace-nowrap z-30 animate-in fade-in zoom-in duration-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rpg-gold" />
          <span>{speech}</span>
        </div>
      )}

      {/* ANIMAL GRAPHIC / AVATAR CARD */}
      <div className={`relative px-2 py-1.5 rounded-2xl bg-[#090B14]/80 backdrop-blur-md border border-emerald-500/40 flex items-center gap-1.5 shadow-lg group-hover:border-rpg-gold group-hover:scale-115 transition ${
        clicked ? 'scale-125 rotate-6 border-rpg-gold' : ''
      } ${companion.rarity === 'Legendary' ? 'border-amber-400 shadow-glow-gold' : ''}`}>
        
        {/* Render Emoji Icon with Tail / Ear Animations */}
        <div className="relative text-2xl flex items-center justify-center">
          <span>{companion.icon || '🐱'}</span>

          {/* Animated Cat Tail Detail Overlay */}
          {species === 'cat' && (
            <span className="absolute -bottom-1 -right-1 text-xs anim-cat-tail">〰️</span>
          )}

          {/* Animated Rabbit Ear Twitch Detail Overlay */}
          {species === 'rabbit' && (
            <span className="absolute -top-1 right-0 text-[10px] anim-ear-twitch">✨</span>
          )}
        </div>

        {/* Name Tag Label on Hover */}
        <div className="hidden group-hover:flex flex-col text-[9px] font-fantasy font-bold leading-none pr-1">
          <span className="text-white">{companion.name}</span>
          <span className="text-emerald-400 text-[8px]">{companion.rarity || 'Common'}</span>
        </div>

        {/* Companion Rarity Indicator Dot */}
        <div className={`w-2 h-2 rounded-full border border-black ${
          companion.rarity === 'Legendary' ? 'bg-amber-400 animate-pulse' :
          companion.rarity === 'Epic' ? 'bg-purple-500' :
          companion.rarity === 'Rare' ? 'bg-blue-400' : 'bg-emerald-400'
        }`} />
      </div>
    </div>
  );
};

export default AnimalCompanion;
