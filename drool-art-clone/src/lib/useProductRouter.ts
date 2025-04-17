'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Product slug mapping
const productMappings: Record<string, string> = {
  'idepetak': 'IDEPETAK',
  'casino': 'CASINO',
  'lajukuje': 'LAJUKUJE',
  'laju-kuje': 'LAJUKUJE',
  'elenablakablaka': 'ELENABLAKABLAKA',
  'grshemiach': 'GRSHEMIACH',
  'vladoandjele': 'VLADOANDJELE',
  'apsolutnotvoj': 'APSOLUTNOTVOJ',
  'jecapack': 'JECAPACK',
  'mkmz': 'MKMZ',
  'oprostajna': 'OPROSTAJNA',
};

export function useProductRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentProduct, setCurrentProduct] = useState<string | null>(null);

  // Parse the current product from the URL
  useEffect(() => {
    if (!pathname) return;

    // Extract the slug from the pathname
    const match = pathname.match(/\/products\/([^\/]+)/);
    const slug = match ? match[1] : null;

    if (slug) {
      console.log(`[ProductRouter] Found slug in URL: ${slug}`);
      setCurrentProduct(slug);
    }
  }, [pathname]);

  // Navigate to a product page with correct slug
  const navigateToProduct = (slug: string) => {
    // Get the correct case for the slug if available
    const correctSlug = productMappings[slug.toLowerCase()] || slug;
    console.log(`[ProductRouter] Navigating to product: ${slug} → ${correctSlug}`);
    router.push(`/products/${correctSlug}`);
  };

  return {
    currentProduct,
    navigateToProduct,
  };
} 