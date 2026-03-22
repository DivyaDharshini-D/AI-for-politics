import { useState, useEffect, useRef } from 'react';

const initialLogs = [
  { type: 'info', msg: 'PoliticView MERN dashboard loaded' },
  { type: 'success', msg: 'MongoDB connected' },
  { type: 'info', msg: 'Claude AI backend ready' },
  { type: 'info', msg: '12 intelligence modules active' },
];

let globalAddLog = null;
export function addLog(msg, type = 'info') {
  if (globalAddLog) globalAddLog(msg, type);
}

export default function ActivityLog() {
  const [logs, setLogs] = useState(initialLogs);
  const bodyRef = useRef(null);

  globalAddLog = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-100), { type, msg: `[${time}] ${msg}` }]);
  };

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [logs]);

  const typeClass = { info: 'log-info', warn: 'log-warn', error: 'log-err', success: 'log-success' };

  return (
    <div className="pv-log-section">
      <div className="pv-log-header">
        <span className="pv-log-title">Activity Log</span>
        <button
          className="pv-btn-ghost"
          style={{ height: 26, padding: '0 10px', fontSize: 11, background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.12)', color: 'rgba(255,255,255,.4)' }}
          onClick={() => setLogs([])}
        >
          Clear
        </button>
      </div>
      <div className="pv-log-body" ref={bodyRef}>
        {logs.map((l, i) => (
          <div key={i}>
            <span className={typeClass[l.type] || 'log-info'}>[{l.type.toUpperCase()}]</span> {l.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
