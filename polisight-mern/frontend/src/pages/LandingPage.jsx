import { useEffect, useRef } from 'react';
import './LandingPage.css';

export default function LandingPage({ onNavigate }) {
  const canvasRef = useRef(null);

  // Animated particle grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const dots = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79,142,247,0.45)';
        ctx.fill();
      });
      // Lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(79,142,247,${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className="landing">
      <canvas ref={canvasRef} className="landing-canvas" />

      {/* Nav */}
      <nav className="landing-nav animate-fadeIn">
        <div className="landing-logo">
          <div className="landing-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
              <line x1="12" y1="2" x2="12" y2="22"/>
              <line x1="2" y1="8.5" x2="22" y2="8.5"/>
              <line x1="2" y1="15.5" x2="22" y2="15.5"/>
            </svg>
          </div>
          <span>PoliSight</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>
        <div className="landing-nav-actions">
          <button className="btn btn-ghost" onClick={() => onNavigate('login')}>Sign in</button>
          <button className="btn btn-primary" onClick={() => onNavigate('signup')}>Get started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-badge animate-fadeUp">
          <span className="source-dot live" />
          Live political intelligence · 3 data sources
        </div>

        <h1 className="landing-hero-title animate-fadeUp" style={{ animationDelay: '80ms' }}>
          Political news,<br />
          <span className="landing-hero-accent">decoded in real-time</span>
        </h1>

        <p className="landing-hero-sub animate-fadeUp" style={{ animationDelay: '160ms' }}>
          PoliSight aggregates NewsData, GNews and Mastodon into a unified intelligence dashboard — with sentiment analysis, trend tracking and live timelines.
        </p>

        <div className="landing-hero-ctas animate-fadeUp" style={{ animationDelay: '240ms' }}>
          <button className="btn btn-primary landing-cta-primary" onClick={() => onNavigate('signup')}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 3a1 1 0 110 2 1 1 0 010-2zm0 4a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z"/></svg>
            Start for free
          </button>
          <button className="btn btn-ghost landing-cta-demo" onClick={() => onNavigate('login')}>
            Try demo account →
          </button>
        </div>

        <div className="landing-hero-stats animate-fadeUp" style={{ animationDelay: '320ms' }}>
          {[
            { n: '3', label: 'Live APIs' },
            { n: '∞', label: 'Articles tracked' },
            { n: '<5s', label: 'Refresh time' },
            { n: '100%', label: 'Free tier' },
          ].map(s => (
            <div key={s.label} className="landing-stat">
              <strong>{s.n}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="features">
        {[
          {
            icon: '📡',
            title: 'Multi-source News',
            desc: 'NewsData.io + GNews aggregated, de-duplicated and ranked by recency across all political categories.',
          },
          {
            icon: '🦣',
            title: 'Mastodon Social',
            desc: 'Real-time fediverse posts tagged with political topics, with engagement metrics and trending tags.',
          },
          {
            icon: '📈',
            title: 'Trends & Analysis',
            desc: 'Keyword frequency, sentiment breakdown and source analysis powered by NewsData intelligence.',
          },
          {
            icon: '🕐',
            title: 'Live Timeline',
            desc: 'Chronological event stream combining articles and social posts into a unified narrative view.',
          },
          {
            icon: '🎨',
            title: 'Themeable UI',
            desc: 'Dark / light modes with 5 accent colors. Your preferences persist across sessions.',
          },
          {
            icon: '⚡',
            title: 'Smart Caching',
            desc: 'Stale-while-revalidate strategy ensures sub-100ms UI response times with fresh data in the background.',
          },
        ].map((f, i) => (
          <div key={i} className="landing-feature-card" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="landing-feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA Banner */}
      <section className="landing-cta-banner">
        <h2>Ready to track the pulse of politics?</h2>
        <p>Free account · No credit card · Live data from day one</p>
        <button className="btn btn-primary" style={{ padding:'12px 32px', fontSize:'15px' }} onClick={() => onNavigate('signup')}>
          Create free account
        </button>
      </section>

      <footer className="landing-footer">
        <span>© 2026 PoliSight</span>
        <span>Built with NewsData.io · GNews · Mastodon</span>
      </footer>
    </div>
  );
}
