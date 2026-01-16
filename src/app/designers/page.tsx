'use client';

import { useBrands } from '@/features/brand/hooks';
import { BrandCard } from '@/features/brand/components/BrandCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Star, Award, TrendingUp, Zap, Crown, Flame } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

export default function DesignersPage() {
  const { data: brands, isLoading } = useBrands();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = brands?.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Different layout distribution
  const featuredBrand = filteredBrands?.[0];
  const topBrands = filteredBrands?.slice(1, 4) || [];
  const mainBrands = filteredBrands?.slice(4, 10) || [];
  const remainingBrands = filteredBrands?.slice(10) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-amber-50">
      {/* Modern Header */}
      <div className="bg-white shadow-2xl border-b-4 border-black">
        <div className="container mx-auto px-4 py-8 mt-10">
          {/* Magazine Masthead */}
          <div className="text-center mb-6">
            <h1 className="font-metal text-7xl text-gray-900 mb-2 tracking-tight">
              THE DESIGNERS   <span className=" text-5xl text-red-900 mt-2">HERALD</span>
            </h1>
            
            <div className="flex items-center justify-center space-x-8 mt-6 text-sm font-gothic text-gray-700">
              <span>{format(new Date(), 'MMMM d, yyyy').toUpperCase()}</span>
              <div className="w-2 h-2 bg-red-900 rounded-full"></div>
              <span>FASHION & STYLE</span>
              <div className="w-2 h-2 bg-red-900 rounded-full"></div>
              <span>WORLDWIDE CIRCULATION</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Discover fashion designers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 text-lg border-3 border-red-900 focus:border-black focus:ring-black bg-white font-gothic rounded-none shadow-lg"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-red-900" />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Button size="sm" className="bg-red-900 hover:bg-red-800 text-white font-metal">
                  SEARCH
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white border-4 border-red-900 shadow-lg">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        {!isLoading && (
          <div className="space-y-16">
            {/* Hero Section */}
            {featuredBrand && (
              <section className="relative">
                                 <div className="absolute top-0 left-0 bg-red-900 text-white px-6 py-2 font-metal text-lg tracking-wider z-10 transform -rotate-2">
                   <Flame className="w-5 h-5 inline mr-2" />
                   SPOTLIGHT
                 </div>
                <div className="bg-white border-6 border-black shadow-2xl p-8 mt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="order-2 lg:order-1">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-3">          
                        </div>
                        <h2 className="font-metal text-6xl text-gray-900 leading-tight">
                          {featuredBrand.name}
                        </h2>
                        <p className="font-gothic text-xl text-gray-700 leading-relaxed">
                          Pioneering the future of fashion with revolutionary designs that challenge conventional 
                          boundaries and redefine modern elegance.
                        </p>
                        <div className="flex items-center space-x-6">
                          <Button className="bg-red-900 hover:bg-red-800 text-white font-metal text-lg px-8 py-4">
                            EXPLORE COLLECTION
                          </Button>
                          <div className="text-center">
                            <p className="font-gothic text-sm text-gray-600">ESTABLISHED</p>
                            <p className="font-metal text-2xl text-red-900">
                              {featuredBrand.createdAt ? new Date(featuredBrand.createdAt).getFullYear() : '2025'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="order-1 lg:order-2">
                      <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-red-900">
                        {featuredBrand.logoUrl ? (
                          <img
                            src={featuredBrand.logoUrl}
                            alt={featuredBrand.name}
                            className="w-full h-full object-contain "
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <div className="text-8xl mb-4">🎨</div>
                              <p className="font-gothic text-2xl">SIGNATURE BRAND</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Top Designers Row */}
            {topBrands.length > 0 && (
              <section>
                <div className="text-center mb-8">
                  <h3 className="font-metal text-4xl text-gray-900 mb-2">TOP DESIGNERS</h3>
                  <div className="w-24 h-1 bg-red-900 mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {topBrands.map((brand, index) => (
                    <div key={brand.brandId} className="relative group">
                     
                      <div className="bg-white border-4 border-red-900 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                        <BrandCard brand={brand} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Magazine Grid Layout */}
            {mainBrands.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-metal text-4xl text-gray-900 mb-2">TRENDING NOW</h3>
                    <div className="w-16 h-1 bg-red-900"></div>
                  </div>
                  <div className="flex items-center space-x-2 text-red-900">
                    <Zap className="w-6 h-6" />
                    <span className="font-metal text-lg">HOT PICKS</span>
                  </div>
                </div>
                
                                 {/* Uniform grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {mainBrands.map((brand, index) => (
                     <div key={brand.brandId} className="relative group">
                      {index % 3 === 0 && (
                        <div className="absolute -top-2 -left-2 bg-red-900 text-white px-3 py-1 font-metal text-xs transform -rotate-6 z-10">
                          TRENDING
                        </div>
                      )}
                      <div className="bg-white border-4 border-red-900 shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300">
                        <BrandCard brand={brand} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Remaining Brands */}
            {remainingBrands.length > 0 && (
              <section>
                <div className="text-center mb-8">
                  <h3 className="font-metal text-4xl text-gray-900 mb-2">ALL DESIGNERS</h3>
                  <p className="font-gothic text-lg text-gray-600">Complete Fashion Directory</p>
                  <div className="w-32 h-1 bg-red-900 mx-auto mt-4"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {remainingBrands.map((brand) => (
                    <div key={brand.brandId} className="bg-white border-4 border-red-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <BrandCard brand={brand} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {!isLoading && filteredBrands?.length === 0 && (
              <div className="text-center py-24">
                <div className="bg-white border-8 border-red-900 shadow-2xl p-16 max-w-2xl mx-auto">
                  <div className="text-8xl mb-8 text-red-900">🔍</div>
                  <h3 className="font-metal text-4xl text-gray-900 mb-4">NO DESIGNERS FOUND</h3>
                  <p className="font-gothic text-xl text-gray-600 mb-8">
                    Your search didn't match any designers in our directory.
                  </p>
                  <Button 
                    onClick={() => setSearchQuery('')}
                    className="bg-red-900 hover:bg-red-800 text-white font-metal text-lg px-8 py-4"
                  >
                    VIEW ALL DESIGNERS
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-24 bg-white border-8 border-red-900 shadow-2xl">
          <div className="bg-gradient-to-r from-red-900 to-red-700 text-white p-8 text-center">
            <h4 className="font-metal text-3xl mb-4">THE DESIGNERS HERALD</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h5 className="font-metal text-lg mb-2">EDITORIAL TEAM</h5>
                <p className="font-gothic text-red-100">Fashion Industry Experts</p>
              </div>
              <div>
                <h5 className="font-metal text-lg mb-2">CIRCULATION</h5>
                <p className="font-gothic text-red-100">Global Fashion Community</p>
              </div>
              <div>
                <h5 className="font-metal text-lg mb-2">ESTABLISHED</h5>
                <p className="font-gothic text-red-100">2025 • Fashion Forward</p>
              </div>
            </div>
          </div>
          <div className="p-6 text-center bg-gray-50">
            <p className="font-gothic text-sm text-gray-600">
              © 2025 The Designers Herald • All Rights Reserved • Premium Fashion Directory
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 