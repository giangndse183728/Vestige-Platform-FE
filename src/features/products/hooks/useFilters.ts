import { create } from 'zustand';
import { ProductFilters } from '@/features/products/schema';

interface FiltersStore {
  filters: ProductFilters;
  totalProducts?: number;
  setFilters: (filters: ProductFilters) => void;
  updateFilter: (key: keyof ProductFilters, value: string) => void;
  setTotalProducts: (total: number | undefined) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetPagination: () => void;
}

const defaultFilters: ProductFilters = {
  search: '',
  minPrice: '',
  maxPrice: '',
  category: '',
  brand: '',
  condition: '',
  sortDir: 'desc',
  page: '1',
  size: '24'
};

export const useFiltersStore = create<FiltersStore>((set, get) => ({
  filters: defaultFilters,
  totalProducts: undefined,
  
  setFilters: (filters) => set({ filters }),
  
  updateFilter: (key, value) => {
    set((state) => {
      const apiValue = value === 'all' ? '' : value;
      if (key !== 'page' && key !== 'size') {
        return {
          ...state,
          filters: { ...state.filters, [key]: apiValue, page: '1' }
        };
      }
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
  
  setPage: (page) => set((state) => ({
    ...state,
    filters: { ...state.filters, page: page.toString() }
  })),
  
  setPageSize: (size) => set((state) => ({
    ...state,
    filters: { ...state.filters, size: size.toString(), page: '1' }
  })),
  
  resetPagination: () => set((state) => ({
    ...state,
    filters: { ...state.filters, page: '1' }
  })),
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