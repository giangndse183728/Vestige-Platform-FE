import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { ProductsResponse, CreateProductRequest, UpdateProductRequest, ProductDetail, ProductFilters } from './schema';


export const getProducts = async (filters?: ProductFilters): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice);
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.brand) params.append('brand', filters.brand);
  if (filters?.condition) params.append('condition', filters.condition);
  if (filters?.sortDir) params.append('sortDir', filters.sortDir);

  const queryString = params.toString();
  const url = queryString ? `/products?${queryString}` : '/products';
  
  const response = await api.get<ApiResponse<ProductsResponse>>(url);
  return response.data.data;
};

export const getMyProducts = async (filters?: ProductFilters): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice);
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.brand) params.append('brand', filters.brand);
  if (filters?.condition) params.append('condition', filters.condition);
  if (filters?.sortDir) params.append('sortDir', filters.sortDir);

  const queryString = params.toString();
  const url = queryString ? `/products/my-products?${queryString}` : '/products/my-products';
  
  const response = await api.get<ApiResponse<ProductsResponse>>(url);
  return response.data.data;
};

export const getProduct = async (id: string): Promise<ProductsResponse> => {
  const response = await api.get<ApiResponse<ProductsResponse>>(`/products`);
  return response.data.data;
};

export const getMyProductDetail = async (id: string): Promise<ProductDetail> => {
  const response = await api.get<ApiResponse<ProductDetail>>(`/products/${id}`);
  return response.data.data;
};

export const createProduct = async (data: CreateProductRequest) => {
  const response = await api.post<ApiResponse<any>>('/products', data);
  return response.data.data;
};

export const updateProduct = async (id: number, data: UpdateProductRequest) => {
  const response = await api.patch<ApiResponse<ProductDetail>>(`/products/${id}`, data);
  return response.data.data;
};

export const getAllProductStatuses = async (): Promise<any> => {
  const response = await api.get('/products/admin/all-statuses');
  return response.data.data;
};

export const deleteProductByAdmin = async (id: number) => {
  const response = await api.delete(`/products/admin/${id}`);
  return response.data;
};

export const updateProductByAdmin = async (id: number, data: any) => {
  const response = await api.patch(`/products/admin/${id}`, data);
  return response.data;
};

export const updateProductImagesByAdmin = async (id: number, images: any) => {
  const response = await api.patch(`/products/admin/${id}/images`, images);
  return response.data;
};
