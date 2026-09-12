/**
 * Calculates updated streak state based on user's streak object and completion date.
 * userStreak: { current: number, longest: number, lastCompletedDate: Date | string | null }
 */
function updateStreak(userStreak = { current: 0, longest: 0, lastCompletedDate: null }) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  if (!userStreak.lastCompletedDate) {
    const current = 1;
    const longest = Math.max(1, userStreak.longest || 0);
    return {
      current,
      longest,
      lastCompletedDate: now,
      incrementedToday: true
    };
  }

  const lastDate = new Date(userStreak.lastCompletedDate);
  const lastDateStr = lastDate.toISOString().split('T')[0];

  if (lastDateStr === todayStr) {
    // Already completed a quest today; maintain streak
    return {
      current: userStreak.current || 1,
      longest: Math.max(userStreak.current || 1, userStreak.longest || 0),
      lastCompletedDate: userStreak.lastCompletedDate,
      incrementedToday: false
    };
  }

  // Calculate difference in calendar days
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastMidnight = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
  const diffTime = Math.abs(todayMidnight - lastMidnight);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let current = userStreak.current || 0;
  if (diffDays === 1) {
    // Consecutive day completion
    current += 1;
  } else {
    // Streak broken; reset to 1
    current = 1;
  }

  const longest = Math.max(current, userStreak.longest || 0);

  return {
    current,
    longest,
    lastCompletedDate: now,
    incrementedToday: true
  };
}

module.exports = {
  updateStreak
};
