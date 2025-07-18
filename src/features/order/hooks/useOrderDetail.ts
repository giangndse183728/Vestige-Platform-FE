import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '../services';

export const useOrderDetail = (orderId: number) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: orderId > 0,
  });
}; 