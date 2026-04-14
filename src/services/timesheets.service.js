import api from './api.js';

export const timesheetsService = {
  getAll: (params) =>
    api.get('/timesheets', { params }).then((r) => r.data),

  getByEmployee: (employeeId, params) =>
    api.get(`/employees/${employeeId}/timesheets`, { params }).then((r) => r.data),

  submit: (employeeId, data) =>
    api.post(`/employees/${employeeId}/timesheets`, data).then((r) => r.data.data),

  approve: (id) =>
    api.patch(`/timesheets/${id}/approve`).then((r) => r.data.data),

  reject: (id, rejectionNote) =>
    api.patch(`/timesheets/${id}/reject`, { rejectionNote }).then((r) => r.data.data),
};
