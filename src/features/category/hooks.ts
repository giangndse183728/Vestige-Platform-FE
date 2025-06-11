import { useQuery } from '@tanstack/react-query';
import { getCategories } from './service';
import { CategoryList } from './schema';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
};

export const useCategories = () => {
  return useQuery<CategoryList>({
    queryKey: categoryKeys.lists(),
    queryFn: getCategories,
    initialData: [],
  });
};
