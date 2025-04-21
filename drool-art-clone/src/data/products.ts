/**
 * Central product data source for PreludaStvar
 * This file serves as a single source of truth for all product information
 */

// Define product types
export interface ProductSize {
  id: string;
  name: string;
  dimensions: string;
  price: number;
}

export interface ProductFinish {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
}

export interface Product {
  // Core product data
  id: string;
  slug: string;
  exactSlug: string; // The correctly cased slug for image filenames
  
  // Localized data
  nameKey: string;
  artistKey: string;
  descriptionKey: string;
  
  // Pricing and options
  sizes: ProductSize[];
  finishes: ProductFinish[];
  
  // Metadata
  tags: string[];
  featured: boolean;
  new: boolean;
  trending: boolean;
}

// Common product sizes
export const PRODUCT_SIZES: ProductSize[] = [
  {
    id: 'a4',
    name: 'A4',
    dimensions: '21x30 cm',
    price: 900
  },
  {
    id: 'a3',
    name: 'A3',
    dimensions: '30x40 cm',
    price: 1200
  }
];

// Common product finishes
export const PRODUCT_FINISHES: ProductFinish[] = [
  {
    id: 'no-frame',
    name: 'Bez rama',
    description: 'Samo print, bez rama',
    priceMultiplier: 1.0,
  },
  {
    id: 'black-frame',
    name: 'Crni ram',
    description: 'Print u elegantnom crnom ramu',
    priceMultiplier: 1.75,
  },
  {
    id: 'white-frame',
    name: 'Beli ram',
    description: 'Print u elegantnom belom ramu',
    priceMultiplier: 1.75,
  },
];

