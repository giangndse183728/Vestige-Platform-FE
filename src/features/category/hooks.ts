import { useQuery } from '@tanstack/react-query';
import { getCategories } from './service';
import { CategoriesResponse } from './schema';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
};

export const useCategories = () => {
  return useQuery<CategoriesResponse>({
    queryKey: categoryKeys.lists(),
    queryFn: getCategories,
    initialData: [],
  });
};
