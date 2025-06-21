'use client';

import React, { useState, createContext, useContext } from 'react';
import { FilterProductLayout } from '@/components/layouts/FilterProductLayout';
import { ProductFilters } from '@/features/products/schema';
import { FiltersContext } from '@/features/products/hooks/useFilters';

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    minPrice: '',
    maxPrice: '',
    category: '',
    brand: '',
    condition: '',
    sortDir: 'desc'
  });

  const [totalProducts, setTotalProducts] = useState<number | undefined>(undefined);

  return (
    <FiltersContext.Provider value={{ filters, setFilters, totalProducts, setTotalProducts }}>
      <FilterProductLayout 
        onFiltersChange={setFilters} 
        totalProducts={totalProducts}
        initialFilters={filters}
      >
        {children}
      </FilterProductLayout>
    </FiltersContext.Provider>
  );
}