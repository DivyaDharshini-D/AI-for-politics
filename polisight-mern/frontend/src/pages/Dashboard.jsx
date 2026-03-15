import { useMemo } from 'react';
import { useApi }       from '../hooks/useApi';
import { usePolitical } from '../context/PoliticalContext';
import { getParties, POLITICAL_DATA } from '../data/politicalData';
import MiniChart from '../components/MiniChart';
import './Dashboard.css';

const COLORS = ['#4f8ef7','#a78bfa','#34d399','#fbbf24','#f87171','#22d3ee','#818cf8','#fb923c'];
const PROV_COLOR = { newsdata:'#4f8ef7', gnews:'#34d399', newsapi:'#f97316' };
const PROV_LABEL = { newsdata:'NewsData', gnews:'GNews', newsapi:'NewsAPI' };

const ago = (d) => {
  if (!d) return '';
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 3600) return `${Math.round(s/60)}m ago`;
  if (s < 86400) return `${Math.round(s/3600)}h ago`;
  return `${Math.round(s/86400)}d ago`;
};

function StatCard({ label, value, sub, color, icon, delay=0 }) {
  return (
    <div className="stat-card animate-fadeUp card" style={{ animationDelay:`${delay}ms` }}>
      <div className="stat-card-top">
        <span className="stat-card-icon" style={{ background:`${color}18`, color }}>{icon}</span>
      </div>
      <div className="stat-card-value">{value ?? '—'}</div>
      <div className="stat-card-label">{label}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}

function NewsCard({ article, index }) {
  const pColor = PROV_COLOR[article._provider] || 'var(--accent)';
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer"
      className="news-mini-card animate-fadeUp" style={{ animationDelay:`${index*40}ms` }}>
      <div className="news-mini-img">
        {article.image
          ? <img src={article.image} alt="" loading="lazy" onError={e=>{e.target.style.display='none';}}/>
          : <div className="news-mini-placeholder">📰</div>}
      </div>
      <div className="news-mini-body">
        <div className="news-mini-provider" style={{ color:pColor }}>
          <span className="nmp-dot" style={{ background:pColor }}/>{PROV_LABEL[article._provider]||'News'}
        </div>
        <p className="news-mini-title">{article.title}</p>
        <div className="news-mini-meta">
          <span>{article.source}</span>
          <span className="nmc-time">{ago(article.publishedAt)}</span>
        </div>
      </div>
    </a>
  );
}

function SentimentBar({ positive=0, negative=0, neutral=0, loading, articleCount=0, breakdown }) {
  const total = positive + negative + neutral || 1;
  const pct = n => Math.round((n/total)*100);
  if (loading) return <div className="skeleton" style={{ height:130 }}/>;
  if (total <= 1) return <div className="chart-empty">Fetching sentiment…</div>;
  return (
    <div className="sentiment-widget">
      <div className="sentiment-bar-track">
        <div className="sentiment-seg pos" style={{ width:`${pct(positive)}%` }}/>
        <div className="sentiment-seg neu" style={{ width:`${pct(neutral)}%`  }}/>
        <div className="sentiment-seg neg" style={{ width:`${pct(negative)}%` }}/>
      </div>
      <div className="sentiment-legend">
        {[['Positive','var(--green)',pct(positive)],['Neutral','var(--amber)',pct(neutral)],['Negative','var(--red)',pct(negative)]].map(([l,c,v])=>(
          <div key={l} className="sentiment-legend-item">
            <div className="sentiment-dot" style={{ background:c }}/><span>{l}</span><strong style={{ color:c }}>{v}%</strong>
          </div>
        ))}
      </div>
      <div className="sentiment-pills">
        <div className="sentiment-pill pos"><span className="sp-num">{positive}</span><span>Positive</span></div>
        <div className="sentiment-pill neu"><span className="sp-num">{neutral}</span><span>Neutral</span></div>
        <div className="sentiment-pill neg"><span className="sp-num">{negative}</span><span>Negative</span></div>
      </div>
      {breakdown && <div className="sentiment-breakdown-note">From {breakdown.newsdata} NewsData + {breakdown.newsapi} NewsAPI articles</div>}
    </div>
  );
}

