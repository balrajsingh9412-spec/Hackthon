const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6
    },
    level: {
      type: Number,
      default: 1
    },
    xp: {
      type: Number,
      default: 0
    },
    gold: {
      type: Number,
      default: 100 // Starting Gold welcome bonus
    },
    attributes: {
      strength: { type: Number, default: 10 },
      intellect: { type: Number, default: 10 },
      vitality: { type: Number, default: 10 },
      discipline: { type: Number, default: 10 },
      wisdom: { type: Number, default: 10 }
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastCompletedDate: { type: Date, default: null }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
