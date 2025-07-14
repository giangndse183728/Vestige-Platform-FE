import { useQuery } from '@tanstack/react-query';
import { fetchSellerProducts } from '../services';
import { ProductsResponse } from '../schema';

const EMPTY_PRODUCTS_RESPONSE: ProductsResponse = {
  content: [],
  pagination: {
    currentPage: 1,
    pageSize: 8,
    totalPages: 1,
    totalElements: 0,
  },
  filters: {},
};

export function useSellerProduct(sellerId?: number) {
  return useQuery({
    queryKey: ['seller-products', sellerId],
    queryFn: () => (sellerId ? fetchSellerProducts(sellerId) : Promise.resolve(EMPTY_PRODUCTS_RESPONSE)),
    enabled: !!sellerId,
  });
}
