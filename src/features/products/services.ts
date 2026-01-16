import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { ProductsResponse, CreateProductRequest, UpdateProductRequest, ProductDetail, ProductFilters, Product } from './schema';
import productsData from '@/mock/products.json';
import brandsData from '@/mock/brands.json';
import categoriesData from '@/mock/categories.json';

// Helper function to get all category names including children
const getCategoryNamesWithChildren = (categoryId: number): string[] => {
  const category = categoriesData.find(c => c.categoryId === categoryId);
  if (!category) return [];
  
  const names: string[] = [category.name];
  
  // Add children category names if the category has children
  if (category.children && category.children.length > 0) {
    category.children.forEach((child: { name: string }) => {
      names.push(child.name);
    });
  }
  
  return names;
};

// Helper function to filter and paginate mock products
const filterMockProducts = (filters?: ProductFilters): ProductsResponse => {
  let filtered = [...productsData] as Product[];
  
  // Apply search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.brandName.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply price filters
  if (filters?.minPrice) {
    filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice!));
  }
  if (filters?.maxPrice) {
    filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice!));
  }
  
  // Apply brand filter
  if (filters?.brand) {
    const brandIds = filters.brand.split(',').map(id => parseInt(id.trim()));
    const brandNames = brandsData
      .filter(b => brandIds.includes(b.brandId))
      .map(b => b.name);
    filtered = filtered.filter(p => brandNames.includes(p.brandName));
  }
  
  // Apply condition filter
  if (filters?.condition) {
    const conditions = filters.condition.split(',').map(c => c.trim());
    filtered = filtered.filter(p => conditions.includes(p.condition));
  }
  
  // Apply category filter - includes parent and children categories
  if (filters?.category) {
    const categoryId = parseInt(filters.category);
    const categoryNames = getCategoryNamesWithChildren(categoryId);
    if (categoryNames.length > 0) {
      filtered = filtered.filter(p => categoryNames.includes(p.categoryName));
    }
  }
  
  // Apply sorting
  if (filters?.sortDir === 'desc') {
    // Newest First - sort by productId ASC (lower ID = newer)
    filtered = filtered.sort((a, b) => a.productId - b.productId);
  } else if (filters?.sortDir === 'asc') {
    // Oldest First - sort by productId DESC (higher ID = older)
    filtered = filtered.sort((a, b) => b.productId - a.productId);
  }
  
  // Apply pagination
  const page = parseInt(filters?.page || '0');
  const size = parseInt(filters?.size || '12');
  const start = page * size;
  const paginatedContent = filtered.slice(start, start + size);
  
  return {
    content: paginatedContent,
    pagination: {
      currentPage: page,
      pageSize: size,
      totalPages: Math.ceil(filtered.length / size),
      totalElements: filtered.length
    },
    filters: {}
  };
};

export const getProducts = async (filters?: ProductFilters): Promise<ProductsResponse> => {
  // Using mock data
  return filterMockProducts(filters);
};

export const getMyProducts = async (filters?: ProductFilters): Promise<ProductsResponse> => {
  // Using mock data - simulates user's own products (first 5 products)
  const myProducts = productsData.slice(0, 5) as Product[];
  const page = parseInt(filters?.page || '0');
  const size = parseInt(filters?.size || '12');
  
  return {
    content: myProducts.slice(page * size, (page + 1) * size),
    pagination: {
      currentPage: page,
      pageSize: size,
      totalPages: Math.ceil(myProducts.length / size),
      totalElements: myProducts.length
    },
    filters: {}
  };
};

export const getProduct = async (): Promise<ProductsResponse> => {
  // Using mock data
  return filterMockProducts();
};

export const getMyProductDetail = async (id: string): Promise<ProductDetail> => {
  const product = productsData.find(p => p.productId === parseInt(id));
  if (!product) throw new Error('Product not found');
  
  // Create mock product detail
  return createMockProductDetail(product);
};

