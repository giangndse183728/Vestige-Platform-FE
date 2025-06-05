import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { ProductsResponse } from './schema';

export const getProducts = async (): Promise<ProductsResponse> => {
  const response = await api.get<ApiResponse<ProductsResponse>>('/products');
  return response.data.data;
};

export const getProduct = async (id: string) => {
  const response = await api.get<ApiResponse<any>>(`/products/${id}`);
  return response.data.data;
};
