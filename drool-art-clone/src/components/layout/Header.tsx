'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, toggleCart } = useCart();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent scrolling when mobile menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/85 backdrop-blur-md shadow-sm py-2'
          : 'bg-white/75 backdrop-blur-sm py-3'
      }`}
    >
      {/* Promotional banner with subtle animation */}
      <div className="bg-black text-white text-center py-2 text-sm overflow-hidden">
        <p className="animate-pulse font-medium px-4 whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="inline-block mx-1">✨</span> 
          {t('common.currentSale')} 
          <span className="inline-block mx-1">✨</span>
        </p>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Logo with subtle hover effect */}
          <Link 
            href="/" 
            className="relative z-10 transition-transform duration-300 hover:scale-105 -ml-4"
          >
            <Image 
              src="/assets/images/logos/preludastvar1.png" 
              alt="PreludaStvar" 
              width={160} 
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Main Navigation - Desktop with enhanced animations */}
          <nav className="hidden md:flex items-center space-x-12">
            {[
              { href: '/posteri', label: t('common.posters') },
              { href: '/cesta-pitanja', label: t('faq.title') },
              { href: '/o-nama', label: t('common.aboutUs') },
              { href: '/kontakt', label: t('common.contactUs') }
            ].map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`text-base font-medium relative group transition-colors duration-300 ${
                  pathname === item.href 
                    ? 'text-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <span>{item.label}</span>
                <span 
                  className={`absolute -bottom-1 left-0 h-0.5 bg-black transform transition-all duration-300 ease-out ${
                    pathname === item.href 
                      ? 'w-full' 
                      : 'w-0 group-hover:w-full'
                  }`}
                  style={{ transformOrigin: 'left' }}
                ></span>
              </Link>
            ))}
          </nav>

          {/* Right Side Icons with enhanced interactivity */}
          <div className="flex items-center space-x-6">
            {/* Language switcher with improved design */}
            <button 
              onClick={() => setLanguage(language === 'sr' ? 'en' : 'sr')}
              className="p-1.5 hover:opacity-70 transition-opacity duration-200"
              aria-label={language === 'sr' ? 'Promeni jezik na engleski' : 'Change language to Serbian'}
            >
              {language === 'sr' ? (
                <span className="flex items-center text-base font-medium">
                  <span className="font-bold">SR</span>
                  <span className="mx-1 text-gray-400">|</span>
                  <span className="text-gray-400">EN</span>
                </span>
              ) : (
                <span className="flex items-center text-base font-medium">
                  <span className="text-gray-400">SR</span>
                  <span className="mx-1 text-gray-400">|</span>
                  <span className="font-bold">EN</span>
                </span>
              )}
            </button>
            
            {/* Cart button with animation */}
            <button 
              onClick={toggleCart}
              className="relative p-1.5 hover:opacity-70 transition-opacity duration-200 focus:outline-none"
              aria-label={t('cart.title')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              {/* Cart count badge with enter animation */}
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-black rounded-full transform translate-x-1/2 -translate-y-1/2 animate-scaleIn">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle with improved animation */}
            <button 
              className="md:hidden p-1.5 z-50 focus:outline-none" 
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Zatvori meni' : 'Otvori meni'}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center relative">
                <span 
                  className={`block w-6 h-0.5 bg-black absolute transition-all duration-300 ease-out ${
                    isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                  }`}
                ></span>
                <span 
                  className={`block w-6 h-0.5 bg-black absolute transition-all duration-300 ease-out ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                ></span>
                <span 
                  className={`block w-6 h-0.5 bg-black absolute transition-all duration-300 ease-out ${
                    isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with improved animation and design */}
      <div 
        className={`fixed inset-0 bg-white z-40 transition-transform duration-500 ease-in-out transform ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="container mx-auto px-4 py-8 h-full flex flex-col">
          <div className="flex justify-end mb-8">
            {/* Close button is now handled by the animated hamburger */}
          </div>

          <nav className="flex flex-col space-y-8 items-center justify-center flex-1">
            {[
              { href: '/posteri', label: t('common.posters') },
              { href: '/cesta-pitanja', label: t('faq.title') },
              { href: '/o-nama', label: t('common.aboutUs') },
              { href: '/kontakt', label: t('common.contactUs') }
            ].map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`text-2xl font-medium py-2 relative group transition-colors duration-300 ${
                  pathname === item.href 
                    ? 'text-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
                onClick={toggleMobileMenu}
              >
                <span>{item.label}</span>
                <span 
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-black transform transition-all duration-300 ease-out ${
                    pathname === item.href 
                      ? 'w-full' 
                      : 'w-0 group-hover:w-full'
                  }`}
                  style={{ transformOrigin: 'left' }}
                ></span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pb-8 flex justify-center">
            <button 
              onClick={() => {
                setLanguage(language === 'sr' ? 'en' : 'sr');
                toggleMobileMenu();
              }}
              className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-200"
            >
              {language === 'sr' ? (
                <span className="flex items-center text-base font-medium px-3">
                  <span className="font-bold">SR</span>
                  <span className="mx-1 text-gray-400">|</span>
                  <span className="text-gray-400">EN</span>
                </span>
              ) : (
                <span className="flex items-center text-base font-medium px-3">
                  <span className="text-gray-400">SR</span>
                  <span className="mx-1 text-gray-400">|</span>
                  <span className="font-bold">EN</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
