import api from '@/libs/axios'
import { LoginFormData, SignupFormData, LoginResponse, SignupResponse, AuthUser } from './schema'

export async function login(credentials: LoginFormData): Promise<LoginResponse> {
  try {

    const response = await api.post<LoginResponse>('/auth/login', credentials)
    if (response.data) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response.data
  } catch (err) {
    throw new Error('Login Failed')
  }
}


export async function signup(userData: SignupFormData): Promise<SignupResponse> {
  try {
    const response = await api.post<SignupResponse>('/auth/signup', userData)

    if (response.data) {
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }

    return response.data
  } catch (err) {
    throw new Error('Signup Failed')
  }
}

// Đăng xuất
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } catch (err) {
    console.warn('Logout Failed', err)
  } finally {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  }
}

export const getCurrentUser = async (): Promise<AuthUser> => {
    const response = await api.get<AuthUser>('/users/profile');
    return response.data;
  };
