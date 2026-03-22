import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ActivityLog, { addLog } from './components/ActivityLog';

import AuthPage from './pages/AuthPage';
import OverviewSection from './pages/OverviewSection';
import CoreIntelligenceSection from './pages/CoreIntelligenceSection';
import { InfluenceDetectionSection, PublicInsightSection, StrategySection } from './pages/IntelligenceSections';
import { ContentEngineSection, SimulationSection, GeoSection } from './pages/StrategySections';
import NewsFeedSection from './pages/NewsFeedSection';
import SocialFeedSection from './pages/SocialFeedSection';
import { IntegrationSection, PerformanceSection, InnovationSection, MemorySection } from './pages/SupportSections';
import ChiefStrategistSection from './pages/ChiefStrategistSection';

function Dashboard() {
  const [timeRange, setTimeRange] = useState('24h');
  const [activeSection, setActiveSection] = useState('section-overview');

  useEffect(() => {
    const ids = [
      'section-overview','section-core','section-influence','section-public',
      'section-strategy','section-content','section-simulation','section-geo',
      'section-integration','section-news','section-social','section-performance',
      'section-innovation','section-memory','section-strategist',
    ];
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.25, rootMargin: '-60px 0px -50% 0px' }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Header
        timeRange={timeRange}
        setTimeRange={t => { setTimeRange(t); addLog(`Time range: ${t}`); }}
        onRefresh={() => { addLog('Dashboard refreshed', 'info'); window.location.reload(); }}
      />
      <div className="pv-layout">
        <Sidebar activeSection={activeSection} />
        <main className="pv-main">
          <OverviewSection timeRange={timeRange} />
          <CoreIntelligenceSection />
          <InfluenceDetectionSection />
          <PublicInsightSection />
          <StrategySection />
          <ContentEngineSection />
          <SimulationSection />
          <GeoSection />
          <IntegrationSection />
          <NewsFeedSection />
          <SocialFeedSection />
          <PerformanceSection />
          <InnovationSection />
          <MemorySection />
          <ChiefStrategistSection />
        </main>
      </div>
      <footer style={{ marginLeft: 'var(--sidebar-w)', padding: '0 32px 32px' }}>
        <ActivityLog />
      </footer>
    </>
  );
}

function AppInner() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)' }}>
      <div style={{ textAlign:'center' }}>
        <div className="spinner" style={{ width:24, height:24, borderWidth:3 }} />
        <div style={{ marginTop:12, color:'var(--ink-muted)', fontSize:13 }}>Loading PoliticView...</div>
      </div>
    </div>
  );
  return user ? <Dashboard /> : <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <AppInner />
      </LocationProvider>
    </AuthProvider>
  );
}