// Products data
export const PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'apsolutnotvoj',
    exactSlug: 'APSOLUTNOTVOJ',
    nameKey: 'products.apsolutnotvoj.name',
    artistKey: 'products.apsolutnotvoj.artist',
    descriptionKey: 'products.apsolutnotvoj.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: true,
    new: false,
    trending: true
  },
  {
    id: '2',
    slug: 'bangbang',
    exactSlug: 'bangbang',
    nameKey: 'products.bangbang.name',
    artistKey: 'products.bangbang.artist',
    descriptionKey: 'products.bangbang.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: true,
    new: false,
    trending: true
  },
  {
    id: '3',
    slug: 'casino',
    exactSlug: 'CASINO',
    nameKey: 'products.casino.name',
    artistKey: 'products.casino.artist',
    descriptionKey: 'products.casino.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: true,
    new: false,
    trending: false
  },
  {
    id: '4',
    slug: 'elenablakablaka',
    exactSlug: 'ELENABLAKABLAKA',
    nameKey: 'products.elenablakablaka.name',
    artistKey: 'products.elenablakablaka.artist',
    descriptionKey: 'products.elenablakablaka.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: true,
    trending: false
  },
  {
    id: '5',
    slug: 'grshemiach',
    exactSlug: 'GRSHEMIACH',
    nameKey: 'products.grshemiach.name',
    artistKey: 'products.grshemiach.artist',
    descriptionKey: 'products.grshemiach.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: true,
    trending: false
  },
  {
    id: '6',
    slug: 'idepetak',
    exactSlug: 'IDEPETAK',
    nameKey: 'products.idepetak.name',
    artistKey: 'products.idepetak.artist',
    descriptionKey: 'products.idepetak.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: true,
    new: false,
    trending: true
  },
  {
    id: '7',
    slug: 'jecapack',
    exactSlug: 'JECAPACK',
    nameKey: 'products.jecapack.name',
    artistKey: 'products.jecapack.artist',
    descriptionKey: 'products.jecapack.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: true,
    trending: false
  },
  {
    id: '8',
    slug: 'lajukuje',
    exactSlug: 'LAJUKUJE',
    nameKey: 'products.lajukuje.name',
    artistKey: 'products.lajukuje.artist',
    descriptionKey: 'products.lajukuje.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: true
  },
  {
    id: '9',
    slug: 'mkmz',
    exactSlug: 'MKMZ',
    nameKey: 'products.mkmz.name',
    artistKey: 'products.mkmz.artist',
    descriptionKey: 'products.mkmz.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: true,
    trending: false
  },
  {
    id: '10',
    slug: 'oprostajna',
    exactSlug: 'OPROSTAJNA',
    nameKey: 'products.oprostajna.name',
    artistKey: 'products.oprostajna.artist',
    descriptionKey: 'products.oprostajna.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: true,
    trending: false
  },
  {
    id: '11',
    slug: 'vladoandjele',
    exactSlug: 'VLADOANDJELE',
    nameKey: 'products.vladoandjele.name',
    artistKey: 'products.vladoandjele.artist',
    descriptionKey: 'products.vladoandjele.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: true,
    trending: false
  },
  {
    id: '12',
    slug: 'zovime',
    exactSlug: 'zovime',
    nameKey: 'products.zovime.name',
    artistKey: 'products.zovime.artist',
    descriptionKey: 'products.zovime.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: true
  },
  {
    id: '13',
    slug: 'bass',
    exactSlug: 'bass',
    nameKey: 'products.bass.name',
    artistKey: 'products.bass.artist',
    descriptionKey: 'products.bass.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: true,
    trending: false
  },
  {
    id: '14',
    slug: 'bezkoda',
    exactSlug: 'bezkoda',
    nameKey: 'products.bezkoda.name',
    artistKey: 'products.bezkoda.artist',
    descriptionKey: 'products.bezkoda.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: true,
    trending: false
  },
  {
    id: '15',
    slug: 'bicu1',
    exactSlug: 'bicu1',
    nameKey: 'products.bicu1.name',
    artistKey: 'products.bicu1.artist',
    descriptionKey: 'products.bicu1.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: true,
    trending: false
  },
  {
    id: '16',
    slug: 'bik',
    exactSlug: 'bik',
    nameKey: 'products.bik.name',
    artistKey: 'products.bik.artist',
    descriptionKey: 'products.bik.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '17',
    slug: 'daraskinemsnjom',
    exactSlug: 'daraskinemsnjom',
    nameKey: 'products.daraskinemsnjom.name',
    artistKey: 'products.daraskinemsnjom.artist',
    descriptionKey: 'products.daraskinemsnjom.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '18',
    slug: 'januar',
    exactSlug: 'januar',
    nameKey: 'products.januar.name',
    artistKey: 'products.januar.artist',
    descriptionKey: 'products.januar.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '19',
    slug: 'jaocu',
    exactSlug: 'jaocu',
    nameKey: 'products.jaocu.name',
    artistKey: 'products.jaocu.artist',
    descriptionKey: 'products.jaocu.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '20',
    slug: 'kaonik',
    exactSlug: 'kaonik',
    nameKey: 'products.kaonik.name',
    artistKey: 'products.kaonik.artist',
    descriptionKey: 'products.kaonik.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '21',
    slug: 'kleopatra',
    exactSlug: 'kleopatra',
    nameKey: 'products.kleopatra.name',
    artistKey: 'products.kleopatra.artist',
    descriptionKey: 'products.kleopatra.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '22',
    slug: 'kozapamti',
    exactSlug: 'kozapamti',
    nameKey: 'products.kozapamti.name',
    artistKey: 'products.kozapamti.artist',
    descriptionKey: 'products.kozapamti.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '23',
    slug: 'krimirad',
    exactSlug: 'krimirad',
    nameKey: 'products.krimirad.name',
    artistKey: 'products.krimirad.artist',
    descriptionKey: 'products.krimirad.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '24',
    slug: 'mojbeograd',
    exactSlug: 'mojbeograd',
    nameKey: 'products.mojbeograd.name',
    artistKey: 'products.mojbeograd.artist',
    descriptionKey: 'products.mojbeograd.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '25',
    slug: 'nevaljala',
    exactSlug: 'nevaljala',
    nameKey: 'products.nevaljala.name',
    artistKey: 'products.nevaljala.artist',
    descriptionKey: 'products.nevaljala.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '26',
    slug: 'nikad',
    exactSlug: 'nikad',
    nameKey: 'products.nikad.name',
    artistKey: 'products.nikad.artist',
    descriptionKey: 'products.nikad.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '27',
    slug: 'puma1',
    exactSlug: 'puma1',
    nameKey: 'products.puma1.name',
    artistKey: 'products.puma1.artist',
    descriptionKey: 'products.puma1.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '28',
    slug: 'sat',
    exactSlug: 'sat',
    nameKey: 'products.sat.name',
    artistKey: 'products.sat.artist',
    descriptionKey: 'products.sat.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '29',
    slug: 'smztvj',
    exactSlug: 'smztvj',
    nameKey: 'products.smztvj.name',
    artistKey: 'products.smztvj.artist',
    descriptionKey: 'products.smztvj.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '30',
    slug: 'svesto',
    exactSlug: 'svesto',
    nameKey: 'products.svesto.name',
    artistKey: 'products.svesto.artist',
    descriptionKey: 'products.svesto.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics'],
    featured: false,
    new: false,
    trending: false
  },
  {
    id: '31',
    slug: 'cecapack',
    exactSlug: 'cecapack',
    nameKey: 'products.cecapack.name',
    artistKey: 'products.cecapack.artist',
    descriptionKey: 'products.cecapack.description',
    sizes: PRODUCT_SIZES,
    finishes: PRODUCT_FINISHES,
    tags: ['music', 'lyrics', 'pack'],
    featured: false,
    new: true,
    trending: false
  }
];

