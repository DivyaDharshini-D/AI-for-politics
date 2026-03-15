import { useState, useMemo } from 'react';
import { useApi } from '../hooks/useApi';
import { usePolitical } from '../context/PoliticalContext';
import { POLITICAL_DATA } from '../data/politicalData';
import './NewsPage.css';

const CATEGORIES = ['politics','world','business','technology','science','health','sports','entertainment'];

const PROV_COLOR = { newsdata:'#4f8ef7', gnews:'#34d399', newsapi:'#f97316' };
const PROV_LABEL = { newsdata:'NewsData.io', gnews:'GNews', newsapi:'NewsAPI.org' };
const PROV_BADGE = { newsdata:'badge-blue', gnews:'badge-green', newsapi:'badge-amber' };

const ago = (d) => {
  if (!d) return '';
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 3600) return `${Math.round(s/60)}m ago`;
  if (s < 86400) return `${Math.round(s/3600)}h ago`;
  return `${Math.round(s/86400)}d ago`;
};

// ── Article card ───────────────────────────────────────────────────────────────
function ArticleCard({ article, index }) {
  const pColor = PROV_COLOR[article._provider] || 'var(--accent)';
  const pLabel = PROV_LABEL[article._provider] || 'News';
  const pBadge = PROV_BADGE[article._provider] || 'badge-muted';
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer"
      className="article-card card card-interactive animate-fadeUp"
      style={{ animationDelay:`${Math.min(index*35, 400)}ms` }}>
      <div className="article-img">
        {article.image
          ? <img src={article.image} alt="" loading="lazy"
              onError={e=>{e.target.parentElement.innerHTML='<div class="article-img-ph">📰</div>';}}/>
          : <div className="article-img-ph">📰</div>
        }
        <span className="article-provider-badge" style={{ background:`${pColor}dd` }}>{pLabel}</span>
      </div>
      <div className="article-body">
        <div className="article-meta-top">
          {article.category && <span className="badge badge-blue">{article.category}</span>}
          <span className="article-source">{article.source}</span>
          <span className="article-time">{ago(article.publishedAt)}</span>
        </div>
        <h3 className="article-title">{article.title}</h3>
        {article.description && <p className="article-desc">{article.description}</p>}
        {article.keywords?.length > 0 && (
          <div className="article-tags">
            {article.keywords.slice(0,3).map(k=><span key={k} className="badge badge-muted">{k}</span>)}
          </div>
        )}
        <div className="article-footer">
          <span className={`badge ${pBadge}`} style={{ fontSize:10 }}>{pLabel}</span>
          <span className="article-read-more">Read article →</span>
        </div>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="article-card-skeleton card">
      <div className="skeleton article-img"/>
      <div className="article-body" style={{ gap:8 }}>
        <div className="skeleton" style={{ height:13, width:'40%' }}/>
        <div className="skeleton" style={{ height:17, width:'90%' }}/>
        <div className="skeleton" style={{ height:13, width:'75%' }}/>
        <div className="skeleton" style={{ height:13, width:'55%' }}/>
      </div>
    </div>
  );
}

function SourceTab({ id, label, color, count, active, onClick }) {
  return (
    <button className={`news-src-tab${active?' active':''}`} onClick={onClick}
      style={active ? { borderColor:color, color, background:`${color}12` } : {}}>
      {active && <span className="ns-dot" style={{ background:color }}/>}
      {label}
      {count != null && <span className="ns-count">{count}</span>}
    </button>
  );
}

