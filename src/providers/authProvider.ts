// -----------------------------------------------------------------------------
// Auth Provider – Handles login, logout, authentication checks, and permissions.
// Uses the Go backend's /login endpoint and stores JWT in localStorage.
// -----------------------------------------------------------------------------

import { AuthProvider, HttpError } from '@refinedev/core';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const authProvider: AuthProvider = {
  // ---------------------------------------------------------------------------
  // login – Authenticates user with email and password.
  // Stores the token in localStorage under the key 'refine-auth'.
  // ---------------------------------------------------------------------------
  login: async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token } = response.data;

      localStorage.setItem('refine-auth', token);
      return {
        success: true,
        redirectTo: '/',
      };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || 'Invalid email or password';
      return {
        success: false,
        error: new HttpError(errorMessage, error?.response?.status || 401),
      };
    }
  },

  // ---------------------------------------------------------------------------
  // logout – Removes token and redirects to login.
  // ---------------------------------------------------------------------------
  logout: async () => {
    localStorage.removeItem('refine-auth');
    return {
      success: true,
      redirectTo: '/login',
    };
  },

  // ---------------------------------------------------------------------------
  // check – Verifies if the user is authenticated (token exists).
  // Optionally, you could validate the token by calling /me.
  // ---------------------------------------------------------------------------
  check: async () => {
    const token = localStorage.getItem('refine-auth');
    if (token) {
      // Optional: validate token by calling /me endpoint.
      // For now, we simply trust the token's existence.
      return {
        authenticated: true,
      };
    }
    return {
      authenticated: false,
      redirectTo: '/login',
    };
  },

  // ---------------------------------------------------------------------------
  // getPermissions – Returns user permissions (roles).
  // For admin, we decode the JWT or assume the token is from an admin.
  // You can implement a /me endpoint to return the user's role.
  // For simplicity, we return ['admin'] if token exists.
  // ---------------------------------------------------------------------------
  getPermissions: async () => {
    const token = localStorage.getItem('refine-auth');
    if (token) {
      // In a real app, decode the JWT or fetch user profile to get role.
      // For now, assume any logged-in user is admin.
      return ['admin'];
    }
    return [];
  },

  // ---------------------------------------------------------------------------
  // onError – Handles API errors (e.g., 401 Unauthorised).
  // If a 401 occurs, we log out automatically.
  // ---------------------------------------------------------------------------
  onError: async (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('refine-auth');
      return {
        logout: true,
        redirectTo: '/login',
        error: new HttpError('Your session has expired. Please login again.', 401),
      };
    }
    return {};
  },

  // ---------------------------------------------------------------------------
  // register – Optional; not used in this setup.
  // ---------------------------------------------------------------------------
  register: async () => ({ success: false, error: new HttpError('Registration not supported', 400) }),

  // ---------------------------------------------------------------------------
  // forgotPassword – Optional; not used.
  // ---------------------------------------------------------------------------
  forgotPassword: async () => ({ success: false, error: new HttpError('Not implemented', 400) }),

  // ---------------------------------------------------------------------------
  // updatePassword – Optional; not used.
  // ---------------------------------------------------------------------------
  updatePassword: async () => ({ success: false, error: new HttpError('Not implemented', 400) }),
};