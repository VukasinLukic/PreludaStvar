'use client';

import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { useParams } from 'next/navigation'; // Hook to get dynamic route parameters

export default function EditProductPage() {
  const params = useParams();
  const productId = params?.productId as string | undefined;

  if (!productId) {
    // Handle the case where productId is missing, though Next.js routing should prevent this
    return (
        <div className="p-4 md:p-8">
            <p className="text-red-500">Error: Product ID is missing.</p>
            <Link href="/bojanicnikola" className="text-indigo-600 hover:underline mt-2 inline-block">
                &larr; Back to Dashboard
            </Link>
        </div>
    );
  }

  // This page is protected by the AdminAuthLayout
  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
          <Link href="/bojanicnikola" className="text-indigo-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
      </div>
      {/* Pass the productId to the form to enable edit mode */}
      <ProductForm productId={productId} />
    </div>
  );
} 