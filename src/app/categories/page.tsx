'use client';

import { useCategories } from '@/features/category/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryTree } from '@/features/category/components/CategoryTree';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter top-level categories
  const topLevelCategories = categories?.filter(cat => cat.level === 0);
  
  const filteredCategories = topLevelCategories?.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.children?.some(child => 
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.children?.some(grandchild => 
        grandchild.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  );

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 py-8 mt-8 bg-black/10">
        <div className="max-w-8xl mx-auto">
          <div className="mb-12 relative border-b-6 border-black pb-8">
            <div className="text-center mb-2 p-4">
              <Skeleton className="h-20 w-96 mx-auto mb-4" />
              <div className="flex justify-center mt-4 space-x-8">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="container mx-auto px-2 py-8 mt-8 bg-black/10">
        <div className="max-w-8xl mx-auto text-center py-20">
          <div className="text-6xl mb-4 font-metal">📰</div>
          <h2 className="text-2xl font-gothic text-gray-800 mb-2">No Categories Found</h2>
          <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-8 mt-8 bg-black/10">
      <div className="max-w-8xl mx-auto">     

        <section className="mb-12">
          <div className="bg-red-900 text-white p-3 text-center mb-6">
            <h2 className="font-metal text-3xl tracking-wider">CATEGORY HIERARCHY</h2>
          </div>

        <section className="mb-8">
          <div className="bg-white border-2 border-black p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-center mb-6">
              <h2 className="font-metal text-2xl tracking-wider mb-2">SEARCH CATEGORIES</h2>
              <p className="text-gray-600 font-gothic">Find the perfect category for your needs</p>
            </div>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
              <Input
                placeholder="Search categories by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-4 text-lg border-2 border-black rounded-none bg-white font-gothic shadow-inner"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {searchQuery && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 font-mono">
                  Found {filteredCategories?.length || 0} category{filteredCategories?.length !== 1 ? 'ies' : 'y'} matching "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <CategoryTree 
              categories={filteredCategories?.slice(0, Math.ceil((filteredCategories?.length || 0) / 2)) || []} 
            />
            
            {/* Right Column */}
            <CategoryTree 
              categories={filteredCategories?.slice(Math.ceil((filteredCategories?.length || 0) / 2)) || []} 
            />
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-12">
          <div className="bg-black text-white p-3 text-center mb-6">
            <h2 className="font-metal text-lg tracking-wider">CATEGORY STATISTICS</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border-2 border-black p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 font-gothic mb-2">
                {topLevelCategories?.length || 0}
              </div>
              <div className="text-gray-600 font-metal text-xs uppercase tracking-wider">
                Top Level
              </div>
            </div>
            
            <div className="bg-white border-2 border-black p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 font-gothic mb-2">
                {topLevelCategories?.reduce((acc, cat) => acc + (cat.childrenCount || 0), 0) || 0}
              </div>
              <div className="text-gray-600 font-metal text-xs uppercase tracking-wider">
                Sub Categories
              </div>
            </div>
            
            <div className="bg-white border-2 border-black p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 font-gothic mb-2">
                {topLevelCategories?.filter(cat => cat.childrenCount > 0).length || 0}
              </div>
              <div className="text-gray-600 font-metal text-xs uppercase tracking-wider">
                With Children
              </div>
            </div>
            
            <div className="bg-white border-2 border-black p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 font-gothic mb-2">
                {categories?.length || 0}
              </div>
              <div className="text-gray-600 font-metal text-xs uppercase tracking-wider">
                Total
              </div>
            </div>
          </div>
        </section>

        {/* Empty State */}
        {!isLoading && filteredCategories?.length === 0 && searchQuery && (
          <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4 font-metal">📰</div>
            <h3 className="text-xl font-gothic text-gray-600 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
            <Button 
              onClick={clearSearch}
              className="font-metal border-2 border-black hover:bg-red-900 hover:text-white"
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 border-t-4 border-black pt-6 text-center bg-white/90 p-6">
          <p className="font-gothic text-sm text-gray-500">
            THE CATEGORY GAZETTE • Published by Shopping Editorial Board • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
} 