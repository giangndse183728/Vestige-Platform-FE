'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Brand } from '../schema';

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <Link href={`/marketplace?brand=${brand.brandId}`}>
      <Card className="group relative bg-white overflow-hidden border-2 border-black -mr-[2px] -mb-[2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer rounded-none">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {brand.logoUrl && isValidUrl(brand.logoUrl) ? (
            <Image 
              src={brand.logoUrl}
              alt={brand.name}
              width={400}
              height={400}
              className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="text-4xl mb-2 opacity-40">🏷️</div>
                <p className="font-gothic text-xs text-gray-400 uppercase tracking-wider">No Logo</p>
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-metal text-lg mb-2 leading-tight truncate" title={brand.name}>
            {brand.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="font-gothic text-xs text-gray-600 uppercase tracking-wider">
              Est. {brand.createdAt ? new Date(brand.createdAt).getFullYear() : '2025'}
            </span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-black"></div>
              <span className="font-gothic text-xs text-gray-500 uppercase tracking-wider">Premium</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 