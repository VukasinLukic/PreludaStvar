import ProductClient from '../[slug]/ProductClient';

export default function BangbangProductPage() {
  // Directly render the product page with a specific slug
  return (
    <ProductClient params={{ slug: 'bangbang' }} />
  );
} 