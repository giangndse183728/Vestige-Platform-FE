import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../services';
import { UpdateProductRequest } from '../schema';
import { myProductKeys } from './useMyProducts';

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myProductKeys.all });
    },
  });
}; 