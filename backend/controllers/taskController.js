const Task = require('../models/Task');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { calculateProgression, getRequiredXP, getPlayerTitle } = require('../utils/progression');
const { updateStreak } = require('../utils/streak');
const { getQuestRewards } = require('../utils/rewards');

// @desc    Get user quests
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new quest
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, category, difficulty } = req.body;

    if (!title || title.trim() === '') {
      res.status(400);
      throw new Error('Quest title is required');
    }

    const rewardInfo = getQuestRewards(difficulty, category);

    const task = await Task.create({
      userId: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      category: rewardInfo.attribute,
      difficulty: (difficulty || 'medium').toLowerCase(),
      xpReward: rewardInfo.xp,
      goldReward: rewardInfo.gold,
      statReward: rewardInfo.statPoints,
      completed: false
    });

    return res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quest
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      res.status(404);
      throw new Error('Quest not found or access denied');
    }
    return res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quest
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      res.status(404);
      throw new Error('Quest not found or access denied');
    }

    if (task.completed) {
      res.status(400);
      throw new Error('Completed quests cannot be modified');
    }

    const { title, description, category, difficulty } = req.body;

    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    
    if (difficulty || category) {
      const newDiff = difficulty || task.difficulty;
      const newCat = category || task.category;
      const rewardInfo = getQuestRewards(newDiff, newCat);
      task.category = rewardInfo.attribute;
      task.difficulty = newDiff.toLowerCase();
      task.xpReward = rewardInfo.xp;
      task.goldReward = rewardInfo.gold;
      task.statReward = rewardInfo.statPoints;
    }

    await task.save();

    return res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quest
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      res.status(404);
      throw new Error('Quest not found or access denied');
    }
    return res.json({
      success: true,
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete quest authoritatively
// @route   POST /api/tasks/:id/complete
// @access  Private
const completeTask = async (req, res, next) => {
  try {
    // Atomically find & mark task complete to eliminate duplicate completion race conditions!
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, completed: false },
      { $set: { completed: true, completedAt: new Date() } },
      { new: true }
    );

    if (!task) {
      // Check if task exists to differentiate 404 vs 400
      const existingTask = await Task.findOne({ _id: req.params.id, userId: req.user._id });
      if (!existingTask) {
        res.status(404);
        throw new Error('Quest not found or access denied');
      }
      res.status(400);
      throw new Error('This quest has already been completed!');
    }

    // Fetch user
    const user = await User.findById(req.user._id);

    // Compute server rewards
    const xpReward = task.xpReward || 100;
    const goldReward = task.goldReward || 20;
    const statReward = task.statReward || 4;
    const targetAttribute = task.category || 'intellect';

    // Update level, XP & Energy
    const progResult = calculateProgression(user.level, user.xp, xpReward);
    user.level = progResult.newLevel;
    user.xp = progResult.newXP;
    user.gold += goldReward;
    user.energy = Math.min(100, (user.energy || 85) + 10); // +10 Energy boost on quest complete

    // Update attribute stat
    if (user.attributes[targetAttribute] !== undefined) {
      user.attributes[targetAttribute] += statReward;
    } else {
      user.attributes.intellect += statReward;
    }

    // Update streak
    const streakResult = updateStreak(user.streak);
    user.streak = {
      current: streakResult.current,
      longest: streakResult.longest,
      lastCompletedDate: streakResult.lastCompletedDate
    };

    await user.save();

    // Create Transaction record
    await Transaction.create({
      userId: user._id,
      type: 'QUEST_REWARD',
      xpAmount: xpReward,
      goldAmount: goldReward,
      taskId: task._id,
      description: `Completed Growth Goal: "${task.title}" (+${xpReward} XP, +${goldReward} Gold, +${statReward} ${targetAttribute.toUpperCase()})`
    });

    const userObj = user.toObject();
    delete userObj.password;
    userObj.requiredXP = getRequiredXP(user.level);
    userObj.title = getPlayerTitle(user.level);

    return res.json({
      success: true,
      data: {
        task,
        user: userObj,
        rewards: {
          xp: xpReward,
          gold: goldReward,
          statPoints: statReward,
          attribute: targetAttribute
        },
        progression: {
          leveledUp: progResult.leveledUp,
          levelsGained: progResult.levelsGained,
          newLevel: progResult.newLevel,
          newTitle: userObj.title
        },
        streak: {
          current: streakResult.current,
          longest: streakResult.longest,
          incrementedToday: streakResult.incrementedToday
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask
};
