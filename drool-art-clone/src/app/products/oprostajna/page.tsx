import ProductClient from '../[slug]/ProductClient';

export default function OprostajnaProductPage() {
  // Directly render the product page with a specific slug
  return (
    <ProductClient params={{ slug: 'OPROSTAJNA' }} />
  );
} 