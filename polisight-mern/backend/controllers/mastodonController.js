const apiClient = require('../utils/apiClient');
const { formatMastodonPost } = require('../utils/formatters');

const base    = () => `https://${process.env.MASTODON_INSTANCE || 'mastodon.social'}`;
const headers = () => process.env.MASTODON_ACCESS_TOKEN
  ? { Authorization: `Bearer ${process.env.MASTODON_ACCESS_TOKEN}` } : {};

const getPostsByTag = async (req, res, next) => {
  try {
    const { tag = 'politics', limit = 20 } = req.query;
    const { data } = await apiClient.get(
      `${base()}/api/v1/timelines/tag/${encodeURIComponent(tag)}`,
      { params: { limit }, headers: headers() }
    );
    res.json({ success: true, tag, posts: (data || []).map(formatMastodonPost) });
  } catch (err) { next(err); }
};

const getTrendingTags = async (req, res, next) => {
  try {
    const { data } = await apiClient.get(`${base()}/api/v1/trends/tags`, {
      params: { limit: 20 }, headers: headers(), timeout: 6000,
    });
    res.json({
      success: true,
      tags: (data || []).slice(0, 12).map(t => ({
        name: t.name, url: t.url,
        uses: t.history?.[0]?.uses || 0,
        accounts: t.history?.[0]?.accounts || 0,
      })),
    });
  } catch (err) { next(err); }
};

module.exports = { getPostsByTag, getTrendingTags };
