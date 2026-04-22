/** Admin STAGE 3 — Final Approval. Approve & move to Employee, or Reject the application. */

import { useState } from "react";
import AdminDocumentPreviewModal from "@/components/admin/AdminDocumentPreviewModal";
import EntityAvatar from "@/components/shared/EntityAvatar";
import { resolveApplicationResumeUrl } from "@/utils/resolveApplicationResumeUrl";
import OnboardingAdminStepper from "./OnboardingAdminStepper";

export default function AdminFinalApproval({ application, onFinalHire, onReject, hireMessage, rejectPending }) {
  const app = application || {};
  const ob = app.onboarding || {};
  const dossierUrl = resolveApplicationResumeUrl(app);
  const [documentPreview, setDocumentPreview] = useState(null);
  const finalSubmitted = Boolean(ob.finalSubmitted);
  const canHire = finalSubmitted && !rejectPending;
  const hireDisabledReason = !finalSubmitted
    ? "Applicant must submit the onboarding checklist before you can approve."
    : "";

  return (
    <main className="flex-1 px-8 py-12 bg-surface w-full max-w-full">
      <div className="max-w-4xl mx-auto">
        <OnboardingAdminStepper activeStep={3} />
      </div>
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tighter mb-4">Onboarding Completion Review</h1>
          <p className="text-on-surface-variant leading-relaxed">
            Review the final verification summary for <span className="font-semibold text-primary">{app.name || "Candidate"}</span> (
            {app.role || "Role"}). All automated background checks and manual document audits should be complete.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            disabled={!dossierUrl}
            onClick={() => {
              if (!dossierUrl) return;
              setDocumentPreview({
                url: dossierUrl,
                title: "Application dossier (resume)",
                fileName: `${(app.name || "Candidate").replace(/\s+/g, "_")}_Resume.pdf`,
              });
            }}
            className="px-6 h-12 border border-outline-variant/30 text-primary font-bold text-sm tracking-tight rounded hover:bg-slate-50 transition-all disabled:cursor-not-allowed disabled:opacity-40"
          >
            View Dossier
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 rounded-xl relative overflow-hidden signature-glow">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary font-label">Profile Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded uppercase tracking-tighter">Verified</span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <EntityAvatar name={app.name} size="profile" rounded="xl" className="shadow-md" />
              <div>
                <h3 className="font-headline font-bold text-lg text-primary">{app.name || "—"}</h3>
                <p className="text-sm text-on-surface-variant">{app.email || "—"}</p>
                <p className="text-sm font-medium text-secondary mt-1">{app.location || "—"}</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-outline-variant/10">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Experience Match</span>
                <span className="font-bold text-primary">98%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full" style={{ width: "98%" }} />
              </div>
            </div>
          </div>
          <div className="glass-card p-8 rounded-xl">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary font-label">Document Audit</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded uppercase tracking-tighter">Approved</span>
            </div>
            <div className="space-y-4">
              {["Work Authorization", "Academic Credentials", "Government ID", "Bank Information"].map((label) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-xl">description</span>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <span className="material-symbols-outlined text-green-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 glass-card p-8 rounded-xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-secondary font-label">Background Verification (BGV)</span>
                <h2 className="text-xl font-headline font-bold text-primary mt-1">Screening Summary</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-black text-on-surface-variant block mb-1">Risk Rating</span>
                <span className="text-2xl font-headline font-black text-green-600 tracking-tighter">CLEAR</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Criminal Record</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">shield</span>
                  <span className="text-sm font-bold text-primary">No Records Found</span>
                </div>
                <p className="text-[10px] text-slate-500">Global & Local Database Check</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Past Employment</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">work_history</span>
                  <span className="text-sm font-bold text-primary">Verified (8 years)</span>
                </div>
                <p className="text-[10px] text-slate-500">Confirmed with 3 former employers</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reference Check</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">recommend</span>
                  <span className="text-sm font-bold text-primary">Highly Recommended</span>
                </div>
                <p className="text-[10px] text-slate-500">All 3 references responded positive</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 sticky top-32">
          <div className="bg-primary-container rounded-xl p-8 text-on-primary-container shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            <h2 className="text-2xl font-headline font-bold text-white mb-2">Ready for Decision</h2>
            <p className="text-blue-100/70 text-sm leading-relaxed mb-8">
              This candidate has passed compliance checkpoints for the role. Transitioning to &apos;Employee&apos; status will trigger asset provisioning
              and system access.
            </p>
            <div className="space-y-4">
              <button
                type="button"
                onClick={onFinalHire}
                disabled={!canHire}
                title={hireDisabledReason || undefined}
                className="w-full h-14 bg-white text-primary-container font-black text-sm uppercase tracking-widest rounded shadow-xl hover:scale-[1.02] transition-transform active:scale-95 duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="material-symbols-outlined">person_add</span>
                Approve & Move to Employee
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!onReject) return;
                  if (!window.confirm(`Reject this application for ${app.name || "the applicant"}? This cannot be undone.`)) return;
                  onReject();
                }}
                disabled={!onReject || rejectPending}
                className="w-full h-14 bg-transparent border border-white/20 text-white font-bold text-sm uppercase tracking-widest rounded hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">cancel</span>
                {rejectPending ? "Rejecting…" : "Reject Application"}
              </button>
            </div>
            {hireDisabledReason ? (
              <p className="mt-3 text-[11px] text-white/80 italic">{hireDisabledReason}</p>
            ) : null}
            {hireMessage ? <p className="mt-4 text-xs text-white/90">{hireMessage}</p> : null}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-blue-200">lock</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-blue-100">Authenticated Admin Session Required</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-6 glass-card rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary">info</span>
              <h4 className="text-sm font-bold text-primary">Post-Approval Steps</h4>
            </div>
            <ul className="space-y-3">
              <li className="flex gap-3 text-xs text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1 shrink-0" />
                Corporate email creation
              </li>
              <li className="flex gap-3 text-xs text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1 shrink-0" />
                Laptop & peripheral shipping request
              </li>
              <li className="flex gap-3 text-xs text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1 shrink-0" />
                Welcome package automated dispatch
              </li>
            </ul>
          </div>
        </div>
      </div>

      <AdminDocumentPreviewModal
        open={documentPreview != null}
        onClose={() => setDocumentPreview(null)}
        url={documentPreview?.url || ""}
        title={documentPreview?.title || "Document preview"}
        downloadFileName={documentPreview?.fileName}
      />
    </main>
  );
}
