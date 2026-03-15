const User          = require('../models/User');
const generateToken = require('../utils/generateToken');

// ── POST /api/auth/register ───────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user  = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: user.toProfile(),
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Explicitly select password (it's excluded by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: user.toProfile(),
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/me  (protected) ─────────────────────────────────────────────
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user.toProfile() });
};

// ── PUT /api/auth/preferences  (protected) ───────────────────────────────────
const updatePreferences = async (req, res, next) => {
  try {
    const { theme, accent } = req.body;
    const update = {};
    if (theme)  update['preferences.theme']  = theme;
    if (accent) update['preferences.accent'] = accent;

    const user = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true, runValidators: true });
    res.json({ success: true, user: user.toProfile() });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/save-article  (protected) ─────────────────────────────────
const saveArticle = async (req, res, next) => {
  try {
    const { articleId, title, url, source, publishedAt } = req.body;
    if (!articleId || !url) {
      return res.status(400).json({ success: false, message: 'articleId and url are required' });
    }

    // Avoid duplicates
    const already = req.user.savedArticles.some(a => a.articleId === articleId);
    if (already) {
      return res.status(400).json({ success: false, message: 'Article already saved' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { savedArticles: { articleId, title, url, source, publishedAt } } },
      { new: true }
    );
    res.json({ success: true, savedArticles: user.savedArticles });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/auth/save-article/:articleId  (protected) ────────────────────
const unsaveArticle = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { savedArticles: { articleId: req.params.articleId } } },
      { new: true }
    );
    res.json({ success: true, savedArticles: user.savedArticles });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/saved-articles  (protected) ────────────────────────────────
const getSavedArticles = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, savedArticles: user.savedArticles });
};


// ── PUT /api/auth/profile  (protected) ───────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
    }
    const user = await User.findByIdAndUpdate(req.user._id, { name: name.trim() }, { new: true, runValidators: true });
    res.json({ success: true, user: user.toProfile() });
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe, updatePreferences, updateProfile, saveArticle, unsaveArticle, getSavedArticles };
