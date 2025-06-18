import { useMutation } from '@tanstack/react-query';
import { getStripeOnboardUrl } from '../service';
import { toast } from 'sonner';

export const useStripeOnboard = () => {
  return useMutation({
    mutationFn: getStripeOnboardUrl,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      toast.error('Failed to start Stripe onboarding. Please try again.');
      console.error('Stripe onboarding error:', error);
    },
  });
}; 