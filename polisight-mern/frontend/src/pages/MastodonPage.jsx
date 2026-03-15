import { usePolitical } from '../context/PoliticalContext';
import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import './MastodonPage.css';

const TAGS = ['politics','news','democracy','election','government','climate','economy','justice'];

function PostCard({ post, index }) {
  const ago = (d) => {
    if (!d) return '';
    const s = (Date.now() - new Date(d)) / 1000;
    if (s < 3600) return `${Math.round(s/60)}m`;
    if (s < 86400) return `${Math.round(s/3600)}h`;
    return `${Math.round(s/86400)}d`;
  };
  return (
    <div className="mast-post card animate-fadeUp" style={{ animationDelay: `${index * 35}ms` }}>
      <div className="mast-post-header">
        <div className="mast-avatar">
          {post.account?.avatar
            ? <img src={post.account.avatar} alt="" onError={e => { e.target.style.display='none'; }} />
            : <span>{(post.account?.displayName || post.account?.username || '?')[0]?.toUpperCase()}</span>
          }
        </div>
        <div className="mast-user-info">
          <span className="mast-display-name">{post.account?.displayName || post.account?.username}</span>
          <span className="mast-username">@{post.account?.username}</span>
        </div>
        <span className="mast-time">{ago(post.createdAt)}</span>
      </div>
      <p className="mast-content">{post.content}</p>
      {post.tags?.length > 0 && (
        <div className="mast-tags">
          {post.tags.slice(0, 4).map(t => <span key={t} className="badge badge-purple">#{t}</span>)}
        </div>
      )}
      <div className="mast-stats">
        <span className="mast-stat">
          <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"/></svg>
          {post.repliesCount}
        </span>
        <span className="mast-stat">
          <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fillRule="evenodd" d="M4 2a1 1 0 00-1 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/></svg>
          {post.reblogsCount}
        </span>
        <span className="mast-stat">
          <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          {post.favouritesCount}
        </span>
        {post.url && (
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="mast-link">View →</a>
        )}
      </div>
    </div>
  );
}

function TrendTag({ tag, active, onClick }) {
  return (
    <button className={`trend-tag-btn ${active ? 'active' : ''}`} onClick={onClick}>
      <span>#{tag.name}</span>
      {tag.uses > 0 && <span className="trend-tag-uses">{Number(tag.uses).toLocaleString()}</span>}
    </button>
  );
}

export default function MastodonPage({ onRefreshSignal }) {
  const { searchQuery: politicalQuery } = usePolitical();
  const defaultTag = politicalQuery?.split(' ')[0] || 'politics';
  const [tag, setTag] = useState(defaultTag);
  const { data: postsData, loading: postsLoading } = useApi('/mastodon', { tag, limit: 20 }, [onRefreshSignal, tag]);
  const { data: trendData } = useApi('/mastodon/trending', {}, [onRefreshSignal]);

  return (
    <div className="mastodon-page">
      {/* Header */}
      <div className="mast-header card">
        <div className="mast-header-inner">
          <div className="mast-header-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M21.327 8.566c0-4.339-2.843-5.61-2.843-5.61-1.433-.658-3.894-.935-6.451-.956h-.063c-2.557.021-5.016.298-6.45.956 0 0-2.843 1.272-2.843 5.61 0 .993-.019 2.181.012 3.441.103 4.243.778 8.425 4.701 9.463 1.809.479 3.362.579 4.612.51 2.268-.126 3.541-.809 3.541-.809l-.075-1.646s-1.621.511-3.441.449c-1.804-.062-3.707-.194-3.999-2.409a4.523 4.523 0 01-.04-.621s1.77.433 4.014.536c1.372.063 2.658-.08 3.965-.236 2.506-.299 4.688-1.843 4.962-3.254.434-2.223.398-5.424.398-5.424zm-3.353 5.59h-2.081V9.057c0-1.075-.452-1.62-1.357-1.62-1 0-1.501.647-1.501 1.927v2.791h-2.069V9.364c0-1.28-.501-1.927-1.502-1.927-.905 0-1.357.546-1.357 1.62v5.099H6.026V8.903c0-1.074.273-1.927.823-2.558.567-.631 1.307-.955 2.228-.955 1.065 0 1.872.409 2.405 1.228l.518.869.519-.869c.533-.819 1.34-1.228 2.405-1.228.92 0 1.66.324 2.228.955.549.631.822 1.484.822 2.558v5.253z"/>
            </svg>
          </div>
          <div>
            <h2 className="mast-header-title">Mastodon Feed</h2>
            <p className="mast-header-sub">Real-time posts from mastodon.social</p>
          </div>
          <div className="mast-live-badge">
            <span className="source-dot live" /> Live
          </div>
        </div>
      </div>

      <div className="mastodon-layout">
        {/* Main feed */}
        <div className="mast-feed">
          <div className="mast-tag-filter">
            {TAGS.map(t => (
              <button key={t} className={`cat-pill ${tag === t ? 'active' : ''}`} onClick={() => setTag(t)}>
                #{t}
              </button>
            ))}
          </div>
          <div className="mast-posts">
            {postsLoading
              ? Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="card" style={{ padding: 16, display:'flex', flexDirection:'column', gap:10 }}>
                    <div style={{ display:'flex', gap:10 }}>
                      <div className="skeleton" style={{ width:40, height:40, borderRadius:'50%' }} />
                      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
                        <div className="skeleton" style={{ height:13, width:'50%' }} />
                        <div className="skeleton" style={{ height:11, width:'30%' }} />
                      </div>
                    </div>
                    <div className="skeleton" style={{ height:14, width:'95%' }} />
                    <div className="skeleton" style={{ height:14, width:'80%' }} />
                  </div>
                ))
              : (postsData?.posts || []).map((p, i) => <PostCard key={p.id} post={p} index={i} />)
            }
            {!postsLoading && !postsData?.posts?.length && (
              <div className="empty-state">No posts found for #{tag}</div>
            )}
          </div>
        </div>

        {/* Sidebar trending */}
        <aside className="mast-sidebar">
          <div className="card mast-trending-card">
            <div className="section-header">
              <h3 className="section-title">Trending Tags</h3>
              <span className="badge badge-purple">Fediverse</span>
            </div>
            <div className="mast-trending-list">
              {(trendData?.tags || []).map(t => (
                <TrendTag key={t.name} tag={t} active={tag === t.name} onClick={() => setTag(t.name)} />
              ))}
              {!trendData?.tags?.length && <div className="skeleton" style={{ height:200 }} />}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
