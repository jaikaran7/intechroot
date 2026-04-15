import api from './api.js';

export const jobsService = {
  getAll: (params) =>
    api.get('/jobs', { params }).then((r) => r.data),

  getById: (id) =>
    api.get(`/jobs/${id}`).then((r) => r.data.data),

  create: (data) =>
    api.post('/jobs', data).then((r) => r.data.data),

  update: (id, data) =>
    api.put(`/jobs/${id}`, data).then((r) => r.data.data),

  updateStatus: (id, status) =>
    api.patch(`/jobs/${id}/status`, { status }).then((r) => r.data.data),

  delete: (id) =>
    api.delete(`/jobs/${id}`).then((r) => r.data),
};
