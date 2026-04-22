import api from './api.js';

export const applicationsService = {
  getAll: (params) =>
    api.get('/applications', { params }).then((r) => {
      const body = r.data;
      const meta = body.meta ?? body.pagination;
      return {
        success: body.success,
        data: Array.isArray(body.data) ? body.data : [],
        pagination: meta
          ? {
              total: meta.total,
              page: meta.page,
              limit: meta.limit,
              totalPages: meta.totalPages,
            }
          : body.pagination,
      };
    }),

  getStats: (params) =>
    api.get('/applications/stats', { params }).then((r) => r.data.data),

  getById: (id) =>
    api.get(`/applications/${id}`).then((r) => r.data.data),

  getByEmail: (email) =>
    api.get(`/applications/by-email/${encodeURIComponent(email)}`).then((r) => r.data.data),

  create: (data) =>
    api
      .post('/applications', data, {
        transformRequest: [
          (body, headers) => {
            if (typeof FormData !== 'undefined' && body instanceof FormData && headers) {
              delete headers['Content-Type'];
            }
            return body;
          },
        ],
      })
      .then((r) => r.data.data),

  advanceStage: (id, note) =>
    api.patch(`/applications/${id}/stage`, { note }).then((r) => r.data.data),

  hire: (id) =>
    api.patch(`/applications/${id}/hire`).then((r) => r.data.data),

  approvePortal: (id) =>
    api.patch(`/applications/${id}/portal-approve`).then((r) => r.data.data),

  rejectApplication: (id) =>
    api.patch(`/applications/${id}/portal-reject`).then((r) => r.data.data),

  createInterview: (id, data) =>
    api.post(`/applications/${id}/interviews`, data).then((r) => r.data.data),

  updateInterview: (id, iid, data) =>
    api.patch(`/applications/${id}/interviews/${iid}`, data).then((r) => r.data.data),

  createMessage: (id, text) =>
    api.post(`/applications/${id}/messages`, { text }).then((r) => r.data.data),
};
