'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { 
  Product, 
  ProductSize, 
  ProductFinish, 
  getProductBySlug,
  getProductImageUrl,
  calculateProductPrice,
  PRODUCTS,
  DEFAULT_PRODUCT_SLUG
} from '@/data/products';
import { ensureAltText } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type ProductClientProps = {
  params: {
    slug: string;
  };
};

const ProductClient = ({ params }: ProductClientProps) => {
  const { t } = useLanguage();
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  
  // Fetch product data
  const product = useMemo(() => getProductBySlug(slug), [slug]);
  
  // State initialization
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  
  const { addToCart } = useCart();

  // Memoize translated values
  const productName = useMemo(() => product ? t(product.nameKey) : '', [product, t]);
  const productArtist = useMemo(() => product ? t(product.artistKey) : '', [product, t]);
  const productDescription = useMemo(() => product ? t(product.descriptionKey) : '', [product, t]);

  // Calculate current price based on size and finish
  const getCurrentPrice = useCallback((): number => {
    return product ? calculateProductPrice(product, selectedSize, selectedFinish) : 0;
  }, [product, selectedSize, selectedFinish]);
  
  // Size change handler
  const handleSizeChange = useCallback((size: string) => {
    setSelectedSize(size);
  }, []);
  
  // Finish change handler
  const handleFinishChange = useCallback((finish: string) => {
    setSelectedFinish(finish);
  }, []);

  // Add to cart handler with proper type checking
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    
    const price = getCurrentPrice().toString();
    
    addToCart({
      id: product.id,
      name: productName,
      artist: productArtist || "Poster inspirisan pesmom",
      price: price,
      image: getProductImageUrl(product.slug),
      size: selectedSize,
      finish: selectedFinish !== 'no-frame' ? selectedFinish : undefined,
    }, quantity);
    
    setSuccess(true);
    toast.success(t('product.addedToCart'));
  }, [product, productName, productArtist, selectedSize, selectedFinish, quantity, addToCart, getCurrentPrice, t]);

  // Initialize product state on mount and when slug changes
  useEffect(() => {
    if (!slug) return;
    
    setLoading(true);
    
    try {
      // Find product by slug
      const foundProduct = getProductBySlug(slug);
      
      if (foundProduct) {
        // Initialize with the first size and finish option
        setSelectedSize(foundProduct.sizes[0]?.id || '');
        setSelectedFinish(foundProduct.finishes[0]?.id || '');
      } else {
        console.warn(`[ProductClient] Failed to find product with slug: ${slug}`);
        router.push('/posteri');
      }
    } catch (error) {
      console.error(`[ProductClient] Error loading product:`, error);
    } finally {
      setLoading(false);
    }
  }, [slug, router]);

  // Get random recommendations excluding current product
  const getRandomRecommendations = useCallback((): Product[] => {
    if (!product) return [];
    
    // Filter out the current product
    const filteredProducts = PRODUCTS.filter(p => p.id !== product.id);
    
    // Shuffle the filtered products and take 4
    return [...filteredProducts]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }, [product]);

  // Memoize recommendations to prevent recalculation on each render
  const recommendedProducts = useMemo(() => 
    getRandomRecommendations(), 
    [getRandomRecommendations]
  );

  // Define size options from product data
  const sizeOptions = useMemo(() => 
    product ? product.sizes.map(size => ({
      id: size.id,
      name: t(`product.sizes.${size.id}.name`),
      description: t(`product.sizes.${size.id}.description`),
      dimensions: size.dimensions || '',
      price: size.price
    })) : [],
    [product, t]
  );

  // Define finish options from product data
  const finishOptions = useMemo(() => 
    product ? product.finishes.map(finish => ({
      id: finish.id,
      name: t(`product.finishes.${finish.id}.name`),
      description: t(`product.finishes.${finish.id}.description`),
      priceMultiplier: finish.priceMultiplier
    })) : [],
    [product, t]
  );

  // Check if product exists
  if (!product) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('product.notFound')}</h1>
        <Button onClick={() => router.push('/products')}>{t('common.backToProducts')}</Button>
      </div>
    );
  }

  // If loading, show loading indicator
  if (loading) {
    return <div className="container mx-auto px-4 py-16 pt-24">Učitavanje...</div>;
  }

  const selectedSizeObj = sizeOptions.find(s => s.id === selectedSize);
  const selectedFinishObj = finishOptions.find(f => f.id === selectedFinish);
  const price = getCurrentPrice();

  return (
    <div className="product-detail-container bg-white">
      <div className="container mx-auto px-4">
        {/* Product Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('common.home'), href: '/' },
            { label: t('common.posters'), href: '/posteri' },
            { label: productName, href: '#' },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
          {/* Product Image - Optimized with proper sizing */}
          <div className="relative aspect-[3/4] w-full">
              <Image
              src={getProductImageUrl(product.slug)}
              alt={ensureAltText(productName, `${product.nameKey} poster`)}
                fill
                priority
                className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="eager"
              />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="font-sans-heading text-3xl md:text-4xl mb-2">{productName}</h1>
            <p className="text-lg text-gray-500 mb-6">{t('product.inspiredBy')}</p>

            <p className="text-2xl font-semibold mb-8">{new Intl.NumberFormat('sr-RS', {
              style: 'currency',
              currency: 'RSD',
            }).format(price)}</p>

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
                    {size.name} {size.dimensions && `- ${size.dimensions}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Finish Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-3">{t('product.frame')}</h3>
              <div className="flex flex-wrap gap-3">
                {finishOptions.map((finish) => (
                  <button
                    key={finish.id}
                    onClick={() => handleFinishChange(finish.id)}
                    className={`px-4 py-2 border ${
                      selectedFinish === finish.id
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    } transition-colors duration-200`}
                  >
                    {finish.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase mb-2">{t('product.quantity')}</h3>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-l-md"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <div className="w-16 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-r-md"
                  aria-label="Increase quantity"
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
                {t('product.addedToCart')}{' '}
                <Link href="/cart" className="underline">
                  {t('cart.title')}
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
              {productDescription || t('product.defaultDescription')}
            </p>
            <p className="mt-4">
              {t('product.printQuality')}
            </p>
          </div>
        </div>

        {/* You Might Also Like Section */}
        {recommendedProducts.length > 0 && (
        <div className="border-t border-gray-100 pt-16 pb-24">
          <h2 className="font-sans-heading text-2xl mb-8 text-center">{t('common.youMightAlsoLike')}</h2>
          <div className="product-grid">
              {recommendedProducts.map((relatedProduct) => {
                const relatedProductName = t(relatedProduct.nameKey);
                
                return (
                  <Link href={`/products/${relatedProduct.slug}`} key={relatedProduct.id} className="product-card">
                <div className="product-card-image">
                  <div className="aspect-[3/4] relative p-3 bg-white">
                    <div className="relative w-full h-full">
                      <Image
                            src={getProductImageUrl(relatedProduct.slug)}
                            alt={ensureAltText(relatedProductName, `${relatedProduct.nameKey} poster`)}
                        fill
                        className="object-contain transition-transform duration-300 hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 25vw"
                            loading="lazy"
                      />
                    </div>
                  </div>
                </div>
                <div className="product-card-content">
                      <h3 className="product-card-title">{relatedProductName}</h3>
                  <p className="text-sm text-gray-600 mb-1">{t('product.inspiredBy')}</p>
                      <p className="font-semibold mt-1">
                        {new Intl.NumberFormat('sr-RS', { style: 'currency', currency: 'RSD' }).format(
                          calculateProductPrice(relatedProduct, relatedProduct.sizes[0]?.id || '', 'no-frame')
                        )}
                      </p>
                </div>
              </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductClient; 