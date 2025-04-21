import { Product } from "../types/product";

// Base URL for Firebase Functions
const FUNCTIONS_BASE_URL = process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL || "https://europe-west1-preludast.cloudfunctions.net";

/**
 * Fetches all products from Firebase Functions
 */
export async function fetchProducts(): Promise<Product[]> {
  console.log(`Fetching products from: ${FUNCTIONS_BASE_URL}/getProducts`);
  try {
    const response = await fetch(`${FUNCTIONS_BASE_URL}/getProducts`);

    if (!response.ok) {
      let errorData: any = { error: "Failed to fetch products", status: response.status };
      try {
        errorData = await response.json();
      } catch (e) { /* Ignore json parsing error */ }
      console.error("Fetch Products API Error Response:", errorData);
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }

    const products: Product[] = await response.json();
    console.log(`Successfully fetched ${products.length} products.`);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Re-throw the error so calling components can handle it
    throw error;
  }
}

/**
 * Fetches a single product by slug from Firebase Functions
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  console.log(`Fetching product by slug: ${slug} from: ${FUNCTIONS_BASE_URL}/getProductBySlug`);
  if (!slug) {
    console.error("fetchProductBySlug called with empty slug.");
    return null;
  }

  try {
    const response = await fetch(`${FUNCTIONS_BASE_URL}/getProductBySlug?slug=${encodeURIComponent(slug)}`);

    if (!response.ok) {
        // Handle 404 specifically
      if (response.status === 404) {
        console.warn(`Product with slug "${slug}" not found (404).`);
        return null; // Return null for not found
      }
      // Handle other errors
      let errorData: any = { error: `Failed to fetch product ${slug}`, status: response.status };
      try {
        errorData = await response.json();
      } catch (e) { /* Ignore json parsing error */ }
      console.error(`Fetch Product API Error Response (slug: ${slug}):`, errorData);
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }

    const product: Product = await response.json();
    console.log(`Successfully fetched product: ${product.name?.en || product.id}`);
    return product;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    // Re-throw the error so calling components can handle it
    throw error;
  }
}

/**
 * Fetches products for homepage display (featured, trending, latest)
 * This replaces the hardcoded data in the homepage component
 */
export async function fetchHomepageProducts(): Promise<{
  bestSellers: Product[];
  trending: Product[];
  latest: Product[];
}> {
  try {
    // Fetch all products
    const allProducts = await fetchProducts();
    
    // Filter for different sections
    const bestSellers = allProducts
      .filter(product => product.isOnSale === true)
      .slice(0, 4); // Limit to 4 products
      
    const trending = allProducts
      .filter(product => product.isNew === true)
      .slice(0, 4); // Limit to 4 products
      
    const latest = allProducts
      .sort((a, b) => {
        // Sort by createdAt timestamp if available
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
      })
      .slice(0, 2); // Limit to 2 products

    return {
      bestSellers: bestSellers.length > 0 ? bestSellers : [], 
      trending: trending.length > 0 ? trending : [],
      latest: latest.length > 0 ? latest : []
    };
  } catch (error) {
    console.error("Error fetching homepage products:", error);
    // Return empty arrays as fallback
    return {
      bestSellers: [],
      trending: [],
      latest: []
    };
  }
} 