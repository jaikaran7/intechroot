import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * API base URL resolution
 *
 * - Production: prefer absolute origin from `VITE_API_URL` (e.g. https://<service>.up.railway.app)
 * - Dev: REQUIRE `VITE_API_URL` so we never "accidentally" talk to localhost and use local secrets.
 *
 * You can still override the full base path with `VITE_API_BASE_URL` (absolute).
 */
const apiOrigin = String(import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');
const explicitBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');

if (import.meta.env.DEV && !apiOrigin && !explicitBaseUrl) {
  // Fail loudly during development rather than silently hitting localhost.
  // (This prevents local `.env` secrets like RESEND_API_KEY from being used.)
  throw new Error(
    'API misconfigured: set VITE_API_URL to your Railway backend origin (e.g. https://<name>.up.railway.app).'
  );
}

const BASE_URL = explicitBaseUrl || (apiOrigin ? `${apiOrigin}/api/v1` : '/api/v1');

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
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/applicant/login') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password');

    // Don't attempt refresh-token on login/forgot/reset failures.
    // Those flows must surface the actual 401 message to the UI.
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
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
