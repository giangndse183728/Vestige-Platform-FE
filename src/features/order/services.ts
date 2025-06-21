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
