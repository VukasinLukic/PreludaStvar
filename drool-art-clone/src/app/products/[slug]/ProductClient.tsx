'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useCart } from '@/contexts/CartContext';
import { getProductSlug, getProductImageUrl, getProductUrl } from '@/lib/productRoutes';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { useLanguage } from '@/contexts/LanguageContext';

// Helper for creating human-readable product titles from slugs
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

// Define all product images with exact case based on the file listing
const productImages = [
  'APSOLUTNOTVOJ', 'bangbang', 'bass', 'bezkoda', 'bicu1', 'bik', 
  'CASINO', 'cecapack', 'daraskinemsnjom', 'ELENABLAKABLAKA', 
  'GRSHEMIACH', 'IDEPETAK', 'januar', 'jaocu', 'JECAPACK', 'kaonik',
  'kleopatra', 'kozapamti', 'krimirad', 'LAJUKUJE', 'MKMZ', 
  'mojbeograd', 'nevaljala', 'nikad', 'OPROSTAJNA', 'puma1', 
  'sat', 'smztvj', 'svesto', 'VLADOANDJELE', 'zovime'
];

// IMPORTANT: Direct mappings from slug to image file - this guarantees exact matches
const DIRECT_PRODUCT_MAPPINGS: Record<string, string> = {
  // Lowercase to exact case
  'idepetak': 'IDEPETAK',
  'apsolutnotvoj': 'APSOLUTNOTVOJ',
  'bezkoda': 'bezkoda',
  'bangbang': 'bangbang',
  'bass': 'bass',
  'bicu1': 'bicu1',
  'bik': 'bik',
  'casino': 'CASINO',
  'CASINO': 'CASINO',
  'cecapack': 'cecapack',
  'daraskinemsnjom': 'daraskinemsnjom',
  'elenablakablaka': 'ELENABLAKABLAKA',
  'ELENABLAKABLAKA': 'ELENABLAKABLAKA',
  'grshemiach': 'GRSHEMIACH',
  'GRSHEMIACH': 'GRSHEMIACH',
  'IDEPETAK': 'IDEPETAK',
  'januar': 'januar',
  'jaocu': 'jaocu',
  'jecapack': 'JECAPACK',
  'JECAPACK': 'JECAPACK',
  'kaonik': 'kaonik',
  'kleopatra': 'kleopatra',
  'kozapamti': 'kozapamti',
  'krimirad': 'krimirad',
  'lajukuje': 'LAJUKUJE',
  'LAJUKUJE': 'LAJUKUJE',
  'mkmz': 'MKMZ',
  'MKMZ': 'MKMZ',
  'mojbeograd': 'mojbeograd',
  'nevaljala': 'nevaljala',
  'nikad': 'nikad',
  'oprostajna': 'OPROSTAJNA',
  'OPROSTAJNA': 'OPROSTAJNA',
  'puma1': 'puma1',
  'sat': 'sat',
  'smztvj': 'smztvj',
  'svesto': 'svesto',
  'vladoandjele': 'VLADOANDJELE',
  'VLADOANDJELE': 'VLADOANDJELE',
  'zovime': 'zovime',
  
  // Special cases with hyphens
  'laju-kuje': 'LAJUKUJE',
  'bela-blaka-blaka': 'ELENABLAKABLAKA',
  'vlado-andjele': 'VLADOANDJELE',
  'bicu-tu': 'bicu1',
  'moj-beograd': 'mojbeograd',
  'ide-petak': 'IDEPETAK',
  'ja-hocu': 'jaocu',
  'da-raskinemo-s-njom': 'daraskinemsnjom',
  'koza-pamti': 'kozapamti',
  'apsolutno-tvoj': 'APSOLUTNOTVOJ',
  'g-r-sh-em-i-ach': 'GRSHEMIACH',
  'elena-blaka-blaka': 'ELENABLAKABLAKA',
  
  // Common misspellings/variations
  'kazino': 'CASINO',
  'laju': 'LAJUKUJE',
  'kuje': 'LAJUKUJE',
  'elena': 'ELENABLAKABLAKA',
  'blaka': 'ELENABLAKABLAKA',
  'vlado': 'VLADOANDJELE',
  'andjele': 'VLADOANDJELE',
  'grsh': 'GRSHEMIACH',
  'ide': 'IDEPETAK',
  'petak': 'IDEPETAK'
};

