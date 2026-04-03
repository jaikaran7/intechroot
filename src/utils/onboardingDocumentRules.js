/** @param {string} [isoDate] YYYY-MM-DD */
export function getExpiryBucket(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return null;
  const day = isoDate.slice(0, 10);
  const d = new Date(`${day}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  if (d < end) return "expired";
  const days = (d - end) / 86400000;
  if (days <= 90) return "expiring_soon";
  return null;
}

export function hasUploadedFile(stored) {
  if (!stored) return false;
  if (stored.fileUrl != null && String(stored.fileUrl).trim() !== "") return true;
  return Boolean(stored?.fileData && String(stored.fileData).trim().length > 0);
}

const VERIFICATION_ENUM = ["unapproved", "waiting", "verified", "rejected"];

function resolveDocVerificationWhenUploaded(stored) {
  if (VERIFICATION_ENUM.includes(stored.verification)) return stored.verification;
  const vs = stored.verificationStatus;
  if (vs === "Verified") return "verified";
  if (vs === "Rejected") return "rejected";
  if (vs === "Waiting for Verification") return "waiting";
  if (vs === "Unapproved") return "unapproved";
  return "unapproved";
}

/**
 * Canonical verification for UI + admin (legacy verificationStatus mapped).
 * Never verified/waiting/rejected without an actual upload (fileUrl or fileData).
 */
export function resolveDocVerification(stored) {
  if (!stored || !hasUploadedFile(stored)) return "unapproved";
  return resolveDocVerificationWhenUploaded(stored);
}

/**
 * Status column: not_uploaded | uploaded | expiring_soon | expired.
 * Does not use template row demo status — missing file is always not uploaded.
 * Verified rows show UPLOADED in status (avoids EXPIRED contradicting verified lock).
 */
export function getRowUploadStatusKey(stored, row, expiryValue) {
  if (!stored || !hasUploadedFile(stored)) {
    return row.required ? "not_uploaded" : "not_uploaded_neutral";
  }
  const v = resolveDocVerification(stored);
  if (v === "verified") return "uploaded";
  const bucket = getExpiryBucket((expiryValue || "").slice(0, 10));
  if (bucket === "expired") return "expired";
  if (bucket === "expiring_soon") return "expiring_soon";
  return "uploaded";
}

/** @deprecated use getRowUploadStatusKey */
export function getDisplayUploadStatus(stored, row, expiryValue) {
  return getRowUploadStatusKey(stored, row, expiryValue);
}
