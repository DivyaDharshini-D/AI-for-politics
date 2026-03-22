const axios = require('axios');
const NewsCache = require('../models/NewsCache');

// ─── Safe upsert helper (avoids unique index race conditions) ───
async function saveCache(query, source, articles) {
  try {
    await NewsCache.findOneAndUpdate(
      { query, source },
      { $set: { articles, fetchedAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (e) {
    // Ignore duplicate key errors on race conditions
    if (e.code !== 11000) console.error('Cache save error:', e.message);
  }
}

// ─── NEWSDATA.IO ───
async function fetchNewsData(query, language = 'en') {
  try {
    const cached = await NewsCache.findOne({ query, source: 'newsdata' });
    if (cached?.articles?.length) return cached.articles;

    const res = await axios.get('https://newsdata.io/api/1/news', {
      params: { apikey: process.env.NEWSDATA_API_KEY, q: query, language, category: 'politics' },
      timeout: 12000,
    });

    const articles = (res.data.results || []).slice(0, 10).map(a => ({
      title: a.title || '',
      description: a.description || '',
      url: a.link || '',
      publishedAt: a.pubDate ? new Date(a.pubDate) : new Date(),
      source: a.source_id || 'NewsData',
    })).filter(a => a.title);

    await saveCache(query, 'newsdata', articles);
    return articles;
  } catch (err) {
    console.error('NewsData error:', err.message);
    return [];
  }
}

// ─── GNEWS ───
async function fetchGNews(query, language = 'en') {
  try {
    const cached = await NewsCache.findOne({ query, source: 'gnews' });
    if (cached?.articles?.length) return cached.articles;

    const res = await axios.get('https://gnews.io/api/v4/search', {
      params: { q: query, lang: language, max: 10, token: process.env.GNEWS_API_KEY },
      timeout: 12000,
    });

    const articles = (res.data.articles || []).map(a => ({
      title: a.title || '',
      description: a.description || '',
      url: a.url || '',
      publishedAt: a.publishedAt ? new Date(a.publishedAt) : new Date(),
      source: a.source?.name || 'GNews',
    })).filter(a => a.title);

    await saveCache(query, 'gnews', articles);
    return articles;
  } catch (err) {
    console.error('GNews error:', err.message);
    return [];
  }
}

// ─── NEWSAPI.ORG ───
async function fetchNewsAPI(query) {
  try {
    const cached = await NewsCache.findOne({ query, source: 'newsapi' });
    if (cached?.articles?.length) return cached.articles;

    const res = await axios.get('https://newsapi.org/v2/everything', {
      params: { q: query, sortBy: 'publishedAt', pageSize: 10, apiKey: process.env.NEWSAPI_KEY },
      timeout: 12000,
    });

    const articles = (res.data.articles || [])
      .filter(a => a.title && a.title !== '[Removed]')
      .map(a => ({
        title: a.title || '',
        description: a.description || '',
        url: a.url || '',
        publishedAt: a.publishedAt ? new Date(a.publishedAt) : new Date(),
        source: a.source?.name || 'NewsAPI',
      }));

    await saveCache(query, 'newsapi', articles);
    return articles;
  } catch (err) {
    console.error('NewsAPI error:', err.message);
    return [];
  }
}

// ─── AGGREGATE ALL THREE ───
async function fetchAllNews(query) {
  const results = await Promise.allSettled([
    fetchNewsData(query),
    fetchGNews(query),
    fetchNewsAPI(query),
  ]);

  const allArticles = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value || []);

  // Deduplicate by first 60 chars of title
  const seen = new Set();
  return allArticles.filter(a => {
    if (!a.title) return false;
    const key = a.title.substring(0, 60).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

module.exports = { fetchNewsData, fetchGNews, fetchNewsAPI, fetchAllNews };
