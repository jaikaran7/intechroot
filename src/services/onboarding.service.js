import api from './api.js';

export const onboardingService = {
  getState: (applicationId) =>
    api.get(`/onboarding/${applicationId}`).then((r) => r.data.data),

  submitProfile: (applicationId, data) =>
    api.patch(`/onboarding/${applicationId}/profile`, data).then((r) => r.data.data),

  submitDocuments: (applicationId) =>
    api.patch(`/onboarding/${applicationId}/documents`).then((r) => r.data.data),

  acknowledgeBgv: (applicationId) =>
    api.patch(`/onboarding/${applicationId}/bgv-acknowledge`, { acknowledged: true }).then((r) => r.data.data),

  finalSubmit: (applicationId) =>
    api.patch(`/onboarding/${applicationId}/final-submit`).then((r) => r.data.data),

  // Admin
  enableOnboarding: (applicationId) =>
    api.post(`/onboarding/${applicationId}/admin/enable`).then((r) => r.data.data),

  adminRequestDocument: (applicationId, name) =>
    api.post(`/onboarding/${applicationId}/admin/documents/request`, { name }).then((r) => r.data.data),

  adminApproveDocuments: (applicationId) =>
    api.patch(`/onboarding/${applicationId}/admin/documents/approve`).then((r) => r.data.data),

  adminSetBgv: (applicationId, data) =>
    api.patch(`/onboarding/${applicationId}/admin/bgv/approve`, data).then((r) => r.data.data),
};
