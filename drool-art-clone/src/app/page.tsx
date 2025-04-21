'use client';

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import Faq from '@/components/Faq';
import { useLanguage } from "@/contexts/LanguageContext";
import { ensureAltText } from '@/lib/utils';
import { fetchHomepageProducts } from '@/lib/firebaseFunctions';

type HomepageProduct = {
  id: string;
  name: { sr: string; en: string };
  artist: { sr: string; en: string };
  price: number;
  imageURL: string;
  slug: string;
};

// ProductCard component
const ProductCard = ({ product }: { product: HomepageProduct }) => {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'sr';
  
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={product.imageURL || '/assets/images/placeholder.png'}
            alt={product.name[lang] || 'Product Image'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.name[lang]}</h3>
          <p className="text-sm text-gray-600">{product.artist[lang]}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-primary-700 font-bold">{product.price} RSD</span>
            <span className="text-xs text-gray-500">+ shipping</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default async function Home() {
  const { bestSellers, trending, latest } = await fetchHomepageProducts();
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/hero.jpg"
            alt="Preluda Stvar Hero"
            fill
            priority
            className="object-cover opacity-70"
          />
        </div>
        <div className="z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
            Preluda Stvar
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 animate-fade-in-up animation-delay-300">
            Jedinstveni printovi koji oživljavaju kultnu muziku na vašim zidovima
          </p>
          <div className="animate-fade-in-up animation-delay-600">
            <Link
              href="/products"
              className="px-8 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition duration-300"
            >
              Pogledaj sve proizvode
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('homepage.bestsellers')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-6xl font-bold mb-8 text-center">{t('homepage.trending')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Additions */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">{t('homepage.latestArrivals')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {latest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Faq data={{
        titleKey: "faq.title",
        subtitleKey: "faq.subtitle",
        faqList: [
          {
            questionKey: "faq.question1",
            answerKey: "faq.answer1"
          },
          {
            questionKey: "faq.question2",
            answerKey: "faq.answer2"
          },
          {
            questionKey: "faq.question3",
            answerKey: "faq.answer3"
          },
          {
            questionKey: "faq.question4",
            answerKey: "faq.answer4"
          },
          {
            questionKey: "faq.question5",
            answerKey: "faq.answer5"
          },
          {
            questionKey: "faq.question6",
            answerKey: "faq.answer6"
          }
        ],
        footerTextKey: "faq.footerText",
        footerButtonTitleKey: "common.contactUs",
        footerLink: "/kontakt"
      }} />
    </main>
  );
}

// Note: The animations (animate-fade-in-up, animation-delay-300, animation-delay-600) 
// need to be defined in the global CSS or Tailwind config
