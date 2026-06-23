import api from '@/lib/axios';
import { UserCreate, TokenResponse, UserResponse } from '@/types/api.types';

/**
 * Auth Service
 * 
 * Handles authentication API calls.
 * Token storage is managed by Axios interceptors in lib/axios.ts
 * User state is managed by React Query in hooks/useAuth.ts
 * 
 * This ensures a single source of truth:
 * - React Query: User data
 * - localStorage (via Axios): JWT token
 * - NO Zustand duplication
 */
class AuthService {
  async register(data: UserCreate): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/api/v1/auth/register', data);
    if (response.data.message) {
      this.storeToken(response.data.message);
    }
    return response.data;
  }

  async login(data: UserCreate): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/api/v1/auth/login', data);
    if (response.data.message) {
      this.storeToken(response.data.message);
    }
    return response.data;
  }

  async refresh(): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/api/v1/auth/refresh');
    if (response.data.message) {
      this.storeToken(response.data.message);
    }
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/api/v1/auth/logout');
    } finally {
      this.clearAuth();
    }
  }

  async getMe(): Promise<UserResponse> {
    const response = await api.get<UserResponse>('/api/v1/auth/me');
    return response.data;
  }

  async googleLogin(): Promise<void> {
    window.location.href = '/api/v1/auth/google';
  }

  /**
   * Store token in localStorage
   * Axios interceptor will use this for subsequent requests
   */
  private storeToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Clear all auth data
   * This is called on logout
   */
  private clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get token from localStorage
   * Used by Axios interceptor
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Check if user is authenticated
   * Based on token existence
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export default new AuthService();