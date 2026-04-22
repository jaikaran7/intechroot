/**
 * Best-effort resume URL for admin previews (signed URL, onboarding file, or legacy HTTP field).
 */
export function resolveApplicationResumeUrl(app) {
  if (!app) return "";
  const stored = app.onboardingDocuments?.find((d) => d.templateKey === "resume");
  if (stored?.fileData?.trim()) return stored.fileData.trim();
  if (stored?.fileUrl?.trim()) return stored.fileUrl.trim();
  const href = app.documents?.resume;
  if (href && href !== "#" && String(href).trim()) return String(href).trim();
  const legacy = app.resumeFileUrl;
  if (legacy && String(legacy).trim() && /^https?:\/\//i.test(String(legacy))) return String(legacy).trim();
  return "";
}
