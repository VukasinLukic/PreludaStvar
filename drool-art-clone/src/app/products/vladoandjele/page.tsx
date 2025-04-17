import ProductClient from '../[slug]/ProductClient';

export default function VlaDoAndjeleProductPage() {
  // Directly render the product page with a specific slug
  return (
    <ProductClient params={{ slug: 'VLADOANDJELE' }} />
  );
} 