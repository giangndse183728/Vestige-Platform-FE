import * as z from "zod";

const categorySchemaBase = {
  categoryId: z.number(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
  parent: z.number().nullable(),
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

export const categoriesResponseSchema = z.array(categorySchema);

export type Category = {
  categoryId: number;
  name: string;
  description: string;
  createdAt: string;
  parent: number | null;
  children: Category[];
  level: number;
  hasChildren: boolean;
  childrenCount: number;
};

export type CategoriesResponse = Category[];
