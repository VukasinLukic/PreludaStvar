import ProductClient from '../[slug]/ProductClient';

export default function ZovimeProductPage() {
  // Directly render the product page with a specific slug
  return (
    <ProductClient params={{ slug: 'zovime' }} />
  );
} 