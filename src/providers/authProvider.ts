import { AuthProvider } from '@refinedev/core';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_URL}/v1/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem('refine-auth', token);
      return { success: true, redirectTo: '/' };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || 'Invalid email or password';
      return {
        success: false,
        error: {
          message: errorMessage,
          statusCode: error?.response?.status || 401,
          name: 'AuthError',
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem('refine-auth');
    return { success: true, redirectTo: '/login' };
  },

  check: async () => {
    const token = localStorage.getItem('refine-auth');
    if (token) {
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: '/login' };
  },

  getPermissions: async () => {
    const token = localStorage.getItem('refine-auth');
    if (token) {
      return ['admin'];
    }
    return [];
  },

  onError: async (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('refine-auth');
      return {
        logout: true,
        redirectTo: '/login',
        error: {
          message: 'Your session has expired. Please login again.',
          statusCode: 401,
          name: 'SessionExpired',
        },
      };
    }
    return {};
  },

  register: async () => ({
    success: false,
    error: { message: 'Registration not supported', statusCode: 400, name: 'NotSupported' },
  }),

  forgotPassword: async () => ({
    success: false,
    error: { message: 'Not implemented', statusCode: 400, name: 'NotImplemented' },
  }),

  updatePassword: async () => ({
    success: false,
    error: { message: 'Not implemented', statusCode: 400, name: 'NotImplemented' },
  }),
};