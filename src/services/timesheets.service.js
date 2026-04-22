import api from './api.js';

/** Avoid stale list data after creates/updates (browser may otherwise serve 304 from cache). */
const noCacheHeaders = { 'Cache-Control': 'no-cache', Pragma: 'no-cache' };

export const timesheetsService = {
  getAll: (params) =>
    api.get('/timesheets', { params, headers: noCacheHeaders }).then((r) => r.data),

  getByEmployee: (employeeId, params) =>
    api
      .get(`/employees/${employeeId}/timesheets`, { params, headers: noCacheHeaders })
      .then((r) => r.data),

  saveDraft: (employeeId, data) =>
    api.post(`/employees/${employeeId}/timesheets`, data).then((r) => r.data.data),

  submitForApproval: (employeeId, timesheetId) =>
    api
      .patch(`/employees/${employeeId}/timesheets/${timesheetId}/submit-for-approval`, {}, { headers: noCacheHeaders })
      .then((r) => r.data.data),

  approve: (id) =>
    api.patch(`/timesheets/${id}/approve`).then((r) => r.data.data),

  reject: (id, rejectionNote) =>
    api.patch(`/timesheets/${id}/reject`, { rejectionNote }).then((r) => r.data.data),
};
