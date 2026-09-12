const express = require('express');
const router = express.Router();
const { getCharacterProfile, getTransactions } = require('../controllers/characterController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/me', getCharacterProfile);
router.get('/transactions', getTransactions);

module.exports = router;
