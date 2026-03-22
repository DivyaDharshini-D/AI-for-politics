const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const intelligenceRoutes = require('./routes/intelligence');
const newsRoutes = require('./routes/news');
const socialRoutes = require('./routes/social');
const analyticsRoutes = require('./routes/analytics');
const simulationRoutes = require('./routes/simulation');

const app = express();

// ─── SECURITY ───
app.use(helmet());

// ─── CORS FIX (VERY IMPORTANT) ───
const allowedOrigins = [
  'http://localhost:5173',
  'https://politicview.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / mobile apps
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed'), false);
    }
  },
  credentials: true
}));

// ─── BODY PARSER ───
app.use(express.json({ limit: '10mb' }));

// ─── LOGGER ───
app.use(morgan('dev'));

// ─── RATE LIMIT ───
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});
app.use('/api/', limiter);

// ─── ROUTES ───
app.use('/api/auth', authRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/simulation', simulationRoutes);

// ─── HEALTH CHECK ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── ERROR HANDLER ───
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// ─── DB + SERVER START ───
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    const PORT = process.env.PORT || 10000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });

module.exports = app;
