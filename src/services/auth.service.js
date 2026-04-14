import api from './api.js';

export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then((r) => r.data.data),

  logout: () =>
    api.post('/auth/logout').then((r) => r.data),

  refreshToken: () =>
    api.post('/auth/refresh-token').then((r) => r.data.data),

  applicantVerify: (email) =>
    api.post('/auth/applicant/verify', { email }).then((r) => r.data.data),

  employeeLogin: (email, password) =>
    api.post('/auth/employee/login', { email, password }).then((r) => r.data.data),
};
