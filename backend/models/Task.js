const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please add a quest title'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      enum: ['strength', 'intellect', 'vitality', 'discipline', 'wisdom'],
      default: 'intellect'
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'epic'],
      default: 'medium'
    },
    xpReward: {
      type: Number,
      default: 100
    },
    goldReward: {
      type: Number,
      default: 20
    },
    statReward: {
      type: Number,
      default: 4
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);
