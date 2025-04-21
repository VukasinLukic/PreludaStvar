'use client';

import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from '@/lib/firebaseClient';
import { useRouter } from 'next/navigation'; // To redirect after logout
import ProductList from './ProductList'; // Import the new component

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    console.log('Logging out...');
    try {
      await signOut(auth);
      console.log('Logout successful');
      // The AdminAuthLayout should detect the sign-out via onAuthStateChanged
      // and redirect to login. Optionally, push manually if needed.
      // router.push('/bojanicnikola/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
        >
          Logout
        </button>
      </div>

      {/* Product Management Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <ProductList />
      </div>

      {/* TODO: Add other admin sections (Orders, Settings, etc.) */}
    </div>
  );
} 