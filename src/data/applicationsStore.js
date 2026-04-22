/**
 * Compatibility stub — retained for ApplicantOnboardingPage.jsx (Rule 4: do not touch onboarding files).
 * All other pages now use React Query + the real API.
 */

// No-op stubs for onboarding actions (onboarding flow is handled by the iframe)
export const applicantAcknowledgeBgvStep = () => {};
export const applicantMarkOnboardingProfileComplete = () => {};
export const applicantSetOnboardingStep = () => {};
export const applicantSubmitOnboardingFinal = () => {};
export const getMaxAllowedApplicantOnboardingStep = () => 1;
export const useApplicationsSync = () => ({ applications: [] });

// Admin onboarding helpers (stubbed — used by AdminDocumentApproval via applicationsStore)
export const adminSetBgvInstructions = () => {};
export const adminAddDocumentRequest = () => {};
export const adminAddBgvRequest = () => {};
export const setOnboardingVerification = () => {};
export const submitOnboardingDocumentForVerification = () => {};
export const upsertOnboardingDocument = () => {};
export const getApplicationsSnapshot = () => [];
export const getPostLoginPathForApplicant = () => ({ path: '/applicant/dashboard' });
