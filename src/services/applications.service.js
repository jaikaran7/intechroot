import api from './api.js';

export const applicationsService = {
  getAll: (params) =>
    api.get('/applications', { params }).then((r) => r.data),

  getById: (id) =>
    api.get(`/applications/${id}`).then((r) => r.data.data),

  getByEmail: (email) =>
    api.get(`/applications/by-email/${encodeURIComponent(email)}`).then((r) => r.data.data),

  create: (data) =>
    api.post('/applications', data).then((r) => r.data.data),

  advanceStage: (id, note) =>
    api.patch(`/applications/${id}/stage`, { note }).then((r) => r.data.data),

  hire: (id) =>
    api.patch(`/applications/${id}/hire`).then((r) => r.data.data),

  createInterview: (id, data) =>
    api.post(`/applications/${id}/interviews`, data).then((r) => r.data.data),

  updateInterview: (id, iid, data) =>
    api.patch(`/applications/${id}/interviews/${iid}`, data).then((r) => r.data.data),

  createMessage: (id, text) =>
    api.post(`/applications/${id}/messages`, { text }).then((r) => r.data.data),
};
