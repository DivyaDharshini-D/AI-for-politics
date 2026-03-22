const { fetchAllNews, fetchNewsData, fetchGNews, fetchNewsAPI } = require('../services/newsService');

exports.searchNews = async (req, res) => {
  try {
    const { q, source } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, message: 'Query parameter q is required' });
    }

    let articles;
    const query = q.trim();

    if (source === 'newsdata')     articles = await fetchNewsData(query);
    else if (source === 'gnews')   articles = await fetchGNews(query);
    else if (source === 'newsapi') articles = await fetchNewsAPI(query);
    else                           articles = await fetchAllNews(query);

    res.json({ success: true, articles, count: articles.length, query });
  } catch (err) {
    console.error('News search error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTopPoliticsNews = async (req, res) => {
  try {
    const { region = 'global' } = req.query;
    const queryMap = {
      global: 'politics government election',
      India:  'india politics election government',
      'United States': 'us politics congress election',
      'United Kingdom': 'uk politics parliament election',
      Germany: 'germany politics bundesrat election',
      France: 'france politics macron election',
      Brazil: 'brazil politics lula election',
      Australia: 'australia politics parliament election',
      Canada: 'canada politics parliament trudeau',
      default: `${region} politics election`,
    };
    const q = queryMap[region] || queryMap.default.replace('${region}', region);
    const articles = await fetchAllNews(q);
    res.json({ success: true, articles: articles.slice(0, 24), region, query: q });
  } catch (err) {
    console.error('Top news error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
