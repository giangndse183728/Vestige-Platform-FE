'use client';

import React, { useState, createContext, useContext } from 'react';
import { FilterProductLayout } from '@/components/layouts/FilterProductLayout';
import { ProductFilters } from '@/features/products/schema';

// Create a context for filters
const FiltersContext = createContext<{
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  totalProducts?: number;
  setTotalProducts: (total: number | undefined) => void;
} | null>(null);

export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
};

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