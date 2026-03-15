const express = require('express');
const router  = express.Router();
const cache   = require('../middleware/cacheMiddleware');
const { getNews, getHeadlines } = require('../controllers/newsController');

router.get('/headlines', cache(120), getHeadlines);
router.get('/',          cache(180), getNews);

module.exports = router;
