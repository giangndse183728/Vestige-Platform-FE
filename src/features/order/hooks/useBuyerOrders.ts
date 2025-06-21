import { useQuery } from '@tanstack/react-query';
import { getOrdersByRole } from '../services';

export const useBuyerOrders = () => {
  return useQuery({
    queryKey: ['orders', 'buyer'],
    queryFn: async () => {
      try {
        const result = await getOrdersByRole('buyer');
        console.log('Buyer Orders API Response:', result);
        return result.content;
      } catch (error) {
        console.error('Error fetching buyer orders:', error);
        throw error;
      }
    },
  });
}; 