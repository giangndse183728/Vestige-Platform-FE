import { useQuery } from '@tanstack/react-query';
import { getMyProductDetail, getProductBySlug } from '../services';

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: ['product-detail', id],
    queryFn: () => getMyProductDetail(id),
    enabled: !!id,
  });
};

export const useProductDetailBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product-detail-slug', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
}; 