export const getProductBySlug = async (slug: string): Promise<ProductDetail> => {
  const product = productsData.find(p => p.slug === slug);
  if (!product) throw new Error('Product not found');
  
  // Create mock product detail
  return createMockProductDetail(product);
};

// Helper function to create mock product detail
const createMockProductDetail = (product: Product): ProductDetail => {
  const brand = brandsData.find(b => b.name === product.brandName);
  const category = categoriesData.find(c => c.name === product.categoryName);
  
  return {
    productId: product.productId,
    slug: product.slug,
    title: product.title,
    description: `This is a beautiful ${product.title} from ${product.brandName}. In ${product.condition.toLowerCase()} condition.`,
    price: product.price,
    originalPrice: (product as any).discountPercentage && (product as any).discountPercentage > 0
      ? Math.round(product.price / (1 - (product as any).discountPercentage / 100))
      : Math.round(product.price * 1.3),
    condition: product.condition,
    size: (product as any).size || 'M',
    color: (product as any).color || 'Black',
    authenticityConfidenceScore: 95,
    status: product.status || 'ACTIVE',
    viewsCount: product.viewsCount,
    likesCount: product.likesCount,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    seller: {
      userId: 1,
      username: 'Im_dnilb',
      firstName: 'Im_dnilb',
      lastName: '',
      profilePictureUrl: 'data:image/jpeg;base64,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',
      isLegitProfile: true,
      sellerRating: 4.8,
      sellerReviewsCount: 125,
      successfulTransactions: 89,
      joinedDate: '2023-01-15T10:00:00Z'
    },
    category: {
      categoryId: category?.categoryId || 1,
      name: product.categoryName,
      description: category?.description || ''
    },
    brand: {
      brandId: brand?.brandId || 1,
      name: product.brandName,
      logoUrl: brand?.logoUrl || ''
    },
    images: (product as any).images || [],
    discountPercentage: (product as any).discountPercentage || 0,
    hasDiscount: (product as any).hasDiscount || false
  };
};

export const createProduct = async (data: CreateProductRequest) => {
  const response = await api.post<ApiResponse<any>>('/products', data);
  return response.data.data;
};

export const updateProduct = async (id: number, data: UpdateProductRequest) => {
  const response = await api.patch<ApiResponse<ProductDetail>>(`/products/${id}`, data);
  return response.data.data;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
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
  // Using mock data - sort by viewsCount
  const sorted = [...productsData].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 12) as Product[];
  return {
    content: sorted,
    pagination: {
      currentPage: 0,
      pageSize: 12,
      totalPages: 1,
      totalElements: sorted.length
    },
    filters: {}
  };
}

export async function fetchNewArrivals(): Promise<ProductsResponse> {
  // Using mock data - newest products (sort by productId ASC)
  const sorted = [...productsData].sort((a, b) => a.productId - b.productId).slice(0, 12) as Product[];
  return {
    content: sorted,
    pagination: {
      currentPage: 0,
      pageSize: 12,
      totalPages: 1,
      totalElements: sorted.length
    },
    filters: {}
  };
}

export async function fetchSellerProducts(sellerId: number, page: number = 0, size: number = 12): Promise<ProductsResponse> {
  // Using mock data - simulate seller products (random selection)
  const sellerProducts = productsData.slice(sellerId % 10, (sellerId % 10) + size) as Product[];
  return {
    content: sellerProducts,
    pagination: {
      currentPage: page,
      pageSize: size,
      totalPages: 1,
      totalElements: sellerProducts.length
    },
    filters: {}
  };
}

export async function fetchTopLikedProducts(): Promise<ProductsResponse> {
  // Using mock data - sort by likesCount
  const sorted = [...productsData].sort((a, b) => b.likesCount - a.likesCount).slice(0, 3) as Product[];
  return {
    content: sorted,
    pagination: {
      currentPage: 0,
      pageSize: 3,
      totalPages: 1,
      totalElements: sorted.length
    },
    filters: {}
  };
}
