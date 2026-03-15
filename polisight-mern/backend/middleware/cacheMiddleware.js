const cache = require('../config/cache');

/**
 * cacheMiddleware(ttl) — caches GET responses in node-cache.
 * Cache key = full request URL (path + query string).
 */
const cacheMiddleware = (ttl = 300) => (req, res, next) => {
  if (req.method !== 'GET') return next();

  const key = req.originalUrl;
  const hit = cache.get(key);
  if (hit) return res.json({ ...hit, _cache: 'HIT' });

  const originalJson = res.json.bind(res);
  res.json = (data) => {
    if (res.statusCode === 200 && data?.success !== false) {
      cache.set(key, data, ttl);
    }
    return originalJson({ ...data, _cache: res.statusCode === 200 ? 'MISS' : undefined });
  };

  next();
};

module.exports = cacheMiddleware;
