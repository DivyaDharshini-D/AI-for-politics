const express = require('express');
const router  = express.Router();
const cache   = require('../middleware/cacheMiddleware');
const { searchGNews, getTopHeadlines } = require('../controllers/gnewsController');

router.get('/top', cache(180), getTopHeadlines);
router.get('/',    cache(180), searchGNews);

module.exports = router;
