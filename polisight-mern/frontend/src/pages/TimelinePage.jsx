import { useState, useMemo } from 'react';
import { useApi } from '../hooks/useApi';
import { usePolitical } from '../context/PoliticalContext';
import { POLITICAL_DATA } from '../data/politicalData';
import './TimelinePage.css';

const PROV_COLOR = { newsdata:'#4f8ef7', gnews:'#34d399', newsapi:'#f97316', mastodon:'#a78bfa' };
const PROV_LABEL = { newsdata:'NewsData', gnews:'GNews', newsapi:'NewsAPI', mastodon:'Mastodon' };
const PROV_BADGE = { newsdata:'badge-blue', gnews:'badge-green', newsapi:'badge-amber', mastodon:'badge-purple' };

function TimelineItem({ item, index }) {
  const d    = new Date(item.publishedAt || item.createdAt);
  const time = isNaN(d) ? '' : d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
  const date = isNaN(d) ? '' : d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
  const color = PROV_COLOR[item.type] || 'var(--accent)';
  return (
    <div className="tl-item animate-fadeUp" style={{ animationDelay:`${Math.min(index*30,350)}ms` }}>
      <div className="tl-time">
        <span className="tl-date">{date}</span>
        <span className="tl-clock">{time}</span>
      </div>
      <div className="tl-connector">
        <div className="tl-dot" style={{ borderColor:color, boxShadow:`0 0 8px ${color}55` }}/>
        <div className="tl-line"/>
      </div>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="tl-card card">
        <div className="tl-card-header">
          <span className={`badge ${PROV_BADGE[item.type]||'badge-muted'}`}>{PROV_LABEL[item.type]||item.type}</span>
          {item.source && <span className="tl-source">{item.source}</span>}
          {item.category && <span className="badge badge-muted">{item.category}</span>}
        </div>
        <p className="tl-title">{item.title||item.content}</p>
        {item.description && <p className="tl-desc">{item.description}</p>}
      </a>
    </div>
  );
}

function DateGroupHeader({ date }) {
  return (
    <div className="tl-date-header">
      <div className="tl-date-line"/>
      <span className="tl-date-label">{date}</span>
      <div className="tl-date-line"/>
    </div>
  );
}

const FILTERS = [
  { id:'all',      label:'All Events'  },
  { id:'newsdata', label:'NewsData'    },
  { id:'gnews',    label:'GNews'       },
  { id:'newsapi',  label:'NewsAPI'     },
  { id:'mastodon', label:'Mastodon'    },
];

