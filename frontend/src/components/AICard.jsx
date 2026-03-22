import { useState } from 'react';
import { useAI } from '../hooks/useAI';
import { useLocation } from '../context/LocationContext';

/* ─── Badge ─── */
export function Badge({ type = 'ai', label, dot = true }) {
  return (
    <span className={`pv-badge badge-${type}`}>
      {dot && <span className="pv-badge-dot" />}
      {label}
    </span>
  );
}

/* ─── OutputBox — renders markdown-like formatting ─── */
export function OutputBox({ output, loading, error }) {
  if (!output && !loading && !error) return null;

  // Light markdown renderer: bold, headers, line breaks
  const formatOutput = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Headers: ## or **text**
        if (/^#{1,3}\s/.test(line)) {
          return (
            <div key={i} style={{ fontWeight: 700, color: 'var(--ink)', marginTop: i > 0 ? 10 : 0, marginBottom: 3, fontSize: 13 }}>
              {line.replace(/^#+\s/, '')}
            </div>
          );
        }
        // Bold: **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j}>{p.slice(2, -2)}</strong>
            : p
        );
        // Bullet lines
        if (/^[-•*]\s/.test(line)) {
          return (
            <div key={i} style={{ display: 'flex', gap: 6, marginTop: 3 }}>
              <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>▸</span>
              <span>{rendered.map((p, j) => p.startsWith?.('**') ? <strong key={j}>{p}</strong> : p)}</span>
            </div>
          );
        }
        // Numbered lines
        if (/^\d+[.)]\s/.test(line)) {
          return <div key={i} style={{ marginTop: 4 }}>{rendered}</div>;
        }
        // Empty line = spacer
        if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;
        return <div key={i} style={{ marginTop: 2 }}>{rendered}</div>;
      });
  };

  return (
    <div className="pv-output">
      {loading && (
        <span style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>
          <span className="spinner" />Analyzing with Gemini AI...
        </span>
      )}
      {error && !loading && (
        <span style={{ color: 'var(--accent)' }}>⚠ {error}</span>
      )}
      {output && !loading && (
        <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
          {formatOutput(output)}
        </div>
      )}
    </div>
  );
}

/* ─── AICard ─── */
export function AICard({
  title, badge, tagline, body,
  module, inputType = 'textarea', placeholder,
  endpoint, chips, children, labelOverride,
  runLabel = 'Run Analysis',
}) {
  const [value, setValue] = useState('');
  const { output, loading, error, run, clear } = useAI(endpoint);
  const { locationLabel, countryData } = useLocation();

  const handleRun = () => {
    if (!value.trim()) {
      // show error via useAI
      run(module, '');
      return;
    }
    const region = locationLabel || countryData?.name || 'global';
    const contextPrefix = locationLabel ? `[Political Context: ${locationLabel}]\n\n` : '';
    run(module, contextPrefix + value.trim(), { region });
  };

  const handleClear = () => {
    setValue('');
    clear();
  };

  return (
    <div className="pv-card fade-in">
      <div className="pv-card-header">
        <div className="pv-card-title">{title}</div>
        {badge && <Badge {...badge} />}
      </div>
      {tagline && <div className="pv-card-tagline">{tagline}</div>}
      {body && <div className="pv-card-body">{body}</div>}
      {children}
      <div className="pv-input-group">
        <label className="pv-input-label">
          {labelOverride || (inputType === 'textarea' ? 'Enter text' : 'Enter keyword or topic')}
        </label>
        {inputType === 'textarea' ? (
          <textarea
            className="pv-textarea"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <input
            className="pv-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={placeholder}
            onKeyDown={e => e.key === 'Enter' && handleRun()}
          />
        )}
      </div>
      {chips && (
        <div className="pv-chip-row">
          {chips.map(c => <span key={c} className="pv-chip">{c}</span>)}
        </div>
      )}
      <div className="pv-btn-row">
        <button className="pv-btn-primary" onClick={handleRun} disabled={loading}>
          {loading ? <><span className="spinner" />Analyzing...</> : runLabel}
        </button>
        <button className="pv-btn-ghost" onClick={handleClear} disabled={loading}>
          Clear
        </button>
      </div>
      <OutputBox output={output} loading={loading} error={error} />
    </div>
  );
}

/* ─── InfoCard (no AI, display-only) ─── */
export function InfoCard({ title, badge, tagline, body, chips, children }) {
  return (
    <div className="pv-card fade-in">
      <div className="pv-card-header">
        <div className="pv-card-title">{title}</div>
        {badge && <Badge {...badge} />}
      </div>
      {tagline && <div className="pv-card-tagline">{tagline}</div>}
      {body && <div className="pv-card-body">{body}</div>}
      {chips && (
        <div className="pv-chip-row">
          {chips.map(c => <span key={c} className="pv-chip">{c}</span>)}
        </div>
      )}
      {children}
    </div>
  );
}
