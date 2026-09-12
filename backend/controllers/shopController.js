const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Transaction = require('../models/Transaction');

const SHOP_CATALOG = [
  {
    id: 'iron_shield',
    name: 'Iron Shield',
    description: 'Forged from tempered iron. Grants sturdy protection to resilient adventurers.',
    price: 250,
    type: 'shield',
    rarity: 'Rare',
    icon: '🛡️',
    effect: '+5 Defense'
  },
  {
    id: 'mystic_avatar',
    name: 'Mystic Archmage Avatar',
    description: 'Enchanted arcane avatar frame glowing with ancient runic energy.',
    price: 400,
    type: 'avatar',
    rarity: 'Rare',
    icon: '🧙',
    effect: '+10 Arcane Aura'
  },
  {
    id: 'dragon_blade',
    name: 'Dragon Slayer Greatsword',
    description: 'Infused with dragon fire. Deals devastating strikes against procrastination.',
    price: 650,
    type: 'weapon',
    rarity: 'Epic',
    icon: '⚔️',
    effect: '+15 Attack Power'
  },
  {
    id: 'golden_crown',
    name: 'Crown of Sovereign Monarchs',
    description: 'A regal artifact gleaming with pure gold and precious gems.',
    price: 1000,
    type: 'crown',
    rarity: 'Legendary',
    icon: '👑',
    effect: '+25 Prestige'
  },
  {
    id: 'elixir_wisdom',
    name: 'Elixir of Greater Wisdom',
    description: 'A glowing blue potion that sharpens focus and enhances mental acuity.',
    price: 150,
    type: 'potion',
    rarity: 'Common',
    icon: '🧪',
    effect: '+10 Wisdom Boost'
  },
  {
    id: 'fire_theme',
    name: 'Aura of Infernal Flame',
    description: 'Envelops your adventurer profile in flickering dragon embers.',
    price: 800,
    type: 'theme',
    rarity: 'Epic',
    icon: '🔥',
    effect: 'Infernal Glow Aura'
  },
  {
    id: 'shadow_cloak',
    name: 'Shadow Wanderer Cloak',
    description: 'Woven from moonlight shadows. Allows swift movement between quests.',
    price: 350,
    type: 'badge',
    rarity: 'Rare',
    icon: '🧥',
    effect: '+8 Agility'
  },
  {
    id: 'pennant_honor',
    name: 'Banner of Eternal Honor',
    description: 'Carried only by true legends who master daily discipline.',
    price: 1200,
    type: 'badge',
    rarity: 'Legendary',
    icon: '🚩',
    effect: '+30 Sovereign Reputation'
  }
];

// @desc    Get Shop items catalog & purchase status
// @route   GET /api/shop
// @access  Private
const getShopItems = async (req, res, next) => {
  try {
    const userInventory = await Inventory.find({ userId: req.user._id });
    const ownedItemIds = userInventory.map(item => item.itemId);

    const catalogWithOwnership = SHOP_CATALOG.map(item => ({
      ...item,
      isOwned: ownedItemIds.includes(item.id)
    }));

    return res.json({
      success: true,
      data: {
        userGold: req.user.gold,
        items: catalogWithOwnership
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Purchase item from Adventurer's Shop
// @route   POST /api/shop/:itemId/buy
// @access  Private
const buyItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = SHOP_CATALOG.find(i => i.id === itemId);

    if (!item) {
      res.status(404);
      throw new Error('Item not found in Adventurer Shop catalog');
    }

    const user = await User.findById(req.user._id);

    if (user.gold < item.price) {
      res.status(400);
      throw new Error(`Insufficient Gold! You have ${user.gold} Gold, but "${item.name}" costs ${item.price} Gold.`);
    }

    // Check if item is already owned (for unique non-potion items)
    if (item.type !== 'potion') {
      const existing = await Inventory.findOne({ userId: user._id, itemId: item.id });
      if (existing) {
        res.status(400);
        throw new Error(`You already possess "${item.name}" in your inventory!`);
      }
    }

    // Deduct Gold
    user.gold -= item.price;
    await user.save();

    // Create Inventory record
    const inventoryItem = await Inventory.create({
      userId: user._id,
      itemId: item.id,
      itemName: item.name,
      itemDescription: item.description,
      itemType: item.type,
      itemRarity: item.rarity,
      itemIcon: item.icon,
      itemEffect: item.effect,
      pricePaid: item.price,
      equipped: false
    });

    // Create Transaction record
    await Transaction.create({
      userId: user._id,
      type: 'SHOP_PURCHASE',
      xpAmount: 0,
      goldAmount: -item.price,
      itemId: item.id,
      description: `Purchased "${item.name}" from Adventurer Shop (-${item.price} Gold)`
    });

    return res.status(201).json({
      success: true,
      data: {
        item: inventoryItem,
        remainingGold: user.gold,
        message: `Successfully purchased "${item.name}"!`
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShopItems,
  buyItem
};
