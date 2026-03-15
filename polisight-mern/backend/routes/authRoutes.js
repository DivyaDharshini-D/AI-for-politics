const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  register, login, getMe,
  updatePreferences, updateProfile,
  saveArticle, unsaveArticle, getSavedArticles,
} = require('../controllers/authController');

router.post('/register',                  register);
router.post('/login',                     login);
router.get('/me',                         protect, getMe);
router.put('/preferences',                protect, updatePreferences);
router.put('/profile',                    protect, updateProfile);
router.get('/saved-articles',             protect, getSavedArticles);
router.post('/save-article',              protect, saveArticle);
router.delete('/save-article/:articleId', protect, unsaveArticle);

module.exports = router;
