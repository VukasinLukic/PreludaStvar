'use client';

import { useState, useEffect } from 'react';
import { useCart, CartItem } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { ensureAltText } from '@/lib/utils';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseClient';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
  igUsername?: string;
}

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [showIgPromo, setShowIgPromo] = useState(false);
  const [igUsername, setIgUsername] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Srbija',
    notes: '',
    igUsername: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = () => {
    setShowIgPromo(true);
  };

  const handleIgPromoSubmit = () => {
    if (igUsername) {
      setShowIgPromo(false);
      setIsCheckingOut(true);
      setShippingInfo(prev => ({ ...prev, igUsername }));
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    console.log('Slanje porudžbine:', { proizvodi: cartItems, podaci: shippingInfo });

    const { subtotal, igDiscount, finalTotal } = calculateTotals();

    const orderData = {
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: parseInt(item.price),
        quantity: item.quantity,
        size: item.size || null,
        finish: item.finish || null,
        image: item.image || ''
      })),
      shippingInfo: {
        ...shippingInfo,
        igUsername: igUsername || null,
      },
      subtotal: subtotal,
      discount: igDiscount,
      total: finalTotal,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    try {
      // 1. Sačuvaj porudžbinu u Firestore
      const ordersCollection = collection(firestore, 'orders');
      const docRef = await addDoc(ordersCollection, orderData);
      const orderId = docRef.id;
      console.log('Porudžbina sačuvana u Firestore sa ID:', orderId);

      // 2. Pošalji email potvrdu
      try {
        const emailResponse = await fetch('/api/send-order-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            customerEmail: shippingInfo.email,
            orderItems: cartItems.map(item => ({
              name: item.name,
              price: parseInt(item.price),
              quantity: item.quantity,
              size: item.size,
              finish: item.finish,
            })),
            shippingAddress: {
              address: shippingInfo.address,
              city: shippingInfo.city,
              postalCode: shippingInfo.postalCode,
              country: shippingInfo.country,
            },
            orderTotal: finalTotal,
            igDiscount: igDiscount > 0 ? igDiscount : undefined,
          }),
        });

        if (!emailResponse.ok) {
          // Ako email nije poslat, samo beležimo grešku, ali nastavljamo jer je porudžbina već sačuvana
          console.error('Greška prilikom slanja email potvrde:', await emailResponse.text());
        } else {
          console.log('Email potvrda uspešno poslata');
        }
      } catch (emailError) {
        console.error('Izuzetak prilikom slanja email potvrde:', emailError);
        // Nastavljamo sa procesom čak i ako email ne uspe
      }

      // 3. Očisti korpu i prikaži potvrdu
      setIsOrderComplete(true);
      clearCart();

    } catch (error) {
      console.error('Greška prilikom čuvanja porudžbine u Firestore:', error);
      setSubmitError('Došlo je do greške prilikom slanja porudžbine. Molimo pokušajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate discounts and totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + (parseInt(item.price) * item.quantity), 0);
    const igDiscount = igUsername ? Math.round(subtotal * 0.1) : 0;
    const finalTotal = subtotal - igDiscount;

    return {
      subtotal,
      igDiscount,
      finalTotal
    };
  };

  const { subtotal, igDiscount, finalTotal } = calculateTotals();

  if (cartItems.length === 0 && !isOrderComplete) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Korpa</h1>
          
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Vaša korpa je prazna</h2>
            <p className="mb-8">Dodajte neke proizvode u korpu pre nego što nastavite</p>
            <Link 
              href="/posteri"
              className="bg-black text-white px-6 py-3 rounded-full font-medium"
            >
              Pogledaj postere
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isOrderComplete) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-green-50 border border-green-200 p-10 rounded-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-green-800">Porudžbina uspešno primljena!</h2>
              <p className="text-lg mb-8 text-green-700">
                Hvala na porudžbini! Poslali smo Vam email sa detaljima Vaše porudžbine.
                Očekujte isporuku u roku od 3-5 radnih dana.
              </p>
              <Link 
                href="/"
                className="bg-black text-white px-8 py-3 rounded-full font-medium"
              >
                Nazad na početnu
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Instagram Promo Modal */}
        {showIgPromo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Osvoji 10% popusta!</h3>
              <p className="mb-6">Zaprati nas na Instagramu @preludastvar i osvoji 10% popusta na tvoju porudžbinu! Unesi svoj Instagram username ispod:</p>
              <input
                type="text"
                value={igUsername}
                onChange={(e) => setIgUsername(e.target.value)}
                placeholder="@tvoj_username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowIgPromo(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                >
                  Preskoči
                </button>
                <button
                  onClick={handleIgPromoSubmit}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-md"
                  disabled={!igUsername}
                >
                  Potvrdi
                </button>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-8">Korpa</h1>
        
        <div className="lg:grid lg:grid-cols-12 gap-8">
          {!isCheckingOut ? (
            <>
              <div className="lg:col-span-8">
                {/* Cart Items */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Proizvodi</h2>
                    
                    <div className="divide-y">
                      {cartItems.map((item) => (
                        <div key={item.cartItemId} className="py-6 flex flex-wrap md:flex-nowrap">
                          <div className="w-full md:w-24 h-32 md:h-24 relative mb-4 md:mb-0 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={ensureAltText(item.name, "Cart item")}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="md:ml-6 flex-grow">
                            <div className="flex flex-wrap justify-between mb-2">
                              <h3 className="text-lg font-medium">{item.name}</h3>
                              <p className="font-medium">{parseInt(item.price) * item.quantity} RSD</p>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{item.artist}</p>
                            {item.size && <p className="text-gray-600 text-sm">Veličina: {item.size}</p>}
                            {item.finish && <p className="text-gray-600 text-sm">Ram: {item.finish}</p>}
                            
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center border border-gray-300 rounded">
                                <button
                                  onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                                  className="w-8 h-8 flex items-center justify-center"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                              
                              <button 
                                onClick={() => removeFromCart(item.cartItemId)}
                                className="text-red-600 text-sm font-medium"
                              >
                                Ukloni
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-4 mt-8 lg:mt-0">
                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Pregled porudžbine</h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Ukupno proizvoda</span>
                        <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cena proizvoda</span>
                        <span>{subtotal} RSD</span>
                      </div>
                      {igUsername && (
                        <div className="flex justify-between text-green-600">
                          <span>Instagram popust (10%)</span>
                          <span>-{igDiscount} RSD</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Dostava</span>
                        <span>Besplatno</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-bold">
                        <span>Ukupno</span>
                        <span>{finalTotal} RSD</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      {cartItems.length > 0 && (
                        <button
                          onClick={handleCheckout}
                          className="w-full bg-black text-white px-6 py-3 rounded-full font-medium"
                        >
                          Nastavi dalje
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="lg:col-span-8">
                {/* Checkout Form */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">Podaci za dostavu</h2>
                    
                    <form onSubmit={handleSubmitOrder}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium mb-2">Ime</label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={shippingInfo.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium mb-2">Prezime</label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={shippingInfo.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={shippingInfo.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-2">Telefon</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={shippingInfo.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="address" className="block text-sm font-medium mb-2">Adresa</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium mb-2">Grad</label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={shippingInfo.city}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label htmlFor="postalCode" className="block text-sm font-medium mb-2">Poštanski broj</label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={shippingInfo.postalCode}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium mb-2">Država</label>
                          <select
                            id="country"
                            name="country"
                            value={shippingInfo.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          >
                            <option value="Srbija">Srbija</option>
                            <option value="Hrvatska">Hrvatska</option>
                            <option value="Bosna i Hercegovina">Bosna i Hercegovina</option>
                            <option value="Crna Gora">Crna Gora</option>
                            <option value="Severna Makedonija">Severna Makedonija</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="notes" className="block text-sm font-medium mb-2">Napomene</label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={shippingInfo.notes}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="Dodatne informacije za dostavu..."
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => setIsCheckingOut(false)}
                          className="border border-black text-black py-3 px-6 rounded-full font-medium"
                        >
                          Nazad na korpu
                        </button>
                        <button
                          type="submit"
                          className="bg-black text-white py-3 px-6 rounded-full font-medium"
                        >
                          Naruči
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-4 mt-8 lg:mt-0">
                {/* Order Summary for Checkout */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Pregled porudžbine</h2>
                    
                    <div className="divide-y">
                      {cartItems.map((item) => (
                        <div key={`${item.id}-${item.size}-${item.finish}-summary`} className="py-3 flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              {item.size && `${item.size} `}
                              {item.finish && `/ ${item.finish}`}
                              {` × ${item.quantity}`}
                            </p>
                          </div>
                          <p className="font-medium">{parseInt(item.price) * item.quantity} RSD</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between mb-2">
                        <span>Ukupno proizvoda</span>
                        <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Cena proizvoda</span>
                        <span>{subtotal} RSD</span>
                      </div>
                      {igUsername && (
                        <div className="flex justify-between text-green-600">
                          <span>Instagram popust (10%)</span>
                          <span>-{igDiscount} RSD</span>
                        </div>
                      )}
                      <div className="flex justify-between mb-2">
                        <span>Dostava</span>
                        <span>Besplatno</span>
                      </div>
                      <div className="border-t pt-3 mt-2 flex justify-between font-bold">
                        <span>Ukupno</span>
                        <span>{finalTotal} RSD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="lg:col-span-12 mt-4 text-red-600 text-center">
                  {submitError}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 