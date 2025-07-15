import axios from '@/libs/axios';
import { SellerReviewRequest, SellerReviewResponse, SellerReviewResponseSchema, SellerReviewRequestSchema } from '../schema/sellerReviewSchema';

export async function getSellerReview(transactionId: number): Promise<SellerReviewResponse | null> {
  try {
    const res = await axios.get(`/reviews/transaction/${transactionId}`);
    return SellerReviewResponseSchema.parse(res.data);
  } catch (e: any) {
    if (e.response && e.response.status === 404) return null;
    throw e;
  }
}

export async function submitSellerReview(data: SellerReviewRequest): Promise<SellerReviewResponse> {
  SellerReviewRequestSchema.parse(data);
  const res = await axios.post('/reviews', data);
  return SellerReviewResponseSchema.parse(res.data);
} 