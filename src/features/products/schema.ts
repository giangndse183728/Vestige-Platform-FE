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
export type ProductsResponse = z.infer<typeof productsResponseSchema>;