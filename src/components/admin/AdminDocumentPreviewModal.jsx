import { useCallback, useEffect, useState } from "react";

const PDF_RE = /\.pdf($|\?|#)/i;
const IMG_RE = /\.(png|jpe?g|gif|webp|bmp|svg)($|\?|#)/i;

/** @param {string} url */
export function inferDocumentPreviewKind(url) {
  if (!url || typeof url !== "string") return "none";
  const t = url.trim();
  if (!t) return "none";
  const lower = t.toLowerCase();
  if (lower.startsWith("data:image/")) return "image";
  if (lower.startsWith("data:application/pdf") || lower.startsWith("data:application%2fpdf")) return "pdf";
  if (lower.startsWith("data:")) return "blob";
  if (PDF_RE.test(t)) return "pdf";
  if (IMG_RE.test(t)) return "image";
  if (/^https?:\/\//i.test(t)) return "external";
  return "pdf";
}

function pickDownloadName(title, url, fallback = "document") {
  if (title && /\.[a-z0-9]+$/i.test(title.trim())) return title.trim();
  try {
    const u = new URL(url, window.location.origin);
    const last = u.pathname.split("/").filter(Boolean).pop();
    if (last && /\.[a-z0-9]+$/i.test(last)) return decodeURIComponent(last);
  } catch {
    /* ignore */
  }
  const kind = inferDocumentPreviewKind(url);
  if (kind === "pdf") return `${fallback}.pdf`;
  if (kind === "image") return `${fallback}.png`;
  return fallback;
}

async function downloadFromUrl(url, filename) {
  if (!url) return;
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }
  try {
    const res = await fetch(url, { mode: "cors" });
    if (res.ok) {
      const blob = await res.blob();
      const obj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = obj;
      a.download = filename;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(obj);
      return;
    }
  } catch {
    /* fall through */
  }
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * In-app document preview for admins. Download is optional and gated by confirming interest
 * unless `requireInterestForDownload` is false (e.g. future role-based permissions).
 */
export default function AdminDocumentPreviewModal({
  open,
  onClose,
  url,
  title = "Document preview",
  downloadFileName,
  requireInterestForDownload = true,
}) {
  const [interestConfirmed, setInterestConfirmed] = useState(false);

  useEffect(() => {
    if (open) setInterestConfirmed(false);
  }, [open, url]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const kind = inferDocumentPreviewKind(url || "");
  const downloadName = downloadFileName || pickDownloadName(title, url || "");
  const canDownload = kind === "pdf" || kind === "image" || kind === "blob";
  const useIframePreview = kind === "pdf" || kind === "blob";
  const downloadEnabled = !requireInterestForDownload || interestConfirmed;

  const handleDownload = useCallback(() => {
    if (!downloadEnabled || !canDownload || !url) return;
    void downloadFromUrl(url, downloadName);
  }, [canDownload, downloadEnabled, downloadName, url]);

  const openExternal = useCallback(() => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  if (!open || !url) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#000615]/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-doc-preview-title"
    >
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close preview" onClick={onClose} />
      <div className="relative z-10 flex w-[min(96vw,56rem)] max-h-[min(92vh,900px)] flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-2xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-outline-variant/15 bg-surface-container-low/50 px-4 py-3">
          <h2 id="admin-doc-preview-title" className="min-w-0 truncate text-sm font-bold text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl leading-none">close</span>
          </button>
        </div>

        <div className="min-h-[min(72vh,720px)] flex-1 overflow-auto bg-surface-container-low/30">
          {useIframePreview ? (
            <iframe title={title} src={url} className="h-[min(72vh,720px)] w-full border-0 bg-white" />
          ) : null}
          {kind === "image" ? (
            <div className="flex min-h-[min(72vh,720px)] items-center justify-center p-4">
              <img src={url} alt="" className="max-h-[min(70vh,680px)] max-w-full object-contain shadow-md" />
            </div>
          ) : null}
          {kind === "external" ? (
            <div className="flex min-h-[min(40vh,320px)] flex-col items-center justify-center gap-4 p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-secondary">link</span>
              <p className="max-w-md text-sm text-on-surface-variant">
                This asset is an external link. Embedded preview is not available here. Open it in a new tab to review.
              </p>
              <p className="max-w-lg break-all text-xs text-outline">{url}</p>
            </div>
          ) : null}
          {kind === "none" ? (
            <p className="p-8 text-center text-sm text-on-surface-variant">No document URL to display.</p>
          ) : null}
        </div>

        <div className="shrink-0 space-y-3 border-t border-outline-variant/15 bg-surface-container-lowest px-4 py-3">
          {canDownload && requireInterestForDownload ? (
            <label className="flex cursor-pointer items-start gap-3 text-left">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded border-outline-variant text-secondary focus:ring-secondary"
                checked={interestConfirmed}
                onChange={(e) => setInterestConfirmed(e.target.checked)}
              />
              <span className="text-xs leading-snug text-on-surface-variant">
                I confirm legitimate interest in retaining a copy of this file. This enables the download action for
                compliance with internal handling rules.
              </span>
            </label>
          ) : null}

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={openExternal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-xs font-bold text-primary hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-base leading-none">open_in_new</span>
              Open in new tab
            </button>
            {canDownload ? (
              <button
                type="button"
                disabled={!downloadEnabled}
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-on-secondary hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-base leading-none">download</span>
                Download
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high"
            >
              Close
            </button>
          </div>
          {kind === "pdf" ? (
            <p className="text-[10px] text-on-surface-variant">
              If the preview stays blank, the host may block embedding—use &quot;Open in new tab&quot; to view the file.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
