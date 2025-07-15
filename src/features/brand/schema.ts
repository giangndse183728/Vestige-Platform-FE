import * as z from "zod";

export const brandSchema = z.object({
  brandId: z.number(),
  name: z.string(),
  logoUrl: z.string().url(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createBrandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  logoUrl: z.string().url('Invalid logo URL'),
});

export const brandsResponseSchema = z.array(brandSchema);

export type Brand = z.infer<typeof brandSchema>;
export type CreateBrandRequest = z.infer<typeof createBrandSchema>;
export type BrandsResponse = Brand[]; 