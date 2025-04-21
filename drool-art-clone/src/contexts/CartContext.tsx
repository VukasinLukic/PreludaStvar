'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Fix useState null error by ensuring proper React behavior in server components
if (typeof React.useState !== 'function') {
  throw new Error('CartContext must be used within a ClientProvider component');
}

// Define types
export type CartItem = {
  id: number | string;
  name: string;
  artist: string;
  price: string;
  image: string;
  quantity: number;
  size?: string;
  finish?: string;
  // Add composite key for uniquely identifying items with the same options
  cartItemId: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'cartItemId'>, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  cartTotal: number;
  cartCount: number;
};

// Create context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isCartOpen: false,
  toggleCart: () => {},
  cartTotal: 0,
  cartCount: 0,
});

// Helper function to generate a unique cart item ID
const generateCartItemId = (id: number | string, size?: string, finish?: string): string => {
  return `${id}-${size || 'default'}-${finish || 'none'}`;
};

// Create a provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize cart with empty array first to avoid hydration issues
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Load cart data from localStorage only on client side after initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          // Parse stored cart items and ensure they have cartItemId
          const parsed = JSON.parse(savedCart);
          const itemsWithId = parsed.map((item: any) => ({
            ...item,
            cartItemId: item.cartItemId || generateCartItemId(item.id, item.size, item.finish)
          }));
          setCartItems(itemsWithId);
        } catch (error) {
          console.error('Error parsing cart data:', error);
          setCartItems([]);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Add an item to the cart
  const addToCart = (item: Omit<CartItem, 'quantity' | 'cartItemId'>, quantity: number = 1) => {
    // Generate a unique ID for this cart item based on product ID, size, and finish
    const cartItemId = generateCartItemId(item.id, item.size, item.finish);
    
    setCartItems(prevItems => {
      // Find existing item with the same cartItemId
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.cartItemId === cartItemId);

      if (existingItemIndex > -1) {
        // Item with these exact options exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }

      // Item doesn't exist with these options, add it as new with the cartItemId
      return [...prevItems, { ...item, quantity, cartItemId }];
    });

    // Open the cart drawer when adding items
    setIsCartOpen(true);
  };

  // Remove an item from the cart using cartItemId
  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  // Update the quantity of an item using cartItemId
  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  };

  // Toggle the cart drawer
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  // Simple cart total calculation - just multiply price by quantity and sum
  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (parseInt(item.price) * item.quantity), 0);
  };

  // Calculate total number of items
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Provide the cart context to children
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
        cartTotal: calculateCartTotal(),
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using the cart context
export const useCart = () => useContext(CartContext);