// Create product data objects
const productsData: Record<string, any> = {};

// Fill the productsData object with all products
productImages.forEach((originalImage, index) => {
  const slug = originalImage.toLowerCase();
  const name = formatName(originalImage);
  
  const productData = {
    id: slug,
    originalImage: originalImage,
    name: name,
    artist: "Poster inspirisan pesmom",
    price: "900", // Base A4 price
    image: `/product-photos/${originalImage}.png`,
    description: `Inspirisan pesmom "${name}".`,
    stock: 5 + Math.floor(Math.random() * 20)
  };
  
  // Store the product data
  productsData[slug] = productData;
});

// IMPORTANT: Store a default product to use as fallback
const DEFAULT_PRODUCT = productsData['idepetak'] || productsData['lajukuje'] || productsData['zovime'];

// Debug log
console.log("[ProductClient] Initialized with products:", Object.keys(productsData).length);

// Helper function to find the correct product by slug
const findProductBySlug = (urlSlug: string): any => {
  console.log(`[ProductClient] Finding product for slug: "${urlSlug}"`);
  
  if (!urlSlug || typeof urlSlug !== 'string') {
    console.error("[ProductClient] Invalid slug:", urlSlug);
    return DEFAULT_PRODUCT;
  }
  
  // Use the product routes helper to get the normalized slug
  const normalizedSlug = getProductSlug(urlSlug);
  console.log(`[ProductClient] Normalized slug via helper: "${normalizedSlug}"`);
  
  // Check if we have a direct match in productsData
  if (productsData[normalizedSlug]) {
    console.log(`[ProductClient] Found product via normalized slug: ${normalizedSlug}`);
    return productsData[normalizedSlug];
  }
  
  // Add special cases for frequently accessed products
  const specialCases: Record<string, string> = {
    'idepetak': 'idepetak',
    'casino': 'casino',
    'lajukuje': 'lajukuje',
    'zovime': 'zovime',
    'grshemiach': 'grshemiach',
    'apsolutnotvoj': 'apsolutnotvoj',
    'elenablakablaka': 'elenablakablaka',
    'vladoandjele': 'vladoandjele',
    'jecapack': 'jecapack',
    'mkmz': 'mkmz',
    'oprostajna': 'oprostajna',
    'bangbang': 'bangbang'
  };
  
  // Check special cases first
  if (specialCases[normalizedSlug]) {
    const specialSlug = specialCases[normalizedSlug];
    console.log(`[ProductClient] Found special case: ${normalizedSlug} → ${specialSlug}`);
    return productsData[specialSlug];
  }
  
  // 1. Check our direct mappings first (most reliable)
  if (DIRECT_PRODUCT_MAPPINGS[normalizedSlug]) {
    const exactProductKey = DIRECT_PRODUCT_MAPPINGS[normalizedSlug].toLowerCase();
    console.log(`[ProductClient] Found direct mapping: ${normalizedSlug} → ${exactProductKey}`);
    
    if (productsData[exactProductKey]) {
      return productsData[exactProductKey];
    }
  }
  
  // 2. Try direct lookup in productsData
  if (productsData[normalizedSlug]) {
    console.log(`[ProductClient] Found by direct lookup: ${normalizedSlug}`);
    return productsData[normalizedSlug];
  }
  
  // 3. If the slug has hyphens, try removing them
  if (normalizedSlug.includes('-')) {
    const dehyphenatedSlug = normalizedSlug.replace(/-/g, '');
    if (productsData[dehyphenatedSlug]) {
      console.log(`[ProductClient] Found after removing hyphens: ${normalizedSlug} → ${dehyphenatedSlug}`);
      return productsData[dehyphenatedSlug];
    }
  }
  
  // 4. Try product-specific checks
  if (normalizedSlug.includes('ide') || normalizedSlug.includes('petak')) {
    console.log(`[ProductClient] Special case for 'idepetak'`);
    return productsData['idepetak'];
  }
  
  if (normalizedSlug.includes('casin') || normalizedSlug.includes('kazin')) {
    console.log(`[ProductClient] Special case for 'casino'`);
    return productsData['casino'];
  }
  
  if (normalizedSlug.includes('laju') || normalizedSlug.includes('kuje')) {
    console.log(`[ProductClient] Special case for 'lajukuje'`);
    return productsData['lajukuje'];
  }
  
  // 5. Look for partial matches by slug containment
  for (const key of Object.keys(productsData)) {
    if (key.includes(normalizedSlug) || normalizedSlug.includes(key)) {
      console.log(`[ProductClient] Found by partial match: ${normalizedSlug} → ${key}`);
      return productsData[key];
    }
  }
  
  // No match found, use default
  console.warn(`[ProductClient] No product found for: ${normalizedSlug}, using default`);
  return DEFAULT_PRODUCT;
};

