import api from '@/lib/axios';
import { UserCreate, TokenResponse, UserResponse } from '@/types/api.types';

class AuthService {
  async register(data: UserCreate): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/api/v1/auth/register', data);
    if (response.data.message) {
      this.storeToken(response.data);
    }
    return response.data;
  }

  async login(data: UserCreate): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/api/v1/auth/login', data);
    if (response.data.message) {
      this.storeToken(response.data);
    }
    return response.data;
  }

  async refresh(): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/api/v1/auth/refresh');
    if (response.data.message) {
      this.storeToken(response.data);
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

  private storeToken(response: TokenResponse) {
    if (typeof window !== 'undefined') {
      const { message } = response;
      localStorage.setItem('auth_token', message);
    }
  }

  private clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export default new AuthService();