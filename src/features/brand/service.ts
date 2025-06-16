import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { BrandsResponse, Brand, CreateBrandRequest } from './schema';

export const getBrands = async (): Promise<BrandsResponse> => {
  const response = await api.get<ApiResponse<BrandsResponse>>('/brands');
  return response.data.data;
};

export const createBrand = async (data: CreateBrandRequest): Promise<Brand> => {
  const response = await api.post<Brand>('/brands', data);
  return response.data;
};

export const updateBrand = async (brandId: number, data: Partial<CreateBrandRequest>): Promise<Brand> => {
  const response = await api.put<Brand>(`/brands/${brandId}`, data);
  return response.data;
};

export const deleteBrand = async (brandId: number): Promise<void> => {
  await api.delete(`/brands/${brandId}`);
};
