import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerFilters {
  search?: string;
  status?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
};

export const customersApi = {
  getAll: (filters?: CustomerFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tags) filters.tags.forEach(tag => params.append('tags', tag));
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    return api.get(`/customers?${params.toString()}`);
  },
  getOne: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
  restore: (id: string) => api.post(`/customers/${id}/restore`),
  addContact: (customerId: string, data: any) => 
    api.post(`/customers/${customerId}/contacts`, data),
  removeContact: (contactId: string) => 
    api.delete(`/customers/contacts/${contactId}`),
};

export const projectsApi = {
  getAll: () => api.get('/projects'),
  getOne: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

export const documentsApi = {
  getAll: (projectId?: string) => api.get('/documents', { params: { projectId } }),
  getOne: (id: string) => api.get(`/documents/${id}`),
  upload: (file: File, data: any, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    if (data.projectId) formData.append('projectId', data.projectId);
    if (data.category) formData.append('category', data.category);
    if (data.description) formData.append('description', data.description);
    return api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },
  download: (id: string) => api.get(`/documents/${id}/download`, { responseType: 'blob' }),
  update: (id: string, data: any) => api.put(`/documents/${id}`, data),
  delete: (id: string) => api.delete(`/documents/${id}`),
};

export const tasksApi = {
  getAll: (projectId?: string) => api.get('/tasks', { params: { projectId } }),
  getOne: (id: string) => api.get(`/tasks/${id}`),
  create: (data: any) => api.post('/tasks', data),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

export const emailsApi = {
  getAll: (params?: { projectId?: string; unreadOnly?: boolean }) => api.get('/emails', { params }),
  getOne: (id: string) => api.get(`/emails/${id}`),
  markAsRead: (id: string) => api.put(`/emails/${id}/read`),
  assignToProject: (id: string, projectId: string) => api.post(`/emails/${id}/assign`, { projectId }),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  getOne: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  changePassword: (data: any) => api.put('/users/profile/password', data),
};
