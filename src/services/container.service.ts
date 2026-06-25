import api from '@/lib/axios';
import { ContainerCreate, ContainerResponse, ContainerTreeResponse, ContainerUpdate } from '@/types/api.types';

class ContainerService {
  async getAll(): Promise<ContainerResponse[]> {
    const response = await api.get<ContainerResponse[]>('/api/v1/containers/');
    return response.data;
  }

  async getOne(containerId: string): Promise<ContainerTreeResponse> {
    const response = await api.get<ContainerTreeResponse>(`/api/v1/containers/${containerId}`);
    return response.data;
  }

  async create(data: ContainerCreate): Promise<ContainerResponse> {
    const response = await api.post<ContainerResponse>('/api/v1/containers/', data);
    return response.data;
  }

  async update(containerId: string, data: ContainerUpdate): Promise<ContainerResponse> {
    const response = await api.patch<ContainerResponse>(`/api/v1/containers/${containerId}`, data);
    return response.data;
  }

  async delete(containerId: string): Promise<void> {
    await api.delete(`/api/v1/containers/${containerId}`);
  }
}

const containerService = new ContainerService();

export default containerService;