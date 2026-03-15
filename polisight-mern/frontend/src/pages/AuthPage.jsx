import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

function AuthForm({ mode, onNavigate, onSuccess }) {
  const { login, signup } = useAuth();
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, pass);
      } else {
        if (name.trim().length < 2) throw new Error('Name must be at least 2 characters');
        if (pass.length < 8)        throw new Error('Password must be at least 8 characters');
        await signup(name.trim(), email, pass);
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <div className="auth-deco">
        <div className="auth-deco-grid" />
        <div className="auth-deco-content">
          <div className="auth-deco-logo">
            <div className="auth-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
                <line x1="12" y1="2"  x2="12" y2="22"/>
                <line x1="2"  y1="8.5" x2="22" y2="8.5"/>
                <line x1="2"  y1="15.5" x2="22" y2="15.5"/>
              </svg>
            </div>
            <span>PoliSight</span>
          </div>
          <h2>Track politics.<br />Stay ahead.</h2>
          <p>Real-time news intelligence from 3 live data sources, powered by MongoDB.</p>
          <div className="auth-deco-chips">
            {['NewsData.io', 'GNews', 'Mastodon', 'MongoDB', 'JWT Auth'].map(c => (
              <span key={c} className="auth-chip">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <button className="auth-back-btn btn btn-ghost" onClick={() => onNavigate('landing')}>
          ← Back
        </button>

        <div className="auth-form-inner animate-scaleIn">
          <div className="auth-form-header">
            <h1>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
            <p>{mode === 'login' ? 'Sign in to your PoliSight account' : 'Start tracking politics for free'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <div className="auth-field">
                <label>Full name</label>
                <input className="input" type="text" placeholder="Alex Johnson"
                  value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            <div className="auth-field">
              <label>Email address</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input className="input" type="password"
                placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                value={pass} onChange={e => setPass(e.target.value)} required />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading && <span className="auth-spinner" />}
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login'
              ? <>No account? <button onClick={() => onNavigate('signup')}>Sign up free</button></>
              : <>Already have an account? <button onClick={() => onNavigate('login')}>Sign in</button></>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginPage({ onNavigate, onSuccess }) {
  return <AuthForm mode="login"   onNavigate={onNavigate} onSuccess={onSuccess} />;
}
export function SignupPage({ onNavigate, onSuccess }) {
  return <AuthForm mode="signup"  onNavigate={onNavigate} onSuccess={onSuccess} />;
}
