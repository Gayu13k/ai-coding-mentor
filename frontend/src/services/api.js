import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

let currentToken = null;
let logoutCallback = null;

export const setApiToken = (token) => {
  currentToken = token;
};

export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

// Request interceptor: attach JWT token
api.interceptors.request.use((config) => {
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

// Response interceptor: handle 401/403 by clearing stale auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token is invalid/expired — clear it so user can re-login
      const requestUrl = error.config?.url || '';
      // Don't auto-logout on auth endpoints (login/register failures are expected)
      if (!requestUrl.includes('/auth/')) {
        if (logoutCallback) {
          logoutCallback();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
