const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes       = require('./routes/auth');
const intelligenceRoutes = require('./routes/intelligence');
const newsRoutes       = require('./routes/news');
const socialRoutes     = require('./routes/social');
const analyticsRoutes  = require('./routes/analytics');
const simulationRoutes = require('./routes/simulation');

const app = express();

// ─── SECURITY & MIDDLEWARE ───
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// ─── RATE LIMITING ───
const limiter   = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, message: 'Too many requests' });
const aiLimiter = rateLimit({ windowMs: 60 * 1000,      max: 30,  message: 'AI rate limit reached — wait 60s' });
app.use('/api/', limiter);
app.use('/api/intelligence/', aiLimiter);
app.use('/api/simulation/',   aiLimiter);

// ─── ROUTES ───
app.use('/api/auth',         authRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/news',         newsRoutes);
app.use('/api/social',       socialRoutes);
app.use('/api/analytics',    analyticsRoutes);
app.use('/api/simulation',   simulationRoutes);

// Health check
app.get('/api/health', (req, res) =>
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    gemini: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here',
  })
);

// ─── ERROR HANDLER ───
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ─── STARTUP ───
function checkEnv() {
  const required = { MONGO_URI: '✅', JWT_SECRET: '✅', GEMINI_API_KEY: '✅', NEWSDATA_API_KEY: '✅', GNEWS_API_KEY: '✅', NEWSAPI_KEY: '✅', MASTODON_ACCESS_TOKEN: '✅' };
  console.log('\n📋 Environment Check:');
  let allOk = true;
  for (const [key, ok] of Object.entries(required)) {
    const val = process.env[key];
    const configured = val && val !== 'your_gemini_api_key_here' && val !== 'your_anthropic_api_key_here';
    console.log(`  ${configured ? '✅' : '❌'} ${key}: ${configured ? 'configured' : 'MISSING or placeholder'}`);
    if (!configured && key === 'GEMINI_API_KEY') allOk = false;
  }
  if (!allOk) {
    console.log('\n  ⚠️  Add your Gemini API key to backend/.env:');
    console.log('     GEMINI_API_KEY=AIzaSy...');
    console.log('     Get it free at: https://aistudio.google.com/app/apikey\n');
  }
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    checkEnv();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n🚀 PoliticView backend running on http://localhost:${PORT}`);
      console.log(`   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
