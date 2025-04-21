'use client'; // Form interaction requires client component

import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";

export default function AddProductPage() {
  // This page is protected by the AdminAuthLayout
  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
          <Link href="/bojanicnikola" className="text-indigo-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
      </div>
      <ProductForm />
    </div>
  );
} 