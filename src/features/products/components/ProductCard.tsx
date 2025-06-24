'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../schema';
import { Eye, Heart } from 'lucide-react';
import { formatVNDPrice } from '@/utils/format';
import { useWishlistStore } from '@/features/wishlist/store';
import { cn } from '@/utils/cn';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlistStore();
  const isInWishlist = isProductInWishlist(product.productId);

  const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault(); // Prevent navigating to product page
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.productId);
    } else {
      addToWishlist(product);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <Link href={`/products/${product.productId}`}>
      <div className="group relative bg-white/90 backdrop-blur-sm overflow-hidden border-2 border-black -mr-[2px] -mb-[2px]">
        <div className="absolute top-0 right-0 z-10 px-3 py-1 bg-black text-white text-xs font-metal uppercase shadow-sm">
          {product.condition}
        </div>
        
        <div className="relative aspect-[1/1] overflow-hidden bg-gray-100">
          {product.primaryImageUrl && isValidUrl(product.primaryImageUrl) ? (
            <Image 
              src={product.primaryImageUrl}
              alt={product.title}
              width={600}
              height={600}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <Image
              src="/placeholder.png"
              alt="No image available"
              width={600}
              height={600}
              className="w-full h-full object-contain opacity-60"
            />
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-3 border-b border-black/10 pb-1">
            <span className="text-[var(--dark-red)] mr-2">—</span>
            <span className="font-gothic text-xs uppercase tracking-wider text-black/80">
              {product.categoryName}
            </span>
          </div>
          
          <h3 className="font-serif text-xl font-bold mb-3 leading-tight truncate" title={product.title}>{product.title}</h3>
          <p className="text-black/70 text-sm mb-5 font-serif">Brand: {product.brandName}</p>
          <div className="flex items-center justify-between border-t border-black/10 pt-3">
            <span className="font-metal text-[var(--dark-red)]">Price: {formatVNDPrice(product.price)}</span>
            <div className="flex items-center gap-4 text-sm font-serif text-black/70">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {product.viewsCount}
              </span>
              <button onClick={handleWishlistToggle} className="flex items-center gap-1 z-20">
                <Heart className={cn("w-4 h-4", isInWishlist ? 'text-red-500 fill-current' : '')} />
                <span>{product.likesCount + (isInWishlist ? 1 : 0)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
