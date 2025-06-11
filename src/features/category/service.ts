import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { CategoryList } from './schema';

export const getCategories = async (): Promise<CategoryList> => {
  const response = await api.get<ApiResponse<CategoryList>>('/categories');
  return response.data.data;
};
