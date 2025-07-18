import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { CreateOrderData, Order, OrdersResponse } from './schema';

export const createOrder = async (data: CreateOrderData): Promise<Order> => {
  const response = await api.post<ApiResponse<Order>>('/orders/payos', data);
  return response.data.data;
};

export const confirmPayment = async (params: {
  code: string;
  status: string;
  orderCode: string;
}): Promise<any> => {
  const response = await api.post<ApiResponse<any>>('/payos/confirm-payment', {}, {
    params
  });
  return response.data.data;
};

export const getOrders = async (): Promise<OrdersResponse> => {
  const response = await api.get<ApiResponse<OrdersResponse>>('/orders');
  return response.data.data;
};

export const getOrdersByRole = async (role: 'buyer' | 'seller'): Promise<OrdersResponse> => {
  const response = await api.get<ApiResponse<OrdersResponse>>(`/orders?role=${role}`);
  return response.data.data;
};

export const getOrderById = async (orderId: number): Promise<Order> => {
  const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
  return response.data.data;
};

// ADMIN ORDER SERVICES
export const getAdminTransactions = async () => {
  const response = await api.get('/orders/admin/transactions');
  return response.data;
};

export const getAdminProblemTransactions = async () => {
  const response = await api.get('/orders/admin/transactions/problems');
  return response.data;
};

export const getAdminTransactionAnalytics = async () => {
  const response = await api.get('/orders/admin/transactions/analytics');
  return response.data;
};

export const getAdminOrderStatistics = async () => {
  const response = await api.get('/orders/admin/statistics');
  return response.data;
};

export const getAdminOrderTimeline = async (orderId: string | number) => {
  const response = await api.get(`/orders/admin/orders/${orderId}/timeline`);
  return response.data;
};

export const getAdminExportOrders = async () => {
  const response = await api.get('/orders/admin/orders/export');
  return response.data;
};

export const getAdminSellerAnalytics = async () => {
  const response = await api.get('/orders/admin/analytics/sellers');
  return response.data;
};

export const getAdminRevenueAnalytics = async () => {
  const response = await api.get('/orders/admin/analytics/revenue');
  return response.data;
};

export const getAdminBuyerAnalytics = async () => {
  const response = await api.get('/orders/admin/analytics/buyers');
  return response.data;
};

export const getAdminAllOrders = async () => {
  const response = await api.get('/orders/admin/all');
  return response.data;
};

export const getAdminAwaitingReleaseTransactions = async () => {
  const response = await api.get('/orders/admin/transactions/awaiting-release');
  return response.data;
};

export const releaseEscrowByAdmin = async (transactionId: number, notes?: string) => {
  const response = await api.post(`/orders/admin/transactions/${transactionId}/release-escrow`, undefined, {
    params: notes ? { notes } : undefined,
  });
  return response.data;
};

export const releaseAwaitingEscrowByAdmin = async (transactionId: number, notes?: string) => {
  const response = await api.post(`/orders/admin/transactions/${transactionId}/release-awaiting-escrow`, undefined, {
    params: notes ? { notes } : undefined,
  });
  return response.data;
};

// LOGISTICS SERVICES FOR SHIPPERS

export const confirmPickup = async (orderItemId: number, photoUrls: string[]) => {
  const response = await api.post<ApiResponse<any>>('/logistics/confirm-pickup', {
    orderItemId,
    photoUrls,
  });
  return response.data;
};

export const dispatchItem = async (itemId: number) => {
  const response = await api.post<ApiResponse<any>>(`/logistics/items/${itemId}/dispatch`);
  return response.data;
};

export const confirmDelivery = async (itemId: number, photoUrls: string[]) => {
  const response = await api.post<ApiResponse<any>>(`/logistics/items/${itemId}/confirm-delivery`, {
    photoUrls,
  });
  return response.data;
};

export const getLogisticsListByStatus = async (status: string) => {
  const response = await api.get<ApiResponse<any>>(`/logistics`, { params: { status } });
  return response.data;
};

export const requestItemPickup = async (orderId: number, itemId: number) => {
  const response = await api.post(`/orders/${orderId}/items/${itemId}/request-pickup`);
  return response.data;
};
