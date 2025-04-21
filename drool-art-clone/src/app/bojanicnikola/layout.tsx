'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient'; // Use the client SDK

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AdminAuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // Only redirect if not already on the login page
        // This check might be needed if login page is within this layout
        // Alternatively, move login page outside this layout
        // For now, assume login page is separate or handled
        console.log('User is not authenticated, redirecting to login...');
        router.push('/bojanicnikola/login');
      } else {
        console.log('User is authenticated:', currentUser.uid);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();

  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading authentication state...</p>
        {/* Optional: Add a spinner */}
      </div>
    );
  }

  if (!user) {
    // User is not logged in, and redirection is likely happening.
    // Return null or a loading indicator while redirecting.
    return null; // Or a minimal loading state
  }

  // If authenticated, render the requested admin page
  return <>{children}</>;
} 