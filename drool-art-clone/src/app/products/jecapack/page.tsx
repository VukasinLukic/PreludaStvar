import ProductClient from '../[slug]/ProductClient';

export default function JecapackProductPage() {
  // Directly render the product page with a specific slug
  return (
    <ProductClient params={{ slug: 'JECAPACK' }} />
  );
} 