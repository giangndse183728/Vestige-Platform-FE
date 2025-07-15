import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchTopViewedProducts } from '../services';
import { ProductsResponse } from '../schema';

export function useTopViewedProducts(): UseQueryResult<ProductsResponse, Error> {
  return useQuery({
    queryKey: ['top-viewed-products'],
    queryFn: () => fetchTopViewedProducts(),
  });
} 