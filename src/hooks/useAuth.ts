import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/auth.service';
import { RegisterRequest, AuthResponse } from '@/types/api.types';

const AUTH_KEYS = {
  all: ['auth'] as const,
  me: () => [...AUTH_KEYS.all, 'me'] as const,
};

/**
 * Get current authenticated user
 * React Query is the single source of truth for auth state
 * Token is managed by Axios interceptors
 */
export function useAuth() {
  return useQuery({
    queryKey: AUTH_KEYS.me(),
    queryFn: async () => {
      console.log('Fetching current user...');
      const user = await authService.getMe();
      console.log('Current user:', user);
      return user;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Register new user
 * Automatically fetches and caches user data
 * Token is stored in localStorage by Axios interceptor
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data: AuthResponse) => {
      // Set user data in React Query cache
      queryClient.setQueryData(AUTH_KEYS.me(), data.user);
    },
  });
}

/**
 * Login user
 * Automatically fetches and caches user data
 * Token is stored in localStorage by Axios interceptor
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: AUTH_KEYS.me(),
      });
    },
  });
}

/**
 * Logout user
 * Clears React Query cache
 * Token is removed from localStorage by auth service
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all auth queries from cache
      queryClient.removeQueries({ queryKey: AUTH_KEYS.all });
    },
  });
}

/**
 * Refresh authentication token
 * Called automatically by Axios interceptor on 401
 */
export function useRefresh() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.refresh(),
    onSuccess: async () => {
    await queryClient.invalidateQueries({
    queryKey: AUTH_KEYS.me(),
  });
},
  });
}