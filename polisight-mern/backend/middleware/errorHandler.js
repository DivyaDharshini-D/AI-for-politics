const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  const isDev  = process.env.NODE_ENV === 'development';

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({ success: false, message: `${field} already exists` });
  }
  // Mongoose validation
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message).join(', ');
    return res.status(400).json({ success: false, message });
  }
  // JWT
  if (err.name === 'JsonWebTokenError')  return res.status(401).json({ success: false, message: 'Invalid token' });
  if (err.name === 'TokenExpiredError')  return res.status(401).json({ success: false, message: 'Token expired' });

  console.error(`[${status}] ${req.method} ${req.originalUrl} — ${err.message}`);

  res.status(status).json({
    success: false,
    message: isDev ? err.message : 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
};

const notFound = (req, res) =>
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });

module.exports = { errorHandler, notFound };
