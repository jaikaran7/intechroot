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
        password != null && String(password).trim() !== ''
          ? { email, password: String(password).trim() }
          : { email }
      )
      .then((r) => r.data.data),
};
