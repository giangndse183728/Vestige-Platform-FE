import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/services';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any | null;
  userRole: string | null;
}

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { requireAuth = true, requireAdmin = false, redirectTo = '/login' } = options;
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    userRole: null,
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user,
          userRole: user.roleName,
        });
      } catch (error) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          userRole: null,
        });
      }
    };

    checkAuth();
  }, []);

  // Handle redirects in separate useEffect
  useEffect(() => {
    if (authState.isLoading) return;

    // Check authentication requirement
    if (requireAuth && !authState.isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check admin requirement
    if (requireAdmin && authState.isAuthenticated && authState.userRole !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [authState.isLoading, authState.isAuthenticated, authState.userRole, requireAuth, requireAdmin, router, redirectTo]);

  return authState;
}
