import { useState, useCallback, useEffect } from 'react';
import { ThemeProvider, useTheme }   from './context/ThemeContext';
import { AuthProvider, useAuth }     from './context/AuthContext';
import { PoliticalProvider }         from './context/PoliticalContext';
import LandingPage                   from './pages/LandingPage';
import { LoginPage, SignupPage }     from './pages/AuthPage';
import Sidebar                       from './components/Sidebar';
import Topbar                        from './components/Topbar';
import Dashboard                     from './pages/Dashboard';
import NewsPage                      from './pages/NewsPage';
import TrendsPage                    from './pages/TrendsPage';
import TimelinePage                  from './pages/TimelinePage';
import SettingsPage                  from './pages/SettingsPage';
import './App.css';

// Mastodon removed — 4 pages only
const PAGES = {
  dashboard: Dashboard,
  news:      NewsPage,
  trends:    TrendsPage,
  timeline:  TimelinePage,
  settings:  SettingsPage,
};

function ThemeAuthBridge() {
  const { updatePreferences } = useAuth();
  const { registerUpdatePrefs } = useTheme();
  useEffect(() => { registerUpdatePrefs(updatePreferences); }, [updatePreferences, registerUpdatePrefs]);
  return null;
}

function DashboardShell() {
  const { logout } = useAuth();
  const [activePage,    setActivePage]    = useState('dashboard');
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [refreshing,    setRefreshing]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');

  const handleRefresh = useCallback(() => {
    setRefreshing(true); setRefreshSignal(s => s+1);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const handleSearch = useCallback((q) => {
    setSearchQuery(q); if (q) setActivePage('news');
  }, []);

  const PageComponent = PAGES[activePage] || Dashboard;

  return (
    <div className="app-shell">
      <Sidebar active={activePage} onNav={setActivePage}/>
      <div className="main-content">
        <Topbar page={activePage} onRefresh={handleRefresh} loading={refreshing} onSearch={handleSearch} onLogout={logout}/>
        <main className="page-body">
          <PageComponent onRefreshSignal={refreshSignal} searchQuery={searchQuery}/>
        </main>
      </div>
    </div>
  );
}

function AppRouter() {
  const { user } = useAuth();
  const [route, setRoute] = useState(() => user ? 'dashboard' : 'landing');
  const navigate = useCallback((to) => setRoute(to), []);
  const handleAuthSuccess = useCallback(() => setRoute('dashboard'), []);
  if (!user && route === 'dashboard') { setRoute('landing'); return null; }
  if (route === 'landing') return <LandingPage onNavigate={navigate}/>;
  if (route === 'login')   return <LoginPage   onNavigate={navigate} onSuccess={handleAuthSuccess}/>;
  if (route === 'signup')  return <SignupPage  onNavigate={navigate} onSuccess={handleAuthSuccess}/>;
  return <DashboardShell/>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PoliticalProvider>
          <ThemeAuthBridge/>
          <AppRouter/>
        </PoliticalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
