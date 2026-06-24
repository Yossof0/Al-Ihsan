// src/context/LanguageContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSetting, setSetting } from '../db';
import { t as translate } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSetting('language', 'en').then((l) => {
      setLanguage(l);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const updateLanguage = useCallback((lang) => {
    setLanguage(lang);
    setSetting('language', lang);
  }, []);

  const t = useCallback((key) => translate(key, language), [language]);

  if (!loaded) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
