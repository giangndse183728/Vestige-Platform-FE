import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../services';
import { AddressFormData } from '../schema';
import { toast } from 'sonner';

export const useAddresses = () => {
  const queryClient = useQueryClient();

  const { data: addresses, isLoading, error } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses
  });

  const createAddressMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address added successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add address');
    }
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ addressId, data }: { addressId: number; data: AddressFormData }) => 
      updateAddress(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address updated successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update address');
    }
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete address');
    }
  });

  const setDefaultAddressMutation = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Default address updated successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update default address');
    }
  });

  return {
    addresses: addresses?.data || [],
    isLoading,
    error,
    createAddress: createAddressMutation.mutate,
    updateAddress: updateAddressMutation.mutate,
    deleteAddress: deleteAddressMutation.mutate,
    setDefaultAddress: setDefaultAddressMutation.mutate,
    isCreating: createAddressMutation.isPending,
    isUpdating: updateAddressMutation.isPending,
    isDeleting: deleteAddressMutation.isPending,
    isSettingDefault: setDefaultAddressMutation.isPending
  };
}; 