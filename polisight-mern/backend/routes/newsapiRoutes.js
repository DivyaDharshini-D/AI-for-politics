const express = require('express');
const router  = express.Router();
const cache   = require('../middleware/cacheMiddleware');
const { getTopHeadlines, getEverything, getSources } = require('../controllers/newsapiController');

// GET /api/newsapi/top-headlines
router.get('/top-headlines', cache(120), getTopHeadlines);

// GET /api/newsapi/everything
router.get('/everything',    cache(180), getEverything);

// GET /api/newsapi/sources
router.get('/sources',       cache(600), getSources);

module.exports = router;
