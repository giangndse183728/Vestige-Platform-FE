import { useQuery } from '@tanstack/react-query';
import { getOrdersByRole } from '../services';

export const useSellerOrders = () => {
  return useQuery({
    queryKey: ['orders', 'seller'],
    queryFn: async () => {
      try {
        const result = await getOrdersByRole('seller');
        console.log('Seller Orders API Response:', result);
        return result.content;
      } catch (error) {
        console.error('Error fetching seller orders:', error);
        throw error;
      }
    },
  });
}; 