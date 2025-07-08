'use client';

import { useCategories } from '@/features/category/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const router = useRouter();

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

  // Handle category click navigation
  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    router.push(`/marketplace?category=${categoryId}&name=${encodeURIComponent(categoryName)}`);
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
          <div className="bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-16 max-w-2xl mx-auto">
            <div className="text-8xl mb-8 text-red-900">📰</div>
            <h2 className="font-metal text-4xl text-black mb-4">NO CATEGORIES FOUND</h2>
            <p className="font-gothic text-xl text-gray-700">The category archive is currently empty.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-8 mt-8 bg-black/10">
      <div className="max-w-8xl mx-auto">
     

        <section className="mb-12">
          <div className="bg-red-900 text-white p-4 text-center mb-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-metal text-3xl tracking-wider flex items-center justify-center space-x-4">
              <div className="w-8 h-1 bg-white"></div>
              <span>CATEGORY HIERARCHY</span>
              <div className="w-8 h-1 bg-white"></div>
            </h2>
          </div>

        <section className="mb-8">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-center mb-6">
              <p className="text-gray-700 font-gothic font-bold uppercase tracking-wider">Find the perfect category for your needs</p>
            </div>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-900 w-5 h-5" />
              <Input
                placeholder="Search categories by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-4 text-lg border-4 border-black focus:border-red-900 focus:ring-red-900 bg-white font-gothic shadow-inner"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8 hover:bg-red-100"
                >
                  <X className="w-4 h-4 text-red-900" />
                </Button>
              )}
            </div>
            
            {searchQuery && (
              <div className="text-center mt-6">
                <div className="bg-black text-white px-4 py-2 inline-block border-2 border-red-900">
                  <p className="text-sm font-metal tracking-wider">
                    FOUND {filteredCategories?.length || 0} CATEGORY{filteredCategories?.length !== 1 ? 'IES' : 'Y'} MATCHING "{searchQuery.toUpperCase()}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
          
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            {/* Single Card Header */}
            <div className="bg-black text-white p-4 border-b-4 border-black relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-900"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-red-900"></div>
              <h3 className="font-metal text-xl tracking-wider text-center">CATEGORY TREE STRUCTURE</h3>
              <div className="flex justify-center mt-2">
                <div className="w-24 h-1 bg-white"></div>
              </div>
            </div>
            
            {/* Two Column Layout Inside Single Card */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="relative">
                  <div className="pl-4">
                    <div className="space-y-4">
                      {filteredCategories?.slice(0, Math.ceil((filteredCategories?.length || 0) / 2))?.map((category) => (
                        <div key={category.categoryId} className="border-l-4 border-red-900 pl-4">
                          {/* Main Category */}
                          <div 
                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 hover:bg-red-50 hover:border-red-900 transition-all cursor-pointer"
                            onClick={() => handleCategoryClick(category.categoryId.toString(), category.name)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-red-900 rotate-45"></div>
                              <h4 className="font-metal text-lg text-gray-900 hover:text-red-900 transition-colors">{category.name}</h4>
                            </div>
                            <span className="bg-red-900 text-white px-2 py-1 text-xs font-metal">
                              {category.childrenCount || 0}
                            </span>
                          </div>
                          
                          {/* Subcategories */}
                          {category.children && category.children.length > 0 && (
                            <div className="ml-6 mt-2 space-y-2">
                              {category.children.map((subcategory) => (
                                <div key={subcategory.categoryId} className="border-l-4 border border-gray-300 ">
                                  <div 
                                    className="flex items-center justify-between p-2 bg-white border border-gray-100 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                                    onClick={() => handleCategoryClick(subcategory.categoryId.toString(), subcategory.name)}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-gray-400"></div>
                                      <span className="font-gothic text-sm text-gray-700 hover:text-gray-900 transition-colors">{subcategory.name}</span>
                                    </div>
                                    {subcategory.childrenCount > 0 && (
                                      <span className="bg-gray-900 text-white px-1 py-1 text-xs">
                                        {subcategory.childrenCount}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Third level categories */}
                                  {subcategory.children && subcategory.children.length > 0 && (
                                    <div className="ml-4 mt-1 space-y-1">
                                      {subcategory.children.slice(0, 3).map((thirdLevel) => (
                                        <div 
                                          key={thirdLevel.categoryId} 
                                          className="flex items-center space-x-2 p-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                                          onClick={() => handleCategoryClick(thirdLevel.categoryId.toString(), thirdLevel.name)}
                                        >
                                          <div className="w-1 h-1 bg-gray-300"></div>
                                          <span className="font-gothic">{thirdLevel.name}</span>
                                        </div>
                                      ))}
                                      {subcategory.children.length > 3 && (
                                        <div className="text-xs text-gray-400 font-gothic ml-3">
                                          +{subcategory.children.length - 3} more...
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="relative">
                  <div className="pl-4">
                    <div className="space-y-4">
                      {filteredCategories?.slice(Math.ceil((filteredCategories?.length || 0) / 2))?.map((category) => (
                        <div key={category.categoryId} className=" pl-2">
                          <div 
                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 hover:bg-red-50 hover:border-red-900 transition-all cursor-pointer"
                            onClick={() => handleCategoryClick(category.categoryId.toString(), category.name)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-red-900 rotate-45"></div>
                              <h4 className="font-metal text-lg text-gray-900 hover:text-red-900 transition-colors">{category.name}</h4>
                            </div>
                            <span className="bg-red-900 text-white px-2 py-1 text-xs font-metal">
                              {category.childrenCount || 0}
                            </span>
                          </div>
                          
                          {/* Subcategories */}
                          {category.children && category.children.length > 0 && (
                            <div className="ml-6 mt-2 space-y-2">
                              {category.children.map((subcategory) => (
                                <div key={subcategory.categoryId} className="border-l-4 border border-gray-300">
                                  <div 
                                    className="flex items-center justify-between p-2 bg-white border border-gray-100 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                                    onClick={() => handleCategoryClick(subcategory.categoryId.toString(), subcategory.name)}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-gray-400"></div>
                                      <span className="font-gothic text-sm text-gray-700 hover:text-gray-900 transition-colors">{subcategory.name}</span>
                                    </div>
                                    {subcategory.childrenCount > 0 && (
                                      <span className="bg-gray-900 text-white px-1 py-1 text-xs">
                                        {subcategory.childrenCount}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Third level categories */}
                                  {subcategory.children && subcategory.children.length > 0 && (
                                    <div className="ml-4 mt-1 space-y-1">
                                      {subcategory.children.slice(0, 3).map((thirdLevel) => (
                                        <div 
                                          key={thirdLevel.categoryId} 
                                          className="flex items-center space-x-2 p-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                                          onClick={() => handleCategoryClick(thirdLevel.categoryId.toString(), thirdLevel.name)}
                                        >
                                          <div className="w-1 h-1 bg-gray-300"></div>
                                          <span className="font-gothic">{thirdLevel.name}</span>
                                        </div>
                                      ))}
                                      {subcategory.children.length > 3 && (
                                        <div className="text-xs text-gray-400 font-gothic ml-3">
                                          +{subcategory.children.length - 3} more...
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-12">
          <div className="bg-black text-white p-4 text-center mb-6 border-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-metal text-xl tracking-wider flex items-center justify-center space-x-3">
              <span>CATEGORY STATISTICS</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border-4 border-black p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute top-2 right-2 w-4 h-4 bg-red-900"></div>
              <div className="text-4xl font-bold text-black font-metal mb-2">
                {topLevelCategories?.length || 0}
              </div>
              <div className="text-gray-700 font-gothic text-xs uppercase tracking-wider font-bold">
                Top Level
              </div>
            </div>
            
            <div className="bg-white border-4 border-black p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute top-2 right-2 w-4 h-4 bg-red-900"></div>
              <div className="text-4xl font-bold text-black font-metal mb-2">
                {topLevelCategories?.reduce((acc, cat) => acc + (cat.childrenCount || 0), 0) || 0}
              </div>
              <div className="text-gray-700 font-gothic text-xs uppercase tracking-wider font-bold">
                Sub Categories
              </div>
            </div>
            
            <div className="bg-white border-4 border-black p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute top-2 right-2 w-4 h-4 bg-red-900"></div>
              <div className="text-4xl font-bold text-black font-metal mb-2">
                {topLevelCategories?.filter(cat => cat.childrenCount > 0).length || 0}
              </div>
              <div className="text-gray-700 font-gothic text-xs uppercase tracking-wider font-bold">
                With Children
              </div>
            </div>
            
            <div className="bg-white border-4 border-black p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute top-2 right-2 w-4 h-4 bg-red-900"></div>
              <div className="text-4xl font-bold text-black font-metal mb-2">
                {categories?.length || 0}
              </div>
              <div className="text-gray-700 font-gothic text-xs uppercase tracking-wider font-bold">
                Total
              </div>
            </div>
          </div>
        </section>

        {/* Empty State */}
        {!isLoading && filteredCategories?.length === 0 && searchQuery && (
          <div className="text-center py-20">
            <div className="bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-16 max-w-2xl mx-auto">
              <div className="text-8xl mb-8 text-red-900">📰</div>
              <h3 className="font-metal text-4xl text-black mb-4">NO CATEGORIES FOUND</h3>
              <p className="font-gothic text-xl text-gray-700 mb-8">
                The archive remains silent for "{searchQuery}".
              </p>
              <Button 
                onClick={clearSearch}
                className="bg-red-900 hover:bg-black text-white font-metal text-lg px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
              >
                CLEAR SEARCH
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 