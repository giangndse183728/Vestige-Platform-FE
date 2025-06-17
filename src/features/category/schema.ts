import * as z from "zod";
import { ApiResponse } from "@/libs/axios";

const categorySchemaBase = {
  categoryId: z.number(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  parent: z.object({ categoryId: z.number(), name: z.string() }).nullable(),
  level: z.number(),
  hasChildren: z.boolean(),
  childrenCount: z.number()
};

export const categorySchema: z.ZodType<Category> = z.lazy(() => 
  z.object({
    ...categorySchemaBase,
    children: z.array(categorySchema)
  })
);

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  parentCategoryId: z.number().nullable().optional(),
});

export const categoriesResponseSchema = z.array(categorySchema);

export type Category = {
  categoryId: number;
  name: string;
  description?: string;
  createdAt: string;
  parent: { categoryId: number; name: string } | null;
  children: Category[];
  level: number;
  hasChildren: boolean;
  childrenCount: number;
};

export type CategoryList = Category[];
export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;
export type CategoriesResponse = CategoryList;
