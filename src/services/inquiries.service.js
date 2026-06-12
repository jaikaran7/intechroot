import api from './api.js';
import axios from 'axios';

// Base URL without auth interceptor for the public submission
const apiOrigin = String(import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');
const explicitBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
const BASE_URL = explicitBaseUrl || (apiOrigin ? `${apiOrigin}/api/v1` : '/api/v1');

export const inquiriesService = {
  /** Public — no auth required */
  submit: (payload) =>
    axios.post(`${BASE_URL}/inquiries`, payload, {
      headers: { 'Content-Type': 'application/json' },
    }).then((r) => r.data),

  /** super_admin only */
  list: (params) =>
    api.get('/inquiries', { params }).then((r) => r.data),

  counts: () =>
    api.get('/inquiries/counts').then((r) => r.data.data),

  updateStatus: (id, status) =>
    api.patch(`/inquiries/${id}/status`, { status }).then((r) => r.data),
};
