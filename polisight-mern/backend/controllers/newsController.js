const apiClient = require('../utils/apiClient');
const { formatNewsDataArticle } = require('../utils/formatters');

const NEWSDATA_BASE = 'https://newsdata.io/api/1';

const getNews = async (req, res, next) => {
  try {
    const { q, category = 'politics', country = 'us', page } = req.query;
    const params = {
      apikey:   process.env.NEWSDATA_API_KEY,
      language: 'en',
      category,
      country,
      size:     10,
    };
    if (q)    params.q    = q;
    if (page) params.page = page;

    const { data } = await apiClient.get(`${NEWSDATA_BASE}/news`, { params });
    res.json({
      success:      true,
      articles:     (data.results || []).map(formatNewsDataArticle),
      nextPage:     data.nextPage     || null,
      totalResults: data.totalResults || 0,
    });
  } catch (err) { next(err); }
};

const getHeadlines = async (req, res, next) => {
  try {
    const { country = 'us' } = req.query;
    const { data } = await apiClient.get(`${NEWSDATA_BASE}/news`, {
      params: {
        apikey:   process.env.NEWSDATA_API_KEY,
        country,
        category: 'politics',
        language: 'en',
        size:     5,
      },
    });
    res.json({
      success:   true,
      headlines: (data.results || []).map(a => ({
        id: a.article_id, title: a.title, source: a.source_id,
        publishedAt: a.pubDate, url: a.link, image: a.image_url || null,
      })),
    });
  } catch (err) { next(err); }
};

module.exports = { getNews, getHeadlines };
