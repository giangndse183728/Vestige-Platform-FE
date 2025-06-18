import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services';
import { ProductFilters } from '../schema';



export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  filtered: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
};

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.filtered(filters || {}),
    queryFn: () => getProducts(filters),
  });
};