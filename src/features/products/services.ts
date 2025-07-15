import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { ProductsResponse, CreateProductRequest, UpdateProductRequest, ProductDetail, ProductFilters, Product } from './schema';


export const getProducts = async (filters?: ProductFilters): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice);
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters?.category) params.append('categoryId', filters.category);
  
  if (filters?.brand) {
    const brandIds = filters.brand.split(',').filter(Boolean);
    brandIds.forEach(brandId => {
      params.append('brandId', brandId.trim());
    });
  }
  
  if (filters?.condition) {
    const conditions = filters.condition.split(',').filter(Boolean);
    conditions.forEach(condition => {
      params.append('condition', condition.trim());
    });
  }
  
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
  if (filters?.category) params.append('categoryId', filters.category);
  
  // Handle brand filter - support multiple brands
  if (filters?.brand) {
    const brandIds = filters.brand.split(',').filter(Boolean);
    brandIds.forEach(brandId => {
      params.append('brandId', brandId.trim());
    });
  }
  
  // Handle condition filter - support multiple conditions
  if (filters?.condition) {
    const conditions = filters.condition.split(',').filter(Boolean);
    conditions.forEach(condition => {
      params.append('condition', condition.trim());
    });
  }
  
  if (filters?.sortDir) params.append('sortDir', filters.sortDir);
  if (filters?.page) params.append('page', filters.page);
  if (filters?.size) params.append('size', filters.size);

  const queryString = params.toString();
  const url = queryString ? `/products/my-products?${queryString}` : '/products/my-products';
  
  const response = await api.get<ApiResponse<ProductsResponse>>(url);
  return response.data.data;
};

export const getProduct = async (): Promise<ProductsResponse> => {
  const response = await api.get<ApiResponse<ProductsResponse>>(`/products`);
  return response.data.data;
};

export const getMyProductDetail = async (id: string): Promise<ProductDetail> => {
  const response = await api.get<ApiResponse<ProductDetail>>(`/products/${id}`);
  return response.data.data;
};

export const getProductBySlug = async (slug: string): Promise<ProductDetail> => {
  const response = await api.get<ApiResponse<ProductDetail>>(`/products/slug/${slug}`);
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

export const getAllProductStatuses = async (filters?: ProductFilters): Promise<any> => {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice);
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters?.category) params.append('categoryId', filters.category);
  if (filters?.brand) {
    const brandIds = filters.brand.split(',').filter(Boolean);
    brandIds.forEach(brandId => {
      params.append('brandId', brandId.trim());
    });
  }
  if (filters?.condition) {
    const conditions = filters.condition.split(',').filter(Boolean);
    conditions.forEach(condition => {
      params.append('condition', condition.trim());
    });
  }
  if (filters?.sortDir) params.append('sortDir', filters.sortDir);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.sellerId) params.append('sellerId', filters.sellerId);
  if (filters?.page !== undefined) params.append('page', filters.page);
  if (filters?.size !== undefined) params.append('size', filters.size);

  const queryString = params.toString();
  const url = queryString ? `/products/admin/all-statuses?${queryString}` : '/products/admin/all-statuses';
  const response = await api.get(url);
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

export async function fetchTopViewedProducts(): Promise<ProductsResponse> {
  const response = await api.get<ApiResponse<ProductsResponse>>(`/products?&size=12&sortBy=viewCount&sortDir=desc`);
  return response.data.data;
}

export async function fetchNewArrivals(): Promise<ProductsResponse> {
  const response = await api.get<ApiResponse<ProductsResponse>>(`/products?size=12&sortBy=createdAt&sortDir=desc`);
  return response.data.data;
}

export async function fetchSellerProducts(sellerId: number): Promise<ProductsResponse> {
  const response = await api.get<ApiResponse<ProductsResponse>>(`/products?sellerId=${sellerId}`);
  return response.data.data;
}
