const apiClient = require('../utils/apiClient');
const { formatGNewsArticle } = require('../utils/formatters');

const GNEWS_BASE = 'https://gnews.io/api/v4';

const searchGNews = async (req, res, next) => {
  try {
    const { q = 'politics', lang = 'en', country = 'us', max = 10 } = req.query;
    const { data } = await apiClient.get(`${GNEWS_BASE}/search`, {
      params: { q, lang, country, max, apikey: process.env.GNEWS_API_KEY },
    });
    res.json({ success: true, articles: (data.articles || []).map(formatGNewsArticle), totalResults: data.totalArticles || 0 });
  } catch (err) { next(err); }
};

const getTopHeadlines = async (req, res, next) => {
  try {
    const { topic = 'nation', lang = 'en', country = 'us', max = 10 } = req.query;
    const { data } = await apiClient.get(`${GNEWS_BASE}/top-headlines`, {
      params: { topic, lang, country, max, apikey: process.env.GNEWS_API_KEY },
    });
    res.json({ success: true, articles: (data.articles || []).map(formatGNewsArticle), totalResults: data.totalArticles || 0 });
  } catch (err) { next(err); }
};

module.exports = { searchGNews, getTopHeadlines };
