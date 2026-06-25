import axios, { AxiosInstance, AxiosError } from 'axios';

class APIClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    let isRefreshing = false;

    this.axiosInstance.interceptors.response.use(
      (response) => response,

      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (originalRequest.url?.includes('/auth/refresh')) {
          return Promise.reject(error);
        }

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isRefreshing
        ) {
          originalRequest._retry = true;
          isRefreshing = true;

          try {
            await this.axiosInstance.post('/api/v1/auth/refresh');
            isRefreshing = false;
            return this.axiosInstance(originalRequest);
          } catch {
            isRefreshing = false;
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  getInstance() {
    return this.axiosInstance;
  }
}

const apiClient = new APIClient();
export default apiClient.getInstance();
