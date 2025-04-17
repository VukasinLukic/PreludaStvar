import ProductClient from '../[slug]/ProductClient';

export default function MkmzProductPage() {
  // Directly render the product page with a specific slug
  return (
    <ProductClient params={{ slug: 'MKMZ' }} />
  );
} 