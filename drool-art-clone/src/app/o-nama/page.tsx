'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { ensureAltText } from '@/lib/utils';

export default function AboutUsPage() {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen pt-[100px]">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] w-full">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <Image 
          src="/assets/images/ads/REKLAMAAA1.png" 
          alt={ensureAltText("PreludaStvar Hero", "About page hero image")} 
          fill 
          className="object-cover"
          priority
        />
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">{t('aboutPage.heroTitle')}</h1>
          <p className="text-xl md:text-2xl max-w-3xl text-center">
            {t('aboutPage.heroDesc')}
          </p>
        </div>
      </section>

      {/* DROOL-inspired text section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-10 flex justify-center">
            <Image 
              src="/assets/images/logos/prepre.png" 
              alt={ensureAltText("PreludaStvar Logo", "Company logo")} 
              width={250}
              height={250}
              className="object-contain"
            />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-12">
            {t('aboutPage.mainDesc')}
          </h2>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-16 md:py-24 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t('aboutPage.processTitle')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">1</div>
              <h3 className="text-xl font-bold mb-4">{t('aboutPage.process1Title')}</h3>
              <p className="text-gray-600">
                {t('aboutPage.process1Desc')}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">2</div>
              <h3 className="text-xl font-bold mb-4">{t('aboutPage.process2Title')}</h3>
              <p className="text-gray-600">
                {t('aboutPage.process2Desc')}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">3</div>
              <h3 className="text-xl font-bold mb-4">{t('aboutPage.process3Title')}</h3>
              <p className="text-gray-600">
                {t('aboutPage.process3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-black text-white px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('aboutPage.ctaTitle')}</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            {t('aboutPage.ctaDesc')}
          </p>
          <Link href="/posteri" className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition duration-300">
            {t('aboutPage.ctaButton')}
          </Link>
        </div>
      </section>
    </main>
  );
} 