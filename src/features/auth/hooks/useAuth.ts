'use client';

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
import { useProfile } from '@/features/profile/hooks/useProfile';

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginFormData) => login(credentials),
    onSuccess: (data: LoginResponse) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Login successful!');   
      if (data.role === 'ADMIN') {
        router.push('/admin');
      } else if (data.role === 'SHIPPER') {
        router.push('/shipper');
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect');
        
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.push('/');
        }
      }
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
    mutationFn: (formData: SignupFormData) => {
      const { confirmPassword, ...payload } = formData;
      return signup(payload);
    },
    onSuccess: (data: SignupResponse) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Account created successfully!');
      
      if (data.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
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
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: () => {
      toast.error('Logout failed');
      queryClient.clear();
      router.push('/login');
    },
  });
};

export const useAuth = () => {
  const { user, isLoading, error } = useProfile();

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