// ── Main NewsPage ──────────────────────────────────────────────────────────────
export default function NewsPage({ onRefreshSignal, searchQuery }) {
  const { countryCode, state, party, searchQuery: politicalQuery, newsCountry } = usePolitical();
  const country = POLITICAL_DATA[countryCode];
  const effectiveQuery = searchQuery || politicalQuery;

  const [category,   setCategory]   = useState('politics');
  const [activeTab,  setActiveTab]  = useState('all');   // 'all' | 'newsdata' | 'gnews' | 'newsapi'
  const [sortBy,     setSortBy]     = useState('date');  // 'date' | 'source'
  const [ndPage,     setNdPage]     = useState(null);

  // ── API calls ──────────────────────────────────────────────────────────────
  const ndParams = useMemo(() => ({
    q: effectiveQuery || undefined, category, country: newsCountry, page: ndPage || undefined,
  }), [effectiveQuery, category, newsCountry, ndPage]);

  const gnParams = useMemo(() => ({
    q: effectiveQuery || category, max: 10,
  }), [effectiveQuery, category]);

  const naTopParams = useMemo(() => ({
    country: newsCountry, category: 'politics', pageSize: 10,
    ...(effectiveQuery ? {} : {}),
  }), [newsCountry]);

  const naEverythingParams = useMemo(() => ({
    q: effectiveQuery || category, language: 'en', sortBy: 'publishedAt', pageSize: 10,
  }), [effectiveQuery, category]);

  const { data:ndData,  loading:ndLoading  } = useApi('/news',                  ndParams,        [onRefreshSignal, category, effectiveQuery, newsCountry, ndPage]);
  const { data:gnData,  loading:gnLoading  } = useApi('/gnews',                 gnParams,        [onRefreshSignal, category, effectiveQuery]);
  const { data:naTop,   loading:naTopLoading} = useApi('/newsapi/top-headlines', naTopParams,    [onRefreshSignal, newsCountry]);
  const { data:naAll,   loading:naAllLoading} = useApi('/newsapi/everything',    naEverythingParams, [onRefreshSignal, effectiveQuery, category]);

  // Tag articles with provider
  const ndArticles = useMemo(() => (ndData?.articles  || []).map(a=>({...a,_provider:'newsdata'})), [ndData]);
  const gnArticles = useMemo(() => (gnData?.articles  || []).map(a=>({...a,_provider:'gnews'})),    [gnData]);
  const naArticles = useMemo(() => {
    const top  = (naTop?.articles  || []).map(a=>({...a,_provider:'newsapi'}));
    const all_ = (naAll?.articles  || []).map(a=>({...a,_provider:'newsapi'}));
    // Merge, dedupe by URL
    const seen = new Set();
    return [...top,...all_].filter(a => { if (seen.has(a.url)) return false; seen.add(a.url); return true; });
  }, [naTop, naAll]);

  const loading = ndLoading || gnLoading || naTopLoading || naAllLoading;

  // ── Merge + sort ─────────────────────────────────────────────────────────
  const allArticles = useMemo(() => {
    if (activeTab === 'newsdata') return ndArticles;
    if (activeTab === 'gnews')    return gnArticles;
    if (activeTab === 'newsapi')  return naArticles;
    // All: interleave
    const merged = [];
    const max = Math.max(ndArticles.length, gnArticles.length, naArticles.length);
    for (let i = 0; i < max; i++) {
      if (ndArticles[i]) merged.push(ndArticles[i]);
      if (gnArticles[i]) merged.push(gnArticles[i]);
      if (naArticles[i]) merged.push(naArticles[i]);
    }
    return merged;
  }, [activeTab, ndArticles, gnArticles, naArticles]);

  const sortedArticles = useMemo(() => {
    if (sortBy === 'source') {
      return [...allArticles].sort((a,b) => (a.source||'').localeCompare(b.source||''));
    }
    return [...allArticles].sort((a,b) => new Date(b.publishedAt||0) - new Date(a.publishedAt||0));
  }, [allArticles, sortBy]);

  const totalCount = ndArticles.length + gnArticles.length + naArticles.length;

  return (
    <div className="news-page">

      {/* Filter context */}
      {(state || party) && (
        <div className="news-filter-context">
          <span>{country?.flag}</span>
          <span className="badge badge-blue">{country?.name}</span>
          {state  && <><span>›</span><span className="badge badge-purple">{state}</span></>}
          {party  && <><span>›</span><span className="badge" style={{ background:`${party.color}18`, color:party.color }}>{party.name}</span></>}
        </div>
      )}

      {/* Source tabs + controls */}
      <div className="news-filters">
        <div className="news-src-tabs">
          <SourceTab id="all"      label="All Sources" color="var(--accent)"  count={totalCount}          active={activeTab==='all'}      onClick={()=>setActiveTab('all')}/>
          <SourceTab id="newsdata" label="NewsData.io" color="#4f8ef7"        count={ndArticles.length}   active={activeTab==='newsdata'} onClick={()=>setActiveTab('newsdata')}/>
          <SourceTab id="gnews"    label="GNews"       color="#34d399"        count={gnArticles.length}   active={activeTab==='gnews'}    onClick={()=>setActiveTab('gnews')}/>
          <SourceTab id="newsapi"  label="NewsAPI.org" color="#f97316"        count={naArticles.length}   active={activeTab==='newsapi'}  onClick={()=>setActiveTab('newsapi')}/>
        </div>

        <div className="news-filter-row">
          <div className="news-cat-pills">
            {CATEGORIES.map(c=>(
              <button key={c} className={`cat-pill${category===c?' active':''}`}
                onClick={()=>{ setCategory(c); setNdPage(null); }}>
                {c}
              </button>
            ))}
          </div>
          <div className="news-sort">
            <span className="news-sort-label">Sort:</span>
            {[['date','Newest'],['source','Source']].map(([v,l])=>(
              <button key={v} className={`news-sort-btn${sortBy===v?' active':''}`} onClick={()=>setSortBy(v)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results info bar */}
      {!loading && (
        <div className="news-results-info">
          <span><strong>{sortedArticles.length}</strong> articles</span>
          {activeTab === 'all' && (
            <>
              <span className="nri-dot" style={{ background:'#4f8ef7' }}/><span>{ndArticles.length} NewsData</span>
              <span className="nri-dot" style={{ background:'#34d399' }}/><span>{gnArticles.length} GNews</span>
              <span className="nri-dot" style={{ background:'#f97316' }}/><span>{naArticles.length} NewsAPI</span>
            </>
          )}
          <span className="badge badge-muted">{country?.flag} {country?.name}</span>
          {effectiveQuery && <span className="badge badge-blue">"{effectiveQuery}"</span>}
        </div>
      )}

      {/* Article grid */}
      <div className="news-grid">
        {loading
          ? Array.from({length:9},(_,i)=><SkeletonCard key={i}/>)
          : sortedArticles.map((a,i)=><ArticleCard key={`${a._provider}-${a.id||a.url||i}`} article={a} index={i}/>)
        }
      </div>

      {/* Load more (NewsData pagination) */}
      {(activeTab === 'all' || activeTab === 'newsdata') && ndData?.nextPage && (
        <div className="news-pagination">
          <button className="btn btn-ghost" onClick={()=>setNdPage(ndData.nextPage)} disabled={loading}>
            Load more NewsData articles →
          </button>
        </div>
      )}
    </div>
  );
}
