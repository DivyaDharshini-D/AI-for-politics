import { useState } from 'react';
import { useAI } from '../hooks/useAI';
import { OutputBox } from '../components/AICard';
import { useLocation } from '../context/LocationContext';

export default function ChiefStrategistSection() {
  const [input, setInput] = useState('');
  const { output, loading, error, run, clear } = useAI('/intelligence/run');
  const { locationLabel, countryData } = useLocation();

  const handleRun = () => {
    const region = locationLabel || countryData?.name || 'global';
    const context = locationLabel ? `[Political Context: ${locationLabel}]\n\n` : '';
    run('chief-strategist', context + input, { region });
  };
  const handleClear = () => { setInput(''); clear(); };

  return (
    <section id="section-strategist" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Chief Strategist AI</div>
          <div className="pv-section-subtitle">
            One cockpit that reads every signal and proposes the next move
            {locationLabel && <strong style={{ color: 'var(--ink)' }}> · {locationLabel}</strong>}
          </div>
        </div>
        <span className="pv-badge badge-green"><span className="pv-badge-dot" />Meta-brain</span>
      </div>

      <div className="pv-card fade-in" style={{ maxWidth: 860 }}>
        <div className="pv-card-body" style={{ fontSize: 14 }}>
          This flagship module synthesizes all layers — sentiment, manipulation detection, simulation, memory,
          and innovation — to generate prioritized strategic options for leaders.
        </div>
        <div className="pv-divider" />

        <div className="pv-input-group">
          <label className="pv-input-label">Describe your current strategic dilemma</label>
          <textarea
            className="pv-textarea"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ minHeight: 110 }}
            placeholder="e.g. We must respond to a sudden protest without looking defensive. Our poll numbers dropped 6 points this week. How do we stabilize and re-engage?"
          />
        </div>

        <div className="pv-btn-row" style={{ alignItems: 'center' }}>
          <button
            className="pv-btn-primary"
            style={{ height: 42, padding: '0 24px', fontSize: 14 }}
            onClick={handleRun}
            disabled={loading}
          >
            {loading ? <><span className="spinner" />Thinking...</> : '⚡ Generate Strategic Options'}
          </button>
          <button className="pv-btn-ghost" onClick={handleClear}>Clear</button>
          <span style={{ fontSize: 11, color: 'var(--ink-muted)', fontFamily: "'DM Mono',monospace" }}>
            Powered by Gemini AI · Saved to MongoDB
          </span>
        </div>

        <OutputBox output={output} loading={loading} error={error} />
      </div>
    </section>
  );
}
