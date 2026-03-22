const { searchMastodon, getTrendingPosts, getTrendingHashtags } = require('../services/mastodonService');

exports.searchSocial = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, message: 'Query parameter q is required' });
    }
    const posts = await searchMastodon(q.trim(), parseInt(limit));
    res.json({ success: true, posts, count: posts.length, query: q });
  } catch (err) {
    console.error('Social search error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const [postsResult, hashtagsResult] = await Promise.allSettled([
      getTrendingPosts(),
      getTrendingHashtags(),
    ]);
    res.json({
      success: true,
      trending: {
        posts:    postsResult.status    === 'fulfilled' ? postsResult.value    : [],
        hashtags: hashtagsResult.status === 'fulfilled' ? hashtagsResult.value : [],
      },
    });
  } catch (err) {
    console.error('Trending error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
