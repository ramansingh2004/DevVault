import api from '@/lib/axios';
import { UserCreate, UserResponse } from '@/types/api.types';

class AuthService {
  async register(data: UserCreate) {
    const response = await api.post('/api/v1/auth/register', data);
    return response.data;
  }

  async login(data: UserCreate) {
    const response = await api.post('/api/v1/auth/login', data);
    return response.data;
  }

  async refresh() {
    const response = await api.post('/api/v1/auth/refresh');
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/api/v1/auth/logout');
  }

  async getMe(): Promise<UserResponse> {
    const response = await api.get<UserResponse>('/api/v1/auth/me');
    return response.data;
  }

  async googleLogin(): Promise<void> {
    window.location.href = '/api/v1/auth/google';
  }
}

export default new AuthService();