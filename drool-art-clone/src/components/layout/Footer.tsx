'use client';

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className="bg-black text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between border-t border-gray-800 gap-8">
        <div className="mb-6 md:mb-0">
          <Image src="/assets/images/logos/logo1.png" alt="PreludaStvar" width={120} height={40} className="h-12 w-auto" />
          <p className="mt-4 text-gray-400 max-w-xs">
            {t('footer.newsletterText')}
          </p>
          
          <div className="mt-6 flex space-x-4">
            <a href="https://instagram.com/preludastvar" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://tiktok.com/@preludastvar" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.321 5.562a5.124 5.124 0 0 1-3.035-2.535c-.144-.315-.246-.651-.304-1.002h-3.039v13.943c0 1.349-1.126 2.439-2.517 2.439a2.518 2.518 0 0 1-2.517-2.497c0-1.38 1.126-2.5 2.517-2.5.242 0 .477.035.7.101v-3.16a6.04 6.04 0 0 0-.7-.044c-3.091 0-5.604 2.47-5.604 5.504 0 3.033 2.513 5.503 5.604 5.503 3.091 0 5.603-2.47 5.603-5.503V8.969c1.025.846 2.33 1.357 3.755 1.357V7.118c-.667 0-1.302-.152-1.865-.422a3.52 3.52 0 0 1-.598-.334V5.562z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 flex-1 md:ml-8">
          <div>
            <h3 className="font-bold mb-4 uppercase text-sm">{t('footer.shop')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/posteri" className="hover:text-white transition">{t('footer.allPosters')}</Link></li>
              <li><Link href="/posteri" className="hover:text-white transition">{t('footer.bestSellers')}</Link></li>
              <li><Link href="/akcija" className="hover:text-white transition">{t('common.sale')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 uppercase text-sm">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/cesta-pitanja" className="hover:text-white transition">{t('footer.help')}</Link></li>
              <li><Link href="/kontakt" className="hover:text-white transition">{t('common.contactUs')}</Link></li>
              <li><a href="mailto:info@preludastvar.rs" className="hover:text-white transition">info@preludastvar.rs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 uppercase text-sm">{t('footer.newsletterTitle')}</h3>
            <p className="text-sm text-gray-400 mb-3">{t('footer.newsletterText')}</p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder={t('common.emailPlaceholder')}
                className="bg-gray-800 text-white px-4 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-600 rounded-md"
              />
              <button className="bg-white text-black px-4 py-2 text-sm hover:bg-gray-200 transition rounded-md w-full">
                {t('common.subscribe')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-800 px-4 py-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} PreludaStvar. {t('common.allRightsReserved')}
          </div>
          <div className="flex flex-wrap space-x-3 md:space-x-4 text-xs text-gray-400">
            <Link href="/uslovi-koriscenja" className="hover:text-white transition">{t('common.termsOfUse')}</Link>
            <span>|</span>
            <Link href="/politika-privatnosti" className="hover:text-white transition">{t('common.privacyPolicy')}</Link>
            <span>|</span>
            <button 
              onClick={() => setLanguage('sr')} 
              className={`hover:text-white transition ${language === 'sr' ? 'text-white font-bold' : ''}`}
            >
              SR
            </button>
            <span>|</span>
            <button 
              onClick={() => setLanguage('en')} 
              className={`hover:text-white transition ${language === 'en' ? 'text-white font-bold' : ''}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
