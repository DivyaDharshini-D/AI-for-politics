const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — requires a valid JWT Bearer token.
 * Attaches req.user (full Mongoose doc) on success.
 */
const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorised — no token' });
  }

  try {
    const token   = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user      = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

/**
 * optionalAuth — attaches req.user if token present, but never blocks.
 * Useful for routes that work for both guests and logged-in users.
 */
const optionalAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token   = auth.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user      = await User.findById(decoded.id).select('-password');
    } catch (_) { /* ignore */ }
  }
  next();
};

module.exports = { protect, optionalAuth };
