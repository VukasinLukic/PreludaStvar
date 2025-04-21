import { Timestamp } from 'firebase/firestore'; // Use Firestore timestamp for consistency

// Base data structure stored in Firestore
export interface ProductData {
  slug: string;
  name: { sr: string; en: string };
  artist: { sr: string; en: string };
  price: number; // Base price, variations might affect final price
  imageURL: string;
  isActive?: boolean; // Controls visibility in the store
  isNew?: boolean;
  isOnSale?: boolean;
  saleMultiplier?: number; // e.g., 0.8 for 20% off
  createdAt?: Timestamp; // Managed by Firestore serverTimestamp
  updatedAt?: Timestamp; // Managed by Firestore serverTimestamp
  // Add other metadata fields as needed (e.g., tags, descriptionKey)
}

// Product structure including the Firestore document ID
export interface Product extends ProductData {
  id: string; // Firestore document ID
}

// You might add other related types here later if needed
// e.g., for cart items, order items, etc. 