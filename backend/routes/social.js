const express = require('express');
const router = express.Router();
const { searchSocial, getTrending } = require('../controllers/socialController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/search', searchSocial);
router.get('/trending', getTrending);

module.exports = router;
