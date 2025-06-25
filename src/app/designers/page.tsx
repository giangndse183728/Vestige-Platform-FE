'use client';

import { useBrands } from '@/features/brand/hooks';
import { BrandCard } from '@/features/brand/components/BrandCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

export default function DesignersPage() {
  const { data: brands, isLoading } = useBrands();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = brands?.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Layout distribution similar to editorial
  const featuredBrands = filteredBrands?.slice(0, 6) || [];
  const remainingBrands = filteredBrands?.slice(8) || [];

  return (
    <div className="container mx-auto px-2 py-8 mt-8 bg-black/10">
      <div className="max-w-8xl mx-auto">
        {/* Editorial Style Header */}
        <div className="mb-12 relative border-b-6 border-black pb-8">
          <div className="text-center mb-2 p-4">
            <div className="relative inline-block">
              <h1 className="text-7xl font-metal tracking-widest">THE DESIGNERS HERALD</h1>
            </div>
            <div className="flex justify-center mt-4 space-x-8">
              <span className="text-sm font-metal">VOLUME I</span>
              <span className="text-sm font-metal">•</span>
              <span className="text-sm font-metal">{format(new Date(), 'EEEE, MMMM d, yyyy').toUpperCase()}</span>
              <span className="text-sm font-metal">•</span>
              <span className="text-sm font-metal">FASHION EDITION</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="relative w-[350px]">
              <Input 
                type="text" 
                placeholder="Search designers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg border-2 border-black focus:border-red-900 focus:ring-red-900"
              />
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" 
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white text-xs px-3 py-2">ALL</Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white text-xs px-3 py-2">LUXURY</Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white text-xs px-3 py-2">STREETWEAR</Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white text-xs px-3 py-2">VINTAGE</Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white text-xs px-3 py-2">CONTEMPORARY</Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-px gap-y-px bg-black border-2 border-black">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white p-6">
                  <Skeleton className="h-40 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brands Content */}
        {!isLoading && (
          <div className="space-y-8">
            {/* Featured Brands Section */}
            {featuredBrands.length > 0 && (
              <section className="grid grid-cols-12 gap-6">
                {/* Main Featured Brand */}
                {featuredBrands[0] && (
                  <div className="col-span-12 lg:col-span-8">
                    <div className="relative border-4 border-black bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                      <div className="absolute top-4 left-4 bg-red-900 text-white px-3 py-1 font-metal text-xs z-10">
                        FEATURED
                      </div>
                      <div className="relative h-80 border-b-4 border-black bg-gray-100 flex items-center justify-center">
                        {featuredBrands[0].logoUrl ? (
                          <img
                            src={featuredBrands[0].logoUrl}
                            alt={featuredBrands[0].name}
                            className="max-w-full max-h-full object-contain p-8"
                          />
                        ) : (
                          <div className="text-gray-400 text-center">
                            <div className="text-6xl mb-4">🏷️</div>
                            <p className="font-gothic">No Logo Available</p>
                          </div>
                        )}
                      </div>
                      <div className="p-8">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-lg font-metal text-red-800 uppercase tracking-wider">FEATURED DESIGNER</span>
                          <span className="text-sm text-gray-500">
                            Est. {featuredBrands[0].createdAt ? new Date(featuredBrands[0].createdAt).getFullYear() : '2025'}
                          </span>
                        </div>
                        <h2 className="font-gothic text-5xl mb-6 leading-tight">
                          {featuredBrands[0].name}
                        </h2>
                        <p className="text-gray-700 text-xl leading-relaxed mb-6">
                          Discover the latest collections and timeless pieces from this iconic fashion house.
                        </p>
                        <Button className="text-red-800 hover:text-red-900 font-metal text-lg border-2 border-red-800 hover:bg-red-800 hover:text-white px-6 py-2">
                          Explore Collection →
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sidebar Brands */}
                <div className="col-span-12 lg:col-span-4 space-y-4">
                  <div className="bg-black text-white p-2 text-center">
                    <h3 className="font-metal text-sm tracking-wider">TRENDING DESIGNERS</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {featuredBrands.slice(1, 5).map((brand) => (
                      <BrandCard key={brand.brandId} brand={brand} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Remaining Brands Grid */}
            {remainingBrands.length > 0 && (
              <section className="border-t-4 border-black mt-8 pt-8">
                <h2 className="text-3xl font-metal text-center mb-8">More Designers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-px gap-y-px  border-2 border-black">
                  {remainingBrands.map((brand) => (
                    <BrandCard key={brand.brandId} brand={brand} />
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {!isLoading && filteredBrands?.length === 0 && (
              <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-300">
                <p className="text-xl font-serif text-gray-600">No designers found.</p>
                <p className="mt-2 text-gray-500">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 border-t-4 border-black pt-6 text-center bg-white/90 p-6 rounded-lg">
          <p className="font-gothic text-sm text-gray-500">
            THE DESIGNERS HERALD • Published by Fashion Editorial Board • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
} 