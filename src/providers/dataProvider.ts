// admin-panel/src/providers/dataProvider.ts
import { DataProvider } from '@refinedev/core';
import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const httpClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/v1`,
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('refine-auth');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin resources that should be prefixed with /admin
const ADMIN_RESOURCES = ['products', 'orders', 'users'];

export const dataProvider = (): DataProvider => ({
  getList: async ({ resource }) => {
    const url = ADMIN_RESOURCES.includes(resource)
      ? `/admin/${resource}`
      : `/${resource}`;
    const response = await httpClient.get(url);
    // Handle both paginated { data, pagination } and plain array responses
    const body = response.data;
    if (body && Array.isArray(body.data)) {
      return {
        data: body.data,
        total: body.pagination?.total_items || body.data.length,
      };
    }
    return {
      data: body,
      total: Array.isArray(body) ? body.length : 0,
    };
  },

  getOne: async ({ resource, id }) => {
    const url = ADMIN_RESOURCES.includes(resource)
      ? `/admin/${resource}/${id}`
      : `/${resource}/${id}`;
    const response = await httpClient.get(url);
    return { data: response.data };
  },

  create: async ({ resource, variables }) => {
    const response = await httpClient.post(`/${resource}`, variables);
    return { data: response.data };
  },

  update: async ({ resource, id, variables }) => {
    // Special handling for order status updates – uses admin PATCH endpoint
    if (resource === 'orders' && (variables as any)?.status) {
      const response = await httpClient.patch(`/admin/orders/${id}/status`, variables);
      return { data: response.data };
    }

    // For other admin resources, use admin prefix
    const url = ADMIN_RESOURCES.includes(resource)
      ? `/admin/${resource}/${id}`
      : `/${resource}/${id}`;
    const response = await httpClient.patch(url, variables);
    return { data: response.data };
  },

  deleteOne: async ({ resource, id }) => {
    const url = ADMIN_RESOURCES.includes(resource)
      ? `/admin/${resource}/${id}`
      : `/${resource}/${id}`;
    const response = await httpClient.delete(url);
    return { data: response.data };
  },

  getApiUrl: () => API_URL,

  custom: async ({ url, method, payload, headers }) => {
    const response = await httpClient.request({
      url,
      method,
      data: payload,
      headers,
    });
    return { data: response.data };
  },
});