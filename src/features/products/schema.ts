import * as z from "zod";

export const sellerSchema = z.object({
  userId: z.number(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  profilePictureUrl: z.string().nullable(),
  isLegitProfile: z.boolean(),
  sellerRating: z.number(),
  sellerReviewsCount: z.number(),
  successfulTransactions: z.number(),
  joinedDate: z.string(),
});

export const categorySchema = z.object({
  categoryId: z.number(),
  name: z.string(),
  description: z.string(),
});

export const brandSchema = z.object({
  brandId: z.number(),
  name: z.string(),
  logoUrl: z.string(),
});

export const productImageSchema = z.object({
  imageId: z.number(),
  imageUrl: z.string(),
  isPrimary: z.boolean(),
  displayOrder: z.number(),
});


export const productSchema = z.object({
  productId: z.number(),
  title: z.string(),
  price: z.number(),
  condition: z.string(),
  brandName: z.string(),
  categoryName: z.string(),
  primaryImageUrl: z.string(),
  viewsCount: z.number(),
  likesCount: z.number(),
  status: z.string().optional(),
});


export const productDetailSchema = z.object({
  productId: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  originalPrice: z.number(),
  condition: z.string(),
  size: z.string().nullable(),
  color: z.string().nullable(),
  authenticityConfidenceScore: z.number(),
  status: z.string(),
  viewsCount: z.number(),
  likesCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  seller: sellerSchema,
  category: categorySchema,
  brand: brandSchema,
  images: z.array(productImageSchema),
  discountPercentage: z.number(),
  hasDiscount: z.boolean(),
});

export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  originalPrice: z.number().min(0, 'Original price must be greater than or equal to 0'),
  condition: z.string().min(1, 'Condition is required'),
  size: z.string().min(1, 'Size is required'),
  color: z.string().min(1, 'Color is required'),
  categoryId: z.number().min(1, 'Category is required'),
  brandId: z.number().min(1, 'Brand is required'),
  imageUrls: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required')
});


export const updateProductSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().min(0, 'Price must be greater than or equal to 0').optional(),
  originalPrice: z.number().min(0, 'Original price must be greater than or equal to 0').optional(),
  condition: z.string().min(1, 'Condition is required').optional(),
  size: z.string().min(1, 'Size is required').optional(),
  color: z.string().min(1, 'Color is required').optional(),
  categoryId: z.number().min(1, 'Category is required').optional(),
  brandId: z.number().min(1, 'Brand is required').optional(),
  imageUrls: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required').optional(),
  status: z.string().optional(),
});

export const productsResponseSchema = z.object({
  content: z.array(productSchema),
  pagination: z.object({
    currentPage: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    totalElements: z.number(),
  }),
  filters: z.record(z.unknown()),
});

export interface ProductFilters {
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  category?: string;
  brand?: string;
  condition?: string;
  sortDir?: string;
}

export type Product = z.infer<typeof productSchema>;
export type ProductDetail = z.infer<typeof productDetailSchema>;
export type CreateProductRequest = z.infer<typeof createProductSchema>;
export type UpdateProductRequest = z.infer<typeof updateProductSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;
export type Seller = z.infer<typeof sellerSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Brand = z.infer<typeof brandSchema>;
export type ProductImage = z.infer<typeof productImageSchema>;