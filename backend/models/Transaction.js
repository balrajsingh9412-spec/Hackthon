const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['QUEST_REWARD', 'SHOP_PURCHASE', 'BONUS'],
      required: true
    },
    xpAmount: {
      type: Number,
      default: 0
    },
    goldAmount: {
      type: Number,
      default: 0
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null
    },
    itemId: {
      type: String,
      default: null
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
