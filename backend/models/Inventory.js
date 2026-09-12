const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    itemId: {
      type: String,
      required: true
    },
    itemName: {
      type: String,
      required: true
    },
    itemDescription: {
      type: String,
      default: ''
    },
    itemType: {
      type: String,
      default: 'badge'
    },
    itemRarity: {
      type: String,
      default: 'Common'
    },
    itemIcon: {
      type: String,
      default: '🛡️'
    },
    itemEffect: {
      type: String,
      default: '+5 Honor'
    },
    pricePaid: {
      type: Number,
      required: true
    },
    equipped: {
      type: Boolean,
      default: false
    },
    purchasedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Inventory', inventorySchema);
