'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Import language files - these will be imported dynamically in the browser
import srTranslations from '@/locales/sr.json';
import enTranslations from '@/locales/en.json';

// Fix useState null error by ensuring proper React behavior in server components
if (typeof React.useState !== 'function') {
  throw new Error('LanguageContext must be used within a ClientProvider component');
}

type Language = 'sr' | 'en';
type TranslationKey = string;

const translations = {
  sr: srTranslations,
  en: enTranslations
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const defaultContext: LanguageContextType = {
  language: 'sr',
  setLanguage: () => {},
  t: () => '',
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('sr');
  
  // Save language preference to localStorage
  useEffect(() => {
    // Try to get the language preference from localStorage
    const storedLanguage = localStorage.getItem('language') as Language | null;
    if (storedLanguage && (storedLanguage === 'sr' || storedLanguage === 'en')) {
      setLanguage(storedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function - handles nested keys with dot notation
  const t = (key: TranslationKey): string => {
    // Safety check for undefined or null keys
    if (key === undefined || key === null) {
      console.warn('Translation key is undefined or null');
      return '';
    }
    
    const keys = key.split('.');
    let result: any = translations[language];
    
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        console.warn(`Translation missing for key: ${key} in ${language}`);
        return key;
      }
    }
    
    return typeof result === 'string' ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
} 