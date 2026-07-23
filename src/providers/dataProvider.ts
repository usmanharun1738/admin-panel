// -----------------------------------------------------------------------------
// Data Provider – Handles all CRUD operations with the Go backend.
// Implements the Refine DataProvider interface using axios.
// -----------------------------------------------------------------------------

import { DataProvider } from '@refinedev/core';
import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create an axios instance with base URL and default headers
const httpClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage to every request
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('refine-auth');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dataProvider = (): DataProvider => ({
  // ---------------------------------------------------------------------------
  // getList – Fetches a list of resources (e.g., /products, /orders)
  // ---------------------------------------------------------------------------
  getList: async ({ resource, pagination, filters, sorters }) => {
    const url = `/${resource}`;
    const response = await httpClient.get(url);
    return {
      data: response.data,
      total: response.data.length,
    };
  },

  // ---------------------------------------------------------------------------
  // getOne – Fetches a single resource by ID
  // ---------------------------------------------------------------------------
  getOne: async ({ resource, id }) => {
    const response = await httpClient.get(`/${resource}/${id}`);
    return { data: response.data };
  },

  // ---------------------------------------------------------------------------
  // create – Creates a new resource (POST)
  // ---------------------------------------------------------------------------
  create: async ({ resource, variables }) => {
    const response = await httpClient.post(`/${resource}`, variables);
    return { data: response.data };
  },

  // ---------------------------------------------------------------------------
  // update – Updates an existing resource.
  // Special handling: if updating orders and a 'status' field is present,
  // redirect to the admin endpoint `/admin/orders/:id/status`.
  // Otherwise, uses a generic PATCH.
  // ---------------------------------------------------------------------------
  update: async ({ resource, id, variables }) => {
    let url = `/${resource}/${id}`;
    let method: 'patch' | 'put' = 'patch';

    // Special case: order status update via admin endpoint
    if (resource === 'orders' && variables.status) {
      url = `/admin/orders/${id}/status`;
      method = 'patch';
    }

    const response = await httpClient[method](url, variables);
    return { data: response.data };
  },

  // ---------------------------------------------------------------------------
  // deleteOne – Deletes a resource by ID (DELETE)
  // ---------------------------------------------------------------------------
  deleteOne: async ({ resource, id }) => {
    const response = await httpClient.delete(`/${resource}/${id}`);
    return { data: response.data };
  },

  // ---------------------------------------------------------------------------
  // getApiUrl – Returns the base API URL (required by Refine)
  // ---------------------------------------------------------------------------
  getApiUrl: () => API_URL,

  // ---------------------------------------------------------------------------
  // custom – For arbitrary requests, e.g., custom endpoints.
  // ---------------------------------------------------------------------------
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