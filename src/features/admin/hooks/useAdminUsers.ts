import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as services from '../adminUserServices';

export function useAdminUsers() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery(['admin-users'], () => services.getAllUsersAdmin().then(res => res.data));
  const updateUser = useMutation(({ userId, data }: { userId: number, data: any }) => services.updateUserAdmin(userId, data), {
    onSuccess: () => queryClient.invalidateQueries(['admin-users']),
  });
  const deleteUser = useMutation((userId: number) => services.deleteUserAdmin(userId), {
    onSuccess: () => queryClient.invalidateQueries(['admin-users']),
  });
  const bulkUpdate = useMutation((data: any) => services.bulkUpdateUserAdmin(data), {
    onSuccess: () => queryClient.invalidateQueries(['admin-users']),
  });

  const getUserStatistics = (userId: number) => services.getUserStatisticsAdmin(userId).then(res => res.data);
  const getAllUserStatistics = () => services.getAllUserStatisticsAdmin().then(res => res.data);
  const getUserActivitySummary = () => services.getUserActivitySummaryAdmin().then(res => res.data);

  return {
    usersQuery,
    updateUser,
    deleteUser,
    bulkUpdate,
    getUserStatistics,
    getAllUserStatistics,
    getUserActivitySummary,
  };
} 