type ProductClientProps = {
  params: {
    slug: string;
  };
};

const ProductClient = ({ params }: ProductClientProps) => {
  console.log(`[ProductClient] Component rendering with params:`, params);
  
  // Get the slug from URL params - IMPORTANT: use uppercase for special slugs
  const rawSlug = params?.slug || '';
  
  const [selectedSize, setSelectedSize] = useState('A4');
  const [selectedFrame, setSelectedFrame] = useState('none');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  
  const { addToCart } = useCart();
  const { t } = useLanguage();

  // Find and set product on mount and when slug changes
  useEffect(() => {
    console.log(`[ProductClient] useEffect running with slug: "${rawSlug}"`);
    
    // Reset product state to avoid stale data
    setProduct(null);
    setLoading(true);
    
    try {
      // Find product by slug
      const foundProduct = findProductBySlug(rawSlug);
      
      if (foundProduct) {
        console.log(`[ProductClient] Found product:`, foundProduct.name);
        setProduct(foundProduct);
      } else {
        console.warn(`[ProductClient] Failed to find product, using fallback`);
        setProduct(DEFAULT_PRODUCT);
      }
    } catch (error) {
      console.error(`[ProductClient] Error finding product:`, error);
      setProduct(DEFAULT_PRODUCT);
    } finally {
      setLoading(false);
    }
  }, [rawSlug]);

  // Use useMemo to recalculate size options when frame selection changes
  const sizeOptions = useMemo(() => [
    { id: 'A4', name: 'A4 (21x30 cm)', price: selectedFrame === 'none' ? 900 : 1600 },
    { id: 'A3', name: 'A3 (30x40 cm)', price: selectedFrame === 'none' ? 1200 : 2100 },
  ], [selectedFrame]);

  // Log state changes to help with debugging
  useEffect(() => {
    console.log(`[ProductClient] State changed - Size: ${selectedSize}, Frame: ${selectedFrame}`);
    // Don't call getCurrentPrice here to avoid circular dependency
  }, [selectedSize, selectedFrame]);

  const frameOptions = [
    { id: 'none', name: 'Bez rama' },
    { id: 'black', name: 'Crni ram' },
    { id: 'white', name: 'Beli ram' },
  ];

  // If loading or product is null, show loading indicator
  if (loading || !product) {
    return <div className="container mx-auto px-4 py-16 pt-24">Učitavanje...</div>;
  }

  // Calculate current price
  const getCurrentPrice = (): number => {
    const sizeOption = sizeOptions.find(s => s.id === selectedSize);
    return sizeOption ? sizeOption.price : 900;
  };
  
  // Size change handler with explicit state update
  const handleSizeChange = (sizeId: string): void => {
    console.log(`[ProductClient] Changing size to: ${sizeId}`);
    setSelectedSize(sizeId);
  };
  
  // Frame change handler with explicit state update
  const handleFrameChange = (frameId: string): void => {
    console.log(`[ProductClient] Changing frame to: ${frameId}`);
    setSelectedFrame(frameId);
  };
  
  // Add to cart handler
  const handleAddToCart = () => {
    const price = getCurrentPrice().toString();
    
    // Log detailed information about what's being added to cart
    console.log(`[ProductClient] Adding to cart:`, {
      id: product.id,
      name: product.name,
      price: price,
      size: selectedSize,
      frame: selectedFrame,
      quantity: quantity,
      framePrice: selectedFrame !== 'none' ? 'With frame' : 'No frame'
    });
    
    // Add to cart (cartItemId will be generated inside CartContext)
    addToCart({
      id: product.id,
      name: product.name,
      artist: product.artist,
      price: price,
      image: product.image,
      size: selectedSize,
      finish: selectedFrame !== 'none' ? selectedFrame : undefined,
    }, quantity);
    
    // Show confirmation to the user
    console.log(`[ProductClient] Added ${quantity} item(s) to cart with price ${price} RSD each`);
    setSuccess(true);
  };

  // Get random recommendations that don't include the current product
  const getRandomRecommendations = () => {
    const allProducts = Object.values(productsData);
    const currentProductId = product.id;
    const filteredProducts = allProducts.filter(p => p.id !== currentProductId);
    
    // Shuffle the filtered products and take 4
    const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  const recommendedProducts = getRandomRecommendations();

  return (
    <div className="product-detail-container bg-white">
      <div className="container mx-auto px-4">
        {/* Product Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('common.home'), href: '/' },
            { label: t('common.posters'), href: '/posteri' },
            { label: product.name, href: '#' },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
          {/* Product Image */}
          <div className="relative aspect-[3/4] w-[110%] -ml-[5%]">
            <div className="relative w-full h-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 110vw, 55vw"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="font-sans-heading text-3xl md:text-4xl mb-2">{product.name}</h1>
            <p className="text-lg text-gray-500 mb-6">{t('product.inspiredBy')}</p>

            <p className="text-2xl font-semibold mb-8">{getCurrentPrice()} RSD</p>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">{t('product.size')}</h3>
              <div className="flex flex-wrap gap-3">
                {sizeOptions.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => handleSizeChange(size.id)}
                    className={`px-4 py-2 border ${
                      selectedSize === size.id
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    } transition-colors duration-200`}
                  >
                    {size.name} - {size.price} RSD
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-3">{t('product.frame')}</h3>
              <div className="flex flex-wrap gap-3">
                {frameOptions.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => handleFrameChange(frame.id)}
                    className={`px-4 py-2 border ${
                      selectedFrame === frame.id
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    } transition-colors duration-200`}
                  >
                    {frame.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase mb-2">Količina</h3>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-l-md"
                >
                  -
                </button>
                <div className="w-16 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-r-md"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('common.addToCart')}...
                </span>
              ) : (
                t('common.addToCart')
              )}
            </button>

            {/* Success Message */}
            {success && (
              <div className="mt-4 p-3 bg-green-50 text-green-800 rounded">
                Product added to cart!{' '}
                <Link href="/cart" className="underline">
                  View Cart
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-16 mb-24">
          <h2 className="font-sans-heading text-2xl mb-6">{t('product.description')}</h2>
          <div className="prose max-w-none">
            <p>
              Ovaj poster je inspirisan stihovima koji su obeležili jednu generaciju. Sa jasnom porukom i minimalističkim dizajnom, ovaj komad će se savršeno uklopiti u svaki prostor i doneti dašak autentičnosti i emocije.
            </p>
            <p className="mt-4">
              Štampano na visokokvalitetnom papiru koji osigurava dugotrajnost i očuvanje boja.
            </p>
          </div>
        </div>

        {/* You Might Also Like Section */}
        <div className="border-t border-gray-100 pt-16 pb-24">
          <h2 className="font-sans-heading text-2xl mb-8 text-center">{t('common.youMightAlsoLike')}</h2>
          <div className="product-grid">
            {recommendedProducts.map((relatedProduct) => (
              <Link href={`/products/${relatedProduct.id}`} key={relatedProduct.id} className="product-card">
                <div className="product-card-image">
                  <div className="aspect-[3/4] relative p-3 bg-white">
                    <div className="relative w-full h-full">
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        fill
                        className="object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
                <div className="product-card-content">
                  <h3 className="product-card-title">{relatedProduct.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{t('product.inspiredBy')}</p>
                  <p className="font-semibold mt-1">{relatedProduct.price} RSD</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductClient; 