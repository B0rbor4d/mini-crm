import { api } from './client';
import type { Customer, Document, Task, Email, PaginatedResponse } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { email: string; password: string; firstName?: string; lastName?: string }) =>
    api.post('/auth/register', data),
};

export const customersApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResponse<Customer>>('/customers', { params }),
  getById: (id: string) => api.get<Customer>(`/customers/${id}`),
  create: (data: Partial<Customer>) => api.post<Customer>('/customers', data),
  update: (id: string, data: Partial<Customer>) =>
    api.patch<Customer>(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: { email: string; password: string; firstName?: string; lastName?: string; role?: string }) =>
    api.post('/users', data),
  update: (id: string, data: Partial<{ email: string; firstName: string; lastName: string; role: string; isActive: boolean }>) =>
    api.patch(`/users/${id}`, data),
  updatePassword: (id: string, newPassword: string) =>
    api.patch(`/users/${id}/password`, { newPassword }),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export const documentsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Document>>('/documents', { params }),
  upload: (file: File, projectId?: string, customerId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) formData.append('projectId', projectId);
    if (customerId) formData.append('customerId', customerId);
    return api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadMultiple: (files: File[], projectId?: string, customerId?: string, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (projectId) formData.append('projectId', projectId);
    if (customerId) formData.append('customerId', customerId);
    return api.post('/documents/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },
  downloadZip: (documentIds: string[]) => {
    return api.post('/documents/download-zip', { documentIds }, {
      responseType: 'blob',
    });
  },
  getVersions: (id: string) => api.get(`/documents/${id}/versions`),
  createVersion: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/documents/${id}/versions`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: string) => api.delete(`/documents/${id}`),
};

export const tasksApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string; projectId?: string }) =>
    api.get<PaginatedResponse<Task>>('/tasks', { params }),
  getKanban: (projectId?: string) =>
    api.get<Record<string, Task[]>>('/tasks/kanban', { params: { projectId } }),
  create: (data: Partial<Task>) => api.post<Task>('/tasks', data),
  update: (id: string, data: Partial<Task>) =>
    api.patch<Task>(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

export const emailsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; customerId?: string; projectId?: string; isRead?: boolean }) =>
    api.get<PaginatedResponse<Email>>('/emails', { params }),
  getById: (id: string) => api.get<Email>(`/emails/${id}`),
  getStats: () => api.get<{ total: number; unread: number; synced: number; unassigned: number }>('/emails/stats'),
  sync: (folder?: string, limit?: number) =>
    api.post('/emails/sync', { folder, limit }),
  testConnection: () => api.post('/emails/test-connection'),
  update: (id: string, data: Partial<{ customerId?: string; projectId?: string; isRead?: boolean }>) =>
    api.patch<Email>(`/emails/${id}`, data),
  delete: (id: string) => api.delete(`/emails/${id}`),
  getImapConfig: () => api.get<{ host: string; port: number; tls: boolean; user: string; hasPassword: boolean }>('/emails/config/imap'),
  updateImapConfig: (config: { host: string; port: number; tls: boolean; user: string; password: string }) =>
    api.post('/emails/config/imap', config),
};
