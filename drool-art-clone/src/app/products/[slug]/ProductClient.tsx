'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { Product } from '@/types/product';
import { fetchProductBySlug } from '@/lib/firebaseFunctions';
import { ensureAltText } from '@/lib/utils';
import { useRouter, notFound } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type ProductClientProps = {
  params: {
    slug: string;
  };
};

const ProductClient = ({ params }: ProductClientProps) => {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { slug } = params;
  
  // State for the fetched product
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State initialization
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');
  const [selectedFinishId, setSelectedFinishId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState(false);
  
  const { addToCart } = useCart();

  // Memoize translated values based on the fetched product state
  const productName = useMemo(() => product ? (product.name?.[language] || product.name?.sr) : '', [product, language]);
  const productArtist = useMemo(() => product ? (product.artist?.[language] || product.artist?.sr) : '', [product, language]);

  // Calculate current price - Requires update based on how variations are stored/fetched
  const getCurrentPrice = useCallback((): number => {
    // TODO: Update price calculation based on fetched product and selections
    // This likely involves looking up size/finish price variations within the fetched product data
    // For now, return base price or 0
    return product?.price || 0;
  }, [product, selectedSizeId, selectedFinishId]);
  
  // Size/Finish change handlers (might need adjustment based on data structure)
  const handleSizeChange = useCallback((sizeId: string) => {
    setSelectedSizeId(sizeId);
  }, []);
  
  const handleFinishChange = useCallback((finishId: string) => {
    setSelectedFinishId(finishId);
  }, []);

  // Add to cart handler using fetched product data
  const handleAddToCart = useCallback(() => {
    if (!product) return;

    const price = getCurrentPrice(); // Use updated price calculation

    addToCart({
      id: product.id, // Use Firestore ID
      name: productName,
      artist: productArtist || "Poster inspirisan pesmom",
      price: price.toString(),
      image: product.imageURL, // Use imageURL from Firestore
      size: selectedSizeId, // Use state for selected size ID
      finish: selectedFinishId !== 'no-frame' ? selectedFinishId : undefined, // Use state for selected finish ID
    }, quantity);

    setSuccess(true);
    toast.success(t('product.addedToCart'));
  }, [product, productName, productArtist, selectedSizeId, selectedFinishId, quantity, addToCart, getCurrentPrice, t]);

  // Initialize product state on mount and when slug changes
  useEffect(() => {
    if (!slug) {
        setError('Product slug is missing.');
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);
    setProduct(null); // Reset product state

    const loadProduct = async () => {
      try {
        const fetchedProduct = await fetchProductBySlug(slug);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          // Initialize selections based on fetched data if applicable
          // e.g., setSelectedSizeId(fetchedProduct.sizes?.[0]?.id || '');
          // e.g., setSelectedFinishId(fetchedProduct.finishes?.[0]?.id || '');
          // For now, keep selections basic until variations are implemented
        } else {
          setError(t('product.notFound'));
          console.warn(`[ProductClient] Product not found with slug: ${slug}`);
          // Optionally use notFound() if this component handles it
          // notFound();
        }
      } catch (err: any) {
        console.error(`[ProductClient] Error loading product:`, err);
        setError(err.message || t('product.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    loadProduct();

  }, [slug, t]); // Add t to dependency array if used in error messages

  // Get random recommendations - Requires fetching logic update
  const getRandomRecommendations = useCallback((): Product[] => {
    // TODO: Update recommendation logic
    // - Fetch a few random products from Firestore (excluding current)
    // - Or use a predefined list fetched separately
    return []; // Return empty for now
  }, [product]);

  // Memoize recommendations to prevent recalculation on each render
  const recommendedProducts = useMemo(() => 
    getRandomRecommendations(), 
    [getRandomRecommendations]
  );

  // TODO: Define size/finish options based on fetched product data if available
  // These might need to be fetched or be part of the product document
  const sizeOptions = useMemo(() => [
      // Placeholder - replace with actual data parsing from 'product'
      { id: '21x30', name: '21x30cm', dimensions: '', price: 0 },
      { id: '30x40', name: '30x40cm', dimensions: '', price: 0 },
  ], [/* product, t */]);

  const finishOptions = useMemo(() => [
      // Placeholder - replace with actual data parsing from 'product'
      { id: 'no-frame', name: 'Bez Rama', description: '', priceMultiplier: 1 },
      { id: 'black-frame', name: 'Crni Ram', description: '', priceMultiplier: 1.5 }, // Example multiplier
      { id: 'white-frame', name: 'Beli Ram', description: '', priceMultiplier: 1.5 }, // Example multiplier
  ], [/* product, t */]);

  // Check if product loading resulted in an error
  if (error && !loading) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">{error}</h1>
        <Button onClick={() => router.push('/posteri')}>{t('common.backToProducts')}</Button>
      </div>
    );
  }

  // If loading, show loading indicator
  if (loading) {
    return <div className="container mx-auto px-4 py-16 pt-24 text-center">Učitavanje...</div>;
  }

  // Check if product was not found after loading
  if (!product) {
      // This case might be hit if fetchProductBySlug returns null and no error was set
      // Or use notFound() directly here if appropriate for App Router
      notFound(); // Trigger 404 page
      // return (
      //   <div className="container py-10 text-center">
      //     <h1 className="text-2xl font-bold mb-4">{t('product.notFound')}</h1>
      //     <Button onClick={() => router.push('/posteri')}>{t('common.backToProducts')}</Button>
      //   </div>
      // );
  }

  const selectedSizeObj = sizeOptions.find(s => s.id === selectedSizeId);
  const selectedFinishObj = finishOptions.find(f => f.id === selectedFinishId);
  const price = getCurrentPrice();

  return (
    <div className="product-detail-container bg-white">
      <div className="container mx-auto px-4">
        {/* Product Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('common.home'), href: '/' },
            { label: t('common.posters'), href: '/posteri' },
            { label: productName || slug, href: '#' }, // Use slug as fallback label
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
          {/* Product Image - Use imageURL from fetched product */}
          <div className="relative aspect-[3/4] w-full">
              <Image
              src={product.imageURL || '/placeholder-image.png'} // Use fetched URL, provide placeholder
              alt={ensureAltText(productName, `${product.slug} poster`)}
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
            <p className="text-lg text-gray-500 mb-6">{productArtist || t('product.inspiredBy')}</p>

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
                      selectedSizeId === size.id
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
                      selectedFinishId === finish.id
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

        {/* Description Section - Needs data from Firestore */}
        <div className="mt-16 mb-24">
          <h2 className="font-sans-heading text-2xl mb-6">{t('product.description')}</h2>
          <div className="prose max-w-none">
            <p>
              {/* {productDescription || t('product.defaultDescription')} */}
              {/* TODO: Add description field to Firestore and display here */}Description currently unavailable.
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
              {recommendedProducts.map((relatedProduct) => { // Use Product type
                const relatedProductName = relatedProduct.name?.[language] || relatedProduct.name?.sr; // Use fetched name

                return (
                  <Link href={`/products/${relatedProduct.slug}`} key={relatedProduct.id} className="product-card">
                <div className="product-card-image">
                  <div className="aspect-[3/4] relative p-3 bg-white">
                    <div className="relative w-full h-full">
                      <Image
                            src={relatedProduct.imageURL || '/placeholder-image.png'} // Use fetched URL
                            alt={ensureAltText(relatedProductName, `${relatedProduct.slug} poster`)}
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
                  <p className="text-sm text-gray-600 mb-1">{relatedProduct.artist?.[language] || relatedProduct.artist?.sr || t('product.inspiredBy')}</p> {/* Use fetched artist */}
                      <p className="font-semibold mt-1">
                        {new Intl.NumberFormat('sr-RS', { style: 'currency', currency: 'RSD' }).format(
                          relatedProduct.price || 0 // Use fetched base price
                          // TODO: Update if recommendations need price variations
                          // calculateProductPrice(relatedProduct, relatedProduct.sizes[0]?.id || '', 'no-frame')
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