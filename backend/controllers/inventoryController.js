const Inventory = require('../models/Inventory');

// @desc    Get user inventory items
// @route   GET /api/inventory
// @access  Private
const getInventory = async (req, res, next) => {
  try {
    const items = await Inventory.find({ userId: req.user._id }).sort({ purchasedAt: -1 });
    return res.json({
      success: true,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Equip/Unequip inventory item
// @route   PUT /api/inventory/:id/equip
// @access  Private
const toggleEquipItem = async (req, res, next) => {
  try {
    const item = await Inventory.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }

    // If equipping, un-equip other items of the same type if applicable
    if (!item.equipped) {
      await Inventory.updateMany(
        { userId: req.user._id, itemType: item.itemType, _id: { $ne: item._id } },
        { equipped: false }
      );
      item.equipped = true;
    } else {
      item.equipped = false;
    }

    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    const cat = item.itemType || 'armor';

    if (item.equipped) {
      if (!user.equippedItems) user.equippedItems = {};
      user.equippedItems[cat] = {
        id: item.itemId,
        name: item.itemName,
        category: cat,
        material: item.itemMaterial || 'iron',
        rarity: item.itemRarity
      };
    } else {
      if (user.equippedItems && user.equippedItems[cat]) {
        user.equippedItems[cat] = null;
      }
    }

    user.markModified('equippedItems');
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({
      success: true,
      data: {
        item,
        user: userObj
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  toggleEquipItem
};
