import api from '@/libs/axios'
import { ApiResponse } from '@/libs/axios'
import { LoginFormData, SignupPayload, LoginResponse, SignupResponse, AuthUser } from './schema'

export async function login(credentials: LoginFormData): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/auth/login', credentials)
    if (response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data
  } catch {
    throw new Error('Login Failed')
  }
}


export async function signup(userData: SignupPayload): Promise<SignupResponse> {
  try {
    const response = await api.post<SignupResponse>('/auth/register', userData)
    if (response.data) {
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }
    return response.data
  } catch {
    throw new Error('Signup Failed')
  }
}

// Đăng xuất
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } catch (_err) {
    console.warn('Logout Failed', _err)
  } finally {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  }
}

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await api.get<ApiResponse<AuthUser>>('/users/profile');
  return response.data.data;
};
