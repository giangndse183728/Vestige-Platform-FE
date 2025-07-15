import { z } from 'zod';

export const SellerReviewRequestSchema = z.object({
  transactionId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
});

export const SellerReviewResponseSchema = z.object({
  id: z.number(),
  transactionId: z.number(),
  rating: z.number(),
  comment: z.string(),
  createdAt: z.string(),
});

export type SellerReviewRequest = z.infer<typeof SellerReviewRequestSchema>;
export type SellerReviewResponse = z.infer<typeof SellerReviewResponseSchema>; 