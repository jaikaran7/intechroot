import { REQUIRED_DOCUMENT_ROWS } from "@/constants/requiredDocumentTemplates";
import {
  getExpiryBucket,
  getRowUploadStatusKey,
  hasUploadedFile,
  resolveDocVerification,
} from "@/utils/onboardingDocumentRules";

export function getAllDocumentTemplateRows(application) {
  const extra = (application?.adminRequestedDocuments || []).map((r) => ({
    key: `adminreq_${r.id}`,
    label: r.name,
    required: true,
    status: "not_uploaded",
    expiry: "",
    action: "upload",
    icon: "assignment_add",
  }));
  return [...REQUIRED_DOCUMENT_ROWS, ...extra];
}

export function formatDocumentSubtitle(stored, row) {
  const admin = String(row.key || "").startsWith("adminreq_");
  if (!hasUploadedFile(stored)) {
    if (admin) return "Admin requested";
    return row.required ? "Required" : "Optional";
  }
  const fn = stored.fileName || "Document";
  const parts = fn.split(".");
  const ext = parts.length > 1 ? parts.pop().toUpperCase() : "FILE";
  const base = `${ext} • ${fn}`;
  return admin ? `${base} • Admin requested` : base;
}

export function formatExpiryForDisplay(iso, verification) {
  const day = (iso || "").slice(0, 10);
  if (!day) {
    if (verification === "verified") return "N/A";
    return "—";
  }
  const d = new Date(`${day}T12:00:00`);
  if (Number.isNaN(d.getTime())) return day;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function getApplicantDocumentRowState(application, row, expiryDraft = {}) {
  const stored = application?.onboardingDocuments?.find((d) => d.templateKey === row.key);
  const expiryValue = (stored?.expiryDate || expiryDraft[row.key] || row.expiry || "").slice(0, 10);
  const displayStatus = getRowUploadStatusKey(stored, row, expiryValue);
  const verification = resolveDocVerification(stored);
  const subtitle = formatDocumentSubtitle(stored, row);
  return { stored, expiryValue, displayStatus, verification, subtitle };
}

export function getApplicantDocumentActionLabel(row, stored, expiryValue) {
  const v = resolveDocVerification(stored);
  const file = hasUploadedFile(stored);
  const exp = getExpiryBucket((expiryValue || "").slice(0, 10));
  if (!file) return "Upload";
  if (v === "verified") return "View / Download";
  if (exp === "expired" || exp === "expiring_soon") return "Replace";
  if (v === "rejected") return "Re-upload";
  if (v === "waiting") return "Replace";
  if (v === "unapproved") return "Submit for Verification";
  return "—";
}

/** Plain object for onboarding iframe postMessage (JSON-serializable). */
export function buildDocumentsTableSyncPayload(application, expiryDraft = {}) {
  const rows = getAllDocumentTemplateRows(application);
  return {
    rows: rows.map((row) => {
      const state = getApplicantDocumentRowState(application, row, expiryDraft);
      return {
        key: row.key,
        icon: row.icon || "description",
        title: row.label,
        required: Boolean(row.required),
        subtitle: state.subtitle,
        uploadStatus: state.displayStatus,
        verification: state.verification,
        expiryDisplay: formatExpiryForDisplay(state.expiryValue, state.verification),
        actionLabel: getApplicantDocumentActionLabel(row, state.stored, state.expiryValue),
      };
    }),
  };
}

export function documentIconWrapClass(row, displayStatus) {
  if (String(row.key || "").startsWith("adminreq_")) {
    return "w-10 h-10 shrink-0 rounded bg-amber-50 flex items-center justify-center text-amber-800";
  }
  if (displayStatus === "expired") {
    return "w-10 h-10 shrink-0 rounded bg-rose-50 flex items-center justify-center text-rose-600";
  }
  if (displayStatus === "expiring_soon") {
    return "w-10 h-10 shrink-0 rounded bg-amber-50 flex items-center justify-center text-amber-700";
  }
  return "w-10 h-10 shrink-0 rounded bg-blue-50 flex items-center justify-center text-blue-600";
}
