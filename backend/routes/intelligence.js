const express = require('express');
const router = express.Router();
const { runModule, getHistory, getStats } = require('../controllers/intelligenceController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/run/:module', runModule);
router.get('/history', getHistory);
router.get('/stats', getStats);

module.exports = router;
