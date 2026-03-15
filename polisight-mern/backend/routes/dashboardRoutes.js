const express = require('express');
const router  = express.Router();
const cache   = require('../middleware/cacheMiddleware');
const { getDashboard, getAnalysis } = require('../controllers/dashboardController');

router.get('/dashboard', cache(120), getDashboard);
router.get('/analyze',   cache(300), getAnalysis);

module.exports = router;
