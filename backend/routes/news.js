const express = require('express');
const router = express.Router();
const { searchNews, getTopPoliticsNews } = require('../controllers/newsController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/search', searchNews);
router.get('/top', getTopPoliticsNews);

module.exports = router;
