import axios from '@/libs/axios';
import { ratingStatsSchema, ratingsAllResponseSchema, RatingStats, RatingsAllResponse, submitRatingBodySchema, submitRatingResponseSchema, SubmitRatingBody, SubmitRatingResponse } from './schema';
import ratingStatsData from '@/mock/ratingStats.json';
import ratingsData from '@/mock/ratings.json';

export const feedbackService = {
  async getRatingStats(): Promise<RatingStats> {
    return ratingStatsSchema.parse(ratingStatsData);
    
  },

  async getAllRatings(): Promise<RatingsAllResponse> {
    return ratingsAllResponseSchema.parse(ratingsData);
  },

  async submitRating(body: SubmitRatingBody): Promise<SubmitRatingResponse> {
    const parsed = submitRatingBodySchema.parse(body);
    const response = await axios.post('/ratings', parsed);
    return submitRatingResponseSchema.parse(response.data);
  },
}; 