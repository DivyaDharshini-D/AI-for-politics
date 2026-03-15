const formatNewsDataArticle = (a) => ({
  id:          a.article_id,
  title:       a.title,
  description: a.description || null,
  url:         a.link,
  image:       a.image_url   || null,
  source:      a.source_id,
  publishedAt: a.pubDate,
  category:    a.category?.[0] || 'general',
  sentiment:   a.sentiment   || null,
  keywords:    a.keywords?.slice(0, 5) || [],
  country:     a.country?.[0] || null,
});

const formatGNewsArticle = (a) => ({
  id:          a.url,
  title:       a.title,
  description: a.description || null,
  url:         a.url,
  image:       a.image       || null,
  source:      a.source?.name || null,
  publishedAt: a.publishedAt,
  category:    null,
  sentiment:   null,
  keywords:    [],
});

const formatMastodonPost = (p) => ({
  id:              p.id,
  content:         p.content?.replace(/<[^>]+>/g, '').trim() || '',
  account: {
    username:    p.account?.username,
    displayName: p.account?.display_name || p.account?.username,
    avatar:      p.account?.avatar || null,
  },
  createdAt:       p.created_at,
  repliesCount:    p.replies_count    || 0,
  reblogsCount:    p.reblogs_count    || 0,
  favouritesCount: p.favourites_count || 0,
  url:             p.url,
  tags:            p.tags?.map(t => t.name) || [],
});

module.exports = { formatNewsDataArticle, formatGNewsArticle, formatMastodonPost };