export default function TimelinePage({ onRefreshSignal }) {
  const { newsCountry, searchQuery: politicalQuery, countryCode } = usePolitical();
  const country = POLITICAL_DATA[countryCode||'US'];
  const [filter, setFilter] = useState('all');

  const mastoTag = politicalQuery?.split(' ')[0] || 'politics';

  // ── All 4 sources ──────────────────────────────────────────────────────────
  const { data:ndData,   loading:ndLoading   } = useApi('/news',                  { category:'politics', country:newsCountry },                             [onRefreshSignal, newsCountry]);
  const { data:gnData,   loading:gnLoading   } = useApi('/gnews/top',             { topic:'nation', q:politicalQuery||undefined },                          [onRefreshSignal, politicalQuery]);
  const { data:naData,   loading:naLoading   } = useApi('/newsapi/top-headlines', { country:newsCountry, category:'politics', pageSize:15 },                [onRefreshSignal, newsCountry]);
  const { data:naAllData,loading:naAllLoading} = useApi('/newsapi/everything',    { q:politicalQuery||'politics', language:'en', sortBy:'publishedAt', pageSize:10 }, [onRefreshSignal, politicalQuery]);
  const { data:mastData, loading:mastLoading } = useApi('/mastodon',              { tag:mastoTag, limit:15 },                                               [onRefreshSignal, mastoTag]);

  const loading = ndLoading || gnLoading || naLoading || naAllLoading || mastLoading;

  // ── Merge all sources ──────────────────────────────────────────────────────
  const allItems = useMemo(() => {
    const nd = (ndData?.articles||[]).map(a=>({ id:a.id||a.url, title:a.title, description:a.description, url:a.url, source:a.source, publishedAt:a.publishedAt, category:a.category, type:'newsdata' }));
    const gn = (gnData?.articles||[]).map(a=>({ id:a.id||a.url, title:a.title, description:a.description, url:a.url, source:a.source, publishedAt:a.publishedAt, type:'gnews' }));

    // Merge naData + naAllData, dedupe
    const naTop = (naData?.articles||[]).map(a=>({ id:a.url, title:a.title, description:a.description, url:a.url, source:a.source, publishedAt:a.publishedAt, type:'newsapi' }));
    const naAll = (naAllData?.articles||[]).map(a=>({ id:a.url, title:a.title, description:a.description, url:a.url, source:a.source, publishedAt:a.publishedAt, type:'newsapi' }));
    const naMap = new Map(); [...naTop,...naAll].forEach(a=>{ if(!naMap.has(a.url)) naMap.set(a.url,a); });
    const na = [...naMap.values()];

    const ma = (mastData?.posts||[]).map(p=>({ id:p.id, title:p.content?.slice(0,120)+(p.content?.length>120?'…':''), content:p.content, publishedAt:p.createdAt, source:`@${p.account?.username}`, url:p.url, type:'mastodon' }));

    const all = [...nd,...gn,...na,...ma].filter(i=>(i.publishedAt||i.createdAt)&&i.title);
    all.sort((a,b)=>new Date(b.publishedAt||b.createdAt)-new Date(a.publishedAt||a.createdAt));
    return all;
  }, [ndData, gnData, naData, naAllData, mastData]);

  const filtered = useMemo(()=>filter==='all'?allItems:allItems.filter(i=>i.type===filter), [allItems, filter]);

  // Group by date
  const grouped = useMemo(() => {
    const groups = []; let lastDate = null;
    filtered.forEach((item,i) => {
      const d = new Date(item.publishedAt||item.createdAt);
      const dateStr = isNaN(d) ? 'Unknown' : d.toLocaleDateString('en-US',{ weekday:'long', month:'long', day:'numeric' });
      if (dateStr !== lastDate) { groups.push({ type:'header', date:dateStr, id:`h-${i}` }); lastDate=dateStr; }
      groups.push({ type:'item', item, index:i });
    });
    return groups;
  }, [filtered]);

  const countByType = (t) => allItems.filter(i=>i.type===t).length;

  return (
    <div className="timeline-page">

      {/* Controls */}
      <div className="tl-controls card">
        <div className="tl-controls-inner">
          <div className="tl-filter-tabs">
            {FILTERS.map(f=>(
              <button key={f.id} className={`tl-tab${filter===f.id?' active':''}`}
                onClick={()=>setFilter(f.id)}
                style={filter===f.id&&f.id!=='all' ? { borderColor:PROV_COLOR[f.id], color:PROV_COLOR[f.id], background:`${PROV_COLOR[f.id]}12` } : {}}>
                {f.id!=='all' && <span className="tl-tab-dot" style={{ background:PROV_COLOR[f.id] }}/>}
                {f.label}
                <span className="tl-tab-count">
                  {f.id==='all' ? allItems.length : countByType(f.id)}
                </span>
              </button>
            ))}
          </div>
          <div className="tl-meta">
            <span className="tl-country">{country?.flag} {country?.name}</span>
            {loading && <span className="tl-loading"><span className="source-dot live"/> Updating…</span>}
          </div>
        </div>
      </div>

      {/* Timeline stream */}
      <div className="tl-stream">
        {loading && !filtered.length
          ? Array.from({length:6},(_,i)=>(
              <div key={i} className="tl-item">
                <div className="tl-time"><div className="skeleton" style={{ height:12,width:40 }}/></div>
                <div className="tl-connector"><div className="tl-dot skeleton"/><div className="tl-line"/></div>
                <div className="tl-card card" style={{ flex:1 }}>
                  <div className="skeleton" style={{ height:13,width:'30%',marginBottom:8 }}/>
                  <div className="skeleton" style={{ height:16,width:'90%' }}/>
                </div>
              </div>
            ))
          : grouped.map(entry=>
              entry.type==='header'
                ? <DateGroupHeader key={entry.id} date={entry.date}/>
                : <TimelineItem key={`${entry.item.type}-${entry.item.id}`} item={entry.item} index={entry.index}/>
            )
        }
        {!loading && !filtered.length && (
          <div className="empty-state">No events found for this filter</div>
        )}
      </div>
    </div>
  );
}
