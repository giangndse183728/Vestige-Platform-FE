import { create } from 'zustand';
import { ProductFilters } from '@/features/products/schema';

interface FiltersStore {
  filters: ProductFilters;
  totalProducts?: number;
  setFilters: (filters: ProductFilters) => void;
  updateFilter: (key: keyof ProductFilters, value: string) => void;
  setTotalProducts: (total: number | undefined) => void;
  clearFilters: () => void;
}

const defaultFilters: ProductFilters = {
  search: '',
  minPrice: '',
  maxPrice: '',
  category: '',
  brand: '',
  condition: '',
  sortDir: 'desc'
};

export const useFiltersStore = create<FiltersStore>((set, get) => ({
  filters: defaultFilters,
  totalProducts: undefined,
  
  setFilters: (filters) => set({ filters }),
  
  updateFilter: (key, value) => {
    set((state) => {
      const apiValue = value === 'all' ? '' : value;
      return {
        ...state,
        filters: { ...state.filters, [key]: apiValue }
      };
    });
  },
  
  setTotalProducts: (total) => set({ totalProducts: total }),
  
  clearFilters: () => set({ 
    filters: { ...defaultFilters }
  }),
}));

// Legacy context for backward compatibility (if needed)
export const useFilters = () => {
  const store = useFiltersStore();
  return {
    filters: store.filters,
    setFilters: store.setFilters,
    totalProducts: store.totalProducts,
    setTotalProducts: store.setTotalProducts,
  };
};