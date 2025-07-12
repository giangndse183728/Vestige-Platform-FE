import api from '@/libs/axios';

export const getAllUsersAdmin = () => api.get('/users/admin');
export const getUserAdmin = (userId: number) => api.get(`/users/admin/${userId}`);
export const updateUserAdmin = (userId: number, data: any) => api.patch(`/users/admin/${userId}`, data);
export const bulkUpdateUserAdmin = (data: any) => api.patch('/users/admin/bulk-update', data);
export const deleteUserAdmin = (userId: number) => api.delete(`/users/admin/${userId}`);
export const getUserStatisticsAdmin = (userId: number) => api.get(`/users/admin/${userId}/statistics`);
export const getAllUserStatisticsAdmin = () => api.get('/users/admin/statistics');
export const getUserActivitySummaryAdmin = () => api.get('/users/admin/activity-summary'); 