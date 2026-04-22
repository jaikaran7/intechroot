/** Admin STAGE 2 — Document Approval. Verify uploads, request new docs, save BGV link for the applicant. */

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { documentsService } from "@/services/documents.service";
import { onboardingService } from "@/services/onboarding.service";
import { onboardingVerificationBadge, uploadStatusBadge } from "@/components/shared/requiredDocumentBadges";
import {
  documentIconWrapClass,
  formatDocumentSubtitle,
  formatExpiryForDisplay,
  getAllDocumentTemplateRows,
  getApplicantDocumentRowState,
} from "@/utils/applicantDocumentRows";
import { hasUploadedFile, resolveDocVerification } from "@/utils/onboardingDocumentRules";
import AdminDocumentPreviewModal from "@/components/admin/AdminDocumentPreviewModal";
import EntityAvatar from "@/components/shared/EntityAvatar";
import OnboardingAdminStepper from "./OnboardingAdminStepper";

const candidateIdLabel = (app) => (app?.id != null ? `#ITR-${String(app.id).padStart(5, "0")}` : "#ITR-—");

export default function AdminDocumentApproval({ application, onApproveDocuments }) {
  const queryClient = useQueryClient();
  const app = application || {};
  const ob = app.onboarding || {};
  const adminRequested = app.adminRequestedDocuments || [];
  const allDocRows = getAllDocumentTemplateRows(app);
  const totalDocRows = allDocRows.length;

  const invalidateApp = () => {
    if (app.id) queryClient.invalidateQueries({ queryKey: ['application', app.id] });
  };

  const verifyDocumentMutation = useMutation({
    mutationFn: ({ documentId, verification }) => documentsService.verify(documentId, verification),
    onSuccess: invalidateApp,
  });

  const saveBgvMutation = useMutation({
    mutationFn: (payload) => onboardingService.adminSetBgv(app.id, payload),
    onSuccess: () => {
      setActionMessage({ kind: "success", text: "BGV link saved for the candidate." });
      invalidateApp();
    },
    onError: (err) => {
      setActionMessage({
        kind: "error",
        text: err?.response?.data?.error?.message || "Failed to save BGV instructions.",
      });
    },
  });

  const requestDocumentMutation = useMutation({
    mutationFn: (name) => onboardingService.adminRequestDocument(app.id, name),
    onSuccess: () => {
      setNewDocNameDraft("");
      setIsDocRequestModalOpen(false);
      setActionMessage({ kind: "success", text: "Document request added. The applicant will see it in their documents list." });
      invalidateApp();
    },
    onError: (err) => {
      setActionMessage({
        kind: "error",
        text: err?.response?.data?.error?.message || "Failed to request document.",
      });
    },
  });

  const deleteDocRequestMutation = useMutation({
    mutationFn: (requestId) => onboardingService.adminDeleteDocumentRequest(app.id, requestId),
    onSuccess: invalidateApp,
  });

  const [bgvLinkDraft, setBgvLinkDraft] = useState(ob.bgvLink || "");
  const [bgvNoteDraft, setBgvNoteDraft] = useState(ob.bgvNote || "");
  const [isDocRequestModalOpen, setIsDocRequestModalOpen] = useState(false);
  const [newDocNameDraft, setNewDocNameDraft] = useState("");
  const [documentPreview, setDocumentPreview] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    setBgvLinkDraft(ob.bgvLink || "");
    setBgvNoteDraft(ob.bgvNote || "");
  }, [app.id, ob.bgvLink, ob.bgvNote]);

  useEffect(() => {
    if (!actionMessage) return undefined;
    const t = window.setTimeout(() => setActionMessage(null), 4000);
    return () => window.clearTimeout(t);
  }, [actionMessage]);

  const handleSaveBgv = () => {
    if (!app.id) return;
    saveBgvMutation.mutate({ bgvLink: bgvLinkDraft.trim(), bgvNote: bgvNoteDraft.trim() });
  };

  const handleSubmitNewDocumentRequest = () => {
    if (!app.id || !newDocNameDraft.trim()) return;
    requestDocumentMutation.mutate(newDocNameDraft.trim());
  };

  return (
    <div className="p-10 max-w-7xl mx-auto w-full">
      {actionMessage ? (
        <div
          className={`mb-6 rounded-xl px-6 py-3 text-sm font-semibold ${
            actionMessage.kind === "error"
              ? "bg-error-container/10 text-error border border-error/30"
              : "bg-green-50 text-green-800 border border-green-200"
          }`}
          role={actionMessage.kind === "error" ? "alert" : "status"}
        >
          {actionMessage.text}
        </div>
      ) : null}
      <OnboardingAdminStepper activeStep={2} />
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-2 block">Application ID: {candidateIdLabel(app)}</span>
          <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-4">Onboarding: {app.name || "Candidate"}</h1>
          <p className="text-on-surface-variant leading-relaxed">
            {app.role || "Role"} — Document verification stage for final approval and compliance clearing.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          <div className="bg-surface-container-lowest shadow-[0_40px_40px_-15px_rgba(11,31,58,0.04)] overflow-hidden">
          <div className="px-8 py-6 border-b border-surface-container flex justify-between items-center bg-surface-container-low/30">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">description</span>
              Required Documentation
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setNewDocNameDraft("");
                  setIsDocRequestModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Request New Document
              </button>
            </div>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                    Document Name
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                    Expiry Date
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                    Verification
                  </th>
                  <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {allDocRows.map((row) => {
                  const { stored, expiryValue, displayStatus, verification } = getApplicantDocumentRowState(app, row);
                  const statusForBadge = displayStatus === "not_uploaded_neutral" ? "not_uploaded" : displayStatus;
                  const hasFile = hasUploadedFile(stored);
                  const v = verification;
                  const canApprove = hasFile && v !== "verified";
                  const previewUrl = stored?.fileData?.trim()
                    ? stored.fileData
                    : stored?.fileUrl?.trim() || "/sample.pdf";
                  const expStr = formatExpiryForDisplay(expiryValue, verification);
                  return (
                    <tr key={row.key} className="hover:bg-surface-container-low/20 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={documentIconWrapClass(row, displayStatus)}>
                            <span
                              className="material-symbols-outlined text-lg"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {row.icon}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-primary text-sm">
                              {row.label}
                              {row.required ? <span className="ml-1 text-red-500">*</span> : null}
                            </p>
                            <p className="text-xs text-on-surface-variant truncate">
                              {formatDocumentSubtitle(stored, row)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">{uploadStatusBadge(statusForBadge)}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`text-sm ${
                            displayStatus === "expired"
                              ? "font-medium text-red-700"
                              : displayStatus === "expiring_soon"
                                ? "font-medium text-yellow-700"
                                : "text-on-surface-variant"
                          }`}
                        >
                          {expStr}
                        </span>
                      </td>
                      <td className="px-6 py-5">{onboardingVerificationBadge(resolveDocVerification(stored))}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            disabled={!hasFile}
                            onClick={() => {
                              if (!hasFile) return;
                              setDocumentPreview({
                                url: previewUrl,
                                title: row.label,
                                fileName: stored?.fileName || `${row.label.replace(/\s+/g, "_")}.pdf`,
                              });
                            }}
                            className="p-2 text-on-primary-container hover:bg-primary-container hover:text-white rounded transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                            title="View"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>
                          <button
                            type="button"
                            disabled={!canApprove || !stored?.id || verifyDocumentMutation.isPending}
                            onClick={() => {
                              if (!stored?.id || !canApprove) return;
                              verifyDocumentMutation.mutate({ documentId: stored.id, verification: "verified" });
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Approve"
                          >
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                              check_circle
                            </span>
                          </button>
                          <button
                            type="button"
                            disabled={!hasFile || v === "verified" || !stored?.id || verifyDocumentMutation.isPending}
                            onClick={() => {
                              if (!stored?.id || !hasFile || v === "verified") return;
                              if (!window.confirm("Reject this document? The applicant can upload a new version.")) return;
                              verifyDocumentMutation.mutate({ documentId: stored.id, verification: "rejected" });
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Reject"
                          >
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                              cancel
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
            <div className="px-8 py-4 bg-surface-container-low flex justify-between items-center text-xs text-on-surface-variant font-medium">
            <p>
              Showing {totalDocRows} of {totalDocRows} documents
            </p>
            <div className="flex gap-4">
              <button type="button" className="opacity-50" disabled>
                Previous
              </button>
              <button type="button" className="text-primary font-bold">
                1
              </button>
              <button type="button" className="opacity-50" disabled>
                Next
              </button>
            </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest shadow-[0_40px_40px_-15px_rgba(11,31,58,0.04)] overflow-hidden">
            <div className="px-8 py-6 border-b border-surface-container flex flex-wrap justify-between items-center gap-3 bg-surface-container-low/30">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">policy</span>
              Background Verification
            </h2>
            </div>
            <div className="px-8 py-6 space-y-4">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Add the third-party BGV portal link and instructions. The candidate sees this in onboarding step 3 under{" "}
              <span className="font-semibold text-primary">Required Action</span> and the button opens your link.
            </p>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant mb-2">
                Required action note
              </label>
              <textarea
                value={bgvNoteDraft}
                onChange={(e) => setBgvNoteDraft(e.target.value)}
                rows={4}
                placeholder="e.g. Complete the Checkr flow using your personal email; consent is required before the criminal search."
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant mb-2">
                BGV portal URL
              </label>
              <input
                type="url"
                value={bgvLinkDraft}
                onChange={(e) => setBgvLinkDraft(e.target.value)}
                placeholder="https://partner-verification.example/invite/…"
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveBgv}
                disabled={saveBgvMutation.isPending}
                className="px-5 py-2.5 bg-primary-container text-on-primary text-xs font-bold rounded hover:opacity-90 transition-all disabled:opacity-50"
              >
                {saveBgvMutation.isPending ? "Saving…" : "Save for candidate"}
              </button>
              {ob.bgvLink?.trim() ? (
                <span className="text-xs text-on-surface-variant">Link on file · updates apply when the candidate opens step 3.</span>
              ) : (
                <span className="text-xs text-amber-800">No link saved yet — the candidate page shows default text until you save.</span>
              )}
            </div>
            {adminRequested.length > 0 ? (
              <div className="border-t border-surface-container pt-5 mt-2">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant mb-3">
                  Admin-requested additional documents
                </p>
                <ul className="space-y-2">
                  {adminRequested.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between gap-3 text-sm text-primary font-medium bg-surface-container-low/80 rounded-lg px-4 py-2 border border-outline-variant/15"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-secondary text-lg">assignment_add</span>
                        <span className="truncate">{r.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!window.confirm("Remove this document request? The applicant will no longer see it.")) return;
                          deleteDocRequestMutation.mutate(r.id);
                        }}
                        disabled={deleteDocRequestMutation.isPending}
                        className="text-[10px] font-bold text-error hover:underline disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <div className="bg-surface-container-lowest/70 backdrop-blur-md p-6 border border-outline-variant/15 shadow-[0_40px_40px_-15px_rgba(11,31,58,0.04)]">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-secondary mb-4">Verification Health</h3>
            <div className="relative h-2 w-full bg-surface-container rounded-full mb-6 overflow-hidden">
              <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-secondary to-tertiary-fixed-dim w-1/4" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Approved</span>
                <span className="text-xs font-bold text-primary">1 / 4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Pending Review</span>
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Rejections</span>
                <span className="text-xs font-bold text-error">1</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onApproveDocuments}
              className="w-full mt-8 py-3 bg-primary text-on-primary text-[10px] font-extrabold uppercase tracking-widest active:scale-95 transition-all"
            >
              Complete Step 02
            </button>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/10 p-1">
            <EntityAvatar name={app.name} size="hero" rounded="xl" className="mx-auto w-full max-w-[12rem]" />
            <div className="p-4">
              <p className="text-xs font-bold text-primary">{app.name || "—"}</p>
              <p className="text-[10px] text-on-surface-variant">{app.email || "—"}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-[8px] font-bold px-1.5 py-0.5 bg-surface-container-high rounded-sm text-on-surface-variant uppercase">
                  {app.role || "Role"}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-error-container/20 p-5 border-l-4 border-error">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              <div>
                <p className="text-xs font-bold text-on-error-container">Incomplete Vetting</p>
                <p className="text-[10px] text-on-error-container/80 mt-1 leading-normal">
                  Review outstanding items before completing this step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.25em] text-primary mb-8 border-b border-surface-container pb-4">Audit & Activity Log</h3>
        <div className="space-y-0">
          <div className="flex gap-6 py-6 border-b border-surface-container hover:bg-surface-container-low/40 px-4 transition-colors">
            <span className="text-[10px] font-bold text-on-surface-variant w-24 shrink-0 mt-1">Today</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">
                Document verification in progress for <span className="font-semibold text-primary">{app.name}</span>
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Workflow: onboarding admin step 2</p>
            </div>
          </div>
        </div>
      </div>

      {isDocRequestModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md">
          <div className="glass-card rounded-xl p-6 w-[min(92vw,32rem)] border border-white/30 shadow-2xl">
            <h4 className="text-lg font-bold text-primary mb-3">Request new document</h4>
            <p className="text-xs text-on-surface-variant mb-3">
              Enter the document name. It appears immediately for the candidate in their documents list and onboarding step 2.
            </p>
            <input
              type="text"
              className="w-full bg-white border border-slate-200 rounded p-3 text-sm focus:ring-0 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30"
              placeholder="e.g. Professional license certificate"
              value={newDocNameDraft}
              onChange={(e) => setNewDocNameDraft(e.target.value)}
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-lg"
                onClick={() => setIsDocRequestModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold bg-primary-container text-white rounded-lg disabled:opacity-40"
                disabled={!newDocNameDraft.trim() || requestDocumentMutation.isPending}
                onClick={handleSubmitNewDocumentRequest}
              >
                {requestDocumentMutation.isPending ? "Adding…" : "Add request"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminDocumentPreviewModal
        open={documentPreview != null}
        onClose={() => setDocumentPreview(null)}
        url={documentPreview?.url || ""}
        title={documentPreview?.title || "Document preview"}
        downloadFileName={documentPreview?.fileName}
      />
    </div>
  );
}
