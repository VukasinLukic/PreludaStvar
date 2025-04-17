'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button 
      onClick={() => setLanguage(language === 'sr' ? 'en' : 'sr')}
      className="p-2 hover:text-gray-600"
      aria-label={language === 'sr' ? 'Promeni jezik na engleski' : 'Change language to Serbian'}
    >
      {language === 'sr' ? (
        <span className="flex items-center text-sm font-medium">
          <span className="font-bold">SR</span>
          <span className="mx-1 text-gray-400">|</span>
          <span className="text-gray-400">EN</span>
        </span>
      ) : (
        <span className="flex items-center text-sm font-medium">
          <span className="text-gray-400">SR</span>
          <span className="mx-1 text-gray-400">|</span>
          <span className="font-bold">EN</span>
        </span>
      )}
    </button>
  );
} 