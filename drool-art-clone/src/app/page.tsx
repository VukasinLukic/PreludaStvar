'use client';

import Image from "next/image";
import Link from "next/link";
import Faq from '@/components/Faq';
import { useLanguage } from "@/contexts/LanguageContext";
import { ensureAltText } from '@/lib/utils';

// ProductCard component
const ProductCard = ({ product }: { product: any }) => {
  const { t } = useLanguage();
  
  return (
    <div className="group">
      <div className="relative mb-3 overflow-hidden">
        <Link href={product.href}>
          <Image
            src={product.image}
            alt={ensureAltText(product.name, "Product image")}
            width={300}
            height={400}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>
      <Link href={product.href}>
        <h3 className="font-medium mb-1">{product.name}</h3>
      </Link>
      <p className="text-sm text-gray-600 mb-2">{t('product.inspiredBy')}</p>
      <div className="mt-2">
        <span className="font-medium">{product.price} RSD</span>
      </div>
    </div>
  );
};

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white">
      {/* Hero Banner with adjusted padding for navbar */}
      <div className="bg-black text-white text-center pt-36 pb-24 px-4 relative overflow-hidden h-[80vh] md:h-[90vh]">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full opacity-70 bg-gradient-to-b from-black to-transparent absolute top-0 left-0 z-10" />
          <Image
            src="/ads/REKLAMA1.png"
            alt={ensureAltText("Banner background", "PreludaStvar hero banner")}
            fill
            className="object-cover object-center w-full h-full"
            priority
          />
        </div>
        {/* Large Logo Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="w-[80%] md:w-[60%] lg:w-[30%] relative aspect-square">
            <Image
              src="/logos/prepre.png"
              alt={ensureAltText("PreludaStvar Logo", "PreludaStvar brand logo")}
              fill
              className="object-contain opacity-90"
              priority
            />
          </div>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end items-center pb-16">
        </div>
      </div>

      {/* CSS for pulse animation */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 204, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 204, 0, 0);
          }
        }
      `}</style>

      {/* Best Sellers Section */}
      <div className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-6xl font-bold mb-8 text-center">{t('homepage.bestSellers')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/posteri"
              className="bg-black text-white px-6 py-2 uppercase text-sm font-medium inline-block"
            >
              {t('homepage.morePosters')}
            </Link>
          </div>
        </div>
      </div>

      {/* Trending Today Section */}
      <div className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-6xl font-bold mb-8 text-center">{t('homepage.trending')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/posteri"
              className="bg-black text-white px-6 py-2 uppercase text-sm font-medium inline-block"
            >
              {t('homepage.morePopular')}
            </Link>
          </div>
        </div>
      </div>

      {/* Don't Settle Section */}
      <div className="py-16 px-4 bg-black text-white text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold mb-2">{t('homepage.emotionTitle')}</h2>
          <p className="mb-6">{t('homepage.tiktokCTA')}</p>
          <Link
            href="https://www.tiktok.com/@preludastvar"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white px-6 py-2 uppercase text-sm font-medium inline-block hover:bg-white hover:text-black transition"
          >
            {t('homepage.followTikTok')}
          </Link>
        </div>
      </div>

      {/* Latest Drop Section */}
      <section id="akcija" className="px-4 md:px-8 py-16 md:py-24 bg-[#f5f5f5]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-6xl font-bold mb-4">{t('homepage.latestDrops')}</h2>
          <p className="text-lg mb-12">{t('homepage.latestSubtitle')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {latestProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
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
    </div>
  );
}

// Sample data for products
const bestSellers = [
  {
    id: 1,
    name: "Bass",
    artist: "Preluda Stvar",
    price: "900",
    image: "/product-photos/bass.png",
    href: "/products/bass"
  },
  {
    id: 2,
    name: "Casino",
    artist: "Preluda Stvar",
    price: "900",
    image: "/product-photos/CASINO.png",
    href: "/products/casino"
  },
  {
    id: 3,
    name: "Laju Kuje",
    artist: "Preluda Stvar",
    price: "900",
    image: "/product-photos/LAJUKUJE.png",
    href: "/products/lajukuje"
  },
  {
    id: 4,
    name: "Zovi Me",
    artist: "Preluda Stvar",
    price: "900",
    image: "/product-photos/zovime.png",
    href: "/products/zovime"
  }
];

const trendingProducts = [
  {
    id: 5,
    name: "Grshemiach",
    artist: "Preluda Stvar",
    price: "900",
    image: "/product-photos/GRSHEMIACH.png",
    href: "/products/grshemiach"
  },
  {
    id: 6,
    name: "Apsolutno Tvoj",
    artist: "Preluda Stvar",
    price: "900",
    image: "/product-photos/APSOLUTNOTVOJ.png",
    href: "/products/apsolutnotvoj"
  },
  {
    id: 7,
    name: "Elena Blaka Blaka",
    artist: "Preluda Stvar",
    price: "900",
    image: "/product-photos/ELENABLAKABLAKA.png",
    href: "/products/elenablakablaka"
  },
  {
    id: 8,
    name: "Vlado Andjele",
    artist: "Preluda Stvar",
    price: "900",
    image: "/product-photos/VLADOANDJELE.png",
    href: "/products/vladoandjele"
  }
];

const latestProducts = [
  {
    id: 9,
    name: "Jeca Pack",
    artist: "Preluda Stvar",
    price: "2700",
    image: "/product-photos/JECAPACK.png",
    href: "/products/jecapack"
  },
  {
    id: 10,
    name: "Ceca Pack",
    artist: "Preluda Stvar",
    price: "2700",
    image: "/product-photos/cecapack.png",
    href: "/products/cecapack"
  }
];
