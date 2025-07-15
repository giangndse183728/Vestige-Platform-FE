import { useQuery } from '@tanstack/react-query';
import { getStripeAccountStatus } from '../service';

export const useStripeAccountStatus = () => {
  return useQuery({
    queryKey: ['stripe-account-status'],
    queryFn: getStripeAccountStatus,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}; 