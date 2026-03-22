const express = require('express');
const router = express.Router();
const { getDashboardStats, getRegionalSentiment } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/dashboard', getDashboardStats);
router.get('/regional', getRegionalSentiment);

module.exports = router;
