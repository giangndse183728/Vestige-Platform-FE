import axios from '@/libs/axios';
import { ratingStatsSchema, ratingsAllResponseSchema, RatingStats, RatingsAllResponse, submitRatingBodySchema, submitRatingResponseSchema, SubmitRatingBody, SubmitRatingResponse } from './schema';

export const feedbackService = {
  async getRatingStats(): Promise<RatingStats> {
    const response = await axios.get('/ratings/stats');
    return ratingStatsSchema.parse(response.data);
  },

  async getAllRatings(): Promise<RatingsAllResponse> {
    const response = await axios.get('/ratings/all');
    return ratingsAllResponseSchema.parse(response.data);
  },

  async submitRating(body: SubmitRatingBody): Promise<SubmitRatingResponse> {
    const parsed = submitRatingBodySchema.parse(body);
    const response = await axios.post('/ratings', parsed);
    return submitRatingResponseSchema.parse(response.data);
  },
}; 