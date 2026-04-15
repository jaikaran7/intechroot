import api from './api.js';

export const documentsService = {
  upload: (formData) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data),

  // Replace existing doc of same templateKey (resets verification to pending)
  upsert: (formData) =>
    api.post('/documents/upsert', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data),

  // Fetch all documents for an owner (employee or applicant)
  getByOwner: (ownerId, ownerType) =>
    api.get('/documents', { params: { ownerId, ownerType } }).then((r) => r.data.data),

  getDownloadUrl: (id) =>
    api.get(`/documents/${id}/download`).then((r) => r.data.data),

  verify: (id, verification) =>
    api.patch(`/documents/${id}/verify`, { verification }).then((r) => r.data.data),

  delete: (id) =>
    api.delete(`/documents/${id}`).then((r) => r.data),
};
