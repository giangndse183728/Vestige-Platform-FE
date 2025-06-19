import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../services';
import { ActualOrder } from '../schema';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        const result = await getOrders();
        console.log('API Response:', result);
        return result.content;
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
    },
  });
}; 