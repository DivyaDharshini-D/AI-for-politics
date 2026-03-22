const axios = require('axios');

const MASTODON_BASE = `https://${process.env.MASTODON_INSTANCE || 'mastodon.social'}`;
const TOKEN = process.env.MASTODON_ACCESS_TOKEN;

const mastodonClient = axios.create({
  baseURL: `${MASTODON_BASE}/api/v1`,
  headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  timeout: 12000,
});

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#\d+;/g, '').trim();
}

async function searchMastodon(query, limit = 20) {
  try {
    const res = await mastodonClient.get('/search', {
      params: { q: query, type: 'statuses', limit: Math.min(limit, 40), resolve: false },
    });
    return (res.data.statuses || []).map(s => ({
      id: s.id,
      content: stripHtml(s.content).substring(0, 300),
      url: s.url,
      createdAt: s.created_at,
      account: s.account?.acct || 'unknown',
      favourites: s.favourites_count || 0,
      reblogs: s.reblogs_count || 0,
      replies: s.replies_count || 0,
    }));
  } catch (err) {
    console.error('Mastodon search error:', err.message);
    return [];
  }
}

async function getTrendingPosts() {
  try {
    const res = await mastodonClient.get('/trends/statuses', { params: { limit: 10 } });
    return (res.data || []).map(s => ({
      id: s.id,
      content: stripHtml(s.content).substring(0, 300),
      url: s.url,
      createdAt: s.created_at,
      favourites: s.favourites_count || 0,
      reblogs: s.reblogs_count || 0,
    }));
  } catch (err) {
    console.error('Mastodon trending posts error:', err.message);
    return [];
  }
}

async function getTrendingHashtags() {
  try {
    const res = await mastodonClient.get('/trends/tags', { params: { limit: 15 } });
    return (res.data || []).map(t => ({
      name: t.name,
      url: t.url,
      history: (t.history || []).slice(0, 3).map(h => ({
        day: h.day,
        uses: parseInt(h.uses) || 0,
        accounts: parseInt(h.accounts) || 0,
      })),
    }));
  } catch (err) {
    console.error('Mastodon hashtags error:', err.message);
    return [];
  }
}

module.exports = { searchMastodon, getTrendingPosts, getTrendingHashtags };
