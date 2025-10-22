import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Get auth token for API requests
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
};

// API client with authentication
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// Tasks API
export const tasksApi = {
  getAll: () => apiRequest('/api/tasks'),
  create: (task: any) => apiRequest('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  }),
  update: (id: string, task: any) => apiRequest(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  }),
  delete: (id: string) => apiRequest(`/api/tasks/${id}`, {
    method: 'DELETE',
  }),
};

// Tags API
export const tagsApi = {
  getAll: () => apiRequest('/api/tags'),
  create: (tag: any) => apiRequest('/api/tags', {
    method: 'POST',
    body: JSON.stringify(tag),
  }),
  update: (id: string, tag: any) => apiRequest(`/api/tags/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tag),
  }),
  delete: (id: string) => apiRequest(`/api/tags/${id}`, {
    method: 'DELETE',
  }),
};

// Health check
export const healthCheck = () => apiRequest('/health');
