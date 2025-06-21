import { createContext, useContext } from 'react';
import { ProductFilters } from '@/features/products/schema';

export const FiltersContext = createContext<{
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
