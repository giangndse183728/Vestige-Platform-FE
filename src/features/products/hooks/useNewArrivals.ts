import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchNewArrivals } from '../services';
import { ProductsResponse } from '../schema';

export function useNewArrivals(options = {}): UseQueryResult<ProductsResponse, Error> {
  return useQuery({
    queryKey: ['new-arrivals'],
    queryFn: fetchNewArrivals,
    ...options,
  });
} 