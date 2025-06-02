import { useQuery } from '@tanstack/react-query';
import { authKeys } from './useAuth';
import { getCurrentUser } from '../services';
import { AuthUser } from '@/features/auth/schema';

export const useCurrentUser = () => {
  return useQuery<AuthUser>({
    queryKey: authKeys.user(),
    queryFn: getCurrentUser,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false, 
    refetchOnReconnect: false, 
  });
};
