import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '../services';
import { toast } from 'sonner';
import { Order } from '../schema';

// Accepts: string (legacy), { checkoutUrl: string, ... }, or Order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<Order | string | { checkoutUrl: string }, unknown, any>({
    mutationFn: createOrder,
    onSuccess: (data) => {
      // If PayOS, backend may return a string (legacy) or an object with checkoutUrl
      if (typeof data === 'string' && data.startsWith('http')) {
        const paymentUrl = new URL(data);
        paymentUrl.searchParams.append('returnUrl', `${window.location.origin}/checkout/success`);
        window.location.href = paymentUrl.toString();
        return;
      }
      if (typeof data === 'object' && data !== null && 'checkoutUrl' in data && typeof data.checkoutUrl === 'string') {
        const paymentUrl = new URL(data.checkoutUrl);
        paymentUrl.searchParams.append('returnUrl', `${window.location.origin}/checkout/success`);
        window.location.href = paymentUrl.toString();
        return;
      }
      // Otherwise, data is an Order object
      toast.success('Order created successfully!');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      return data;
    },
    onError: (error) => {
      toast.error('Failed to create order');
      console.error('Create order error:', error);
    },
  });
}; 