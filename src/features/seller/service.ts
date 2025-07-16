import axios from '@/libs/axios';
import { SellerReviewRequest, SellerReviewResponse, SellerReviewResponseSchema, SellerReviewRequestSchema, SellerReviewsResponse } from './schema';

export async function getSellerReview(transactionId: number): Promise<SellerReviewResponse | null> {
  try {
    const res = await axios.get(`/reviews/transaction/${transactionId}`);
    return res.data.data;
  } catch (e: any) {
    if (e.response && e.response.status === 404) return null;
    throw e;
  }
}

export async function submitSellerReview(data: SellerReviewRequest): Promise<SellerReviewResponse> {
  SellerReviewRequestSchema.parse(data);
  const res = await axios.post('/reviews', data);
  return res.data;
}

export async function updateSellerReview(data: SellerReviewRequest): Promise<SellerReviewResponse> {
  SellerReviewRequestSchema.parse(data);
  const res = await axios.patch('/reviews', data);
  return res.data;
}

export async function getReviewsBySellerId(sellerId: number): Promise<SellerReviewsResponse> {
  const res = await axios.get(`/reviews/seller/${sellerId}`);
  return res.data.data;
} 