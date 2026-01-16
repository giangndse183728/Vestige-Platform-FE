import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { BrandsResponse, Brand, CreateBrandRequest } from './schema';
import brandsData from '@/mock/brands.json';

export const getBrands = async (): Promise<BrandsResponse> => {
  // console.log('Fetching brands...');
  // const response = await api.get<ApiResponse<BrandsResponse>>('/brands');
  // return response.data.data;

  // Using mock data
  return brandsData as BrandsResponse;
};

export const createBrand = async (data: CreateBrandRequest): Promise<Brand> => {
  const response = await api.post<ApiResponse<Brand>>('/brands', data);
  return response.data.data;
};

export const updateBrand = async (brandId: number, data: Partial<CreateBrandRequest>): Promise<Brand> => {
  const response = await api.patch<Brand>(`/brands/${brandId}`, data);
  return response.data;
};

export const deleteBrand = async (brandId: number): Promise<void> => {
  await api.delete(`/brands/${brandId}`);
};
