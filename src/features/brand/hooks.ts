import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBrands, createBrand, updateBrand, deleteBrand } from './service';
import { BrandsResponse, CreateBrandRequest } from './schema';

export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  detail: (id: number) => [...brandKeys.all, 'detail', id] as const,
};

export const useBrands = () => {
  return useQuery<BrandsResponse>({
    queryKey: brandKeys.lists(),
    queryFn: getBrands,
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ brandId, data }: { brandId: number; data: Partial<CreateBrandRequest> }) =>
      updateBrand(brandId, data),
    onSuccess: (_, { brandId }) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(brandId) });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    },
  });
};
