import { useState, useEffect } from 'react';
import api from '../services/api';
import { useLocation } from '../context/LocationContext';

export default function NewsFeedSection() {
  const { locationLabel, countryData, state, party } = useLocation();
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [source, setSource] = useState('all');

  // Auto-populate query when location changes
  useEffect(() => {
    const parts = [countryData.name, state, party, 'politics'].filter(Boolean);
    setQuery(parts.join(' '));
  }, [countryData.name, state, party]);

  const search = async (q) => {
    const searchQ = q || query;
    if (!searchQ.trim()) return;
    setLoading(true); setError(''); setArticles([]);
    try {
      const res = await api.get('/news/search', { params: { q: searchQ, source: source === 'all' ? undefined : source } });
      setArticles(res.data.articles || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const loadTopNews = async () => {
    setLoading(true); setError(''); setArticles([]);
    try {
      const res = await api.get('/news/top', { params: { region: countryData.name } });
      setArticles(res.data.articles || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch top news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="section-news" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">News Intelligence Feed</div>
          <div className="pv-section-subtitle">
            Live news from NewsData · GNews · NewsAPI
            {locationLabel && <strong style={{ color: 'var(--ink)' }}> · {locationLabel}</strong>}
          </div>
        </div>
        <span className="pv-badge badge-green"><span className="pv-badge-dot" />3 Sources</span>
      </div>

      <div className="pv-card fade-in">
        <div className="pv-card-header">
          <div className="pv-card-title">Search Political News</div>
          <span className="pv-badge badge-ai"><span className="pv-badge-dot" />Multi-source</span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="pv-input-group" style={{ flex: 1, minWidth: 200 }}>
            <label className="pv-input-label">Search query</label>
            <input
              className="pv-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="e.g. India election, fuel price, budget..."
            />
          </div>
          <div className="pv-input-group">
            <label className="pv-input-label">Source</label>
            <select className="pv-select" value={source} onChange={e => setSource(e.target.value)}>
              <option value="all">All Sources</option>
              <option value="newsdata">NewsData.io</option>
              <option value="gnews">GNews</option>
              <option value="newsapi">NewsAPI</option>
            </select>
          </div>
          <button className="pv-btn-primary" onClick={() => search()} disabled={loading}>
            {loading ? <><span className="spinner" />Fetching...</> : '🔍 Search'}
          </button>
          <button className="pv-btn-ghost" onClick={loadTopNews} disabled={loading}>
            Top News
          </button>
        </div>

        {error && <div style={{ color: 'var(--accent)', fontSize: 13, padding: '8px 0' }}>{error}</div>}

        {articles.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginBottom: 10, fontFamily: "'DM Mono',monospace" }}>
              {articles.length} articles found
            </div>
            {articles.map((a, i) => (
              <div key={i} className="pv-news-item">
                <div className="pv-news-title">
                  <a href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a>
                </div>
                {a.description && (
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.5 }}>
                    {a.description.substring(0, 160)}{a.description.length > 160 ? '...' : ''}
                  </div>
                )}
                <div className="pv-news-meta" style={{ marginTop: 5 }}>
                  {a.source} · {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && articles.length === 0 && !error && (
          <div style={{ fontSize: 13, color: 'var(--ink-muted)', fontStyle: 'italic', padding: '12px 0' }}>
            Press Search or "Top News" to load articles for <strong>{locationLabel || 'your selected region'}</strong>.
          </div>
        )}
      </div>
    </section>
  );
}