function CategoryDonut({ data, loading }) {
  if (loading) return <div className="skeleton" style={{ height:160 }}/>;
  if (!data?.length) return <div className="chart-empty">No category data yet</div>;
  const total = data.reduce((s,d)=>s+d.count,0)||1;
  let cum=0; const r=58,cx=70,cy=70,sw=18,circ=2*Math.PI*r;
  return (
    <div className="donut-chart">
      <svg viewBox="0 0 140 140" className="donut-svg">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-hover)" strokeWidth={sw}/>
        {data.slice(0,6).map((d,i)=>{
          const p=d.count/total,dash=p*circ,off=circ-cum*circ; cum+=p;
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={COLORS[i%COLORS.length]} strokeWidth={sw}
            strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={off}
            style={{ transform:`rotate(-90deg)`,transformOrigin:`${cx}px ${cy}px` }}/>;
        })}
        <text x={cx} y={cy-5}  textAnchor="middle" fill="var(--text-primary)" fontSize="20" fontWeight="800" fontFamily="var(--font-display)">{total}</text>
        <text x={cx} y={cy+12} textAnchor="middle" fill="var(--text-muted)"   fontSize="9">articles</text>
      </svg>
      <div className="donut-legend">
        {data.slice(0,6).map((d,i)=>(
          <div key={i} className="donut-legend-item">
            <div className="donut-legend-dot" style={{ background:COLORS[i%COLORS.length] }}/>
            <span className="donut-legend-label">{d.name}</span>
            <span className="donut-legend-pct">{Math.round((d.count/total)*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourceBreakdownChart({ topSources, stats, loading }) {
  if (loading) return <div className="skeleton" style={{ height:200 }}/>;
  const apiStatus = [
    { key:'newsdata', label:'NewsData.io', color:'#4f8ef7' },
    { key:'gnews',    label:'GNews',       color:'#34d399' },
    { key:'newsapi',  label:'NewsAPI.org', color:'#f97316' },
    { key:'mastodon', label:'Mastodon',    color:'#a78bfa' },
  ];
  return (
    <div>
      <div className="source-api-status">
        {apiStatus.map(s => (
          <div key={s.key} className="sas-item">
            <span className={`sas-dot ${stats?.sourceStatus?.[s.key]==='ok'?'ok':'err'}`} style={{ background: stats?.sourceStatus?.[s.key]==='ok' ? s.color : undefined }}/>
            <span className="sas-name">{s.label}</span>
            <span className={`sas-badge ${stats?.sourceStatus?.[s.key]==='ok'?'ok':'err'}`}>
              {stats?.sourceStatus?.[s.key]==='ok' ? '● Live' : '○ Offline'}
            </span>
          </div>
        ))}
      </div>
      {topSources?.length > 0 && (
        <div className="source-list-chart" style={{ marginTop:12 }}>
          {topSources.slice(0,6).map((s,i)=>(
            <div key={s.name} className="slc-row animate-fadeUp" style={{ animationDelay:`${i*35}ms` }}>
              <span className="slc-dot" style={{ background:COLORS[i%COLORS.length] }}/>
              <span className="slc-name">{s.name}</span>
              <div className="slc-track">
                <div className="slc-fill" style={{ width:`${(s.count/topSources[0].count)*100}%`, background:COLORS[i%COLORS.length], animationDelay:`${i*35+80}ms` }}/>
              </div>
              <span className="slc-count">{s.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PartyBreakdown({ countryCode, analyzeData, loading }) {
  const parties = getParties(countryCode);
  if (loading) return <div className="skeleton" style={{ height:200 }}/>;
  if (!parties.length) return <div className="chart-empty">Select a country to see party data</div>;
  const keywords = analyzeData?.topKeywords || [];
  const scores = parties.map(p => {
    const m = keywords.find(k =>
      k.word?.toLowerCase().includes(p.short.toLowerCase()) ||
      p.name.toLowerCase().split(' ').some(w => w.length > 3 && k.word?.toLowerCase().includes(w))
    );
    return { ...p, count: m?.count || 0 };
  }).sort((a,b)=>b.count-a.count);
  const max = Math.max(...scores.map(p=>p.count), 1);
  return (
    <div className="party-breakdown">
      {scores.map((p,i)=>(
        <div key={p.short} className="party-bar-row animate-fadeUp" style={{ animationDelay:`${i*40}ms` }}>
          <div className="party-bar-meta">
            <span className="party-bar-dot" style={{ background:p.color }}/>
            <span className="party-bar-name">{p.short}</span>
          </div>
          <div className="party-bar-track">
            <div className="party-bar-fill" style={{ width:`${Math.max((p.count/max)*100,3)}%`, background:p.color, animationDelay:`${i*40+80}ms` }}>
              {p.count>0 && <span className="party-bar-label">{p.name}</span>}
            </div>
          </div>
          <span className="party-bar-count">{p.count||'—'}</span>
        </div>
      ))}
    </div>
  );
}

function TrendingTag({ tag, index }) {
  const colors=['badge-blue','badge-purple','badge-cyan','badge-green','badge-amber','badge-red'];
  return (
    <div className="trending-tag animate-fadeUp" style={{ animationDelay:`${index*40}ms` }}>
      <span className={`badge ${colors[index%colors.length]}`}>#{tag.name}</span>
      <div className="trending-tag-bar-wrap">
        <div className="trending-tag-bar" style={{ width:`${Math.min(100,(Number(tag.uses)||0)/500*100)}%`, animationDelay:`${index*45+130}ms` }}/>
      </div>
      <div className="trending-tag-right">
        <span className="trending-tag-uses">{Number(tag.uses||0).toLocaleString()}</span>
        {tag.accounts > 0 && <span className="trending-tag-accounts">{Number(tag.accounts).toLocaleString()} accts</span>}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Dashboard({ onRefreshSignal, searchQuery }) {
  const { countryCode, state, party, searchQuery: politicalQuery, newsCountry } = usePolitical();
  const country = POLITICAL_DATA[countryCode || 'US'];
  const effectiveQuery = searchQuery || politicalQuery || 'politics';

  const { data:dash,      loading:dashLoading,    error:dashError    } = useApi('/dashboard',         { country:newsCountry, q:effectiveQuery }, [onRefreshSignal, newsCountry, effectiveQuery]);
  const { data:analyze,   loading:analyzeLoading                     } = useApi('/analyze',           { q:effectiveQuery, country:newsCountry }, [onRefreshSignal, effectiveQuery, newsCountry]);
  const { data:mastoTrend,loading:mastoLoading                       } = useApi('/mastodon/trending', {},                                        [onRefreshSignal]);

  const allTrendingTags = useMemo(() => {
    const a = dash?.trendingTags || [];
    const b = mastoTrend?.tags   || [];
    const map = new Map();
    [...a,...b].forEach(t => { if (!map.has(t.name)) map.set(t.name,t); });
    return [...map.values()].sort((x,y) => Number(y.uses||0) - Number(x.uses||0)).slice(0,10);
  }, [dash, mastoTrend]);

  return (
    <div className="dashboard">

      {(state || party) && (
        <div className="dashboard-context-banner animate-slideDown">
          <span className="dcb-flag">{country?.flag}</span>
          <span className="dcb-label">Filtered:</span>
          <span className="dcb-crumb">{country?.name}</span>
          {state && <><span className="dcb-sep">›</span><span className="dcb-crumb">{state}</span></>}
          {party && <><span className="dcb-sep">›</span><span className="dcb-party" style={{ color:party.color, background:`${party.color}18` }}>{party.name}</span></>}
          <span className="dcb-query">"{effectiveQuery}"</span>
        </div>
      )}

      <div className="dashboard-stats stagger">
        <StatCard label="Total Articles"   value={dashLoading?'…':(dash?.stats?.totalArticles??'—')} sub="3 News APIs combined"   color="var(--accent)"  delay={0}   icon={<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd"/><path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"/></svg>}/>
        <StatCard label="Sources Active"   value={dashLoading?'…':(dash?.stats?.sourcesActive??'—')} sub="of 3 news APIs"         color="var(--green)"   delay={60}  icon={<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M5.05 3.636a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0 9 9 0 010 12.728 1 1 0 11-1.414-1.414 7 7 0 000-9.9 1 1 0 010-1.414z" clipRule="evenodd"/></svg>}/>
        <StatCard label="Keywords Found"   value={analyzeLoading?'…':(analyze?.topKeywords?.length??'—')} sub={`"${effectiveQuery}"`} color="var(--cyan)"    delay={120} icon={<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>}/>
        <StatCard label="Mastodon Trends"  value={mastoLoading?'…':allTrendingTags.length}             sub="fediverse tags"         color="var(--purple)"  delay={180} icon={<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M21.327 8.566c0-4.339-2.843-5.61-2.843-5.61-1.433-.658-3.894-.935-6.451-.956h-.063c-2.557.021-5.016.298-6.45.956 0 0-2.843 1.272-2.843 5.61 0 .993-.019 2.181.012 3.441.103 4.243.778 8.425 4.701 9.463 1.809.479 3.362.579 4.612.51 2.268-.126 3.541-.809 3.541-.809l-.075-1.646s-1.621.511-3.441.449c-1.804-.062-3.707-.194-3.999-2.409a4.523 4.523 0 01-.04-.621s1.77.433 4.014.536c1.372.063 2.658-.08 3.965-.236 2.506-.299 4.688-1.843 4.962-3.254.434-2.223.398-5.424.398-5.424zm-3.353 5.59h-2.081V9.057c0-1.075-.452-1.62-1.357-1.62-1 0-1.501.647-1.501 1.927v2.791h-2.069V9.364c0-1.28-.501-1.927-1.502-1.927-.905 0-1.357.546-1.357 1.62v5.099H6.026V8.903c0-1.074.273-1.927.823-2.558.567-.631 1.307-.955 2.228-.955 1.065 0 1.872.409 2.405 1.228l.518.869.519-.869c.533-.819 1.34-1.228 2.405-1.228.92 0 1.66.324 2.228.955.549.631.822 1.484.822 2.558v5.253z"/></svg>}/>
      </div>

      <div className="dashboard-grid">

        <div className="dashboard-section card" style={{ gridArea:'headlines' }}>
          <div className="section-header">
            <h2 className="section-title">Top Headlines — {country?.flag} {country?.name}</h2>
            <div style={{ display:'flex', gap:5 }}>
              {[['NewsData','#4f8ef7'],['GNews','#34d399'],['NewsAPI','#f97316']].map(([l,c])=>(
                <span key={l} className="badge" style={{ background:`${c}18`, color:c }}>{l}</span>
              ))}
            </div>
          </div>
          <div className="headlines-list">
            {dashLoading
              ? Array.from({length:5},(_,i)=><div key={i} className="skeleton" style={{ height:70,borderRadius:'var(--radius-md)',marginBottom:8,animationDelay:`${i*55}ms` }}/>)
              : (dash?.topHeadlines||[]).length
                ? (dash.topHeadlines).map((a,i)=><NewsCard key={a.id||i} article={a} index={i}/>)
                : <div className="chart-empty">No headlines — try a different filter</div>
            }
            {dashError && <div className="error-state">⚠ {dashError}</div>}
          </div>
        </div>

        <div className="dashboard-section card" style={{ gridArea:'sentiment' }}>
          <div className="section-header">
            <h2 className="section-title">Sentiment Analysis</h2>
            <span className="badge badge-green">All Sources</span>
          </div>
          <SentimentBar positive={analyze?.sentiment?.positive} negative={analyze?.sentiment?.negative} neutral={analyze?.sentiment?.neutral} loading={analyzeLoading} breakdown={analyze?.breakdown}/>
          {analyze && !analyzeLoading && <div className="sentiment-source">Analysed <strong>{analyze.articleCount}</strong> articles for <em>"{analyze.query}"</em></div>}
        </div>

        <div className="dashboard-section card" style={{ gridArea:'categories' }}>
          <div className="section-header">
            <h2 className="section-title">Category Mix</h2>
            <span className="badge badge-purple">All APIs</span>
          </div>
          <CategoryDonut data={dash?.categoryBreakdown} loading={dashLoading}/>
        </div>

        <div className="dashboard-section card" style={{ gridArea:'parties' }}>
          <div className="section-header">
            <h2 className="section-title">Party Mentions</h2>
            <span className="badge badge-amber">{country?.flag} {country?.name}</span>
          </div>
          <PartyBreakdown countryCode={countryCode||'US'} analyzeData={analyze} loading={analyzeLoading}/>
        </div>

        <div className="dashboard-section card" style={{ gridArea:'sources' }}>
          <div className="section-header">
            <h2 className="section-title">API Sources</h2>
            <span className="badge badge-cyan">{dash?.stats?.sourcesActive||0}/3 live</span>
          </div>
          <SourceBreakdownChart topSources={dash?.topSources} stats={dash?.stats} loading={dashLoading}/>
        </div>

        <div className="dashboard-section card" style={{ gridArea:'keywords' }}>
          <div className="section-header">
            <h2 className="section-title">Top Keywords</h2>
            <span className="badge badge-blue">{analyze?.topKeywords?.length||0} found</span>
          </div>
          {analyzeLoading
            ? <div className="skeleton" style={{ height:200 }}/>
            : analyze?.topKeywords?.length
              ? <MiniChart data={analyze.topKeywords.slice(0,10)}/>
              : <div className="chart-empty">Keywords load in seconds…</div>
          }
        </div>

        <div className="dashboard-section card" style={{ gridArea:'trending' }}>
          <div className="section-header">
            <h2 className="section-title">Mastodon Trending</h2>
            <span className="badge badge-purple">Fediverse</span>
          </div>
          <div className="trending-list">
            {!allTrendingTags.length && mastoLoading
              ? Array.from({length:6},(_,i)=><div key={i} className="skeleton" style={{ height:28,marginBottom:8 }}/>)
              : allTrendingTags.length
                ? allTrendingTags.map((t,i)=><TrendingTag key={t.name} tag={t} index={i}/>)
                : <div className="chart-empty">No trending tags</div>
            }
          </div>
        </div>

      </div>
    </div>
  );
}
