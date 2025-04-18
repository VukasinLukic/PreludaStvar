'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { ensureAltText } from '@/lib/utils';

// Format filename to a more readable name
const formatName = (filename: string) => {
  // Convert to lowercase, except keep uppercase words
  const name = filename
    .replace(/([A-Z])/g, ' $1')
    .replace(/([0-9])/g, ' $1')
    .trim();
    
  // Capitalize first letter of each word
  return name.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

interface Product {
  id: string;
  name: string;
  artist: string;
  price: string;
  image: string;
  href: string;
}

// Generate all posters data from available images
const generateAllPosters = () => {
  const productImages = [
    'APSOLUTNOTVOJ', 'bangbang', 'bass', 'bezkoda', 'bicu1', 'bik', 
    'CASINO', 'daraskinemsnjom', 'ELENABLAKABLAKA', 
    'GRSHEMIACH', 'IDEPETAK', 'januar', 'jaocu', 'kaonik',
    'kleopatra', 'kozapamti', 'krimirad', 'LAJUKUJE', 'MKMZ', 
    'mojbeograd', 'nevaljala', 'nikad', 'OPROSTAJNA', 'puma1', 
    'sat', 'smztvj', 'svesto', 'VLADOANDJELE', 'zovime'
  ];
  
  // Filter out items with "PACK" in their names
  const filteredImages = productImages.filter(img => !img.includes('PACK') && !img.toLowerCase().includes('pack'));
  
  return filteredImages.map((originalImage) => {
    const slug = originalImage.toLowerCase();
    const name = formatName(originalImage);
    
    return {
      id: slug,  // Use slug as ID for consistency
      name: name, // Just use the name without wrapping it
      artist: "Preluda Stvar",
      price: "900",
      image: `/product-photos/${originalImage}.png`,
      href: `/products/${slug}`
    };
  });
};

// Generate posters data
const allPosters = generateAllPosters();

const ProductCard = ({ product }: { product: Product }) => {
  const { t } = useLanguage();
  
  // Determine if product should show badges
  const isNew = product.id === 'bass' || product.id === 'bezkoda' || product.id === 'bicu1';
  const isOnSale = product.id === 'casino' || product.id === 'daraskinemsnjom' || product.id === 'elenablakablaka';
  
  // Calculate discounted price if on sale
  const originalPrice = parseInt(product.price);
  const discountedPrice = isOnSale ? originalPrice / 2 : originalPrice;
  
  return (
    <Link href={`/products/${product.id}`} className="product-card">
      <div className="product-card-image relative">
        {/* Badges */}
        <div className="absolute top-0 left-0 z-10">
          {isNew && (
            <div className="bg-black text-white text-xs font-bold px-2 py-1">
              NEW
            </div>
          )}
          {isOnSale && (
            <div className="bg-black text-white text-xs font-bold px-2 py-1">
              50% OFF
            </div>
          )}
        </div>
        <Image
          src={product.image}
          alt={ensureAltText(product.name, "Poster image")}
          width={600}
          height={800}
          className="product-image"
          priority={true}
        />
      </div>
      <div className="product-card-content">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="text-gray-600">{t('product.inspiredBy')}</p>
        <p className="text-gray-600">{product.artist}</p>
        <div className="mt-2">
          {isOnSale ? (
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-semibold text-lg">{discountedPrice} RSD</span>
              <span className="text-gray-500 line-through text-sm">{originalPrice} RSD</span>
            </div>
          ) : (
            <span className="font-semibold text-lg">{originalPrice} RSD</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default function PostersPage() {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen pt-32 sm:pt-32 pb-8 sm:pb-16 bg-white font-sans">
      {/* Page Title and Search Bar */}
      <section className="py-4 sm:py-6 border-b border-gray-200">
        <div className="container-wide">
          <h1 className="font-sans-heading text-5xl sm:text-7xl md:text-8xl font-bold text-center mb-6 sm:mb-10 tracking-tight">
            {t('postersPage.allPosters')}
          </h1>
        </div>
      </section>

      {/* Products Gallery */}
      <section className="py-6 sm:py-12">
        <div className="container-wide">
          <div className="product-grid">
            {allPosters.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-16 bg-black text-white">
        <div className="container-wide text-center px-4">
          <h2 className="font-sans-heading text-2xl sm:text-3xl md:text-5xl mb-4 sm:mb-6">
            {t('postersPage.findInspiration')}
          </h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto">
            {t('postersPage.findInspirationText')}
          </p>
          <a
            href="https://tiktok.com/@preludastvar"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-lg bg-white text-black font-bold hover:bg-gray-200 transition inline-flex items-center"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.321 5.562a5.124 5.124 0 0 1-3.035-2.535c-.144-.315-.246-.651-.304-1.002h-3.039v13.943c0 1.349-1.126 2.439-2.517 2.439a2.518 2.518 0 0 1-2.517-2.497c0-1.38 1.126-2.5 2.517-2.5.242 0 .477.035.7.101v-3.16a6.04 6.04 0 0 0-.7-.044c-3.091 0-5.604 2.47-5.604 5.504 0 3.033 2.513 5.503 5.604 5.503 3.091 0 5.603-2.47 5.603-5.503V8.969c1.025.846 2.33 1.357 3.755 1.357V7.118c-.667 0-1.302-.152-1.865-.422a3.52 3.52 0 0 1-.598-.334V5.562z"/>
            </svg>
            <span className="text-sm sm:text-base">{t('postersPage.followTikTok')}</span>
          </a>
        </div>
      </section>
    </main>
  );
} 