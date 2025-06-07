import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { CategoriesResponse } from './schema';

export const getCategories = async (): Promise<CategoriesResponse> => {
  const response = await api.get<CategoriesResponse>('/categories');
  return response.data || [];
};
