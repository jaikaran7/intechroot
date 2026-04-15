import api from './api.js';

export const documentsService = {
  upload: (formData) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data),

  getDownloadUrl: (id) =>
    api.get(`/documents/${id}/download`).then((r) => r.data.data),

  verify: (id, verification) =>
    api.patch(`/documents/${id}/verify`, { verification }).then((r) => r.data.data),

  delete: (id) =>
    api.delete(`/documents/${id}`).then((r) => r.data),
};
