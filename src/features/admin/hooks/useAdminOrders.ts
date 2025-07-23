import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAdminAllOrders } from '@/features/order/services';

export function useAdminOrders(page = 0, size = 20, status?: string) {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['admin-orders', page, size, status],
    queryFn: () => getAdminAllOrders({ page, size, status }).then(res => res.data),
  });

  const refetchOrders = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
  };

  return {
    ordersQuery,
    refetchOrders,
  };
}
