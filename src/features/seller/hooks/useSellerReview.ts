import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSellerReview, submitSellerReview } from '../service/sellerReviewService';
import { SellerReviewRequest, SellerReviewResponse } from '../schema/sellerReviewSchema';

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