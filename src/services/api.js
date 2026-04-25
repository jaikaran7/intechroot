import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const LOCAL_API_URL = 'http://localhost:5000';
const apiOrigin = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? LOCAL_API_URL : '');
const BASE_URL = import.meta.env.VITE_API_BASE_URL || (apiOrigin ? `${apiOrigin.replace(/\/$/, '')}/api/v1` : '/api/v1');

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send httpOnly refresh-token cookie
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const url = originalRequest.url || '';
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (url.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        const newToken = data.data.accessToken;
        localStorage.setItem('access_token', newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        // All roles share the unified login page
        const path = window.location.pathname;
        if (path.startsWith('/applicant')) window.location.href = '/applicant/login';
        else window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
