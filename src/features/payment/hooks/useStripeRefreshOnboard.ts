import { useMutation } from '@tanstack/react-query';
import { getStripeRefreshOnboardUrl } from '../service';

export const useStripeRefreshOnboard = () => {
  return useMutation({
    mutationFn: getStripeRefreshOnboardUrl,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      console.error('Error refreshing Stripe onboarding:', error);
    },
  });
}; 