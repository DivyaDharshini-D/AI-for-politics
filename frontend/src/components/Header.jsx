import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, COUNTRIES } from '../context/LocationContext';

export default function Header({ timeRange, setTimeRange, onRefresh }) {
  const { user, logout, updateProfile } = useAuth();
  const { country, state, party, countryData, setCountry, setState, setParty } = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.name || '');
  const [regionDraft, setRegionDraft] = useState(user?.region || countryData.name || 'global');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const panelRef = useRef(null);

  const initials = useMemo(() => {
    const pieces = (user?.name || 'User').trim().split(/\s+/).filter(Boolean);
    return pieces.slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('') || 'U';
  }, [user?.name]);

  useEffect(() => {
    setNameDraft(user?.name || '');
    setRegionDraft(user?.region || countryData.name || 'global');
  }, [user?.name, user?.region, countryData.name]);

  useEffect(() => {
    const onClickAway = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setProfileOpen(false);
        setProfileError('');
      }
    };

    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  const handleProfileSave = async () => {
    if (!nameDraft.trim()) {
      setProfileError('Name is required.');
      return;
    }

    setSavingProfile(true);
    setProfileError('');

    try {
      await updateProfile({
        name: nameDraft.trim(),
        region: (regionDraft || countryData.name || 'global').trim(),
      });
      setProfileOpen(false);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <header className="pv-header">
      <a className="pv-logo" href="#">
        <div className="pv-logo-mark">PV</div>
        <div>
          <div className="pv-logo-text">PoliticView</div>
          <div className="pv-logo-sub">Intelligence Dashboard</div>
        </div>
      </a>

      <div className="pv-header-controls">
        <span className="pv-live-dot">Live</span>

        <select className="pv-select" value={country} onChange={(e) => setCountry(e.target.value)} style={{ maxWidth: 164 }}>
          {Object.entries(COUNTRIES).map(([key, c]) => (
            <option key={key} value={key}>{c.flag} {c.name}</option>
          ))}
        </select>

        {countryData.states.length > 0 && (
          <select className="pv-select" value={state} onChange={(e) => setState(e.target.value)} style={{ maxWidth: 164 }}>
            <option value="">All States</option>
            {countryData.states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}

        {countryData.parties.length > 0 && (
          <select className="pv-select" value={party} onChange={(e) => setParty(e.target.value)} style={{ maxWidth: 164 }}>
            <option value="">All Parties</option>
            {countryData.parties.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        )}

        <select className="pv-select" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="24h">Last 24h</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>

        <button className="pv-btn-header pv-btn-header--neutral" onClick={onRefresh}>Refresh</button>

        <div className="pv-user-wrap" ref={panelRef}>
          <button
            className="pv-user-chip"
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            aria-expanded={profileOpen}
            aria-label="Profile settings"
          >
            <span className="pv-user-avatar">{initials}</span>
            <span className="pv-user-name">{user?.name || 'User'}</span>
          </button>

          {profileOpen && (
            <div className="pv-profile-panel">
              <div className="pv-profile-title">Profile Settings</div>
              <div className="pv-input-group">
                <label className="pv-input-label">Display name</label>
                <input
                  className="pv-input"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="pv-input-group">
                <label className="pv-input-label">Default region</label>
                <input
                  className="pv-input"
                  value={regionDraft}
                  onChange={(e) => setRegionDraft(e.target.value)}
                  placeholder={countryData.name}
                />
              </div>
              {profileError && <div className="pv-profile-error">{profileError}</div>}
              <div className="pv-profile-actions">
                <button
                  className="pv-btn-header pv-btn-header--neutral"
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    setProfileError('');
                  }}
                >
                  Cancel
                </button>
                <button className="pv-btn-header pv-btn-header--primary" type="button" onClick={handleProfileSave} disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="pv-btn-header pv-btn-header--danger" onClick={logout}>Log out</button>
      </div>
    </header>
  );
}
