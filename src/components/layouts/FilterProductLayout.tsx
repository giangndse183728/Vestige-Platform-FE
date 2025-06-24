'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Heart, DollarSign, Tag, Package, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '../ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CategorySelect } from '@/features/category/components/CategorySelect';
import { useBrands } from '@/features/brand/hooks';
import { ProductFilters } from '@/features/products/schema';
import { Brand } from '@/features/brand/schema';
import { useFiltersStore } from '@/features/products/hooks/useFilters';
import { formatVNDPrice } from '@/utils/format';

interface FilterProductLayoutProps {
  children: React.ReactNode;
}

const conditions = [
  { value: 'NEW', label: 'New', hearts: 5, description: 'Brand new with tags' },
  { value: 'LIKE_NEW', label: 'Like New', hearts: 4, description: 'Excellent condition' },
  { value: 'USED_EXCELLENT', label: 'Excellent', hearts: 4, description: 'Minor signs of wear' },
  { value: 'USED_GOOD', label: 'Good', hearts: 3, description: 'Some wear, good condition' },
  { value: 'USED_FAIR', label: 'Fair', hearts: 2, description: 'Noticeable wear' }
];

export function FilterProductLayout({ children }: FilterProductLayoutProps) {
  const { data: brands, isLoading: isLoadingBrands } = useBrands();
  
  const {
    filters,
    totalProducts,
    updateFilter,
    clearFilters: clearStoreFilters
  } = useFiltersStore();
  
  const [priceRange, setPriceRange] = useState([
    filters.minPrice ? parseInt(filters.minPrice) : 0,
    filters.maxPrice ? parseInt(filters.maxPrice) : 100000000
  ]);
  const [activeSelectedBrand, setActiveSelectedBrand] = useState<Brand | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [isPriceExpanded, setIsPriceExpanded] = useState(false);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(false);
  const [isConditionsExpanded, setIsConditionsExpanded] = useState(false);

  const selectedBrands = filters.brand ? filters.brand.split(',').filter(Boolean) : [];
  const selectedConditions = filters.condition ? filters.condition.split(',').filter(Boolean) : [];

  useEffect(() => {
    setPriceRange([
      filters.minPrice ? parseInt(filters.minPrice) : 0,
      filters.maxPrice ? parseInt(filters.maxPrice) : 100000000,
    ]);
  }, [filters.minPrice, filters.maxPrice]);

  const handleFilterChange = (key: keyof ProductFilters, value: string) => {
    updateFilter(key, value);
  };

  const handlePriceRangeCommit = (value: number[]) => {
    updateFilter('minPrice', value[0].toString());
    updateFilter('maxPrice', value[1].toString());
  };

  const handleBrandToggle = (brandValue: string) => {
    const newSelectedBrands = selectedBrands.includes(brandValue)
      ? selectedBrands.filter(b => b !== brandValue)
      : [...selectedBrands, brandValue];
    
    if (newSelectedBrands.length === 1) {
      const brandInfo = brands?.find(b => b.brandId.toString() === newSelectedBrands[0]);
      setActiveSelectedBrand(brandInfo || null);
    } else {
      setActiveSelectedBrand(null);
    }

    updateFilter('brand', newSelectedBrands.join(','));
  };

  const handleConditionToggle = (conditionValue: string) => {
    const newSelectedConditions = selectedConditions.includes(conditionValue)
      ? selectedConditions.filter(c => c !== conditionValue)
      : [...selectedConditions, conditionValue];
    
    updateFilter('condition', newSelectedConditions.join(','));
  };

  const clearFilters = () => {
    clearStoreFilters();
    setActiveSelectedBrand(null);
  };

  const hasActiveFilters = filters.search || selectedBrands.length > 0 || selectedConditions.length > 0 || 
    (filters.category && filters.category !== 'all') || (filters.minPrice && parseInt(filters.minPrice) > 0) || (filters.maxPrice && parseInt(filters.maxPrice) < 100000000);

  const activeFilterCount = [
    !!filters.search,
    selectedBrands.length > 0,
    selectedConditions.length > 0,
    !!(filters.category && filters.category !== 'all'),
    (filters.minPrice && parseInt(filters.minPrice) > 0) || (filters.maxPrice && parseInt(filters.maxPrice) < 100000000)
  ].filter(Boolean).length;

  const popularBrands = brands?.slice(0, 6) || [];
  const otherBrands = brands?.slice(6) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      <div className="container mx-auto py-6">
        <div className="flex flex-col lg:flex-row">
          <aside className="lg:w-80 w-full">
            <div className="lg:sticky lg:top-16">
              <div className="bg-white border-b-4 border-black shadow-lg">
                <div className="bg-black text-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      <span className="font-serif text-lg font-bold">FILTERS</span>
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="bg-red-600 text-white text-xs">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                      className="text-white hover:bg-gray-800 p-1"
                    >
                      {isFilterExpanded ? '−' : '+'}
                    </Button>
                  </div>
                </div>

                {isFilterExpanded && (
                  <div className="p-6 space-y-8 max-h-[calc(100vh-120px)] overflow-y-auto">
                    <div className="space-y-4">
                      <Button
                        variant="ghost"
                        onClick={() => setIsPriceExpanded(!isPriceExpanded)}
                        className="flex items-center justify-between w-full gap-2 border-b-2 border-dotted border-gray-300 pb-2 hover:bg-gray-50 transition-colors p-0 h-auto font-serif font-bold text-sm uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>Price Range</span>
                        </div>
                        {isPriceExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                      {isPriceExpanded && (
                        <div className="px-2">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            onValueCommit={handlePriceRangeCommit}
                            max={100000000}
                            min={0}
                            step={100000}
                            thumbClassName="border-black bg-white"
                            className="w-full"
                          />
                          <div className="flex justify-between mt-2 text-sm font-mono">
                            <span className="bg-gray-100 px-2 py-1 border">{formatVNDPrice(priceRange[0])}</span>
                            <span className="bg-gray-100 px-2 py-1 border">{formatVNDPrice(priceRange[1])}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="border-dotted" />

                    <div className="space-y-3">
                      <Button
                        variant="ghost"
                        onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                        className="flex items-center justify-between w-full gap-2 border-b-2 border-dotted border-gray-300 pb-2 hover:bg-gray-50 transition-colors p-0 h-auto font-serif font-bold text-sm uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>Category</span>
                        </div>
                        {isCategoryExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                      {isCategoryExpanded && (
                        <CategorySelect
                          value={filters.category || 'all'}
                          onValueChange={(value) => handleFilterChange('category', value)}
                          showAllOption={true}
                        />
                      )}
                    </div>

                    <Separator className="border-dotted" />

                    <div className="space-y-3">
                      <Button
                        variant="ghost"
                        onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
                        className="flex items-center justify-between w-full gap-2 border-b-2 border-dotted border-gray-300 pb-2 hover:bg-gray-50 transition-colors p-0 h-auto font-serif font-bold text-sm uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span>Brands</span>
                        </div>
                        {isBrandsExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                      
                      {isBrandsExpanded && (
                        <>
                          {isLoadingBrands ? (
                            <div className="text-sm text-gray-500">Loading brands...</div>
                          ) : brands && brands.length > 0 ? (
                            <>
                              {popularBrands.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-serif font-semibold mb-2 text-gray-600 uppercase tracking-wide">
                                    Popular
                                  </h4>
                                  <div className="space-y-2">
                                    {popularBrands.map((brand) => (
                                      <div key={brand.brandId} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`brand-${brand.brandId}`}
                                          checked={selectedBrands.includes(brand.brandId.toString())}
                                          onCheckedChange={() => handleBrandToggle(brand.brandId.toString())}
                                          className="border-2"
                                        />
                                        <Label 
                                          htmlFor={`brand-${brand.brandId}`}
                                          className="text-sm font-serif cursor-pointer hover:font-semibold transition-all"
                                        >
                                          {brand.name}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {otherBrands.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-serif font-semibold mb-2 text-gray-600 uppercase tracking-wide">
                                    All Brands
                                  </h4>
                                  <div className="space-y-2">
                                    {otherBrands.map((brand) => (
                                      <div key={brand.brandId} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`brand-${brand.brandId}`}
                                          checked={selectedBrands.includes(brand.brandId.toString())}
                                          onCheckedChange={() => handleBrandToggle(brand.brandId.toString())}
                                          className="border-2"
                                        />
                                        <Label 
                                          htmlFor={`brand-${brand.brandId}`}
                                          className="text-sm font-serif cursor-pointer hover:font-semibold transition-all"
                                        >
                                          {brand.name}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-sm text-gray-500">No brands available</div>
                          )}
                        </>
                      )}
                    </div>

                    <Separator className="border-dotted" />

                    <div className="space-y-3">
                      <Button
                        variant="ghost"
                        onClick={() => setIsConditionsExpanded(!isConditionsExpanded)}
                        className="flex items-center justify-between w-full gap-2 border-b-2 border-dotted border-gray-300 pb-2 hover:bg-gray-50 transition-colors p-0 h-auto font-serif font-bold text-sm uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          <span>Condition</span>
                        </div>
                        {isConditionsExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                      
                      {isConditionsExpanded && (
                        <div className="space-y-3">
                          {conditions.map((condition) => (
                            <div key={condition.value} className="flex items-center justify-between p-3 border-2 border-gray-200 hover:border-gray-400 transition-colors rounded-none bg-gray-50/50">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={`condition-${condition.value}`}
                                  checked={selectedConditions.includes(condition.value)}
                                  onCheckedChange={() => handleConditionToggle(condition.value)}
                                  className="border-2"
                                />
                                <div>
                                  <Label 
                                    htmlFor={`condition-${condition.value}`}
                                    className="text-sm font-serif font-semibold cursor-pointer"
                                  >
                                    {condition.label}
                                  </Label>
                                  <div className="text-xs text-gray-600 font-mono">
                                    {condition.description}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((heart) => (
                                  <Heart
                                    key={heart}
                                    className={`w-3 h-3 ${
                                      heart <= condition.hearts
                                        ? 'fill-red-600 text-red-600'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-white border-2 border-black shadow-lg">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-black p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="font-serif text-xl font-bold">Products</h2>
                    {totalProducts !== undefined && (
                      <Badge variant="outline" className="border-2 rounded-none border-black text-black font-serif">
                        {totalProducts} {totalProducts === 1 ? 'item' : 'items'}
                      </Badge>
                    )}
                  </div>
                  {hasActiveFilters && (
                    <div className="text-sm text-gray-600 font-mono">
                      Filtered results
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                    <Input
                      placeholder="Search the marketplace..."
                      value={filters.search || ''}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-12 pr-4 py-3 border-3 border-black rounded-none bg-white text-lg font-serif shadow-inner"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
               
                    <Select
                      value={filters.sortDir || 'desc'}
                      onValueChange={(value) => handleFilterChange('sortDir', value)}
                    >
                      <SelectTrigger className="w-40 border-2 border-black rounded-none bg-white font-serif">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-none bg-white">
                        <SelectItem value="desc">Newest First</SelectItem>
                        <SelectItem value="asc">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {hasActiveFilters && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {filters.search && (
                      <Badge variant="outline" className="border-2 border-blue-600 text-blue-600 font-serif">
                        Search: "{filters.search}"
                      </Badge>
                    )}
                    {selectedBrands.map(brandId => {
                      const brand = brands?.find(b => b.brandId.toString() === brandId);
                      return (
                        <Badge key={brandId} variant="outline" className="border-2 border-green-600 text-green-600 font-serif">
                          {brand?.name || brandId}
                        </Badge>
                      );
                    })}
                    {selectedConditions.map(condition => (
                      <Badge key={condition} variant="outline" className="border-2 border-orange-600 text-orange-600 font-serif">
                        {conditions.find(c => c.value === condition)?.label}
                      </Badge>
                    ))}
                    {(priceRange[0] > 0 || priceRange[1] < 100000000) && (
                      <Badge variant="outline" className="border-2 border-purple-600 text-purple-600 font-serif">
                        {formatVNDPrice(priceRange[0])} - {formatVNDPrice(priceRange[1])}
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="border-2 border-red-600 text-red-600 hover:bg-red-50 font-serif text-xs ml-auto"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                )}
              </div>

              {activeSelectedBrand && (
                <div className="p-6 border-b-2 border-black bg-yellow-50/50">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-white border-2 border-black flex-shrink-0">
                      <img 
                        src={activeSelectedBrand.logoUrl} 
                        alt={`${activeSelectedBrand.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold">{activeSelectedBrand.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 font-mono">
                        Explore the collection from {activeSelectedBrand.name}. 
                        Use the filters to find exactly what you're looking for.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div >
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}