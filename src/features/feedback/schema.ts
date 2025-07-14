import { z } from 'zod';

export const ratingStatsSchema = z.object({
  averageRating: z.number(),
  totalRatings: z.number(),
  oneStarCount: z.number(),
  twoStarCount: z.number(),
  threeStarCount: z.number(),
  fourStarCount: z.number(),
  fiveStarCount: z.number(),
});

export const ratingSchema = z.object({
  id: z.number(),
  rating: z.number(),
  comment: z.string(),
  userId: z.number(),
  username: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ratingsAllResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    content: z.array(ratingSchema),
    pagination: z.object({
      currentPage: z.number(),
      pageSize: z.number(),
      totalPages: z.number(),
      totalElements: z.number(),
    }),
    filters: z.any().nullable(),
  }),
});

export const submitRatingBodySchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string(),
});

export const submitRatingResponseSchema = ratingSchema;

export type RatingStats = z.infer<typeof ratingStatsSchema>;
export type Rating = z.infer<typeof ratingSchema>;
export type RatingsAllResponse = z.infer<typeof ratingsAllResponseSchema>;
export type SubmitRatingBody = z.infer<typeof submitRatingBodySchema>;
export type SubmitRatingResponse = z.infer<typeof submitRatingResponseSchema>; 