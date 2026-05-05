import api from './api.js';

export const employeesService = {
  getAll: (params) =>
    api.get('/employees', { params }).then((r) => r.data),

  getById: (id) =>
    api.get(`/employees/${id}`).then((r) => r.data.data),

  update: (id, data) =>
    api.put(`/employees/${id}`, data).then((r) => r.data.data),

  updateStatus: (id, status) =>
    api.patch(`/employees/${id}/status`, { status }).then((r) => r.data.data),

  sendDashboardMessage: (id, message) =>
    api.post(`/employees/${id}/dashboard-message`, { message }).then((r) => r.data.data),

  addExtraDocumentRequest: (id, name) =>
    api.post(`/employees/${id}/extra-document-requests`, { name }).then((r) => r.data.data),
};
