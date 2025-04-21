import ProductClient from './ProductClient';
import { notFound } from 'next/navigation';
import { ALL_PRODUCT_SLUGS, getProductSlug } from '@/lib/productRoutes';

// Define a list of product slugs for static generation
export async function generateStaticParams() {
  // Use the product routes helper to get all slugs
  return ALL_PRODUCT_SLUGS.map(slug => ({ slug }));
}

export const metadata = {
  title: 'PreludaStvar | Pojedinačni poster',
  description: 'Pogledajte naše jedinstvene postere inspirisane muzikom',
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  // Validate the slug
  if (!params?.slug) {
    console.error("ProductPage: No slug provided in params");
    return notFound();
  }

  // Get the normalized slug to ensure consistent product loading
  // const normalizedSlug = getProductSlug(params.slug);
  // console.log(`ProductPage: Processing slug: ${params.slug} → ${normalizedSlug}`);

  // Return the ProductClient component with the params
  return (
    <div>
      {/* Pass the raw slug, let Client component handle normalization */}
      <ProductClient params={{ slug: params.slug }} />
    </div>
  );
}
