import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
};

export const useProducts = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: getProducts,
  });
};