import api from './api.js';

export const adminService = {
  getDashboardStats: () =>
    api.get('/admin/dashboard/stats').then((r) => r.data.data),

  getPipelineReport: (params) =>
    api.get('/admin/reports/pipeline', { params }).then((r) => r.data),

  getAuditLogs: (params) =>
    api.get('/admin/audit-logs', { params }).then((r) => r.data),
};
