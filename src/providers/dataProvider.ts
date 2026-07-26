import { DataProvider } from '@refinedev/core';
import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const httpClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('refine-auth');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dataProvider = (): DataProvider => ({
  getList: async ({ resource }) => {
    const response = await httpClient.get(`/${resource}`);
    return {
      data: response.data,
      total: response.data.length,
    };
  },

  getOne: async ({ resource, id }) => {
    const response = await httpClient.get(`/${resource}/${id}`);
    return { data: response.data };
  },

  create: async ({ resource, variables }) => {
    const response = await httpClient.post(`/${resource}`, variables);
    return { data: response.data };
  },

  update: async ({ resource, id, variables }) => {
    let url = `/${resource}/${id}`;
    let method: 'patch' | 'put' = 'patch';

    //safely check if we are updating order status
    if (resource === 'orders' && (variables as any)?.status) {
      url = `/admin/orders/${id}/status`;
      method = 'patch';
    }

    const response = await httpClient[method](url, variables);
    return { data: response.data };
  },

  deleteOne: async ({ resource, id }) => {
    const response = await httpClient.delete(`/${resource}/${id}`);
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