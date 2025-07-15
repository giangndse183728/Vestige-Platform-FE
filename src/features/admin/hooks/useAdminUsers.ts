import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as services from '../adminUserServices';

export function useAdminUsers() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => services.getAllUsersAdmin().then(res => res.data),
  });

  const updateUser = useMutation({
    mutationFn: ({ userId, data }: { userId: number, data: any }) => services.updateUserAdmin(userId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const deleteUser = useMutation({
    mutationFn: (userId: number) => services.deleteUserAdmin(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const bulkUpdate = useMutation({
    mutationFn: (data: any) => services.bulkUpdateUserAdmin(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const activateUser = useMutation({
    mutationFn: (userId: number) => services.activateUserAdmin(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const deactivateUser = useMutation({
    mutationFn: (userId: number) => services.deactivateUserAdmin(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const changeUserRole = useMutation({
    mutationFn: ({ userId, role }: { userId: number, role: string }) => services.changeUserRoleAdmin(userId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const resetUserPassword = useMutation({
    mutationFn: (userId: number) => services.resetUserPasswordAdmin(userId),
  });

  // Statistics and analytics functions
  const getUserStatistics = (userId: number) => services.getUserStatisticsAdmin(userId).then(res => res.data);
  const getAllUserStatistics = () => services.getAllUserStatisticsAdmin().then(res => res.data);
  const getUserActivitySummary = () => services.getUserActivitySummaryAdmin().then(res => res.data);

  // Additional user data functions
  const getUserOrders = (userId: number) => services.getUserOrdersAdmin(userId).then(res => res.data);
  const getUserProducts = (userId: number) => services.getUserProductsAdmin(userId).then(res => res.data);
  const getUserTransactions = (userId: number) => services.getUserTransactionsAdmin(userId).then(res => res.data);
  const getUserAdmin = (userId: number) => services.getUserAdmin(userId).then(res => res.data);

  return {
    usersQuery,
    updateUser,
    deleteUser,
    bulkUpdate,
    activateUser,
    deactivateUser,
    changeUserRole,
    resetUserPassword,
    getUserStatistics,
    getAllUserStatistics,
    getUserActivitySummary,
    getUserOrders,
    getUserProducts,
    getUserTransactions,
    getUserAdmin,
  };
} 