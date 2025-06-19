'use client';

import { useBrands } from '@/features/brand/hooks';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function DesignersPage() {
  const { data: brands, isLoading } = useBrands();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = brands?.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="font-metal text-3xl tracking-wider uppercase">Designers</h1>
            <p className="text-muted-foreground">
              Discover our curated collection of fashion designers and brands
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search designers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-input focus:ring-2 focus:ring-primary focus:border-primary w-full rounded-none"
            />
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden bg-white flex flex-col items-center rounded-none">
                  <div className="relative w-full h-40 flex items-center justify-center">
                    <Skeleton className="absolute inset-0" />
                    <div className="border-2 border-black w-full h-full absolute pointer-events-none z-10" />
                  </div>
                </Card>
              ))
            ) : (
              // Brand cards
              filteredBrands?.map((brand) => (
                <Card 
                  key={brand.brandId} 
                  className="overflow-hidden group hover:shadow-lg transition-all duration-300 bg-white rounded-none flex flex-col items-center border-2 border-black">
                  <div className="relative w-full h-40 flex items-center justify-center">
                    <Image
                      src={brand.logoUrl && isValidUrl(brand.logoUrl) ? brand.logoUrl : '/file.svg'}
                      alt={brand.name}
                      fill
                      className="object-contain w-full h-full"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="w-full py-3 px-4">
                    <h2 className="text-lg font-semibold text-center text-gray-900 truncate">{brand.name}</h2>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
} 