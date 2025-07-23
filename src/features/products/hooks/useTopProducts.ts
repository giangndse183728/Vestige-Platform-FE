import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchTopViewedProducts } from '../services';
import { ProductsResponse } from '../schema';
import { fetchTopLikedProducts } from '../services';

export function useTopViewedProducts(options = {}): UseQueryResult<ProductsResponse, Error> {
  return useQuery({
    queryKey: ['top-viewed-products'],
    queryFn: fetchTopViewedProducts,
    ...options,
  });
}

export function useTopLikedProducts(options = {}): UseQueryResult<ProductsResponse, Error> {
  return useQuery({
    queryKey: ['top-liked-products'],
    queryFn: fetchTopLikedProducts, 
    ...options,
  });
} 