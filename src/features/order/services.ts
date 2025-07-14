import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { CreateOrderData, Order, OrdersResponse } from './schema';

export const createOrder = async (data: CreateOrderData): Promise<Order> => {
  const response = await api.post<ApiResponse<Order>>('/orders', data);
  return response.data.data;
};

export const confirmPayment = async (data: {
  orderId: number;
  stripePaymentIntentId: string;
  clientSecret: string;
}): Promise<any> => {
  const response = await api.post<ApiResponse<any>>('/orders/confirm-payment', data);
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

export const requestItemPickup = async (orderId: number, itemId: number) => {
  const response = await api.post(`/orders/${orderId}/items/${itemId}/request-pickup`);
  return response.data;
};
