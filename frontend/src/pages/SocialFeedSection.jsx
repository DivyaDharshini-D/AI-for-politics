import { useState, useEffect } from 'react';
import api from '../services/api';
import { useLocation } from '../context/LocationContext';

export default function SocialFeedSection() {
  const { locationLabel } = useLocation();
  const [query, setQuery] = useState('politics');
  const [posts, setPosts] = useState([]);
  const [trending, setTrending] = useState({ posts: [], hashtags: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('search');

  // Auto-update query on location change
  useEffect(() => {
    if (locationLabel) setQuery(locationLabel + ' politics');
    else setQuery('politics');
  }, [locationLabel]);

  const loadTrending = () => {
    setLoading(true); setError('');
    api.get('/social/trending')
      .then(r => setTrending(r.data.trending || { posts: [], hashtags: [] }))
      .catch(err => setError(err.response?.data?.message || 'Failed to load trending'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === 'trending') loadTrending();
  }, [tab]);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(''); setPosts([]);
    try {
      const res = await api.get('/social/search', { params: { q: query, limit: 20 } });
      setPosts(res.data.posts || []);
      if ((res.data.posts || []).length === 0) setError('No posts found. Try a different search term.');
    } catch (err) {
      setError(err.response?.data?.message || 'Mastodon search failed. Check your access token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="section-social" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Social Intelligence</div>
          <div className="pv-section-subtitle">
            Live data from Mastodon (mastodon.social)
            {locationLabel && <strong style={{ color: 'var(--ink)' }}> · {locationLabel}</strong>}
          </div>
        </div>
        <span className="pv-badge badge-green"><span className="pv-badge-dot" />Mastodon API</span>
      </div>

      <div className="pv-card fade-in">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[['search', '🔍 Search'], ['trending', '🔥 Trending']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              height: 32, padding: '0 14px', borderRadius: 6,
              border: '1.5px solid var(--border)',
              background: tab === t ? 'var(--ink)' : 'var(--bg)',
              color: tab === t ? '#fff' : 'var(--ink-soft)',
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, cursor: 'pointer',
              transition: 'all .15s',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Search Tab ── */}
        {tab === 'search' && (
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div className="pv-input-group" style={{ flex: 1 }}>
                <label className="pv-input-label">Search Mastodon posts</label>
                <input
                  className="pv-input"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && search()}
                  placeholder="e.g. election, politics, democracy..."
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="pv-btn-primary" onClick={search} disabled={loading}>
                  {loading ? <><span className="spinner" />Searching...</> : 'Search'}
                </button>
              </div>
            </div>

            {error && <div style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 10 }}>⚠ {error}</div>}

            {posts.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginBottom: 10, fontFamily: "'DM Mono',monospace" }}>
                  {posts.length} posts from Mastodon
                </div>
                {posts.map((p, i) => (
                  <div key={i} className="pv-news-item">
                    <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.65, marginBottom: 4 }}>
                      {p.content}
                    </div>
                    <div className="pv-news-meta">
                      @{p.account}
                      {' · '}❤ {p.favourites}
                      {' · '}↺ {p.reblogs}
                      {p.url && <> · <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>View ↗</a></>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && posts.length === 0 && !error && (
              <div style={{ fontSize: 13, color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                Press Search to find Mastodon discussions about <strong>{query}</strong>
              </div>
            )}
          </div>
        )}

        {/* ── Trending Tab ── */}
        {tab === 'trending' && (
          <div>
            {loading && (
              <div style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                <span className="spinner" />Loading trending data...
              </div>
            )}
            {error && <div style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 10 }}>⚠ {error}</div>}

            {trending.hashtags.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 10 }}>
                  Trending Hashtags
                </div>
                <div className="pv-chip-row">
                  {trending.hashtags.map((h, i) => (
                    <a key={i} href={h.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <span className="pv-chip" style={{ cursor: 'pointer', color: 'var(--blue)', borderColor: 'var(--blue-light)' }}>
                        #{h.name}
                        {h.history?.[0]?.uses > 0 && (
                          <span style={{ color: 'var(--ink-muted)', marginLeft: 4, fontSize: 10 }}>
                            {h.history[0].uses}
                          </span>
                        )}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {trending.posts.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 10 }}>
                  Trending Posts
                </div>
                {trending.posts.map((p, i) => (
                  <div key={i} className="pv-news-item">
                    <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.65, marginBottom: 4 }}>{p.content}</div>
                    <div className="pv-news-meta">❤ {p.favourites} · ↺ {p.reblogs}</div>
                  </div>
                ))}
              </div>
            )}

            {!loading && trending.posts.length === 0 && trending.hashtags.length === 0 && !error && (
              <div style={{ fontSize: 13, color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                No trending data available right now. Try the Search tab.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