// Create lookup maps for efficient access
export const productsBySlug = PRODUCTS.reduce((acc, product) => {
  acc[product.slug] = product;
  return acc;
}, {} as Record<string, Product>);

export const productsById = PRODUCTS.reduce((acc, product) => {
  acc[product.id] = product;
  return acc;
}, {} as Record<string, Product>);

// Get featured, new, and trending products
export const featuredProducts = PRODUCTS.filter(p => p.featured);
export const newProducts = PRODUCTS.filter(p => p.new);
export const trendingProducts = PRODUCTS.filter(p => p.trending);

// Alias mapping for search and URL handling
export const ALIAS_MAPPINGS: Record<string, string> = {
  // Common misspellings and partial matches
  'idepe': 'idepetak',
  'petak': 'idepetak',
  'kazino': 'casino',
  'cas': 'casino',
  'laju': 'lajukuje',
  'kuje': 'lajukuje',
  'laju-kuje': 'lajukuje',
  'grsh': 'grshemiach',
  'vlado': 'vladoandjele',
  'andjele': 'vladoandjele',
  'elena': 'elenablakablaka',
  'blaka': 'elenablakablaka',
  'jeca': 'jecapack',
  'bang': 'bangbang',
  'zovi': 'zovime'
};

// Default product to use if no match is found
export const DEFAULT_PRODUCT_SLUG = 'idepetak';

/**
 * Get a product by its slug
 */
export function getProductBySlug(slug: string | undefined): Product | undefined {
  if (!slug) return productsBySlug[DEFAULT_PRODUCT_SLUG];
  
  // Normalize to lowercase
  const normalizedSlug = slug.toLowerCase().trim();
  
  // Direct match
  if (productsBySlug[normalizedSlug]) {
    return productsBySlug[normalizedSlug];
  }
  
  // Check for aliases/partial matches
  for (const [alias, productSlug] of Object.entries(ALIAS_MAPPINGS)) {
    if (normalizedSlug.includes(alias)) {
      return productsBySlug[productSlug];
    }
  }
  
  // Remove hyphens and try again
  if (normalizedSlug.includes('-')) {
    const dehyphenated = normalizedSlug.replace(/-/g, '');
    if (productsBySlug[dehyphenated]) {
      return productsBySlug[dehyphenated];
    }
  }
  
  // Default fallback
  return productsBySlug[DEFAULT_PRODUCT_SLUG];
}

/**
 * Get the full product image URL
 */
export function getProductImageUrl(slug: string): string {
  const product = getProductBySlug(slug);
  return `/product-photos/${product?.exactSlug || PRODUCTS[0].exactSlug}.png`;
}

// Helper functions for product calculations
export function calculateProductPrice(product: Product, sizeId: string, finishId: string): number {
  const size = product.sizes.find(s => s.id === sizeId);
  const finish = product.finishes.find(f => f.id === finishId);
  
  if (!size || !finish) return 0;
  
  return Math.round(size.price * finish.priceMultiplier);
}

// Export all product slugs for static site generation
export const ALL_PRODUCT_SLUGS = PRODUCTS.map(p => p.slug); 