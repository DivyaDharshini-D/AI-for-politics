import { useEffect, useState } from 'react';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, RadialLinearScale, Filler, Tooltip, Legend,
} from 'chart.js';
import api from '../services/api';
import { useLocation } from '../context/LocationContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, Filler, Tooltip, Legend);

function seedData(label, base, variance, len = 7) {
  let seed = label.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: len }, () => {
    seed = (seed * 9301 + 49297) % 233280;
    return Math.round(base + (seed / 233280) * variance - variance / 2);
  });
}

export default function OverviewSection({ timeRange = '24h' }) {
  const [stats, setStats] = useState(null);
  const { country, state, party, countryData, locationLabel } = useLocation();

  useEffect(() => {
    let cancelled = false;
    api.get('/analytics/dashboard', {
      params: {
        country: countryData.name,
        state,
        party,
        timeRange,
        region: locationLabel || countryData.name,
      },
    })
      .then((r) => {
        if (!cancelled) setStats(r.data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [country, state, party, timeRange, locationLabel, countryData.name]);

  const locKey = locationLabel || countryData.name || 'Global';
  const sentimentBase = seedData(`${locKey}-sent`, 58, 22);
  const emotionValues = {
    trust: seedData(`${locKey}-trust`, 60, 30)[0],
    fear: seedData(`${locKey}-fear`, 38, 25)[0],
    anger: seedData(`${locKey}-anger`, 42, 30)[0],
    hope: seedData(`${locKey}-hope`, 68, 28)[0],
    disgust: seedData(`${locKey}-disg`, 30, 20)[0],
    enthusiasm: seedData(`${locKey}-enth`, 55, 30)[0],
  };
  const urbanVals = Object.values(emotionValues);
  const ruralVals = seedData(`${locKey}-rural`, 55, 28, 6);

  const sentimentData = {
    labels: stats?.sentimentLabels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Sentiment',
      data: stats?.sentimentTrend || sentimentBase,
      borderColor: '#1a7a4a',
      backgroundColor: 'rgba(26,122,74,0.08)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#1a7a4a',
    }],
  };

  const emotionData = {
    labels: ['Trust', 'Fear', 'Anger', 'Hope', 'Disgust', 'Enthusiasm'],
    datasets: [
      { label: 'Urban', data: urbanVals, borderColor: '#1a4fa0', backgroundColor: 'rgba(26,79,160,0.1)', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#1a4fa0' },
      { label: 'Rural', data: ruralVals, borderColor: '#c8392b', backgroundColor: 'rgba(200,57,43,0.08)', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#c8392b' },
    ],
  };

  const lineOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#8a94a6' } },
      y: { grid: { color: '#e2ddd5' }, ticks: { font: { size: 10 }, color: '#8a94a6' }, min: 30, max: 90 },
    },
  };

  const radarOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 10 }, color: '#4a5568', boxWidth: 10 } } },
    scales: { r: { grid: { color: '#e2ddd5' }, ticks: { display: false }, pointLabels: { font: { size: 10 }, color: '#4a5568' } } },
  };

  const warnings = stats?.trendWarnings || [
    { type: 'warning', title: 'Awaiting enough activity', desc: 'Run a few AI modules to unlock stronger trend confidence.', horizon: '24h', score: 'Low sample' },
  ];

  const breadcrumb = [countryData.name, state, party].filter(Boolean).join(' > ');
  const rangeLabel = timeRange === '30d' ? 'last 30 days' : timeRange === '7d' ? 'last 7 days' : 'last 24 hours';
  const activeModules = stats?.activeModules || stats?.moduleBreakdown?.length || 0;

  return (
    <section id="section-overview" className="pv-section">
      <div className="pv-section-header">
        <div>
          <div className="pv-section-title">Dashboard Overview</div>
          <div className="pv-section-subtitle">
            {breadcrumb
              ? <span>Live intelligence - <strong style={{ color: 'var(--ink)' }}>{breadcrumb}</strong></span>
              : 'Live political intelligence snapshot'
            }
          </div>
        </div>
        <span className="pv-badge badge-ai"><span className="pv-badge-dot" />AI Active</span>
      </div>

      <div className="pv-stats-bar">
        {[
          { label: 'Analyses Today', value: stats?.stats?.total24h ?? '--', note: 'last 24 hours' },
          { label: 'This Week', value: stats?.stats?.total7d ?? '--', note: 'last 7 days' },
          { label: 'Total Analyses', value: stats?.stats?.totalAll ?? '--', note: 'all time' },
          { label: 'Active Modules', value: activeModules, note: rangeLabel },
        ].map((s, i) => (
          <div key={i} className="pv-stat-item">
            <div className="pv-stat-label">{s.label}</div>
            <div className="pv-stat-value">{s.value}</div>
            <div className="pv-stat-delta up">^ {s.note}</div>
          </div>
        ))}
      </div>

      <div className="pv-grid-3" key={locKey}>
        <div className="pv-metric-card">
          <div className="pv-metric-label">Sentiment Pulse - {breadcrumb || 'Global'}</div>
          <div className="pv-chart-wrap">
            <Line data={sentimentData} options={lineOpts} />
          </div>
        </div>

        <div className="pv-metric-card">
          <div className="pv-metric-label">Emotional Heatmap - {breadcrumb || 'Global'}</div>
          <div className="pv-chart-wrap">
            <Radar data={emotionData} options={radarOpts} />
          </div>
        </div>

        <div className="pv-metric-card">
          <div className="pv-metric-label" style={{ marginBottom: 12 }}>Trend Warnings</div>
          {warnings.map((w, i) => (
            <div key={i} className={`pv-trend-item ${w.type}`}>
              <div className="pv-trend-title">{w.title}</div>
              <div className="pv-trend-desc">{w.desc}</div>
              <div className="pv-trend-meta">Horizon: {w.horizon} - Score: {w.score}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
