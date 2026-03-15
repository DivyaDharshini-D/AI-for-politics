const express = require('express');
const router  = express.Router();
const cache   = require('../middleware/cacheMiddleware');
const { getPostsByTag, getTrendingTags } = require('../controllers/mastodonController');

router.get('/trending', cache(120), getTrendingTags);
router.get('/',         cache(60),  getPostsByTag);

module.exports = router;
