import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/auth.service';
import { UserCreate, TokenResponse } from '@/types/api.types';

const AUTH_KEYS = {
  all: ['auth'] as const,
  me: () => [...AUTH_KEYS.all, 'me'] as const,
};

export function useAuth() {
  return useQuery({
    queryKey: AUTH_KEYS.me(),
    queryFn: () => authService.getMe(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserCreate) => authService.register(data),
    onSuccess: (data: TokenResponse) => {
      queryClient.setQueryData(AUTH_KEYS.me(), data.user);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserCreate) => authService.login(data),
    onSuccess: (data: TokenResponse) => {
      queryClient.setQueryData(AUTH_KEYS.me(), data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_KEYS.all });
    },
  });
}

export function useRefresh() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.refresh(),
    onSuccess: (data: TokenResponse) => {
      queryClient.setQueryData(AUTH_KEYS.me(), data.user);
    },
  });
}