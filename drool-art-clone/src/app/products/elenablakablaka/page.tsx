import ProductClient from '../[slug]/ProductClient';

export default function ElenablakablakaProductPage() {
  // Directly render the product page with a specific slug
  return (
    <ProductClient params={{ slug: 'ELENABLAKABLAKA' }} />
  );
} 