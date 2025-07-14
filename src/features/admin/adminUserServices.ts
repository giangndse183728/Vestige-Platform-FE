import api from '@/libs/axios';

// Basic CRUD operations
export const getAllUsersAdmin = () => api.get('/users/admin');
export const getUserAdmin = (userId: number) => api.get(`/users/admin/${userId}`);
export const updateUserAdmin = (userId: number, data: any) => api.patch(`/users/admin/${userId}`, data);
export const bulkUpdateUserAdmin = (data: any) => api.patch('/users/admin/bulk-update', data);
export const deleteUserAdmin = (userId: number) => api.delete(`/users/admin/${userId}`);

// Statistics and analytics
export const getUserStatisticsAdmin = (userId: number) => api.get(`/users/admin/${userId}/statistics`);
export const getAllUserStatisticsAdmin = () => api.get('/users/admin/statistics');
export const getUserActivitySummaryAdmin = () => api.get('/users/admin/activity-summary');

// Additional user management features
export const activateUserAdmin = (userId: number) => api.patch(`/users/admin/${userId}/activate`);
export const deactivateUserAdmin = (userId: number) => api.patch(`/users/admin/${userId}/deactivate`);
export const changeUserRoleAdmin = (userId: number, role: string) => api.patch(`/users/admin/${userId}/role`, { role });
export const resetUserPasswordAdmin = (userId: number) => api.post(`/users/admin/${userId}/reset-password`);
export const getUserOrdersAdmin = (userId: number) => api.get(`/users/admin/${userId}/orders`);
export const getUserProductsAdmin = (userId: number) => api.get(`/users/admin/${userId}/products`);
export const getUserTransactionsAdmin = (userId: number) => api.get(`/users/admin/${userId}/transactions`); 