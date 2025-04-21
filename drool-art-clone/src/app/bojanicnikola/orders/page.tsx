"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OrderList from '@/components/admin/OrderList';
import AdminLayout from '@/components/admin/AdminLayout';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';

export default function AdminOrdersPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        // Get the ID token with claims to check admin status
        const idTokenResult = await user.getIdTokenResult();
        if (idTokenResult.claims.admin) {
          setIsAdmin(true);
        } else {
          router.push('/bojanicnikola/login');
        }
      } else {
        router.push('/bojanicnikola/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Router will redirect, but this prevents flash of content
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Order Management</h1>
        <OrderList />
      </div>
    </AdminLayout>
  );
} 