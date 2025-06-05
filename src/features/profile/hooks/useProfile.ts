import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateProfile, getProfile } from '../services';
import { ProfileFormData } from '../schema';
import { toast } from 'sonner';



export const authKeys = {

    user: () => [ 'user'] as const,
  }; 
  
export const useProfile = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: authKeys.user(),
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const handleUpdateProfile = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  return {
    user,
    isLoading,
    error,
    updateProfile: handleUpdateProfile,
    isUpdating: updateProfileMutation.isPending,
  };
}; 