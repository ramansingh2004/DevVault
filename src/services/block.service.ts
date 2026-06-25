import api from '@/lib/axios';
import { BlockResponse, CreateBulkBlock, PatchBlocks } from '@/types/api.types';

class BlockService {
  async getByContainer(containerId: string): Promise<BlockResponse[]> {
    const response = await api.get<BlockResponse[]>(`/api/v1/blocks/${containerId}`);
    return response.data;
  }

  async create(data: CreateBulkBlock): Promise<BlockResponse[]> {
    const response = await api.post<BlockResponse[]>('/api/v1/blocks/', data);
    return response.data;
  }

  async update(data: PatchBlocks): Promise<BlockResponse[]> {
    const response = await api.patch<BlockResponse[]>('/api/v1/blocks/', data);
    return response.data;
  }

  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ url: string }>('/api/v1/blocks/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

const blockService = new BlockService();

export default blockService;