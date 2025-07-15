import api from '@/libs/axios';
import { ApiResponse } from '@/libs/axios';

export interface StripeOnboardResponse {
  url: string;
}

export interface StripeAccountStatus {
  hasAccount: boolean;
  setupComplete: boolean;
  accountId?: string;
}

export const getStripeOnboardUrl = async (): Promise<StripeOnboardResponse> => {
  const response = await api.post<ApiResponse<StripeOnboardResponse>>('/stripe/onboard-seller');
  return response.data.data;
};

export const getStripeRefreshOnboardUrl = async (): Promise<StripeOnboardResponse> => {
  const response = await api.post<ApiResponse<StripeOnboardResponse>>('/stripe/refresh-onboarding');
  return response.data.data;
};

export const getStripeAccountStatus = async (): Promise<StripeAccountStatus> => {
  const response = await api.get<ApiResponse<StripeAccountStatus>>('/stripe/account-status');
  return response.data.data;
};
