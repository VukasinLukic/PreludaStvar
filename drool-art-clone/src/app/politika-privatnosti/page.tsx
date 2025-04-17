'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

export default function PrivacyPolicyPage() {
  const { t, language } = useLanguage();
  const [lists, setLists] = useState<{[key: string]: string[]}>({});
  
  // Helper function to fetch array translations
  useEffect(() => {
    // Setup list keys
    const listKeys = [
      'privacyPage.section1List',
      'privacyPage.section2List',
      'privacyPage.section3List',
      'privacyPage.section4List',
      'privacyPage.section5List',
      'privacyPage.section8List'
    ];
    
    const listData: {[key: string]: string[]} = {};
    
    // Load translations directly from JSON
    import(`@/locales/${language}.json`).then((translations) => {
      listKeys.forEach(key => {
        const parts = key.split('.');
        let data = translations;
        
        for (const part of parts) {
          if (data && data[part] !== undefined) {
            data = data[part];
          }
        }
        
        if (Array.isArray(data)) {
          listData[key] = data;
        }
      });
      
      setLists(listData);
    });
  }, [language]);
  
  return (
    <main className="min-h-screen py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-8">{t('privacyPage.title')}</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>
            {t('privacyPage.intro')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacyPage.section1Title')}</h2>
          <p>
            {t('privacyPage.section1Text')}
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            {lists['privacyPage.section1List']?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacyPage.section2Title')}</h2>
          <p>
            {t('privacyPage.section2Text')}
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            {lists['privacyPage.section2List']?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacyPage.section3Title')}</h2>
          <p>
            {t('privacyPage.section3Text')}
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            {lists['privacyPage.section3List']?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacyPage.section4Title')}</h2>
          <p>
            {t('privacyPage.section4Text')}
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            {lists['privacyPage.section4List']?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacyPage.section5Title')}</h2>
          <p>
            {t('privacyPage.section5Text')}
          </p>
          <p>
            {t('privacyPage.section5Para2')}
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            {lists['privacyPage.section5List']?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacyPage.section6Title')}</h2>
          <p>
            {t('privacyPage.section6Text')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacyPage.section7Title')}</h2>
          <p>
            {t('privacyPage.section7Text')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacyPage.section8Title')}</h2>
          <p>
            {t('privacyPage.section8Text')}
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            {lists['privacyPage.section8List']?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacyPage.section9Title')}</h2>
          <p>
            {t('privacyPage.section9Text')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacyPage.section10Title')}</h2>
          <p>
            {t('privacyPage.section10Text')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacyPage.section11Title')}</h2>
          <p>
            {t('privacyPage.section11Text')}
          </p>
          <p>
            {t('privacyPage.emailLabel')} {t('privacyPage.emailValue')}<br />
            {t('privacyPage.addressLabel')} {t('privacyPage.addressValue')}
          </p>
          
          <p className="mt-8">
            {t('privacyPage.lastUpdated')}
          </p>
          
          <div className="mt-12">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              &larr; {t('common.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 