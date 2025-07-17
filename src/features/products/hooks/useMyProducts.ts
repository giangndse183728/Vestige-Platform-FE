import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProducts, deleteProduct } from '../services';
import { ProductFilters } from '../schema';

export const myProductKeys = {
  all: ['my-products'] as const,
  lists: () => [...myProductKeys.all, 'list'] as const,
  filtered: (filters: ProductFilters) => [...myProductKeys.lists(), filters] as const,
};

export const useMyProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: myProductKeys.filtered(filters || {}),
    queryFn: () => getMyProducts(filters),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myProductKeys.all });
    },
  });
}; 