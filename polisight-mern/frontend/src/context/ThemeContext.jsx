import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme,  setTheme]  = useState(() => localStorage.getItem('ps-theme')  || 'dark');
  const [accent, setAccent] = useState(() => localStorage.getItem('ps-accent') || 'blue');

  // updatePrefs callback is injected by App after AuthContext is ready
  const [updatePrefs, setUpdatePrefs] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ps-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('ps-accent', accent);
  }, [accent]);

  const toggleTheme = () => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      updatePrefs?.({ theme: next });
      return next;
    });
  };

  const changeAccent = (a) => {
    setAccent(a);
    updatePrefs?.({ accent: a });
  };

  // Called from App once auth context is available
  const registerUpdatePrefs = (fn) => setUpdatePrefs(() => fn);

  return (
    <ThemeContext.Provider value={{ theme, accent, toggleTheme, setAccent: changeAccent, registerUpdatePrefs }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
