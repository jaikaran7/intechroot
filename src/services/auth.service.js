import api from './api.js';

export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then((r) => r.data.data),

  logout: () =>
    api.post('/auth/logout').then((r) => r.data),

  refreshToken: () =>
    api.post('/auth/refresh-token').then((r) => r.data.data),

  applicantLogin: (email, password) =>
    api
      .post(
        '/auth/applicant/login',
        { email, password: String(password || '').trim() }
      )
      .then((r) => r.data.data),

  forgotPassword: ({ email, role }) =>
    api.post('/auth/forgot-password', { email, role }).then((r) => r.data.data),

  resetPassword: ({ token, password, role }) =>
    api.post('/auth/reset-password', { token, password, role }).then((r) => r.data.data),
};
