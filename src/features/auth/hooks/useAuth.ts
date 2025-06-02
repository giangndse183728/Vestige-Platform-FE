import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login, signup, logout } from '../services';
import {
  LoginFormData,
  SignupFormData,
  LoginResponse,
  SignupResponse,
} from '@/features/auth/schema';
import { toast } from 'sonner';
import { useCurrentUser } from './useCurrentUser';

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginFormData) => login(credentials),
    onSuccess: (data: LoginResponse) => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      toast.success('Login successful!');
      router.push('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });
};

export const useSignup = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: SignupFormData) => signup(userData),
    onSuccess: (data: SignupResponse) => {

      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      toast.success('Account created successfully!');
      router.push('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: (error: Error) => {
      toast.error('Logout failed');
      queryClient.clear();
      router.push('/login');
    },
  });
};

export const useAuth = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const logoutMutation = useLogout();

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    error,
    isAuthenticated,

    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    loginError: loginMutation.error,
    signupError: signupMutation.error,
    logoutError: logoutMutation.error,
  };
};
