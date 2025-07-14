import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestItemPickup } from '../services';
import { toast } from 'sonner';

interface RequestPickupParams {
  orderId: number;
  orderItemId: number;
}

export const useRequestPickup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, orderItemId }: RequestPickupParams) => 
      requestItemPickup(orderId, orderItemId),
    onSuccess: (data) => {
      toast.success('Pickup request sent successfully');
      // Invalidate and refetch orders to update the status
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
    },
    onError: (error: any) => {
      console.error('Error requesting pickup:', error);
      toast.error(error.response?.data?.message || 'Failed to request pickup');
    },
  });
}; 