/** Converted from application_process/admin_document_approval/code.html — content area only. */

import { useEffect, useState } from "react";
import {
  adminAddBgvRequest,
  adminAddDocumentRequest,
  adminSetBgvInstructions,
  setOnboardingVerification,
} from "@/data/applicationsStore";
import { onboardingVerificationBadge, uploadStatusBadge } from "@/components/shared/requiredDocumentBadges";
import {
  documentIconWrapClass,
  formatDocumentSubtitle,
  formatExpiryForDisplay,
  getAllDocumentTemplateRows,
  getApplicantDocumentRowState,
} from "@/utils/applicantDocumentRows";
import { hasUploadedFile, resolveDocVerification } from "@/utils/onboardingDocumentRules";

const candidateIdLabel = (app) => (app?.id != null ? `#ITR-${String(app.id).padStart(5, "0")}` : "#ITR-—");

export default function AdminDocumentApproval({ application, onApproveDocuments }) {
  const app = application || {};
  const ob = app.onboarding || {};
  const adminBgv = app.adminBgvRequests || [];
  const allDocRows = getAllDocumentTemplateRows(app);
  const numericAppId = Number(app.id);
  const totalDocRows = allDocRows.length;

  const [bgvLinkDraft, setBgvLinkDraft] = useState(ob.bgvLink || "");
  const [bgvNoteDraft, setBgvNoteDraft] = useState(ob.bgvNote || "");
  const [isDocRequestModalOpen, setIsDocRequestModalOpen] = useState(false);
  const [newDocNameDraft, setNewDocNameDraft] = useState("");
  const [isBgvRequestModalOpen, setIsBgvRequestModalOpen] = useState(false);
  const [newBgvNameDraft, setNewBgvNameDraft] = useState("");

  useEffect(() => {
    setBgvLinkDraft(ob.bgvLink || "");
    setBgvNoteDraft(ob.bgvNote || "");
  }, [app.id, ob.bgvLink, ob.bgvNote]);

  const handleSaveBgv = () => {
    if (app.id == null) return;
    adminSetBgvInstructions(app.id, { link: bgvLinkDraft, note: bgvNoteDraft });
  };

  const handleSubmitNewDocumentRequest = () => {
    if (app.id == null || !newDocNameDraft.trim()) return;
    adminAddDocumentRequest(app.id, newDocNameDraft);
    setNewDocNameDraft("");
    setIsDocRequestModalOpen(false);
  };

  const handleSubmitNewBgvRequest = () => {
    if (app.id == null || !newBgvNameDraft.trim()) return;
    adminAddBgvRequest(app.id, newBgvNameDraft);
    setNewBgvNameDraft("");
    setIsBgvRequestModalOpen(false);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto w-full">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-2 block">Application ID: {candidateIdLabel(app)}</span>
          <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-4">Onboarding: {app.name || "Candidate"}</h1>
          <p className="text-on-surface-variant leading-relaxed">
            {app.role || "Role"} — Document verification stage for final approval and compliance clearing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                check
              </span>
            </div>
            <span className="text-[10px] font-bold mt-2 text-primary/40 uppercase">Identity</span>
          </div>
          <div className="w-12 h-[2px] bg-primary mb-6" />
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-xl ring-4 ring-tertiary-fixed-dim/20">
              <span className="text-sm font-bold">02</span>
            </div>
            <span className="text-[10px] font-bold mt-2 text-primary uppercase">Documents</span>
          </div>
          <div className="w-12 h-[2px] bg-surface-container-highest mb-6" />
          <div className="flex flex-col items-center opacity-40">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
              <span className="text-sm font-bold">03</span>
            </div>
            <span className="text-[10px] font-bold mt-2 uppercase">Vetting</span>
          </div>
          <div className="w-12 h-[2px] bg-surface-container-highest mb-6" />
          <div className="flex flex-col items-center opacity-40">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
              <span className="text-sm font-bold">04</span>
            </div>
            <span className="text-[10px] font-bold mt-2 uppercase">Signed</span>
          </div>
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
                      <td className="px-6 py-5">{uploadStatusBadge(displayStatus)}</td>
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
                              if (hasFile) window.open(previewUrl, "_blank", "noopener,noreferrer");
                            }}
                            className="p-2 text-on-primary-container hover:bg-primary-container hover:text-white rounded transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                            title="View"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>
                          <button
                            type="button"
                            disabled={!canApprove}
                            onClick={() => {
                              if (Number.isFinite(numericAppId) && canApprove) {
                                setOnboardingVerification(numericAppId, row.key, "verified");
                              }
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
                            disabled={!hasFile || v === "verified"}
                            onClick={() => {
                              if (Number.isFinite(numericAppId) && hasFile && v !== "verified") {
                                setOnboardingVerification(numericAppId, row.key, "rejected");
                              }
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
            <button
              type="button"
              onClick={() => {
                setNewBgvNameDraft("");
                setIsBgvRequestModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Request New Verification
            </button>
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
                className="px-5 py-2.5 bg-primary-container text-on-primary text-xs font-bold rounded hover:opacity-90 transition-all"
              >
                Save for candidate
              </button>
              {ob.bgvLink?.trim() ? (
                <span className="text-xs text-on-surface-variant">Link on file · updates apply when the candidate opens step 3.</span>
              ) : (
                <span className="text-xs text-amber-800">No link saved yet — the candidate page shows default text until you save.</span>
              )}
            </div>
            {adminBgv.length > 0 ? (
              <div className="border-t border-surface-container pt-5 mt-2">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant mb-3">
                  Additional verification requests
                </p>
                <ul className="space-y-2">
                  {adminBgv.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center gap-2 text-sm text-primary font-medium bg-surface-container-low/80 rounded-lg px-4 py-2 border border-outline-variant/15"
                    >
                      <span className="material-symbols-outlined text-secondary text-lg">verified_user</span>
                      {r.name}
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
            <img
              alt="Candidate"
              className="w-full h-32 object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYPTWLaomyvdp1M1yMwr12TU5L9Y9GUDS9gyCzIHRwQRLDF5mHTigvO0expu6nyqivxHYmpzz1a6CLGpHQnphfXAKMf8_OgdaQGQyUFwdGW5v2eGKJPSytmDn8exsRyfO9xP0nR_H_1Nc8Di71R2ZkpeO_b_kQpfAunxhvL2kOt0aF1ZBkNuFoj23UPfH1unOlmCcVuZyO6_Tc_sPcrOKzu1dnD8md5nzsp5uvjjqwzKjr5gzSHQnt3O1-yx9-96WUm4LloAMx3kAO"
            />
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
                disabled={!newDocNameDraft.trim()}
                onClick={handleSubmitNewDocumentRequest}
              >
                Add request
              </button>
            </div>
          </div>
        </div>
      )}

      {isBgvRequestModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md">
          <div className="glass-card rounded-xl p-6 w-[min(92vw,32rem)] border border-white/30 shadow-2xl">
            <h4 className="text-lg font-bold text-primary mb-3">Request new verification</h4>
            <p className="text-xs text-on-surface-variant mb-3">
              Enter a short name for the verification step. It appears for the candidate on onboarding step 3 right away.
            </p>
            <input
              type="text"
              className="w-full bg-white border border-slate-200 rounded p-3 text-sm focus:ring-0 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30"
              placeholder="e.g. Employment history check"
              value={newBgvNameDraft}
              onChange={(e) => setNewBgvNameDraft(e.target.value)}
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-lg"
                onClick={() => setIsBgvRequestModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold bg-primary-container text-white rounded-lg disabled:opacity-40"
                disabled={!newBgvNameDraft.trim()}
                onClick={handleSubmitNewBgvRequest}
              >
                Add request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
