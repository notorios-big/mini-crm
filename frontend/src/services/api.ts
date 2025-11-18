import axios from 'axios';
import type {
  User,
  Lead,
  Tag,
  EmailSequence,
  EmailLog,
  Config,
  DashboardStats,
  LeadFormData,
  Note,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/profile');
    return data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.post('/auth/change-password', { currentPassword, newPassword });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Leads API
export const leadsAPI = {
  create: async (leadData: LeadFormData) => {
    const { data } = await api.post('/leads', leadData);
    return data;
  },

  updateStep: async (id: number, step: number, watchedVideo?: boolean) => {
    const { data } = await api.put(`/leads/${id}/step`, { step, watchedVideo });
    return data;
  },

  getAll: async (params?: {
    status?: string;
    search?: string;
    tag?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ leads: Lead[]; total: number }> => {
    const { data } = await api.get('/leads', { params });
    return data;
  },

  getOne: async (id: number): Promise<Lead> => {
    const { data } = await api.get(`/leads/${id}`);
    return data;
  },

  updateStatus: async (id: number, status: string) => {
    const { data } = await api.put(`/leads/${id}/status`, { status });
    return data;
  },

  addTag: async (id: number, tagId: number) => {
    const { data } = await api.post(`/leads/${id}/tags`, { tagId });
    return data;
  },

  removeTag: async (id: number, tagId: number) => {
    const { data } = await api.delete(`/leads/${id}/tags/${tagId}`);
    return data;
  },

  addNote: async (id: number, content: string) => {
    const { data } = await api.post(`/leads/${id}/notes`, { content });
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/leads/${id}`);
    return data;
  },

  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/leads/stats');
    return data;
  },
};

// Tags API
export const tagsAPI = {
  getAll: async (): Promise<Tag[]> => {
    const { data } = await api.get('/tags');
    return data;
  },

  create: async (name: string, color: string): Promise<Tag> => {
    const { data } = await api.post('/tags', { name, color });
    return data;
  },

  update: async (id: number, name: string, color: string) => {
    const { data } = await api.put(`/tags/${id}`, { name, color });
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/tags/${id}`);
    return data;
  },
};

// Email API
export const emailAPI = {
  getSequences: async (): Promise<EmailSequence[]> => {
    const { data } = await api.get('/email/sequences');
    return data;
  },

  getSequence: async (id: number): Promise<EmailSequence> => {
    const { data } = await api.get(`/email/sequences/${id}`);
    return data;
  },

  createSequence: async (sequence: Partial<EmailSequence>): Promise<EmailSequence> => {
    const { data } = await api.post('/email/sequences', sequence);
    return data;
  },

  updateSequence: async (id: number, sequence: Partial<EmailSequence>) => {
    const { data } = await api.put(`/email/sequences/${id}`, sequence);
    return data;
  },

  deleteSequence: async (id: number) => {
    const { data } = await api.delete(`/email/sequences/${id}`);
    return data;
  },

  getLogs: async (params?: { status?: string; limit?: number; offset?: number }): Promise<EmailLog[]> => {
    const { data } = await api.get('/email/logs', { params });
    return data;
  },

  getLeadLogs: async (leadId: number): Promise<EmailLog[]> => {
    const { data } = await api.get(`/email/logs/lead/${leadId}`);
    return data;
  },
};

// Config API
export const configAPI = {
  getAll: async (): Promise<Config> => {
    const { data } = await api.get('/config');
    return data;
  },

  getValue: async (key: string): Promise<string> => {
    const { data } = await api.get(`/config/${key}`);
    return data.value;
  },

  update: async (key: string, value: string) => {
    const { data } = await api.post('/config', { key, value });
    return data;
  },

  bulkUpdate: async (configs: { key: string; value: string }[]) => {
    const { data } = await api.post('/config/bulk', configs);
    return data;
  },

  uploadCover: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post('/config/upload-cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

export default api;
