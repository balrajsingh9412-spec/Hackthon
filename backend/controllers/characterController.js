const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { getRequiredXP, getPlayerTitle } = require('../utils/progression');

// @desc    Get complete character profile
// @route   GET /api/character/me
// @access  Private
const getCharacterProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('Adventurer profile not found');
    }

    const userObj = user.toObject();
    userObj.requiredXP = getRequiredXP(user.level);
    userObj.title = getPlayerTitle(user.level);

    return res.json({
      success: true,
      data: userObj
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user transactions history
// @route   GET /api/character/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCharacterProfile,
  getTransactions
};
