import { Timestamp } from 'firebase/firestore';

// Order item structure (individual product in an order)
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string | null;
  finish: string | null;
  image: string;
}

// Customer shipping information
export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  igUsername: string | null;
}

// Order status options
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';

// Base order data structure for Firestore
export interface OrderData {
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  shippedAt?: Timestamp;
  deliveredAt?: Timestamp;
  notes?: string;
}

// Order structure including the Firestore document ID
export interface Order extends OrderData {
  id: string; // Firestore document ID
} 