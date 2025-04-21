'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseClient'; // Use client SDK
import Link from 'next/link';

// Define the product structure based on Firestore data
interface FirestoreProduct {
  id: string; // Firestore document ID
  slug?: string; // Optional for now, but should be required
  name?: { sr: string; en: string };
  artist?: { sr: string; en: string };
  price?: number;
  imageURL?: string;
  isActive?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  saleMultiplier?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  // Add other fields as needed from your Firestore model
}

export default function ProductList() {
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const productsCollection = collection(firestore, 'products');
      const snapshot = await getDocs(productsCollection);

      if (snapshot.empty) {
        console.log('No products found in Firestore.');
        setProducts([]);
      } else {
        const productList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<FirestoreProduct, 'id'>), // Map data, ensure ID is included
        }));
        setProducts(productList);
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    console.log('Deleting product:', productId);
    try {
      const productDoc = doc(firestore, 'products', productId);
      await deleteDoc(productDoc);
      console.log('Product deleted successfully');
      // Refresh the list after deletion
      setProducts(products.filter(p => p.id !== productId));
      alert('Product deleted successfully!'); // Simple feedback
    } catch (err: any) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
      {/* TODO: Add Link/Button to Create New Product form */}
      <Link href="/bojanicnikola/products/new" className="mb-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200">
        Add New Product
      </Link>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="w-full bg-gray-100 border-b">
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name (SR)</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Price</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Active</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {products.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4">No products found.</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{product.name?.sr || product.id}</td>
                <td className="py-3 px-4">{product.price ? `${product.price} RSD` : 'N/A'}</td>
                <td className="py-3 px-4">{product.isActive ? 'Yes' : 'No'}</td>
                <td className="py-3 px-4">
                  <Link
                    href={`/bojanicnikola/products/${product.id}/edit`}
                    className="text-blue-600 hover:underline mr-2 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 