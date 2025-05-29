import { useQuery } from '@tanstack/react-query';
import { authKeys } from './useAuth';
import { getCurrentUser } from '../services';
import { AuthUser } from '@/features/auth/schema';

export const useCurrentUser = () => {
  return useQuery<AuthUser>({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const user = await getCurrentUser();
      return user;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('authToken'), 
    staleTime: 1000 * 60 * 5, 
  });
};
