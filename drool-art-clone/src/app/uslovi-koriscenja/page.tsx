'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-8">{t('termsPage.title')}</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>
            {t('termsPage.intro')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('termsPage.section1Title')}</h2>
          <p>
            {t('termsPage.section1Text')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('termsPage.section2Title')}</h2>
          <p>
            {t('termsPage.section2Text')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('termsPage.section3Title')}</h2>
          <p>
            {t('termsPage.section3Text')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('termsPage.section4Title')}</h2>
          <p>
            {t('termsPage.section4Text')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('termsPage.section5Title')}</h2>
          <p>
            {t('termsPage.section5Text')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('termsPage.section6Title')}</h2>
          <p>
            {t('termsPage.section6Text')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('termsPage.section7Title')}</h2>
          <p>
            {t('termsPage.section7Text')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('termsPage.section8Title')}</h2>
          <p>
            {t('termsPage.section8Text')}
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('termsPage.section9Title')}</h2>
          <p>
            {t('termsPage.section9Text')}
          </p>
          <p>
            {t('termsPage.emailLabel')} {t('termsPage.emailValue')}<br />
            {t('termsPage.addressLabel')} {t('termsPage.addressValue')}
          </p>
          
          <p className="mt-8">
            {t('termsPage.lastUpdated')}
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