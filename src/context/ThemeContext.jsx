// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSetting, setSetting } from '../db';

const ThemeContext = createContext(null);

// 'auto' follows time-of-day (06:00–18:00 = light, else dark).
// 'light' / 'dark' are manual overrides.
function resolveAutoTheme() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('auto');       // 'auto' | 'light' | 'dark'
  const [resolved, setResolved] = useState(resolveAutoTheme());
  const [loaded, setLoaded] = useState(false);

  // Load saved preference on mount.
  useEffect(() => {
    getSetting('themeMode', 'auto').then((saved) => {
      setMode(saved);
      setLoaded(true);
    });
  }, []);

  // Recompute resolved theme whenever mode changes, and keep auto mode
  // ticking over time (checked every 10 min — cheap, no need for a timer per-second).
  useEffect(() => {
    const apply = () => setResolved(mode === 'auto' ? resolveAutoTheme() : mode);
    apply();
    if (mode === 'auto') {
      const interval = setInterval(apply, 10 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  // Reflect resolved theme onto <html> for Tailwind's `dark:` variant.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.setAttribute('data-theme', resolved);
  }, [resolved]);

  const setThemeMode = useCallback((next) => {
    setMode(next);
    setSetting('themeMode', next);
  }, []);

  if (!loaded) return null; // avoid a flash of the wrong theme

  return (
    <ThemeContext.Provider value={{ mode, resolved, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
