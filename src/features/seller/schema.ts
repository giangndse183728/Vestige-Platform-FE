import { z } from 'zod';

export const SellerReviewRequestSchema = z.object({
  transactionId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(150),
});

export const SellerReviewResponseSchema = z.object({
  reviewId: z.number(),
  rating: z.number(),
  comment: z.string(),
  createdAt: z.string(),
  transactionId: z.number(),
  transactionAmount: z.number(),
  product: z.object({
    productId: z.number(),
    title: z.string(),
    primaryImageUrl: z.string(),
    condition: z.string(),
  }),
  reviewer: z.object({
    userId: z.number(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  reviewedUser: z.object({
    userId: z.number(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    sellerRating: z.number(),
    sellerReviewsCount: z.number(),
  }),
});

export const SellerReviewsResponseSchema = z.object({
    content: z.array(SellerReviewResponseSchema)
});

export type SellerReviewRequest = z.infer<typeof SellerReviewRequestSchema>;
export type SellerReviewResponse = z.infer<typeof SellerReviewResponseSchema>;
export type SellerReviewsResponse = z.infer<typeof SellerReviewsResponseSchema>; 