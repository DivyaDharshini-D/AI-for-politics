require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const morgan    = require('morgan');
const connectDB = require('./config/db');
const cache     = require('./config/cache');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes      = require('./routes/authRoutes');
const newsRoutes      = require('./routes/newsRoutes');
const gnewsRoutes     = require('./routes/gnewsRoutes');
const newsapiRoutes   = require('./routes/newsapiRoutes');
const mastodonRoutes  = require('./routes/mastodonRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

connectDB();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true, methods: ['GET','POST','PUT','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use((req, res, next) => {
  const t = Date.now();
  res.on('finish', () => { const ms = Date.now()-t; if (ms > 2000) console.warn(`⚠ Slow ${req.method} ${req.originalUrl} — ${ms}ms`); });
  next();
});

app.use('/api/auth',     authRoutes);
app.use('/api/news',     newsRoutes);
app.use('/api/gnews',    gnewsRoutes);
app.use('/api/newsapi',  newsapiRoutes);
app.use('/api/mastodon', mastodonRoutes);
app.use('/api',          dashboardRoutes);

app.get('/api/health', (req, res) => res.json({
  status: 'ok', message: '🚀 PoliSight MERN API — 4 Sources',
  env: process.env.NODE_ENV, uptime: `${Math.round(process.uptime())}s`,
  cache: cache.getStats(),
  mongo: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected',
  apis: {
    newsdata: !!process.env.NEWSDATA_API_KEY,
    gnews:    !!process.env.GNEWS_API_KEY,
    newsapi:  !!process.env.NEWSAPI_KEY,
    mastodon: !!process.env.MASTODON_ACCESS_TOKEN,
  },
}));

app.get('/api/cache/stats', (req, res) => res.json({ success:true, stats:cache.getStats(), keys:cache.keys() }));
app.delete('/api/cache', (req, res) => {
  if (process.env.NODE_ENV !== 'development') return res.status(403).json({ success:false });
  cache.flushAll(); res.json({ success:true, message:'Cache flushed' });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`
╔═══════════════════════════════════════════════╗
║        🚀 PoliSight MERN API — 4 Sources      ║
╠═══════════════════════════════════════════════╣
║  http://localhost:${PORT}/api/health              ║
║  Sources: NewsData · GNews · NewsAPI · Mastodon║
╚═══════════════════════════════════════════════╝
`));
