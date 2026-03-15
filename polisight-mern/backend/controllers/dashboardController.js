const apiClient = require('../utils/apiClient');
const { formatNewsDataArticle, formatGNewsArticle } = require('../utils/formatters');
const { formatNewsApiArticle } = require('./newsapiController');

const mastoBase    = () => `https://${process.env.MASTODON_INSTANCE || 'mastodon.social'}`;
const mastoHeaders = () => process.env.MASTODON_ACCESS_TOKEN ? { Authorization: `Bearer ${process.env.MASTODON_ACCESS_TOKEN}` } : {};

function interleave(arrays) {
  const result = []; const maxLen = Math.max(...arrays.map(a => a.length));
  for (let i = 0; i < maxLen; i++) arrays.forEach(arr => { if (arr[i]) result.push(arr[i]); });
  return result;
}

const getDashboard = async (req, res, next) => {
  try {
    const country = req.query.country || 'us';
    const q       = req.query.q       || 'politics';

    const [ndRes, gnRes, naRes, mastoRes] = await Promise.allSettled([
      apiClient.get('https://newsdata.io/api/1/news', {
        params: { apikey: process.env.NEWSDATA_API_KEY, country, q, category: 'politics', language: 'en', size: 8 }, timeout: 7000,
      }),
      apiClient.get('https://gnews.io/api/v4/top-headlines', {
        params: { topic: 'nation', lang: 'en', country, max: 8, apikey: process.env.GNEWS_API_KEY }, timeout: 7000,
      }),
      apiClient.get('https://newsapi.org/v2/top-headlines', {
        params: { apiKey: process.env.NEWSAPI_KEY, country, category: 'politics', pageSize: 8 }, timeout: 7000,
      }),
      apiClient.get(`${mastoBase()}/api/v1/trends/tags`, {
        params: { limit: 12 }, headers: mastoHeaders(), timeout: 5000,
      }),
    ]);

    const ndArticles   = ndRes.status    === 'fulfilled' ? ndRes.value.data.results    || [] : [];
    const gnArticles   = gnRes.status    === 'fulfilled' ? gnRes.value.data.articles   || [] : [];
    const naArticles   = naRes.status    === 'fulfilled' ? (naRes.value.data.articles  || []).filter(a => a.title && a.title !== '[Removed]') : [];
    const mastoTags    = mastoRes.status === 'fulfilled' ? mastoRes.value.data          || [] : [];

    const categoryMap = {};
    ndArticles.forEach(a => { (a.category || ['general']).forEach(c => { categoryMap[c] = (categoryMap[c] || 0) + 1; }); });
    gnArticles.forEach(() => { categoryMap['world']    = (categoryMap['world']    || 0) + 1; });
    naArticles.forEach(() => { categoryMap['politics'] = (categoryMap['politics'] || 0) + 1; });

    const sourceMap = {};
    [...ndArticles.map(a => a.source_id), ...gnArticles.map(a => a.source?.name), ...naArticles.map(a => a.source?.name)]
      .filter(Boolean).forEach(s => { sourceMap[s] = (sourceMap[s] || 0) + 1; });

    res.json({
      success: true,
      stats: {
        totalArticles:  ndArticles.length + gnArticles.length + naArticles.length,
        sourcesActive:  [ndRes, gnRes, naRes].filter(r => r.status === 'fulfilled').length,
        trendingTopics: mastoTags.length,
        lastUpdated:    new Date().toISOString(),
        country,
        sourceStatus: {
          newsdata: ndRes.status    === 'fulfilled' ? 'ok' : 'error',
          gnews:    gnRes.status    === 'fulfilled' ? 'ok' : 'error',
          newsapi:  naRes.status    === 'fulfilled' ? 'ok' : 'error',
          mastodon: mastoRes.status === 'fulfilled' ? 'ok' : 'error',
        },
      },
      newsDataArticles: ndArticles.slice(0,6).map(a => ({ ...formatNewsDataArticle(a), _provider:'newsdata' })),
      gnewsArticles:    gnArticles.slice(0,6).map(a => ({ ...formatGNewsArticle(a),    _provider:'gnews'    })),
      newsApiArticles:  naArticles.slice(0,6).map(a => ({ ...formatNewsApiArticle(a),  _provider:'newsapi'  })),
      topHeadlines: interleave([
        ndArticles.slice(0,5).map(a => ({ ...formatNewsDataArticle(a), _provider:'newsdata' })),
        gnArticles.slice(0,5).map(a => ({ ...formatGNewsArticle(a),    _provider:'gnews'    })),
        naArticles.slice(0,5).map(a => ({ ...formatNewsApiArticle(a),  _provider:'newsapi'  })),
      ]).slice(0,15),
      trendingTags: mastoTags.slice(0,10).map(t => ({ name:t.name, uses:t.history?.[0]?.uses||0, accounts:t.history?.[0]?.accounts||0 })),
      categoryBreakdown: Object.entries(categoryMap).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count),
      topSources: Object.entries(sourceMap).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([name,count])=>({name,count})),
    });
  } catch (err) { next(err); }
};

const getAnalysis = async (req, res, next) => {
  try {
    const { q = 'politics', country = 'us' } = req.query;

    const [ndRes, naRes] = await Promise.allSettled([
      apiClient.get('https://newsdata.io/api/1/news', {
        params: { apikey: process.env.NEWSDATA_API_KEY, q, country, language: 'en', size: 10 },
      }),
      apiClient.get('https://newsapi.org/v2/everything', {
        params: { apiKey: process.env.NEWSAPI_KEY, q, language: 'en', sortBy: 'publishedAt', pageSize: 10 },
      }),
    ]);

    const ndArticles = ndRes.status === 'fulfilled' ? ndRes.value.data.results || [] : [];
    const naArticles = naRes.status === 'fulfilled' ? (naRes.value.data.articles || []).filter(a => a.title && a.title !== '[Removed]') : [];
    const all = [...ndArticles, ...naArticles];

    const sentiment = { positive: 0, negative: 0, neutral: 0 };
    ndArticles.forEach(a => { const s = a.sentiment || 'neutral'; if (s in sentiment) sentiment[s]++; else sentiment.neutral++; });
    naArticles.forEach(() => sentiment.neutral++);

    const kwMap = {};
    ndArticles.forEach(a => (a.keywords || []).forEach(k => { const key = k.toLowerCase().trim(); if (key.length > 2) kwMap[key] = (kwMap[key] || 0) + 1; }));
    naArticles.forEach(a => { if (!a.title) return; a.title.toLowerCase().split(/\W+/).filter(w => w.length > 4).forEach(w => { kwMap[w] = (kwMap[w] || 0) + 1; }); });

    res.json({
      success: true, query: q, country, articleCount: all.length,
      breakdown: { newsdata: ndArticles.length, newsapi: naArticles.length },
      sentiment,
      topKeywords: Object.entries(kwMap).sort((a,b)=>b[1]-a[1]).slice(0,15).map(([word,count])=>({word,count})),
      sources: [...new Set([...ndArticles.map(a=>a.source_id), ...naArticles.map(a=>a.source?.name)].filter(Boolean))].slice(0,12),
      timeRange: { earliest: all.at(-1)?.pubDate||all.at(-1)?.publishedAt||null, latest: all[0]?.pubDate||all[0]?.publishedAt||null },
    });
  } catch (err) { next(err); }
};

module.exports = { getDashboard, getAnalysis };
