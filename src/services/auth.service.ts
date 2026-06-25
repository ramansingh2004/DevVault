import api from '@/lib/axios';
import { UserCreate, UserResponse, AuthResponse } from '@/types/api.types';

class AuthService {
  async register(data: UserCreate): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/v1/auth/register', data);
    return response.data;
  }

  async login(data: UserCreate): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/v1/auth/login', data);
    return response.data;
  }

  async refresh(): Promise<void> {
    await api.post('/api/v1/auth/refresh');
  }

  async logout(): Promise<void> {
    await api.post('/api/v1/auth/logout');
  }

  async getMe(): Promise<UserResponse> {
    const response = await api.get<UserResponse>('/api/v1/auth/me');
    return response.data;
  }
}

export default new AuthService();
