import { createContext, useContext, useState, useCallback } from 'react';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('ps-user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('ps-token') || null);

  /** Persist session to localStorage */
  const persist = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('ps-user',  JSON.stringify(userData));
    localStorage.setItem('ps-token', jwt);
  };

  /** POST /api/auth/register */
  const signup = useCallback(async (name, email, password) => {
    const res  = await fetch(`${BASE}/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    persist(data.user, data.token);
    return data.user;
  }, []);

  /** POST /api/auth/login */
  const login = useCallback(async (email, password) => {
    const res  = await fetch(`${BASE}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    persist(data.user, data.token);
    return data.user;
  }, []);

  /** Clear session */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ps-user');
    localStorage.removeItem('ps-token');
  }, []);

  /** PUT /api/auth/preferences  — syncs theme/accent to DB */
  const updatePreferences = useCallback(async (prefs) => {
    if (!token) return;
    const res  = await fetch(`${BASE}/auth/preferences`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify(prefs),
    });
    const data = await res.json();
    if (res.ok) {
      const updated = { ...user, preferences: data.user.preferences };
      setUser(updated);
      localStorage.setItem('ps-user', JSON.stringify(updated));
    }
  }, [token, user]);

  /** POST /api/auth/save-article */
  const saveArticle = useCallback(async (article) => {
    if (!token) return;
    const res  = await fetch(`${BASE}/auth/save-article`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify(article),
    });
    return res.json();
  }, [token]);

  /** DELETE /api/auth/save-article/:id */
  const unsaveArticle = useCallback(async (articleId) => {
    if (!token) return;
    const res = await fetch(`${BASE}/auth/save-article/${articleId}`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }, [token]);

  return (
    <AuthContext.Provider value={{
      user, token,
      login, signup, logout,
      updatePreferences, saveArticle, unsaveArticle,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
