const NAV = [
  { group: 'Overview', items: [{ href: '#section-overview', icon: '◈', label: 'Dashboard' }] },
  {
    group: 'Intelligence', items: [
      { href: '#section-core', icon: '⬡', label: 'Core Intelligence' },
      { href: '#section-influence', icon: '⊘', label: 'Influence Detection' },
      { href: '#section-public', icon: '◎', label: 'Public Insight' },
    ]
  },
  {
    group: 'Strategy', items: [
      { href: '#section-strategy', icon: '◆', label: 'Strategy Intel' },
      { href: '#section-content', icon: '✦', label: 'Content Engine' },
      { href: '#section-simulation', icon: '⟳', label: 'Simulation' },
    ]
  },
  {
    group: 'Field', items: [
      { href: '#section-geo', icon: '◉', label: 'Geo Intelligence' },
      { href: '#section-integration', icon: '⊞', label: 'Integration' },
      { href: '#section-news', icon: '▣', label: 'News Feed' },
      { href: '#section-social', icon: '❋', label: 'Social Feed' },
    ]
  },
  {
    group: 'Learning', items: [
      { href: '#section-performance', icon: '▲', label: 'Performance' },
      { href: '#section-innovation', icon: '◇', label: 'Innovation' },
      { href: '#section-memory', icon: '○', label: 'Memory' },
      { href: '#section-strategist', icon: '★', label: 'Chief Strategist' },
    ]
  },
];

export default function Sidebar({ activeSection }) {
  return (
    <aside className="pv-sidebar">
      {NAV.map(({ group, items }) => (
        <div key={group}>
          <div className="pv-nav-group-label">{group}</div>
          {items.map(({ href, icon, label }) => (
            <a
              key={href}
              href={href}
              className={`pv-nav-item${activeSection === href.slice(1) ? ' active' : ''}`}
            >
              <span className="pv-nav-icon">{icon}</span>
              {label}
            </a>
          ))}
        </div>
      ))}
    </aside>
  );
}
