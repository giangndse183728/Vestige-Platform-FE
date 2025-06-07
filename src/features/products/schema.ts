import * as z from "zod";

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

export type Product = z.infer<typeof productSchema>;
export type CreateProductRequest = z.infer<typeof createProductSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;