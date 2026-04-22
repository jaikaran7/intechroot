/** Admin STAGE 1 — Profile Review. Read-only summary of the applicant's full identity. */

import { useState } from "react";
import AdminDocumentPreviewModal from "@/components/admin/AdminDocumentPreviewModal";
import EntityAvatar from "@/components/shared/EntityAvatar";
import { resolveApplicationResumeUrl } from "@/utils/resolveApplicationResumeUrl";
import { formatAppliedDateDisplay } from "@/utils/applicantDisplayHelpers";
import OnboardingAdminStepper from "./OnboardingAdminStepper";

const candidateIdLabel = (app) => (app?.id != null ? `#ITR-${String(app.id).padStart(5, "0")}` : "#ITR-—");

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminProfileReview({ application, onApproveProfile }) {
  const app = application || {};
  const skills = Array.isArray(app.skills) ? app.skills : [];
  const tagSkills = skills.length ? skills.slice(0, 3) : [];
  const cvUrl = resolveApplicationResumeUrl(app);
  const [documentPreview, setDocumentPreview] = useState(null);
  const profilePhoto = app.profilePhotoUrl || null;
  const profileCompleted = Boolean(app.onboarding?.profileCompleted);

  function openCv() {
    if (!cvUrl) return;
    setDocumentPreview({
      url: cvUrl,
      title: "Resume / CV",
      fileName: `${(app.name || "Candidate").replace(/\s+/g, "_")}_Resume.pdf`,
    });
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <OnboardingAdminStepper activeStep={1} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>Applicants</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary font-medium">Candidate ID: {candidateIdLabel(app)}</span>
          </nav>
          <h2 className="text-4xl font-extrabold font-headline text-primary tracking-tight">Applicant Profile Review</h2>
          <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
            Verify the applicant&apos;s personal identity details. Approvals are performed at the final stage.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onApproveProfile}
            disabled={!profileCompleted}
            className="px-6 py-3 bg-primary-container text-white font-bold rounded-lg shadow-md hover:bg-primary hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            title={profileCompleted ? "Mark profile reviewed and move to Document Review" : "Waiting for applicant to submit their profile"}
          >
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
            Continue to Document Review
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-4 glass-panel rounded-xl p-8 shadow-sm">
          <div className="relative w-32 h-32 mx-auto mb-6">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={app.name || "Applicant"}
                className="w-full h-full rounded-full object-cover shadow-inner ring-4 ring-white"
              />
            ) : (
              <EntityAvatar name={app.name} size="hero" className="shadow-inner ring-4 ring-white" rounded="full" />
            )}
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold font-headline text-primary">{app.name || "—"}</h3>
            <p className="text-secondary font-medium mt-1">{app.role || "—"}</p>
            {tagSkills.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {tagSkills.map((s) => (
                  <span key={s} className="bg-surface-container-high px-3 py-1 rounded-full text-xs font-semibold text-primary">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="mt-8 pt-8 border-t border-outline-variant/30 space-y-4">
            <div className="flex items-start gap-4 text-sm">
              <span className="material-symbols-outlined text-slate-400">mail</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Email</p>
                <p className="text-slate-700 font-medium break-all">{app.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-sm">
              <span className="material-symbols-outlined text-slate-400">call</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Phone</p>
                <p className="text-slate-700 font-medium">{app.phone || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-sm">
              <span className="material-symbols-outlined text-slate-400">cake</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Date of Birth</p>
                <p className="text-slate-700 font-medium">{formatDate(app.dateOfBirth)}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-sm">
              <span className="material-symbols-outlined text-slate-400">wc</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Gender</p>
                <p className="text-slate-700 font-medium">{app.gender || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-sm">
              <span className="material-symbols-outlined text-slate-400">public</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Nationality</p>
                <p className="text-slate-700 font-medium">{app.nationality || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-sm">
              <span className="material-symbols-outlined text-slate-400">location_on</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Location</p>
                <p className="text-slate-700 font-medium">{app.location || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-sm">
              <span className="material-symbols-outlined text-slate-400">calendar_month</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Applied</p>
                <p className="text-slate-700 font-medium">{formatAppliedDateDisplay(app.appliedDate)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">work_history</span> Experience
              </h4>
              <p className="text-on-surface-variant leading-relaxed font-light text-lg">
                {app.experience ? String(app.experience) : "—"}
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">badge</span> Role Applied
              </h4>
              <p className="text-on-surface-variant leading-relaxed font-light text-lg">
                {app.role || "—"}
              </p>
            </div>
          </div>
          <div className="col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Skills</h4>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className="bg-primary-container/10 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant">No skills listed.</p>
            )}
          </div>
          <div className="col-span-2 flex flex-col gap-6">
            <button
              type="button"
              onClick={openCv}
              disabled={!cvUrl}
              className="bg-secondary-container rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-lg hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-4xl text-on-secondary-container mb-2">picture_as_pdf</span>
              <p className="font-bold text-on-secondary-container">Full CV</p>
              <p className="text-[10px] text-on-secondary-container/70 mt-1 uppercase font-bold">Open resume</p>
            </button>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Onboarding Progress</h4>
              <div className="space-y-3">
                {[
                  { label: "Profile submitted", ok: Boolean(app.onboarding?.profileCompleted) },
                  { label: "Documents submitted", ok: Boolean(app.onboarding?.documentsCompleted) },
                  { label: "Verification acknowledged", ok: Boolean(app.onboarding?.bgvApplicantAcknowledged) },
                  { label: "Final submission", ok: Boolean(app.onboarding?.finalSubmitted) },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">{row.label}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded ${
                        row.ok ? "bg-green-100 text-green-800" : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {row.ok ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-10" />

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
