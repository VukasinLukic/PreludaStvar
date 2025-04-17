/**
 * Product routes helper to ensure all product URLs are properly mapped
 */

// Product exact case mapping - ensures consistent URLs and image paths
const PRODUCT_MAPPINGS: Record<string, string> = {
  // Lowercase to exact case for all products
  'apsolutnotvoj': 'APSOLUTNOTVOJ',
  'bangbang': 'bangbang',
  'bass': 'bass', 
  'bezkoda': 'bezkoda', 
  'bicu1': 'bicu1', 
  'bik': 'bik', 
  'casino': 'CASINO',
  'cecapack': 'cecapack', 
  'daraskinemsnjom': 'daraskinemsnjom', 
  'elenablakablaka': 'ELENABLAKABLAKA',
  'grshemiach': 'GRSHEMIACH',
  'idepetak': 'IDEPETAK',
  'januar': 'januar', 
  'jaocu': 'jaocu', 
  'jecapack': 'JECAPACK',
  'kaonik': 'kaonik', 
  'kleopatra': 'kleopatra', 
  'kozapamti': 'kozapamti', 
  'krimirad': 'krimirad', 
  'lajukuje': 'LAJUKUJE',
  'mkmz': 'MKMZ',
  'mojbeograd': 'mojbeograd', 
  'nevaljala': 'nevaljala', 
  'nikad': 'nikad', 
  'oprostajna': 'OPROSTAJNA',
  'puma1': 'puma1', 
  'sat': 'sat', 
  'smztvj': 'smztvj', 
  'svesto': 'svesto', 
  'vladoandjele': 'VLADOANDJELE',
  'zovime': 'zovime'
};

// Normalized route detection - helps with partial matches
const ALIAS_MAPPINGS: Record<string, string> = {
  // Common misspellings and partial matches
  'idepe': 'idepetak',
  'petak': 'idepetak',
  'kazino': 'casino',
  'cas': 'casino',
  'laju': 'lajukuje',
  'kuje': 'lajukuje', 
  'grsh': 'grshemiach',
  'vlado': 'vladoandjele',
  'andjele': 'vladoandjele',
  'elena': 'elenablakablaka',
  'blaka': 'elenablakablaka',
  'jeca': 'jecapack',
  'bang': 'bangbang',
  'zovi': 'zovime',
  'oprostajna': 'oprostajna',
  'nikad': 'nikad',
  'bicu': 'bicu1',
  'jan': 'januar',
  'svesto': 'svesto'
};

// Default product to use if no match is found
const DEFAULT_PRODUCT = 'idepetak';

/**
 * Get the correct product slug for a given input
 */
export function getProductSlug(input: string): string {
  if (!input) return DEFAULT_PRODUCT;
  
  // Normalize to lowercase
  const normalizedInput = input.toLowerCase().trim();
  
  // Check for exact matches first
  if (PRODUCT_MAPPINGS[normalizedInput]) {
    return normalizedInput;
  }
  
  // Check for aliases/partial matches
  for (const [alias, product] of Object.entries(ALIAS_MAPPINGS)) {
    if (normalizedInput.includes(alias)) {
      return product;
    }
  }
  
  // Remove hyphens and try again
  if (normalizedInput.includes('-')) {
    const dehyphenated = normalizedInput.replace(/-/g, '');
    if (PRODUCT_MAPPINGS[dehyphenated]) {
      return dehyphenated;
    }
  }
  
  // Default fallback
  return DEFAULT_PRODUCT;
}

/**
 * Get the correctly cased image filename for a product
 */
export function getProductImageFilename(slug: string): string {
  const productSlug = getProductSlug(slug);
  return PRODUCT_MAPPINGS[productSlug] || PRODUCT_MAPPINGS[DEFAULT_PRODUCT];
}

/**
 * Get the full product image URL
 */
export function getProductImageUrl(slug: string): string {
  const filename = getProductImageFilename(slug);
  return `/product-photos/${filename}.png`;
}

/**
 * Get the canonical product URL (with correct casing)
 */
export function getProductUrl(slug: string): string {
  const productSlug = getProductSlug(slug);
  return `/products/${productSlug}`;
}

// Export all products for use in static site generation
export const ALL_PRODUCT_SLUGS = Object.keys(PRODUCT_MAPPINGS); 