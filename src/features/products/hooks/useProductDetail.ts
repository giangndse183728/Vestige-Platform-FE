import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../services';

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  });
}; 