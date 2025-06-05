import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';
import { ProfileFormData, ProfileUser } from './schema';

export const updateProfile = async (data: ProfileFormData): Promise<ProfileUser> => {
  const response = await api.patch<ApiResponse<ProfileUser>>('/users/profile', data);
  return response.data.data;
};

export const getProfile = async (): Promise<ProfileUser> => {
  const response = await api.get<ApiResponse<ProfileUser>>('/users/profile');
  return response.data.data;
};
