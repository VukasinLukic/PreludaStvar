'use client';

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/data/products";

export interface ProductCardProps {
  product: {
    id: string | number;
    name: string;
    artist?: string;
    price: string | number;
    image: string;
    href: string;
    nameKey?: string;
    artistKey?: string;
  };
  showArtist?: boolean;
  size?: 'default' | 'small' | 'large';
  className?: string;
}

export function ProductCard({
  product,
  showArtist = true,
  size = 'default',
  className = '',
}: ProductCardProps) {
  const { t } = useLanguage();
  
  // Handle product with translation keys or direct values
  const displayName = product.nameKey ? t(product.nameKey) : product.name;
  const displayArtist = product.artistKey ? t(product.artistKey) : product.artist;
  
  // Calculate size-specific styles
  const getImageSizes = () => {
    switch(size) {
      case 'small': return { width: 200, height: 267 };
      case 'large': return { width: 400, height: 533 };
      default: return { width: 300, height: 400 };
    }
  };
  
  const imageSizes = getImageSizes();
  
  return (
    <div className={`group ${className}`}>
      <div className="relative mb-3 overflow-hidden">
        <Link href={product.href}>
          <Image
            src={product.image}
            alt={displayName}
            width={imageSizes.width}
            height={imageSizes.height}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>
      <Link href={product.href}>
        <h3 className="font-medium mb-1">{displayName}</h3>
      </Link>
      {showArtist && (
        <p className="text-sm text-gray-600 mb-2">
          {displayArtist ? displayArtist : t('product.inspiredBy')}
        </p>
      )}
      <div className="mt-2">
        <span className="font-medium">
          {typeof product.price === 'number' ? `${product.price} RSD` : product.price}
        </span>
      </div>
    </div>
  );
}

export default ProductCard; 