import { useQuery } from '@tanstack/react-query';
import { getMyProductDetail } from '../services';

export const useMyProductDetail = (id: string) => {
  return useQuery({
    queryKey: ['my-product-detail', id],
    queryFn: () => getMyProductDetail(id),
    enabled: !!id,
  });
}; 