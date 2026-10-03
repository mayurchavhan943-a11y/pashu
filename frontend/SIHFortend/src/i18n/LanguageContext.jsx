import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import enTranslations from './locales/en.json';
import mrTranslations from './locales/mr.json';
import hiTranslations from './locales/hi.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', speechCode: 'en-IN', name: 'English', nativeName: 'English' },
  { code: 'mr', speechCode: 'mr-IN', name: 'मराठी', nativeName: 'मराठी (Marathi)' },
  { code: 'hi', speechCode: 'hi-IN', name: 'हिन्दी', nativeName: 'हिन्दी (Hindi)' },
];

const TRANSLATION_MAP = {
  en: enTranslations,
  mr: mrTranslations,
  hi: hiTranslations,
};

const STORAGE_KEY = 'pashucare_language';

const LanguageContext = createContext(null);

function resolveDottedKey(obj, path) {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'en' || saved === 'mr' || saved === 'hi')) {
        return saved;
      }
    }
    return 'en';
  });

  const changeLanguage = useCallback((newLang) => {
    if (newLang === 'en' || newLang === 'mr' || newLang === 'hi') {
      setLanguageState(newLang);
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch (err) {
        console.error('Failed to save language in localStorage', err);
      }
    }
  }, []);

  const speechLanguage = useMemo(() => {
    switch (language) {
      case 'mr': return 'mr-IN';
      case 'hi': return 'hi-IN';
      case 'en':
      default:
        return 'en-IN';
    }
  }, [language]);

  const currentTranslations = useMemo(() => {
    return TRANSLATION_MAP[language] || enTranslations;
  }, [language]);

  const t = useCallback((key, fallback = '') => {
    if (!key) return fallback;

    // 1. Try current language
    const currentVal = resolveDottedKey(currentTranslations, key);
    if (currentVal !== undefined) return currentVal;

    // 2. Fallback to English
    if (language !== 'en') {
      const englishVal = resolveDottedKey(enTranslations, key);
      if (englishVal !== undefined) return englishVal;
    }

    // 3. Fallback to provided default text or key itself
    return fallback || key;
  }, [currentTranslations, language]);

  const contextValue = useMemo(() => ({
    language,
    speechLanguage,
    changeLanguage,
    t,
    languages: SUPPORTED_LANGUAGES,
    currentLanguageMeta: SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0]
  }), [language, speechLanguage, changeLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslation() {
  return useLanguage();
}
