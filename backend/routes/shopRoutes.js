const express = require('express');
const router = express.Router();
const { getShopItems, buyItem } = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getShopItems);
router.post('/:itemId/buy', buyItem);

module.exports = router;
