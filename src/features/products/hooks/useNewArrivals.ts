import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchNewArrivals } from '../services';
import { ProductsResponse } from '../schema';

export function useNewArrivals(): UseQueryResult<ProductsResponse, Error> {
  return useQuery({
    queryKey: ['new-arrivals'],
    queryFn: fetchNewArrivals,
  });
} 