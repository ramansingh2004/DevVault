import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import containerService from '@/services/container.service';
import { ContainerCreate, ContainerUpdate } from '@/types/api.types';

const CONTAINER_KEYS = {
  all: ['containers'] as const,
  list: () => [...CONTAINER_KEYS.all, 'list'] as const,
  detail: (id: string) => [...CONTAINER_KEYS.all, 'detail', id] as const,
};

export function useContainers() {
  return useQuery({
    queryKey: CONTAINER_KEYS.list(),
    queryFn: () => containerService.getAll(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useContainer(containerId: string) {
  return useQuery({
    queryKey: CONTAINER_KEYS.detail(containerId),
    queryFn: () => containerService.getOne(containerId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!containerId,
  });
}

export function useCreateContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContainerCreate) => containerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTAINER_KEYS.list() });
    },
  });
}

export function useUpdateContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ContainerUpdate }) =>
      containerService.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: CONTAINER_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CONTAINER_KEYS.list() });
    },
  });
}

export function useDeleteContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => containerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTAINER_KEYS.list() });
    },
  });
}