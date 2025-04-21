// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuvPP_ZNrp3nlT3gry0NNrpuKLZ4YoO90", // IMPORTANT: Consider using environment variables for sensitive keys
  authDomain: "preludast.firebaseapp.com",
  projectId: "preludast",
  // Note: storageBucket is for Firebase Storage, which we won't use directly here
  // We will use Supabase for storage instead.
  storageBucket: "preludast.firebasestorage.app",
  messagingSenderId: "624057464689",
  appId: "1:624057464689:web:dc89d930eddad38472e8d0",
  measurementId: "G-PJRYW6N5D6"
};

// Initialize Firebase
// Prevents initializing app multiple times, useful for Next.js hot reloading
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
let analytics;

// Initialize Analytics only if supported in the browser environment
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, firestore, analytics }; 