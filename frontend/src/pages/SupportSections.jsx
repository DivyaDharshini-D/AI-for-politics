import { useState, useEffect } from 'react';
import { AICard, InfoCard } from '../components/AICard';
import api from '../services/api';

export function IntegrationSection() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.get('/health')
      .then(r => setHealth(r.data))
      .catch(() => setHealth({ status: 'error' }));
  }, []);

  const geminiOk = health?.gemini === true;

  const sources = [
    { name: 'NewsData.io',   status: 'Connected',                     type: 'positive' },
    { name: 'GNews API',     status: 'Connected',                     type: 'positive' },
    { name: 'NewsAPI.org',   status: 'Connected',                     type: 'positive' },
    { name: 'Mastodon API',  status: 'Connected',                     type: 'positive' },
    { name: 'MongoDB Atlas', status: health?.status === 'ok' ? 'Connected' : 'Checking…', type: health?.status === 'ok' ? 'positive' : 'neutral' },
    { name: 'Gemini AI',     status: geminiOk ? 'Connected' : 'Add GEMINI_API_KEY to .env', type: geminiOk ? 'positive' : 'negative' },
  ];

  return (
    <section id="section-integration" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Integration & Operations</div>
          <div className="pv-section-subtitle">Unified intelligence streams and data pipelines</div>
        </div>
      </div>
      <div className="pv-grid-2">
        <InfoCard
          title="Media Monitoring Hub"
          badge={{ type: 'green', label: 'Single pane of glass' }}
          tagline="Unify news, social, and field intelligence streams"
          body="Normalizes inputs from NewsData, GNews, NewsAPI, Mastodon and field reports into a common schema."
          chips={['NewsData.io', 'GNews', 'NewsAPI', 'Mastodon', 'GDELT']}
        >
          <div className="pv-footnote" style={{ marginTop: 4 }}>
            Connect your own data lake to keep a durable trace of every narrative monitored.
          </div>
        </InfoCard>

        <InfoCard
          title="Data Integration Status"
          badge={{ type: health?.status === 'ok' ? 'green' : 'ai', label: health?.status === 'ok' ? '● Live' : '○ Checking' }}
          tagline="Current connection health across all data sources"
        >
          <div className="pv-divider" />
          {sources.map(s => (
            <div key={s.name} className="pv-regional-row">
              <span className="pv-regional-name" style={{ minWidth: 130, fontSize: 13 }}>{s.name}</span>
              <span className={`pv-pill ${s.type}`}>{s.status}</span>
            </div>
          ))}
          {health?.timestamp && (
            <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 8, fontFamily: "'DM Mono',monospace" }}>
              Last checked: {new Date(health.timestamp).toLocaleTimeString()}
            </div>
          )}
          {!geminiOk && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--amber-light)', borderRadius: 8, fontSize: 12, color: 'var(--amber)', lineHeight: 1.6 }}>
              <strong>To enable AI features:</strong><br />
              1. Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>aistudio.google.com/app/apikey</a><br />
              2. Copy your free API key<br />
              3. Set <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: 3 }}>GEMINI_API_KEY=AIza...</code> in <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: 3 }}>backend/.env</code><br />
              4. Restart the backend: <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: 3 }}>npm run dev</code>
            </div>
          )}
        </InfoCard>
      </div>
    </section>
  );
}

