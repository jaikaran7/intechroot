import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import OnboardingShell from "./OnboardingShell";
import { onboardingService } from "@/services/onboarding.service";
import { documentsService } from "@/services/documents.service";
import { applicationsService } from "@/services/applications.service";
import { hasUploadedFile } from "@/utils/onboardingDocumentRules";

const ID_TEMPLATE_KEYS = ["govId", "passport"];

export default function VerificationStep({ applicationId, onboarding, maxAllowed }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState("");
  const [bgvVisited, setBgvVisited] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { data: application } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationsService.getById(applicationId),
    enabled: !!applicationId,
    staleTime: 15_000,
  });

  const idDoc = useMemo(() => {
    const docs = application?.onboardingDocuments || [];
    return docs.find((d) => ID_TEMPLATE_KEYS.includes(d.templateKey) && hasUploadedFile(d)) || null;
  }, [application?.onboardingDocuments]);

  const bgvLink = onboarding?.bgvLink || "";
  const bgvNote = onboarding?.bgvNote || "";
  const hasBgvLink = Boolean(bgvLink.trim());
  const bgvCompleted = Boolean(onboarding?.bgvCompleted);
  const finalSubmitted = Boolean(onboarding?.finalSubmitted);
  const bgvInitiated = bgvVisited || bgvCompleted;

  const uploadMutation = useMutation({
    mutationFn: (file) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("applicationId", applicationId);
      fd.append("templateKey", "govId");
      fd.append("name", "Government ID");
      return documentsService.upsert(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
    },
    onError: (err) => {
      setUploadError(err?.response?.data?.error?.message || "Upload failed. Try again.");
    },
  });

  const acknowledgeMutation = useMutation({
    mutationFn: () => onboardingService.acknowledgeBgv(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding', applicationId] });
      navigate("/applicant/onboarding/4", { replace: true });
    },
    onError: (err) => {
      setSubmitError(err?.response?.data?.error?.message || "Please complete the identity and BGV steps first.");
    },
  });

  function handleUploadClick() {
    setUploadError("");
    fileInputRef.current?.click();
  }

  function onFileSelected(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File must be 10MB or smaller.");
      return;
    }
    uploadMutation.mutate(file);
  }

  function handleOpenBgv() {
    if (!hasBgvLink) return;
    setBgvVisited(true);
    window.open(bgvLink, "_blank", "noopener,noreferrer");
  }

  const canProceed = Boolean(idDoc) && bgvInitiated && !finalSubmitted;

  return (
    <OnboardingShell
      stepNum={3}
      maxAllowed={maxAllowed}
      onNavigate={(n) => navigate(`/applicant/onboarding/${n}`)}
      eyebrow="Step 03 — Final Validation"
      title="BGV & ID"
      titleAccent="Verification"
      rightPill="Bank-Grade Encryption"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={onFileSelected}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-outline-variant/10 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center">
              <span className="material-symbols-outlined">shield_person</span>
            </div>
            <div>
              <h2 className="font-headline text-xl font-bold text-primary">Background Verification</h2>
              <p className="text-xs text-on-surface-variant">
                To ensure a secure environment, we partner with a third-party agency to verify your professional and
                criminal record history. This process typically takes 3–5 business days.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Required Action</p>
            {hasBgvLink ? (
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {bgvNote ||
                  "Please click the secure link below to visit our verification partner's portal. You will need to provide consent and basic history details."}
              </p>
            ) : (
              <p className="text-xs text-amber-800 leading-relaxed">
                Your admin has not yet shared a BGV link. You can still upload your identity document below; the link
                will appear here once provided.
              </p>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button
              type="button"
              disabled={!hasBgvLink}
              onClick={handleOpenBgv}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-wider shadow disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 active:scale-95"
            >
              Open BGV Link
              <span className="material-symbols-outlined text-base">open_in_new</span>
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${bgvInitiated ? "bg-green-500" : "bg-slate-300"}`}></span>
              <span className={bgvInitiated ? "text-green-700 font-semibold" : "text-on-surface-variant"}>
                {bgvCompleted ? "Completed" : bgvInitiated ? "Initiated" : "Awaiting Start"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-outline-variant/10 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline text-base font-bold text-primary">Identity Document</h3>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                idDoc ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {idDoc ? "Uploaded" : "Action Required"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleUploadClick}
            disabled={finalSubmitted || uploadMutation.isPending}
            className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-lowest flex flex-col items-center justify-center text-center hover:border-primary/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">image</span>
            <p className="text-sm font-semibold text-primary">
              {uploadMutation.isPending ? "Uploading…" : "Click to upload ID"}
            </p>
            <p className="text-[10px] text-on-surface-variant mt-1">Passport, ID, or National ID (Max 10MB)</p>
          </button>

          {idDoc ? (
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-outline-variant/10 bg-white px-3 py-2">
              <span className="material-symbols-outlined text-on-surface-variant">description</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary truncate">{idDoc.fileName || "Identity document"}</p>
                <p className="text-[10px] text-on-surface-variant">
                  {idDoc.templateKey === "govId" ? "Government ID" : "Passport"} · Uploaded
                </p>
              </div>
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={finalSubmitted || uploadMutation.isPending}
                className="text-[10px] font-bold uppercase tracking-wider text-secondary hover:underline disabled:opacity-50"
              >
                Replace
              </button>
            </div>
          ) : null}

          {uploadError ? <p className="mt-3 text-xs text-error font-medium">{uploadError}</p> : null}

          <div className="mt-5 rounded-xl bg-primary-container text-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-2">Verification Status</p>
            <ul className="text-xs space-y-1">
              <li className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${idDoc ? "bg-green-400" : "bg-amber-400"}`}></span>
                ID Document: {idDoc ? "Uploaded" : "Pending"}
              </li>
              <li className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${bgvCompleted ? "bg-green-400" : bgvInitiated ? "bg-blue-400" : "bg-amber-400"}`}></span>
                BGV: {bgvCompleted ? "Completed" : bgvInitiated ? "In progress" : "Not started"}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/applicant/onboarding/2")}
          className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Documents
        </button>
        <div className="flex items-center gap-6">
          <div className="text-right">
            {submitError ? (
              <p className="text-xs font-semibold text-error max-w-xs">{submitError}</p>
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Total Progress</p>
                <p className="text-sm font-bold text-primary">
                  {canProceed ? "75%" : idDoc ? "60%" : "50%"} Complete
                </p>
              </>
            )}
          </div>
          <button
            type="button"
            disabled={!canProceed || acknowledgeMutation.isPending}
            onClick={() => {
              setSubmitError("");
              acknowledgeMutation.mutate();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:opacity-95 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {acknowledgeMutation.isPending ? "Saving…" : "Proceed to Review"}
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </OnboardingShell>
  );
}
