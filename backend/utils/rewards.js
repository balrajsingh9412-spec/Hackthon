const DIFFICULTY_REWARDS = {
  easy: { xp: 50, gold: 10, statPoints: 2 },
  medium: { xp: 100, gold: 20, statPoints: 4 },
  hard: { xp: 175, gold: 35, statPoints: 7 },
  epic: { xp: 300, gold: 60, statPoints: 12 }
};

const VALID_CATEGORIES = ['strength', 'intellect', 'vitality', 'discipline', 'wisdom'];

function getQuestRewards(difficulty, category) {
  const normDiff = (difficulty || 'medium').toLowerCase();
  const normCat = (category || 'intellect').toLowerCase();

  const reward = DIFFICULTY_REWARDS[normDiff] || DIFFICULTY_REWARDS.medium;
  const categoryStat = VALID_CATEGORIES.includes(normCat) ? normCat : 'intellect';

  return {
    xp: reward.xp,
    gold: reward.gold,
    statPoints: reward.statPoints,
    attribute: categoryStat
  };
}

module.exports = {
  DIFFICULTY_REWARDS,
  VALID_CATEGORIES,
  getQuestRewards
};