export function PerformanceSection() {
  const [history, setHistory] = useState([]);
  const [stats, setStats]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/intelligence/history?limit=8'),
      api.get('/intelligence/stats'),
    ])
      .then(([h, s]) => {
        setHistory(h.data.analyses || []);
        setStats(s.data.stats || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const moduleLabel = (m) => m.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <section id="section-performance" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Performance & Learning</div>
          <div className="pv-section-subtitle">Closed-loop tracking of what actually works</div>
        </div>
      </div>
      <div className="pv-grid-2">
        <InfoCard title="Module Usage Stats" badge={{ type: 'shield', label: 'Analytics' }} tagline="Which intelligence modules you use most">
          <div className="pv-divider" />
          {loading && <div style={{ color: 'var(--ink-muted)', fontSize: 13, fontStyle: 'italic' }}>Loading…</div>}
          {!loading && stats.length === 0 && (
            <div style={{ color: 'var(--ink-muted)', fontSize: 13, fontStyle: 'italic' }}>
              No analyses yet. Run any AI module to start tracking.
            </div>
          )}
          {stats.slice(0, 8).map((s, i) => (
            <div key={i} className="pv-regional-row">
              <span style={{ fontSize: 13, fontWeight: 500 }}>{moduleLabel(s._id)}</span>
              <span>
                <span className="pv-pill positive">{s.count} run{s.count !== 1 ? 's' : ''}</span>
                <span className="pv-pill neutral">{(s.totalTokens || 0).toLocaleString()} tokens</span>
              </span>
            </div>
          ))}
        </InfoCard>

        <InfoCard title="Recent Analysis History" badge={{ type: 'green', label: 'MongoDB log' }} tagline="Last 8 analyses saved to your account">
          <div className="pv-divider" />
          {loading && <div style={{ color: 'var(--ink-muted)', fontSize: 13, fontStyle: 'italic' }}>Loading…</div>}
          {!loading && history.length === 0 && (
            <div style={{ color: 'var(--ink-muted)', fontSize: 13, fontStyle: 'italic' }}>
              No history yet. Run any AI module to see it logged here.
            </div>
          )}
          {history.map((a, i) => (
            <div key={i} className="pv-news-item">
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{moduleLabel(a.module)}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                {a.input?.substring(0, 80)}{a.input?.length > 80 ? '…' : ''}
              </div>
              <div className="pv-news-meta" style={{ marginTop: 4 }}>
                {new Date(a.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </InfoCard>
      </div>

      <div className="pv-grid-3" style={{ marginTop: 18 }}>
        <InfoCard title="Strategy Effectiveness Tracker" badge={{ type: 'shield', label: 'Closed loop' }} tagline="See which narratives actually changed minds" body="Connects each campaign or speech to downstream sentiment, turnout, and media framing changes." chips={['Campaign A/B', 'Sentiment delta', 'Turnout shift']} />
        <InfoCard title="Adaptive Learning Engine"       badge={{ type: 'shield', label: 'Closed loop' }} tagline="Your playbook gets smarter every week"      body="Learns from past experiments to recommend fewer, higher-quality moves instead of constant noise." chips={['Pattern learning', 'Move ranking', 'Auto-refine']} />
        <InfoCard title="Experiment Learning Vault"      badge={{ type: 'green',  label: 'Institutional memory' }} tagline="Every test, lesson, and failure — searchable" body="Stores hypotheses, setups, and outcomes so new staff never have to repeat old mistakes." chips={['Searchable archive', 'Outcome logs', 'Lessons learnt']} />
      </div>
    </section>
  );
}

export function InnovationSection() {
  return (
    <section id="section-innovation" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Innovation Layer</div>
          <div className="pv-section-subtitle">Emerging capabilities and future-facing modules</div>
        </div>
        <span className="pv-badge badge-gold"><span className="pv-badge-dot" />Beta</span>
      </div>
      <div className="pv-grid-2">
        <InfoCard
          title="Civic Sentiment Blockchain"
          badge={{ type: 'green', label: 'Transparency rail' }}
          tagline="A tamper-evident ledger of aggregated public mood"
          body="Vision: store anonymized sentiment snapshots on a public chain so leaders, citizens, and media can audit how narratives shift."
          chips={['Anonymized data', 'Public audit', 'Immutable logs']}
        />
        <AICard
          module="reality-gap"
          title="Reality Gap Detector"
          badge={{ type: 'shield', label: 'Reality check' }}
          tagline="Detect when slogans drift too far from lived experience"
          body="Compares messaging claims with World Bank, GDELT, and other datasets to highlight widening gaps."
          inputType="textarea"
          placeholder="e.g. 'We created 10 million jobs this year and unemployment is at an all-time low...'"
          labelOverride="Political claim to reality-check"
          runLabel="Check Reality Gap"
        />
      </div>
    </section>
  );
}

export function MemorySection() {
  return (
    <section id="section-memory" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Memory & History Layer</div>
          <div className="pv-section-subtitle">Institutional recall to avoid repeating past mistakes</div>
        </div>
      </div>
      <div className="pv-grid-2">
        <AICard
          module="issue-memory"
          title="Issue Memory Engine"
          badge={{ type: 'green', label: 'Long memory' }}
          tagline="Remember how people reacted last time"
          body="Retrieves historical sentiment patterns for recurring issues so you avoid re-opening old wounds by accident."
          inputType="input"
          placeholder="e.g. price hike, corruption charge, foreign policy decision..."
          labelOverride="Issue to recall history for"
          runLabel="Recall History"
        />
        <AICard
          module="scandal-recall"
          title="Past Scandal Recall System"
          badge={{ type: 'shield', label: 'Ghost detector' }}
          tagline="Know which phrases will wake up old scandals"
          body="Flags messaging that rhymes with prior scandals so you can rephrase before opponents connect the dots."
          inputType="textarea"
          placeholder="e.g. 'the funds were properly allocated and all procedures were followed'..."
          labelOverride="Phrase or message to audit"
          runLabel="Check for Echoes"
        />
      </div>
    </section>
  );
}
