const apiClient = require('../utils/apiClient');

const NEWSAPI_BASE = 'https://newsapi.org/v2';

/**
 * Normalise a NewsAPI.org article to our standard shape.
 */
const formatNewsApiArticle = (a) => ({
  id:          a.url,
  title:       a.title,
  description: a.description || null,
  url:         a.url,
  image:       a.urlToImage  || null,
  source:      a.source?.name || 'NewsAPI',
  publishedAt: a.publishedAt,
  category:    'politics',
  sentiment:   null,
  keywords:    [],
  country:     null,
  _provider:   'newsapi',
});

/**
 * GET /api/newsapi/top-headlines
 * Query: country, category, q, pageSize
 */
const getTopHeadlines = async (req, res, next) => {
  try {
    const { country = 'us', category = 'politics', q, pageSize = 10, page = 1 } = req.query;

    const params = {
      apiKey:   process.env.NEWSAPI_KEY,
      country,
      category,
      pageSize: Math.min(Number(pageSize), 20),
      page,
    };
    if (q) params.q = q;

    const { data } = await apiClient.get(`${NEWSAPI_BASE}/top-headlines`, { params });

    res.json({
      success:      true,
      articles:     (data.articles || [])
        .filter(a => a.title && a.title !== '[Removed]')
        .map(formatNewsApiArticle),
      totalResults: data.totalResults || 0,
      _provider:    'newsapi',
    });
  } catch (err) { next(err); }
};

/**
 * GET /api/newsapi/everything
 * Query: q, sortBy, from, to, language, pageSize, page
 */
const getEverything = async (req, res, next) => {
  try {
    const {
      q = 'politics',
      sortBy   = 'publishedAt',
      language = 'en',
      pageSize = 10,
      page     = 1,
      from,
      to,
    } = req.query;

    const params = {
      apiKey:   process.env.NEWSAPI_KEY,
      q,
      sortBy,
      language,
      pageSize: Math.min(Number(pageSize), 20),
      page,
    };
    if (from) params.from = from;
    if (to)   params.to   = to;

    const { data } = await apiClient.get(`${NEWSAPI_BASE}/everything`, { params });

    res.json({
      success:      true,
      articles:     (data.articles || [])
        .filter(a => a.title && a.title !== '[Removed]')
        .map(formatNewsApiArticle),
      totalResults: data.totalResults || 0,
      _provider:    'newsapi',
    });
  } catch (err) { next(err); }
};

/**
 * GET /api/newsapi/sources
 * Returns all political news sources from NewsAPI
 */
const getSources = async (req, res, next) => {
  try {
    const { category = 'politics', language = 'en', country } = req.query;
    const params = { apiKey: process.env.NEWSAPI_KEY, category, language };
    if (country) params.country = country;

    const { data } = await apiClient.get(`${NEWSAPI_BASE}/top-headlines/sources`, { params });

    res.json({
      success: true,
      sources: (data.sources || []).map(s => ({
        id:          s.id,
        name:        s.name,
        description: s.description,
        url:         s.url,
        category:    s.category,
        language:    s.language,
        country:     s.country,
      })),
    });
  } catch (err) { next(err); }
};

module.exports = { getTopHeadlines, getEverything, getSources, formatNewsApiArticle };
