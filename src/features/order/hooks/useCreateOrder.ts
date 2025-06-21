import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '../services';
import { toast } from 'sonner';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
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