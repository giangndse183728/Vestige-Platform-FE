import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { ProfileFormData, ProfileUser } from './schema';
import { Address, AddressFormData, AddressesResponse } from './schema';

export const updateProfile = async (data: ProfileFormData): Promise<ProfileUser> => {
  const response = await api.patch<ApiResponse<ProfileUser>>('/users/profile', data);
  return response.data.data;
};

export const getProfile = async (): Promise<ProfileUser> => {
  const response = await api.get<ApiResponse<ProfileUser>>('/users/profile');
  return response.data.data;
};

export const getAddresses = async (): Promise<AddressesResponse> => {
  const response = await api.get<AddressesResponse>('/users/addresses');
  return response.data;
};

export const createAddress = async (data: AddressFormData): Promise<Address> => {
  const response = await api.post<Address>('/users/addresses', data);
  return response.data;
};

export const updateAddress = async (addressId: number, data: AddressFormData): Promise<Address> => {
  const response = await api.put<Address>(`/users/addresses/${addressId}`, data);
  return response.data;
};

export const deleteAddress = async (addressId: number): Promise<void> => {
  await api.delete(`/users/addresses/${addressId}`);
};

export const setDefaultAddress = async (addressId: number): Promise<Address> => {
  const response = await api.put<Address>(`/users/addresses/${addressId}/set-default`);
  return response.data;
};
