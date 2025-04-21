import Image from 'next/image';
import Link from 'next/link';
// import { useLanguage } from '@/contexts/LanguageContext'; // Removed client-side hook
import { ensureAltText } from '@/lib/utils';
import ProductCard from '@/components/products/ProductCard'; // Import reusable card
import { firestoreAdmin } from '@/lib/firebaseAdmin'; // Import Firestore admin instance

// TODO: Add i18n setup for server-side translations
// For now, use hardcoded or simplified text

// Define FirestoreProduct type based on Firestore data structure
interface FirestoreProduct {
  id: string; // Firestore document ID (slug)
  name: { sr: string; en: string };
  artist: { sr: string; en: string };
  price: number;
  imageURL: string;
  isNew?: boolean; // Optional metadata fields
  isOnSale?: boolean;
  saleMultiplier?: number;
}

// Implement Firestore fetching logic
async function getProductsFromFirestore(): Promise<FirestoreProduct[]> {
  try {
    const productsCollection = firestoreAdmin.collection('products');
    // Fetch only active products (if isActive field exists)
    // const snapshot = await productsCollection.where('isActive', '==', true).get();
    const snapshot = await productsCollection.get(); // Fetch all for now

    if (snapshot.empty) {
      console.log('No products found in Firestore.');
      return [];
    }

    const products: FirestoreProduct[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || { sr: 'N/A', en: 'N/A' }, // Provide defaults
        artist: data.artist || { sr: 'N/A', en: 'N/A' },
        price: typeof data.price === 'number' ? data.price : 0,
        imageURL: data.imageURL || '', // Use the Supabase URL
        isNew: data.isNew || false,
        isOnSale: data.isOnSale || false,
        saleMultiplier: data.saleMultiplier || 1,
        // Add other fields as needed
      };
    });

    return products;

  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    // In a real app, you might want to handle this error more gracefully
    return []; // Return empty array on error
  }
}

// This page is now a Server Component
export default async function PostersPage() {
  // const { t } = useLanguage(); // Removed client-side hook

  const products = await getProductsFromFirestore();

  return (
    <main className="min-h-screen pt-32 sm:pt-32 pb-8 sm:pb-16 bg-white font-sans">
      {/* Page Title */}
      <section className="py-4 sm:py-6 border-b border-gray-200">
        <div className="container-wide">
          <h1 className="font-sans-heading text-5xl sm:text-7xl md:text-8xl font-bold text-center mb-6 sm:mb-10 tracking-tight">
            ALL POSTERS
          </h1>
        </div>
      </section>

      {/* Products Gallery */}
      <section className="py-6 sm:py-12">
        <div className="container-wide">
          {products.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    // TODO: Get language preference server-side
                    name: product.name.sr, // Default to Serbian
                    artist: product.artist.sr,
                    price: product.price,
                    image: product.imageURL,
                    href: `/products/${product.id}`,
                    // Pass metadata for badges
                    isNew: product.isNew,
                    isOnSale: product.isOnSale,
                    saleMultiplier: product.saleMultiplier,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-16 bg-black text-white">
        <div className="container-wide text-center px-4">
          <h2 className="font-sans-heading text-2xl sm:text-3xl md:text-5xl mb-4 sm:mb-6">
            Find Inspiration
          </h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto">
            See how our posters fit...
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
            <span className="text-sm sm:text-base">Follow TikTok</span>
          </a>
        </div>
      </section>
    </main>
  );
} 