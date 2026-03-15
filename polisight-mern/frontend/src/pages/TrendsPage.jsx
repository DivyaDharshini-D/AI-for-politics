import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { usePolitical } from '../context/PoliticalContext';
import { getParties, POLITICAL_DATA } from '../data/politicalData';
import './TrendsPage.css';

const COLORS = ['#4f8ef7','#a78bfa','#34d399','#fbbf24','#f87171','#22d3ee','#818cf8','#fb923c','#e879f9','#2dd4bf'];
const QUICK  = ['politics','election','congress','parliament','climate policy','economy','foreign policy','immigration','supreme court','nato'];

// ── Chart components ──────────────────────────────────────────────────────────
function HBar({ label, value, max, color, index, total }) {
  const pct      = max > 0 ? (value/max)*100 : 0;
  const totalPct = total > 0 ? Math.round((value/total)*100) : 0;
  return (
    <div className="hbar-row animate-fadeUp" style={{ animationDelay:`${index*40}ms` }}>
      <span className="hbar-label" title={label}>{label}</span>
      <div className="hbar-track">
        <div className="hbar-fill" style={{ width:`${pct}%`, background:color, animationDelay:`${index*40+80}ms` }}>
          {value > 0 && <span className="hbar-val-inside">{value}</span>}
        </div>
      </div>
      <span className="hbar-pct">{totalPct}%</span>
    </div>
  );
}

function RadarChart({ data }) {
  if (!data?.length || data.length < 3) return <div className="chart-empty">Need 3+ keywords for radar</div>;
  const cx=110, cy=110, r=80, n=Math.min(data.length,8);
  const items = data.slice(0,n);
  const max = Math.max(...items.map(d=>d.count),1);
  const angles = items.map((_,i)=>(i*2*Math.PI)/n - Math.PI/2);
  const pts = items.map((d,i)=>({
    x:  cx+r*(d.count/max)*Math.cos(angles[i]),
    y:  cy+r*(d.count/max)*Math.sin(angles[i]),
    lx: cx+(r+28)*Math.cos(angles[i]),
    ly: cy+(r+28)*Math.sin(angles[i]),
  }));
  return (
    <div className="radar-container">
      <svg viewBox="0 0 220 220" className="radar-svg">
        {[0.25,0.5,0.75,1].map(lvl=>{
          const gpts=angles.map(a=>`${cx+r*lvl*Math.cos(a)},${cy+r*lvl*Math.sin(a)}`).join(' ');
          return <polygon key={lvl} points={gpts} fill="none" stroke="var(--border)" strokeWidth="1"/>;
        })}
        {angles.map((a,i)=><line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(a)} y2={cy+r*Math.sin(a)} stroke="var(--border-mid)" strokeWidth="1"/>)}
        <polygon points={pts.map(p=>`${p.x},${p.y}`).join(' ')} fill="rgba(79,142,247,0.18)" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round"/>
        {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="5" fill="var(--accent)" stroke="var(--bg-surface)" strokeWidth="2"/>)}
        {pts.map((p,i)=><text key={i} x={p.lx} y={p.ly+4} textAnchor="middle" fill="var(--text-secondary)" fontSize="8.5" fontFamily="var(--font-body)">{items[i].word?.slice(0,12)}</text>)}
      </svg>
    </div>
  );
}

function SentimentGauge({ positive=0, negative=0, neutral=0, loading }) {
  if (loading) return <div className="skeleton" style={{ height:160 }}/>;
  const total = positive+negative+neutral||1;
  const score = Math.round(((positive-negative)/total)*100);
  const angle = Math.max(-85, Math.min(85,(score/100)*85));
  const cx=90, cy=88, r=72;
  const toRad = d=>(d-90)*Math.PI/180;
  const nx=cx+r*0.72*Math.cos(toRad(angle)), ny=cy+r*0.72*Math.sin(toRad(angle));
  return (
    <div className="gauge-wrap">
      <svg viewBox="0 0 180 100" className="gauge-svg">
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="var(--bg-hover)" strokeWidth="16"/>
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx} ${cy-r}`} fill="none" stroke="var(--red)"   strokeWidth="16" strokeLinecap="round" opacity=".75"/>
        <path d={`M ${cx-8} ${cy-r+2} A ${r} ${r} 0 0 1 ${cx+8} ${cy-r+2}`} fill="none" stroke="var(--amber)" strokeWidth="16" strokeLinecap="round" opacity=".75"/>
        <path d={`M ${cx} ${cy-r} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}   fill="none" stroke="var(--green)" strokeWidth="16" strokeLinecap="round" opacity=".75"/>
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx={cx} cy={cy} r="5" fill="var(--text-primary)"/>
        <text x={cx} y={cy+22} textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="800" fontFamily="var(--font-display)">{score>0?`+${score}`:score}</text>
        <text x={cx} y={cy+34} textAnchor="middle" fill="var(--text-muted)" fontSize="7.5">sentiment score</text>
      </svg>
      <div className="gauge-legend">
        <span style={{ color:'var(--red)' }}>Negative {Math.round((negative/total)*100)}%</span>
        <span style={{ color:'var(--amber)' }}>Neutral {Math.round((neutral/total)*100)}%</span>
        <span style={{ color:'var(--green)' }}>Positive {Math.round((positive/total)*100)}%</span>
      </div>
    </div>
  );
}

