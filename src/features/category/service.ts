import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { CategoriesResponse, Category, CreateCategoryRequest } from './schema';
import categoriesData from '@/mock/categories.json';

export const getCategories = async (): Promise<CategoriesResponse> => {

  // const response = await api.get<ApiResponse<CategoriesResponse>>('/categories');
  // return response.data.data;

  // Using mock data
  return categoriesData as CategoriesResponse;
};

export const getCategory = async (id: number): Promise<Category> => {
  // Using mock data
  const category = categoriesData.find(c => c.categoryId === id);
  if (!category) throw new Error('Category not found');
  return category as Category;
};

export const createCategory = async (data: CreateCategoryRequest): Promise<Category> => {
  const response = await api.post<ApiResponse<Category>>('/categories', data);
  return response.data.data;
};

export const updateCategory = async (categoryId: number, data: Partial<CreateCategoryRequest>): Promise<Category> => {
  const response = await api.patch<ApiResponse<Category>>(`/categories/${categoryId}`, data);
  return response.data.data;
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  await api.delete(`/categories/${categoryId}`);
};
