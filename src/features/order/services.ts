import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { CreateOrderData, Order } from './schema';

export const createOrder = async (data: CreateOrderData): Promise<Order> => {
  const response = await api.post<ApiResponse<Order>>('/orders', data);
  return response.data.data;
};

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<ApiResponse<Order[]>>('/orders');
  return response.data.data;
};

export const getOrderById = async (orderId: number): Promise<Order> => {
  const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
  return response.data.data;
};
