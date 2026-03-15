import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth }  from '../context/AuthContext';
import { apiFetch } from '../hooks/useApi';
import './SettingsPage.css';

const ACCENTS = [
  { id:'blue',   label:'Ocean Blue',    color:'#4f8ef7' },
  { id:'purple', label:'Cosmic Purple', color:'#a78bfa' },
  { id:'green',  label:'Emerald',       color:'#34d399' },
  { id:'amber',  label:'Amber',         color:'#fbbf24' },
  { id:'red',    label:'Crimson',       color:'#f87171' },
];

function Section({ title, desc, children }) {
  return (
    <div className="settings-section card">
      <div className="settings-section-header">
        <h2 className="settings-section-title">{title}</h2>
        {desc && <p className="settings-section-desc">{desc}</p>}
      </div>
      <div className="settings-section-body">{children}</div>
    </div>
  );
}

function Row({ label, desc, children }) {
  return (
    <div className="settings-row">
      <div className="settings-row-info">
        <span className="settings-row-label">{label}</span>
        {desc && <span className="settings-row-desc">{desc}</span>}
      </div>
      <div className="settings-row-control">{children}</div>
    </div>
  );
}

// ── Profile Editor ────────────────────────────────────────────────────────────
function ProfileEditor({ user }) {
  const [editing,  setEditing]  = useState(false);
  const [name,     setName]     = useState(user?.name || '');
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState('');
  const { token }               = useAuth();

  const handleSave = async () => {
    if (!name.trim() || name.trim().length < 2) { setError('Name must be at least 2 characters'); return; }
    setSaving(true); setError('');
    try {
      await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: name.trim() }),
      });
      setSaved(true); setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-editor">
      {/* Avatar */}
      <div className="profile-avatar-section">
        <div className="profile-avatar-large">
          {user?.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || 'PS'}
        </div>
        <div className="profile-avatar-info">
          <span className="profile-name">{user?.name}</span>
          <span className="profile-email">{user?.email}</span>
          <span className={`badge ${user?.plan==='Pro'?'badge-blue':'badge-muted'}`}>{user?.plan||'Free'}</span>
        </div>
      </div>

      {/* Edit form */}
      {editing ? (
        <div className="profile-edit-form">
          <div className="profile-field">
            <label>Display Name</label>
            <input
              className="input"
              value={name}
              onChange={e=>setName(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&handleSave()}
              placeholder="Your name"
              autoFocus
            />
          </div>
          {error && <div className="profile-error">{error}</div>}
          <div className="profile-edit-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button className="btn btn-ghost" onClick={()=>{ setEditing(false); setName(user?.name||''); setError(''); }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-view">
          <Row label="Full name" desc="Your display name across PoliSight">
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span className="settings-value">{user?.name}</span>
              <button className="btn btn-ghost settings-edit-btn" onClick={()=>setEditing(true)}>
                <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                </svg>
                Edit
              </button>
            </div>
          </Row>
          <Row label="Email" desc="Your sign-in email address">
            <span className="settings-value">{user?.email}</span>
          </Row>
          <Row label="Plan">
            <span className={`badge ${user?.plan==='Pro'?'badge-blue':'badge-muted'}`}>{user?.plan||'Free'}</span>
          </Row>
          <Row label="Member since">
            <span className="settings-value">
              {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) : '—'}
            </span>
          </Row>
          <Row label="User ID" desc="MongoDB document ID">
            <span className="settings-value settings-mono">{user?.id?.slice(-10) || '—'}</span>
          </Row>
          {saved && <div className="profile-success">✓ Profile updated successfully</div>}
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { theme, accent, toggleTheme, setAccent } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="settings-page animate-fadeUp">

      {/* Account / Profile */}
      <Section title="Account" desc="Manage your profile and session">
        <ProfileEditor user={user}/>
        <div className="settings-divider"/>
        <Row label="Sign out" desc="Log out of this session on this device">
          <button className="btn btn-ghost settings-logout-btn" onClick={logout}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
            </svg>
            Sign out
          </button>
        </Row>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" desc="Customize how PoliSight looks — synced to your account">
        <Row label="Color theme" desc="Dark mode is easier on the eyes for political analysis late at night">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            <div className={`theme-toggle-pill ${theme}`}>
              <div className="theme-toggle-knob">
                {theme === 'dark'
                  ? <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
                  : <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/></svg>
                }
              </div>
              <span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
            </div>
          </button>
        </Row>
        <Row label="Accent color" desc="Highlight color used throughout the interface">
          <div className="accent-picker">
            {ACCENTS.map(a => (
              <button key={a.id}
                className={`accent-swatch${accent===a.id?' active':''}`}
                style={{ '--swatch-color':a.color }}
                title={a.label}
                onClick={() => setAccent(a.id)}
              >
                {accent === a.id && (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </Row>
      </Section>

      {/* Data Sources */}
      <Section title="Data Sources" desc="Live APIs powering your political intelligence">
        {[
          { name:'NewsData.io', desc:'Political news with sentiment, keywords, categories', badge:'badge-green',  dot:true },
          { name:'GNews',       desc:'Top headlines from major global news outlets',         badge:'badge-green',  dot:true },
          { name:'Mastodon',    desc:'Real-time fediverse posts and trending political tags', badge:'badge-purple', dot:true },
          { name:'MongoDB Atlas',desc:'User accounts, preferences, saved articles storage',  badge:'badge-green',  dot:true },
        ].map(src => (
          <Row key={src.name} label={src.name} desc={src.desc}>
            <span className={`badge ${src.badge}`}>
              {src.dot && <span className="source-dot live"/>} live
            </span>
          </Row>
        ))}
      </Section>

      {/* Stack info */}
      <Section title="Tech Stack">
        {[
          { label:'Database',  value:'MongoDB Atlas + Mongoose' },
          { label:'Auth',      value:'JWT (7d) + bcryptjs' },
          { label:'Backend',   value:'Node.js + Express MVC' },
          { label:'Frontend',  value:'React 18 + Vite' },
          { label:'Caching',   value:'node-cache (server) + SWR (client)' },
          { label:'Countries', value:'22 countries · 400+ states · 120+ parties' },
        ].map(r=>(
          <Row key={r.label} label={r.label}>
            <span className="settings-value">{r.value}</span>
          </Row>
        ))}
      </Section>

    </div>
  );
}
