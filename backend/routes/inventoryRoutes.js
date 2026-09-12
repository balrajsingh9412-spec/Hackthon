const express = require('express');
const router = express.Router();
const { getInventory, toggleEquipItem } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getInventory);
router.put('/:id/equip', toggleEquipItem);

module.exports = router;
