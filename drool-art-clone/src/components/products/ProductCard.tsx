'use client';

import Image from "next/image";
import Link from "next/link";

export interface ProductCardProps {
  product: {
    id: string | number;
    name: string;
    artist?: string;
    price: number;
    image: string;
    href: string;
    isNew?: boolean;
    isOnSale?: boolean;
    saleMultiplier?: number;
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
  // Calculate size-specific styles
  const getImageSizes = () => {
    switch(size) {
      case 'small': return { width: 200, height: 267 };
      case 'large': return { width: 400, height: 533 };
      default: return { width: 300, height: 400 };
    }
  };
  
  const imageSizes = getImageSizes();
  
  // Calculate sale price
  const isOnSale = product.isOnSale && product.saleMultiplier && product.saleMultiplier < 1;
  const salePrice = isOnSale ? Math.round(product.price * (product.saleMultiplier as number)) : null;

  return (
    <div className={`group relative ${className}`}>
      <div className="relative mb-3 overflow-hidden">
        <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
          {product.isNew && (
            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
              Novo
            </span>
          )}
          {isOnSale && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
              Akcija
            </span>
          )}
        </div>
        <Link href={product.href}>
          <Image
            src={product.image || '/placeholder-image.png'}
            alt={product.name}
            width={imageSizes.width}
            height={imageSizes.height}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            priority={true}
          />
        </Link>
      </div>
      <Link href={product.href}>
        <h3 className="font-medium mb-1 truncate">{product.name}</h3>
      </Link>
      {showArtist && (
        <p className="text-sm text-gray-600 mb-2">
          {product.artist ? product.artist : 'Inspired Design'}
        </p>
      )}
      <div className="mt-2">
        {isOnSale && salePrice !== null ? (
          <div className="flex items-baseline space-x-2">
            <span className="font-medium text-red-600">{salePrice} RSD</span>
            <span className="text-sm text-gray-500 line-through">{product.price} RSD</span>
          </div>
        ) : (
          <span className="font-medium">{product.price} RSD</span>
        )}
      </div>
    </div>
  );
}

export default ProductCard; 