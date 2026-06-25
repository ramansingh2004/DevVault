import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blockService from '@/services/block.service';
import { CreateBulkBlock, PatchBlocks } from '@/types/api.types';

const BLOCK_KEYS = {
  all: ['blocks'] as const,
  byContainer: (containerId: string) => [...BLOCK_KEYS.all, 'container', containerId] as const,
};

export function useBlocks(containerId: string) {
  return useQuery({
    queryKey: BLOCK_KEYS.byContainer(containerId),
    queryFn: () => blockService.getByContainer(containerId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!containerId,
  });
}

export function useCreateBlocks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBulkBlock) => blockService.create(data),
    onSuccess: (data) => {
      const containerId = data[0]?.container_id;
      if (containerId) {
        queryClient.invalidateQueries({ queryKey: BLOCK_KEYS.byContainer(containerId) });
      }
    },
  });
}

export function useUpdateBlocks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatchBlocks) => blockService.update(data),
    onSuccess: (data) => {
      const containerId = data[0]?.container_id;
      if (containerId) {
        queryClient.invalidateQueries({ queryKey: BLOCK_KEYS.byContainer(containerId) });
      }
    },
  });
}

export function useDeleteBlock(containerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blockId: string) => blockService.delete(blockId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOCK_KEYS.byContainer(containerId) });
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => blockService.uploadImage(file),
  });
}