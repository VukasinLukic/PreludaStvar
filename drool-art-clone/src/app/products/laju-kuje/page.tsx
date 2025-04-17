import { redirect } from 'next/navigation';

export default function LajuKujePage() {
  // Force redirect to the product page with correct parameter
  redirect('/products/lajukuje');
  
  return null; // This won't render as we're redirecting
} 