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
    energy: {
      type: Number,
      default: 85 // Starting Energy
    },
    maxEnergy: {
      type: Number,
      default: 100
    },
    character: {
      gender: { type: String, default: 'male' },
      skinTone: { type: String, default: 'warm-sand' },
      hairStyle: { type: String, default: 'short-warrior' },
      hairColor: { type: String, default: '#3b2512' },
      eyeColor: { type: String, default: '#2b5797' },
      bodyType: { type: String, default: 'athletic' },
      height: { type: Number, default: 180 },
      bodySize: { type: String, default: 'medium' }
    },
    equippedItems: {
      weapon: { type: Object, default: null },
      armor: { type: Object, default: null },
      helmet: { type: Object, default: null },
      boots: { type: Object, default: null },
      shield: { type: Object, default: null },
      accessory: { type: Object, default: null }
    },
    purchasedCompanions: {
      type: Array,
      default: [
        { id: 'sparrow', name: 'Song Sparrow', species: 'bird', rarity: 'Common', icon: '🐦', quote: 'Chirps happily in the Life Tree canopy!' }
      ]
    },
    environmentSettings: {
      timeOfDay: { type: String, default: 'auto' },
      weather: { type: String, default: 'sunny' }
    },
    attributes: {
      strength: { type: Number, default: 10 },
      intellect: { type: Number, default: 10 },
      vitality: { type: Number, default: 10 },
      discipline: { type: Number, default: 10 },
      wisdom: { type: Number, default: 10 },
      defense: { type: Number, default: 10 }
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
