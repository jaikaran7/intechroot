import { getExpiryBucket, hasUploadedFile, resolveDocVerification } from "@/utils/onboardingDocumentRules";

const DUMMY_FILE_URL = "/sample.pdf";

function triggerDownload(url, name) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name || "sample.pdf";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Applicant document row actions: in-app View (outline) + primary upload/replace/download.
 * Preview must stay enabled when a file exists even if expiry is missing (expiry only gates new upload/replace).
 *
 * @param {boolean} interactionBusy — finalSubmitted, row spinners, clearing doc, etc.
 * @param {boolean} uploadBlockedByExpiry — missing/past expiry when upload/replace requires it
 */
export default function ApplicantDocumentActionButtons({
  row,
  stored,
  expiryValue,
  onOpenPreview,
  onUploadClick,
  interactionBusy = false,
  uploadBlockedByExpiry = false,
  /** @deprecated use interactionBusy + uploadBlockedByExpiry */
  disabled = false,
  approved = false,
}) {
  const busy = interactionBusy || disabled;
  const blockUpload = busy || uploadBlockedByExpiry;

  const v = resolveDocVerification(stored);
  const hasFile = hasUploadedFile(stored);
  const exp = getExpiryBucket((expiryValue || "").slice(0, 10));

  const uploadPrimaryClass =
    "rounded bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50";
  const downloadOutlineClass =
    "rounded border border-primary px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50";

  if (!hasFile) {
    return (
      <button type="button" disabled={blockUpload} onClick={() => onUploadClick(row.key)} className={uploadPrimaryClass}>
        Upload
      </button>
    );
  }

  const openPreview = () => onOpenPreview(stored, row);

  if (v === "verified") {
    const href = (stored?.fileUrl && String(stored.fileUrl).trim()) || DUMMY_FILE_URL;
    const dlName = stored.fileName || "document.pdf";
    return (
      <div className="flex flex-col items-end gap-2">
        <button type="button" onClick={openPreview} className={downloadOutlineClass}>
          View
        </button>
        <button type="button" onClick={() => triggerDownload(href, dlName)} className={downloadOutlineClass}>
          Download
        </button>
      </div>
    );
  }

  if (approved) return null;

  if (exp === "expired" || exp === "expiring_soon") {
    return (
      <div className="flex flex-col items-end gap-2">
        <button type="button" disabled={busy} onClick={openPreview} className={downloadOutlineClass}>
          View
        </button>
        <button type="button" disabled={blockUpload} onClick={() => onUploadClick(row.key)} className={uploadPrimaryClass}>
          Replace
        </button>
      </div>
    );
  }

  if (v === "rejected") {
    return (
      <div className="flex flex-col items-end gap-2">
        <button type="button" disabled={busy} onClick={openPreview} className={downloadOutlineClass}>
          View
        </button>
        <button type="button" disabled={blockUpload} onClick={() => onUploadClick(row.key)} className={uploadPrimaryClass}>
          Re-upload
        </button>
      </div>
    );
  }

  if (v === "waiting") {
    return (
      <div className="flex flex-col items-end gap-2">
        <button type="button" disabled={busy} onClick={openPreview} className={downloadOutlineClass}>
          View
        </button>
        <button type="button" disabled={blockUpload} onClick={() => onUploadClick(row.key)} className={uploadPrimaryClass}>
          Replace
        </button>
      </div>
    );
  }

  if (v === "unapproved") {
    return (
      <div className="flex flex-col items-end gap-2">
        <button type="button" disabled={busy} onClick={openPreview} className={downloadOutlineClass}>
          View
        </button>
        <button type="button" disabled={blockUpload} onClick={() => onUploadClick(row.key)} className={uploadPrimaryClass}>
          Replace
        </button>
      </div>
    );
  }

  return null;
}
