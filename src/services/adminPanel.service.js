import api from './api.js';

export const adminPanelService = {
  getAdmins: (params) =>
    api.get('/admin-panel/admins', { params }).then((r) => r.data),

  getAdmin: (id) =>
    api.get(`/admin-panel/admins/${id}`).then((r) => r.data.data),

  createAdmin: (data) =>
    api.post('/admin-panel/admins', data).then((r) => r.data.data),

  updateAdmin: (id, data) =>
    api.put(`/admin-panel/admins/${id}`, data).then((r) => r.data.data),

  deleteAdmin: (id) =>
    api.delete(`/admin-panel/admins/${id}`).then((r) => r.data.data),

  getEmployees: (params) =>
    api.get('/admin-panel/employees', { params }).then((r) => r.data),

  getAssignments: (id) =>
    api.get(`/admin-panel/admins/${id}/assignments`).then((r) => r.data.data),

  setAssignments: (id, employeeIds) =>
    api.put(`/admin-panel/admins/${id}/assignments`, { employeeIds }).then((r) => r.data.data),

  getApplicantAssignments: (id) =>
    api.get(`/admin-panel/admins/${id}/applicant-assignments`).then((r) => r.data.data),

  setApplicantAssignments: (id, applicationIds) =>
    api.put(`/admin-panel/admins/${id}/applicant-assignments`, { applicationIds }).then((r) => r.data.data),

  removeApplicantAssignment: (id, applicationId) =>
    api.delete(`/admin-panel/admins/${id}/applicant-assignments/${applicationId}`).then((r) => r.data.data),

  getDashboard: () =>
    api.get('/admin-panel/dashboard').then((r) => r.data.data),
};
