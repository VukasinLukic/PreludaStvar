'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslations from '@/locales/en.json';
import srTranslations from '@/locales/sr.json';

// Available languages
export type Language = 'en' | 'sr';
export const DEFAULT_LANGUAGE: Language = 'sr';

// Initialize i18next
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: enTranslations },
        sr: { translation: srTranslations }
      },
      lng: DEFAULT_LANGUAGE,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      },
      react: {
        useSuspense: false
      }
    });
}

// Context type definition
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key) => key,
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Get initial language from localStorage if available, otherwise use default
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      return savedLanguage || DEFAULT_LANGUAGE;
    }
    return DEFAULT_LANGUAGE;
  });

  // Set language handler that updates both state and i18n
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }, []);

  // Initialize i18n language
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  // Translation function
  const t = useCallback((key: string, options?: any): string => {
    const translation = i18n.t(key, options);
    // Ensure we always return a string
    return typeof translation === 'string' ? translation : key;
  }, []);

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider; 