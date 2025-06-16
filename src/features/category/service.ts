import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { CategoriesResponse, Category, CategoryList } from './schema';

export const getCategories = async (): Promise<CategoryList> => {
  const response = await api.get<ApiResponse<CategoryList>>('/categories');
  return response.data.data;
};

export const createCategory = async (data: {
  name: string;
  description: string;
  parent?: number | null;
}): Promise<Category> => {
  const response = await api.post<Category>('/categories', data);
  return response.data;
};

export const updateCategory = async (
  categoryId: number,
  data: Partial<{
    name: string;
    description: string;
    parent: number | null;
  }>
): Promise<Category> => {
  const response = await api.put<Category>(`/categories/${categoryId}`, data);
  return response.data;
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  await api.delete(`/categories/${categoryId}`);
};
