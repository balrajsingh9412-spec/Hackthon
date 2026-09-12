const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Transaction = require('../models/Transaction');

const SHOP_CATALOG = [
  // NATURE TOOLS & ESSENCES (NURTURING)
  {
    id: 'wooden_sword',
    name: 'Wooden Watering Can',
    description: 'A light wooden watering vessel for apprentice guardians nourishing young sprouts.',
    price: 100,
    category: 'tool',
    material: 'wood',
    rarity: 'Common',
    icon: '🪴',
    attack: 5,
    effect: '+5 Nurture Power',
    requiredLevel: 1
  },
  {
    id: 'iron_sword',
    name: 'Silver Pruning Shears',
    description: 'Forged for careful garden tending. Keeps your Life Tree healthy and vibrant.',
    price: 300,
    category: 'tool',
    material: 'silver',
    rarity: 'Common',
    icon: '✂️',
    attack: 10,
    effect: '+10 Growth Energy',
    requiredLevel: 3
  },
  {
    id: 'steel_sword',
    name: 'Sun Crystal Essence Rod',
    description: 'Channels warm sunlight to accelerate foliage growth and leaf blooming.',
    price: 750,
    category: 'tool',
    material: 'crystal',
    rarity: 'Rare',
    icon: '🪄',
    attack: 22,
    effect: '+22 Solar Vitality',
    requiredLevel: 5
  },
  {
    id: 'silver_sword',
    name: 'Celestial Water Wand',
    description: 'Gleaming crystal wand blessed with pure rain essence.',
    price: 1500,
    category: 'tool',
    material: 'silver',
    rarity: 'Rare',
    icon: '💧',
    attack: 40,
    effect: '+40 Aqua Growth',
    requiredLevel: 10
  },
  {
    id: 'golden_sword',
    name: 'Golden Solar Staff',
    description: 'Radiant golden staff emitting a warm glow of environmental triumph.',
    price: 3000,
    category: 'tool',
    material: 'gold',
    rarity: 'Epic',
    icon: '☀️',
    attack: 75,
    effect: '+75 Sun Harmony',
    requiredLevel: 15
  },
  {
    id: 'mythic_sword',
    name: 'Mythic Astral Life Wand',
    description: 'Cosmic mythic wand forged from star embers. Unlocks ultimate Life Tree power.',
    price: 10000,
    category: 'tool',
    material: 'mythic',
    rarity: 'Mythic',
    icon: '✨',
    attack: 200,
    effect: '+200 Life Essence',
    requiredLevel: 25
  },

  // FLORA ROBES & NATURE TUNICS
  {
    id: 'cloth_suit',
    name: 'Linen Nature Tunic',
    description: 'Simple breathable linen tunic for peaceful garden wanderers.',
    price: 100,
    category: 'robe',
    material: 'linen',
    rarity: 'Common',
    icon: '👕',
    defense: 3,
    effect: '+3 Harmony',
    requiredLevel: 1
  },
  {
    id: 'leather_armor',
    name: 'Woven Bark Vestment',
    description: 'Toughened tree bark vestment for active nature exploring.',
    price: 300,
    category: 'robe',
    material: 'bark',
    rarity: 'Common',
    icon: '🪵',
    defense: 8,
    effect: '+8 Earth Resilience',
    requiredLevel: 2
  },
  {
    id: 'iron_armor',
    name: 'Emerald Leaf Cloak',
    description: 'Lush green leaf cloak providing natural shade and comfort.',
    price: 700,
    category: 'robe',
    material: 'leaf',
    rarity: 'Rare',
    icon: '🌿',
    defense: 18,
    effect: '+18 Nature Shield',
    requiredLevel: 5
  },
  {
    id: 'steel_armor',
    name: 'Silver Birch Vestment',
    description: 'Polished silver birch robes with elegant leaves.',
    price: 1200,
    category: 'robe',
    material: 'birch',
    rarity: 'Rare',
    icon: '🍃',
    defense: 30,
    effect: '+30 Bloom Defense',
    requiredLevel: 8
  },
  {
    id: 'silver_armor',
    name: 'Sun-Dappled Silk Robe',
    description: 'Bright silk robes with elegant radiant reflections.',
    price: 2500,
    category: 'robe',
    material: 'silk',
    rarity: 'Epic',
    icon: '✨',
    defense: 55,
    effect: '+55 Solar Resilience',
    requiredLevel: 12
  },
  {
    id: 'golden_armor',
    name: 'Golden Lotus Garment',
    description: 'Luxury golden robes gleaming with pure peaceful energy.',
    price: 5000,
    category: 'robe',
    material: 'gold',
    rarity: 'Epic',
    icon: '🪷',
    defense: 90,
    effect: '+90 Sanctuary Harmony',
    requiredLevel: 15
  },
  {
    id: 'diamond_armor',
    name: 'Diamond Prism Robe',
    description: 'Crystalline diamond vestment with prismatic light shine.',
    price: 15000,
    category: 'robe',
    material: 'diamond',
    rarity: 'Legendary',
    icon: '💎',
    defense: 180,
    effect: '+180 Prism Defense',
    requiredLevel: 20
  },
  {
    id: 'mythic_armor',
    name: 'Mythic Tree Spirit Vestment',
    description: 'Magical celestial robes emitting cosmic leaf particles.',
    price: 50000,
    category: 'robe',
    material: 'mythic',
    rarity: 'Mythic',
    icon: '🌌',
    defense: 400,
    effect: '+400 Cosmic Harmony',
    requiredLevel: 30
  },

  // ANIMAL COMPANIONS (LIFE TREE WORLD)
  {
    id: 'sparrow',
    name: 'Song Sparrow',
    description: 'Chirps happily in the Life Tree canopy and brings morning joy.',
    price: 100,
    category: 'companion',
    species: 'bird',
    rarity: 'Common',
    icon: '🐦',
    effect: '+5 Canopy Harmony',
    requiredLevel: 1
  },
  {
    id: 'rabbit',
    name: 'Meadow Rabbit',
    description: 'Hops playfully through the lush grass beneath the Life Tree.',
    price: 150,
    category: 'companion',
    species: 'rabbit',
    rarity: 'Common',
    icon: '🐇',
    effect: '+5 Meadow Agility',
    requiredLevel: 1
  },
  {
    id: 'cat',
    name: 'Cozy Calico Cat',
    description: 'Purrs peacefully while resting under the warm shade of your Life Tree.',
    price: 200,
    category: 'companion',
    species: 'cat',
    rarity: 'Common',
    icon: '🐱',
    effect: '+8 Serenity',
    requiredLevel: 2
  },
  {
    id: 'dog',
    name: 'Loyal Golden Pup',
    description: 'Wags its tail enthusiastically whenever you complete your quests.',
    price: 250,
    category: 'companion',
    species: 'dog',
    rarity: 'Common',
    icon: '🐕',
    effect: '+10 Loyalty',
    requiredLevel: 3
  },
  {
    id: 'golden_bird',
    name: 'Golden Sun Sparrow',
    description: 'Brings brilliant golden rays of sunlight to your Life Tree foliage.',
    price: 350,
    category: 'companion',
    species: 'bird',
    rarity: 'Rare',
    icon: '🐤',
    effect: '+15 Golden Aura',
    requiredLevel: 5
  },
  {
    id: 'red_fox',
    name: 'Forest Red Fox',
    description: 'A clever guardian fox resting near the roots of your Life Tree.',
    price: 500,
    category: 'companion',
    species: 'fox',
    rarity: 'Rare',
    icon: '🦊',
    effect: '+20 Focus Wisdom',
    requiredLevel: 7
  },
  {
    id: 'phoenix',
    name: 'Radiant Phoenix Bird',
    description: 'A mythical flame-winged phoenix soaring above your Life Tree canopy.',
    price: 1200,
    category: 'companion',
    species: 'phoenix',
    rarity: 'Epic',
    icon: '🔥',
    effect: '+40 Flame Vitality',
    requiredLevel: 12
  },
  {
    id: 'dragon_spirit',
    name: 'Celestial Dragon Spirit',
    description: 'A legendary magical dragon spirit hovering gracefully around the ancient branches.',
    price: 3000,
    category: 'companion',
    species: 'dragon',
    rarity: 'Legendary',
    icon: '🐉',
    effect: '+100 Sovereign Blessing',
    requiredLevel: 20
  },
  {
    id: 'iron_helm',
    name: 'Iron Guard Helmet',
    description: 'Tempered iron helmet with dark visor slit.',
    price: 200,
    category: 'helmet',
    material: 'iron',
    rarity: 'Common',
    icon: '🪖',
    defense: 6,
    effect: '+6 Defense',
    requiredLevel: 2
  },
  {
    id: 'golden_crown',
    name: 'Crown of Sovereign Monarchs',
    description: 'A regal artifact gleaming with pure gold and gems.',
    price: 1000,
    category: 'helmet',
    material: 'gold',
    rarity: 'Legendary',
    icon: '👑',
    defense: 25,
    effect: '+25 Defense',
    requiredLevel: 10
  },
  {
    id: 'elixir_wisdom',
    name: 'Elixir of Greater Focus',
    description: 'Glowing blue potion that sharpens mental focus and energy.',
    price: 150,
    category: 'material',
    material: 'potion',
    rarity: 'Common',
    icon: '🧪',
    effect: '+10 Energy Restore',
    requiredLevel: 1
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

    const currentUserForCheck = await User.findById(req.user._id);
    if (!currentUserForCheck) {
      res.status(404);
      throw new Error('User not found');
    }

    if (currentUserForCheck.level < (item.requiredLevel || 1)) {
      res.status(400);
      throw new Error(`Your level is too low to purchase "${item.name}"! Requires Level ${item.requiredLevel || 1}.`);
    }

    if (item.category === 'companion') {
      const alreadyHave = currentUserForCheck.purchasedCompanions?.some(c => c.id === item.id);
      if (alreadyHave) {
        res.status(400);
        throw new Error(`You already own the companion "${item.name}"!`);
      }
    }

    // Atomically check Gold sufficiency and deduct Gold to eliminate purchase race conditions!
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, gold: { $gte: item.price } },
      { $inc: { gold: -item.price } },
      { new: true }
    );

    if (!user) {
      const currentUser = await User.findById(req.user._id);
      res.status(400);
      throw new Error(`Insufficient Gold! You have ${currentUser ? currentUser.gold : 0} Gold, but "${item.name}" costs ${item.price} Gold.`);
    }

    // Create Inventory record
    const inventoryItem = await Inventory.create({
      userId: user._id,
      itemId: item.id,
      itemName: item.name,
      itemDescription: item.description,
      itemType: item.category || item.type,
      itemRarity: item.rarity,
      itemIcon: item.icon,
      itemEffect: item.effect,
      pricePaid: item.price,
      equipped: false
    });

    // If item is a companion, add to user.purchasedCompanions array
    if (item.category === 'companion') {
      if (!user.purchasedCompanions) user.purchasedCompanions = [];
      const alreadyHave = user.purchasedCompanions.some(c => c.id === item.id);
      if (!alreadyHave) {
        user.purchasedCompanions.push({
          id: item.id,
          name: item.name,
          species: item.species || 'companion',
          rarity: item.rarity,
          icon: item.icon,
          quote: item.description
        });
        user.markModified('purchasedCompanions');
        await user.save();
      }
    }

    // Create Transaction record
    await Transaction.create({
      userId: user._id,
      type: 'SHOP_PURCHASE',
      xpAmount: 0,
      goldAmount: -item.price,
      itemId: item.id,
      description: `Purchased "${item.name}" from Adventure Shop (-${item.price} Gold)`
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      data: {
        item: inventoryItem,
        remainingGold: user.gold,
        user: userObj,
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
