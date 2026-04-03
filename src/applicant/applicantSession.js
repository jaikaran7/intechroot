const KEY = "intechroot_applicant_id";

export function setApplicantSession(applicantId) {
  if (applicantId == null) {
    localStorage.removeItem(KEY);
    return;
  }
  localStorage.setItem(KEY, String(applicantId));
}

export function getApplicantSessionId() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isNaN(n) ? null : n;
}

export function clearApplicantSession() {
  localStorage.removeItem(KEY);
}
