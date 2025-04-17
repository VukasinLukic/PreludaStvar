'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount
  } = useCart();

  // Prevent body scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={toggleCart}
      />

      {/* Cart drawer */}
      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Korpa ({cartCount} {cartCount === 1 ? 'proizvod' : 'proizvoda'})
              </h2>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={toggleCart}
              >
                <span className="sr-only">Zatvori panel</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 px-4 py-6 sm:px-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-10">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Vaša korpa je prazna</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Pregledajte našu kolekciju i dodajte proizvode u korpu.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/posteri"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none"
                      onClick={toggleCart}
                    >
                      Pogledaj sve postere
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.cartItemId} className="py-6 flex">
                        <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md border border-gray-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <Link href={`/products/${item.id}`} onClick={toggleCart}>
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="ml-4">{(parseInt(item.price) * item.quantity)} RSD</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{item.artist}</p>
                            {item.size && <p className="mt-1 text-sm text-gray-500">Veličina: {item.size}</p>}
                            {item.finish && <p className="mt-1 text-sm text-gray-500">Ram: {item.finish}</p>}
                          </div>
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <div className="flex items-center border rounded">
                              <button
                                type="button"
                                className="p-2 text-gray-500 hover:text-gray-700"
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="px-2 text-gray-900">{item.quantity}</span>
                              <button
                                type="button"
                                className="p-2 text-gray-500 hover:text-gray-700"
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => removeFromCart(item.cartItemId)}
                            >
                              Ukloni
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer with checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Ukupno</p>
                  <p>{cartTotal} RSD</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Dostava i porezi se računaju prilikom plaćanja.</p>
                
                <div className="mt-6">
                  <Link
                    href="/cart"
                    className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800"
                    onClick={toggleCart}
                  >
                    Plaćanje
                  </Link>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    ili{' '}
                    <button
                      type="button"
                      className="text-black font-medium hover:text-gray-600"
                      onClick={toggleCart}
                    >
                      Nastavi kupovinu
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
