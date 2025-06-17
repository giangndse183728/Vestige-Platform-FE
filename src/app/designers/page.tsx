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
            <h1 className="text-3xl font-bold tracking-tight">Designers</h1>
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
              className="pl-10 pr-4 py-2 rounded-md border border-input focus:ring-2 focus:ring-primary focus:border-primary w-full"
            />
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative aspect-[4/3] w-full">
                    <Skeleton className="absolute inset-0" />
                  </div>
                  <div className="p-4 border-t">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                  </div>
                </Card>
              ))
            ) : (
              // Brand cards or No results message
              filteredBrands && filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <Card 
                    key={brand.brandId} 
                    className="overflow-hidden group hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] w-full bg-muted/10">
                      <Image
                        src={brand.logoUrl && isValidUrl(brand.logoUrl) ? brand.logoUrl : '/file.svg'}
                        alt={brand.name}
                        fill
                        className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4 border-t">
                      <h2 className="text-xl font-semibold text-center group-hover:text-primary transition-colors">
                        {brand.name}
                      </h2>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground text-lg">
                    No brands found matching your search.
                  </p>
                </div>
              )
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