function PartyTrendChart({ countryCode, analyzeData, loading }) {
  const parties = getParties(countryCode);
  if (loading) return <div className="skeleton" style={{ height:200 }}/>;
  if (!parties.length) return <div className="chart-empty">Select a country to see party trends</div>;
  const kws = analyzeData?.topKeywords || [];
  const scores = parties.map(p => {
    const m = kws.find(k=>k.word?.toLowerCase().includes(p.short.toLowerCase()) || p.name.toLowerCase().split(' ').some(w=>w.length>3&&k.word?.toLowerCase().includes(w)));
    return { ...p, count: m?.count||0 };
  }).sort((a,b)=>b.count-a.count);
  const max = Math.max(...scores.map(p=>p.count),1);
  return (
    <div className="party-trend-chart">
      {scores.map((p,i)=>(
        <div key={p.short} className="ptc-row animate-fadeUp" style={{ animationDelay:`${i*40}ms` }}>
          <div className="ptc-meta">
            <span className="ptc-dot" style={{ background:p.color }}/>
            <span className="ptc-name">{p.name}</span>
            <span className="ptc-short">{p.short}</span>
          </div>
          <div className="ptc-track">
            <div className="ptc-fill" style={{ width:`${Math.max((p.count/max)*100,3)}%`, background:p.color, animationDelay:`${i*40+100}ms` }}/>
          </div>
          <span className="ptc-count">{p.count||'0'}</span>
        </div>
      ))}
    </div>
  );
}

