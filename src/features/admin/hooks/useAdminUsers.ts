import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import * as services from '../adminUserServices';

export function useAdminUsers(page = 0, size = 20) {
  const queryClient = useQueryClient();
  const [allUsers, setAllUsers] = useState<any[] | null>(null);
  const [allUsersLoading, setAllUsersLoading] = useState(false);
  const [allUsersError, setAllUsersError] = useState<string | null>(null);

  const usersQuery = useQuery({
    queryKey: ['admin-users', page, size],
    queryFn: () => services.getAllUsersAdmin({ page, size }).then(res => res.data),
  });

  // Fetch all users function following ProductManager pattern
  const fetchAllUsers = async (filters?: any) => {
    setAllUsersLoading(true);
    setAllUsersError(null);
    try {
      const data = await services.getAllUsersAdmin(filters);
      setAllUsers(data.data?.content || []);
      return data.data;
    } catch (err: any) {
      setAllUsersError(err?.message || 'Failed to fetch users');
      throw err;
    } finally {
      setAllUsersLoading(false);
    }
  };

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
    allUsers,
    allUsersLoading,
    allUsersError,
    fetchAllUsers,
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