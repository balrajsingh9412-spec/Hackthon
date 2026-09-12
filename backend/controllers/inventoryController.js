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

    await item.save();

    return res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  toggleEquipItem
};