function MastodonTagChart({ tags, loading }) {
  if (loading) return <div className="skeleton" style={{ height:200 }}/>;
  if (!tags?.length) return <div className="chart-empty">No trending tags from Mastodon</div>;
  const max = Math.max(...tags.map(t=>Number(t.uses||0)), 1);
  return (
    <div className="masto-tag-chart">
      {tags.slice(0,10).map((t,i)=>(
        <div key={t.name} className="mtc-row animate-fadeUp" style={{ animationDelay:`${i*40}ms` }}>
          <span className="mtc-tag">#{t.name}</span>
          <div className="mtc-track">
            <div className="mtc-fill" style={{ width:`${(Number(t.uses||0)/max)*100}%`, animationDelay:`${i*40+80}ms` }}/>
          </div>
          <div className="mtc-nums">
            <span>{Number(t.uses||0).toLocaleString()}</span>
            {t.accounts>0 && <span className="mtc-accts">{Number(t.accounts).toLocaleString()} accts</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function SourceCompareChart({ breakdown, sources, loading }) {
  if (loading) return <div className="skeleton" style={{ height:120 }}/>;
  const items = [
    { label:'NewsData.io', count:breakdown?.newsdata||0, color:'#4f8ef7' },
    { label:'NewsAPI.org', count:breakdown?.newsapi||0,  color:'#f97316' },
  ];
  const maxCount = Math.max(...items.map(i=>i.count), 1);
  return (
    <div>
      <div className="src-compare">
        {items.map((s,i)=>(
          <div key={s.label} className="src-cmp-item animate-fadeUp" style={{ animationDelay:`${i*60}ms` }}>
            <div className="src-cmp-bar-wrap">
              <div className="src-cmp-bar" style={{ height:`${Math.max((s.count/maxCount)*100,8)}%`, background:s.color }}/>
            </div>
            <span className="src-cmp-count">{s.count}</span>
            <span className="src-cmp-label">{s.label}</span>
          </div>
        ))}
      </div>
      {sources?.length > 0 && (
        <div className="sources-list" style={{ marginTop:14 }}>
          {sources.slice(0,6).map((s,i)=>(
            <div key={s} className="source-item animate-fadeUp" style={{ animationDelay:`${i*35}ms` }}>
              <div className="source-item-dot" style={{ background:COLORS[i%COLORS.length] }}/>
              <span className="source-item-name">{s}</span>
              <span className="badge badge-muted">#{i+1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main TrendsPage ───────────────────────────────────────────────────────────
export default function TrendsPage({ onRefreshSignal }) {
  const { countryCode, searchQuery: politicalQuery, newsCountry } = usePolitical();
  const country = POLITICAL_DATA[countryCode||'US'];

  const [query,    setQuery]    = useState('');
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    if (politicalQuery && politicalQuery !== query) {
      setQuery(politicalQuery);
      setInputVal(politicalQuery);
    }
  }, [politicalQuery]);

  const activeQuery = query || politicalQuery || 'politics';

  // ── All API sources ────────────────────────────────────────────────────────
  const { data,        loading        } = useApi('/analyze',           { q:activeQuery, country:newsCountry }, [onRefreshSignal, activeQuery, newsCountry]);
  const { data:mastoTrend, loading:mastoLoading } = useApi('/mastodon/trending', {},                          [onRefreshSignal]);

  const topKw    = data?.topKeywords || [];
  const maxKw    = Math.max(...topKw.map(d=>d.count), 1);
  const totalKw  = topKw.reduce((s,d)=>s+d.count, 0);

  return (
    <div className="trends-page">
      {/* Search */}
      <div className="trends-search-row">
        <div className="trends-search-wrap">
          <input className="input" value={inputVal}
            onChange={e=>setInputVal(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&setQuery(inputVal.trim())}
            placeholder="Analyze topic: BJP, election, climate, NATO…"
          />
          <button className="btn btn-primary" onClick={()=>setQuery(inputVal.trim())} disabled={loading}>
            {loading ? <span className="auth-spinner"/> : (
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
            )}
            Analyze
          </button>
        </div>
        <div className="trends-quick-tags">
          {QUICK.map(q=>(
            <button key={q} className={`cat-pill${activeQuery===q?' active':''}`} onClick={()=>{ setQuery(q); setInputVal(q); }}>{q}</button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      {(data||loading) && (
        <div className="trends-stats-bar animate-fadeIn">
          {[
            { n:loading?'…':data?.articleCount||0,    label:'articles analyzed' },
            { n:loading?'…':topKw.length,             label:'keywords found' },
            { n:loading?'…':data?.sources?.length||0, label:'sources' },
            { n:country?.flag,                         label:country?.name||'Global' },
            { n:loading?'…':mastoTrend?.tags?.length||0, label:'mastodon tags' },
          ].map((s,i)=>(
            <div key={i} className="trends-stat-item">
              <span className="trends-stat-n">{s.n}</span>
              <span>{s.label}</span>
              {i < 4 && <div className="trends-divider"/>}
            </div>
          ))}
        </div>
      )}

      {/* Charts grid */}
      <div className="trends-grid">

        <div className="card trends-section" style={{ gridArea:'keywords' }}>
          <div className="section-header">
            <h2 className="section-title">Keyword Frequency</h2>
            <div style={{ display:'flex',gap:5 }}>
              <span className="badge badge-blue">NewsData</span>
              <span className="badge badge-amber">NewsAPI</span>
            </div>
          </div>
          {loading
            ? <div className="skeleton" style={{ height:300 }}/>
            : topKw.length
              ? <div className="hbar-list">{topKw.map((d,i)=><HBar key={d.word} label={d.word} value={d.count} max={maxKw} total={totalKw} color={COLORS[i%COLORS.length]} index={i}/>)}</div>
              : <div className="chart-empty">No keywords found for "{activeQuery}"</div>
          }
        </div>

        <div className="card trends-section" style={{ gridArea:'sentiment' }}>
          <div className="section-header">
            <h2 className="section-title">Sentiment Score</h2>
            <span className="badge badge-green">AI Analysis</span>
          </div>
          <SentimentGauge positive={data?.sentiment?.positive} negative={data?.sentiment?.negative} neutral={data?.sentiment?.neutral} loading={loading}/>
          {data && !loading && (
            <div className="trends-sentiment-note">
              From <strong>{data.breakdown?.newsdata||0}</strong> NewsData + <strong>{data.breakdown?.newsapi||0}</strong> NewsAPI articles
            </div>
          )}
        </div>

        <div className="card trends-section" style={{ gridArea:'radar' }}>
          <div className="section-header">
            <h2 className="section-title">Keyword Radar</h2>
            <span className="badge badge-purple">Visual</span>
          </div>
          {loading ? <div className="skeleton" style={{ height:220 }}/> : <RadarChart data={topKw.slice(0,8)}/>}
        </div>

        <div className="card trends-section" style={{ gridArea:'parties' }}>
          <div className="section-header">
            <h2 className="section-title">Party Trend</h2>
            <span className="badge badge-amber">{country?.flag} {country?.name}</span>
          </div>
          <PartyTrendChart countryCode={countryCode||'US'} analyzeData={data} loading={loading}/>
        </div>

        <div className="card trends-section" style={{ gridArea:'mastodon' }}>
          <div className="section-header">
            <h2 className="section-title">Mastodon Trending</h2>
            <span className="badge badge-purple">Fediverse Live</span>
          </div>
          <MastodonTagChart tags={mastoTrend?.tags} loading={mastoLoading}/>
        </div>

        <div className="card trends-section" style={{ gridArea:'sources' }}>
          <div className="section-header">
            <h2 className="section-title">Source Comparison</h2>
            <span className="badge badge-cyan">{data?.sources?.length||0} sources</span>
          </div>
          <SourceCompareChart breakdown={data?.breakdown} sources={data?.sources} loading={loading}/>
        </div>

      </div>
    </div>
  );
}
