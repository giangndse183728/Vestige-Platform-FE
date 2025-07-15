import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from './services';
import { SubmitRatingBody } from './schema';

export const useRatingStats = () => {
  return useQuery({
    queryKey: ['feedback', 'stats'],
    queryFn: feedbackService.getRatingStats,
  });
};

export const useAllRatings = () => {
  return useQuery({
    queryKey: ['feedback', 'all'],
    queryFn: feedbackService.getAllRatings,
    select: (data) => data.data, // select the 'data' field from the response
  });
};

export const useSubmitRating = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SubmitRatingBody) => feedbackService.submitRating(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['feedback', 'all'] });
    },
  });
}; 