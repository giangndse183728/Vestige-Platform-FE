import { useQuery } from '@tanstack/react-query';
import { getPublicProfile } from '../services';

export const publicProfileKeys = {
  profile: (userId: number) => ['publicProfile', userId] as const,
};

export const usePublicProfile = (userId: number) => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: publicProfileKeys.profile(userId),
    queryFn: () => getPublicProfile(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId,
    retry: (failureCount, error: any) => {
      // Don't retry if it's a 404 (user not found)
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });

  return {
    user,
    isLoading,
    error,
  };
};