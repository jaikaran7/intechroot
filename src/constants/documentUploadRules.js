/**
 * Mirrors backend EXPIRY_OPTIONAL_TEMPLATE_KEYS in documents.controller.js.
 * Rows without expiry do not collect an ID/card expiry date in onboarding.
 */
export const DOCUMENT_UPLOAD_NO_EXPIRY_KEYS = new Set(["incorp", "deposit"]);

export function documentRowRequiresExpiryDate(templateKey) {
  const k = String(templateKey || "").trim();
  return !DOCUMENT_UPLOAD_NO_EXPIRY_KEYS.has(k);
}
