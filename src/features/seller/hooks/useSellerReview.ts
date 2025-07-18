import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSellerReview, submitSellerReview, updateSellerReview, getReviewsBySellerId } from '../service';
import { SellerReviewRequest, SellerReviewResponse, SellerReviewsResponse } from '../schema';

export const useSellerReview = (transactionId: number) => {
  return useQuery<SellerReviewResponse | null>({
    queryKey: ['seller-review', transactionId],
    queryFn: () => getSellerReview(transactionId),
  });
};

export const useSubmitSellerReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SellerReviewRequest) => submitSellerReview(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['seller-review', variables.transactionId] });
    },
  });
};

export const useUpdateSellerReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SellerReviewRequest) => updateSellerReview(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['seller-review', variables.transactionId] });
    },
  });
};

export const useSellerReviewsBySellerId = (sellerId: number) => {
  return useQuery<SellerReviewsResponse, Error, SellerReviewResponse[]>({
    queryKey: ['seller-reviews', sellerId],
    queryFn: () => getReviewsBySellerId(sellerId),
    select: (data) => data.content,
    
  });
  
}; 