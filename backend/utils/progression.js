/**
 * Calculates the total XP required to reach the NEXT level from current level.
 * Formula: Math.floor(100 * Math.pow(level, 1.5))
 * Level 1: 100 XP
 * Level 2: 282 XP
 * Level 3: 519 XP
 * Level 4: 800 XP
 * Level 5: 1118 XP
 * Level 10: 3162 XP
 */
function getRequiredXP(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculates progress and levels up user if XP exceeds threshold.
 * Supports multiple level ups if gained XP is large.
 * Returns { newLevel, newXP, requiredXP, leveledUp, levelsGained }
 */
function calculateProgression(currentLevel, currentXP, xpGained) {
  let level = currentLevel;
  let totalXP = currentXP + xpGained;
  let leveledUp = false;
  let levelsGained = 0;

  while (totalXP >= getRequiredXP(level)) {
    totalXP -= getRequiredXP(level);
    level += 1;
    leveledUp = true;
    levelsGained += 1;
  }

  return {
    newLevel: level,
    newXP: totalXP,
    requiredXP: getRequiredXP(level),
    leveledUp,
    levelsGained
  };
}

/**
 * Returns player title based on level
 */
function getPlayerTitle(level) {
  if (level >= 50) return 'Grandmaster Mythic';
  if (level >= 40) return 'Apex Warlord';
  if (level >= 30) return 'High Champion';
  if (level >= 20) return 'Master Adventurer';
  if (level >= 15) return 'Dungeon Vanguard';
  if (level >= 10) return 'Shadow Explorer';
  if (level >= 5) return 'Novice Traveler';
  return 'Apprentice Wanderer';
}

module.exports = {
  getRequiredXP,
  calculateProgression,
  getPlayerTitle
};
