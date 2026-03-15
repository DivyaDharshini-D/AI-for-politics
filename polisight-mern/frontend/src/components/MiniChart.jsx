import './MiniChart.css';

const COLORS = ['#4f8ef7','#a78bfa','#34d399','#fbbf24','#f87171','#22d3ee','#818cf8','#fb923c'];

export default function MiniChart({ data = [] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.count));
  return (
    <div className="mini-chart">
      {data.map((d, i) => (
        <div key={d.word} className="mini-chart-row animate-fadeUp" style={{ animationDelay: `${i * 40}ms` }}>
          <span className="mini-chart-label">{d.word}</span>
          <div className="mini-chart-track">
            <div
              className="mini-chart-bar"
              style={{
                width: `${(d.count / max) * 100}%`,
                background: COLORS[i % COLORS.length],
                animationDelay: `${i * 40 + 100}ms`,
              }}
            />
          </div>
          <span className="mini-chart-val">{d.count}</span>
        </div>
      ))}
    </div>
  );
}
