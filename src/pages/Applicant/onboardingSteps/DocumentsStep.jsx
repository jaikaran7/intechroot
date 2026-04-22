import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import OnboardingShell from "./OnboardingShell";
import { onboardingService } from "@/services/onboarding.service";
import { documentsService } from "@/services/documents.service";
import { applicationsService } from "@/services/applications.service";
import {
  getAllDocumentTemplateRows,
  getApplicantDocumentRowState,
  getApplicantDocumentActionLabel,
  documentIconWrapClass,
} from "@/utils/applicantDocumentRows";
import {
  uploadStatusBadge,
  onboardingVerificationBadge,
} from "@/components/shared/requiredDocumentBadges";
import { hasUploadedFile } from "@/utils/onboardingDocumentRules";

export default function DocumentsStep({ applicationId, onboarding, maxAllowed }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [pendingUploadKey, setPendingUploadKey] = useState(null);
  const [expiryDraft, setExpiryDraft] = useState({});
  const [rowErrors, setRowErrors] = useState({});
  const [filter, setFilter] = useState("");
  const [submitError, setSubmitError] = useState("");

  const { data: application } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationsService.getById(applicationId),
    enabled: !!applicationId,
    staleTime: 15_000,
  });

  const allRows = useMemo(() => getAllDocumentTemplateRows(application), [application]);
  const visibleRows = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter((r) => (r.label || "").toLowerCase().includes(q));
  }, [allRows, filter]);

  const mandatoryKeys = useMemo(() => {
    const base = ["passport", "workAuth", "govId", "sin"];
    const adminReqIds = (application?.adminRequestedDocuments || []).map((r) => `adminreq_${r.id}`);
    return [...base, ...adminReqIds];
  }, [application?.adminRequestedDocuments]);

  const uploadedMandatorySet = useMemo(() => {
    const set = new Set();
    for (const key of mandatoryKeys) {
      const stored = application?.onboardingDocuments?.find((d) => d.templateKey === key);
      if (hasUploadedFile(stored)) set.add(key);
    }
    return set;
  }, [application?.onboardingDocuments, mandatoryKeys]);

  const allMandatoryUploaded = mandatoryKeys.every((k) => uploadedMandatorySet.has(k));
  const finalSubmitted = Boolean(onboarding?.finalSubmitted);

  const uploadMutation = useMutation({
    mutationFn: ({ key, file, expiry, name }) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("applicationId", applicationId);
      fd.append("templateKey", key);
      fd.append("name", name);
      if (expiry) fd.append("expiryDate", expiry);
      return documentsService.upsert(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
    },
    onError: (err, vars) => {
      setRowErrors((e) => ({ ...e, [vars.key]: err?.response?.data?.error?.message || "Upload failed. Try again." }));
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => onboardingService.submitDocuments(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding', applicationId] });
      navigate("/applicant/onboarding/3", { replace: true });
    },
    onError: (err) => {
      setSubmitError(err?.response?.data?.error?.message || "Please upload all mandatory documents first.");
    },
  });

  function handleUploadClick(rowKey) {
    setRowErrors((e) => ({ ...e, [rowKey]: "" }));
    setPendingUploadKey(rowKey);
    fileInputRef.current?.click();
  }

  function onFileSelected(event) {
    const file = event.target.files?.[0];
    const key = pendingUploadKey;
    event.target.value = "";
    setPendingUploadKey(null);
    if (!file || !key || !application) return;
    if (file.size > 10 * 1024 * 1024) {
      setRowErrors((e) => ({ ...e, [key]: "File must be 10MB or smaller." }));
      return;
    }
    const row = allRows.find((r) => r.key === key);
    const stored = application.onboardingDocuments?.find((d) => d.templateKey === key);
    const expiry = (stored?.expiryDate || expiryDraft[key] || "").trim();
    uploadMutation.mutate({ key, file, expiry, name: row?.label || key });
  }

  const rightPill = finalSubmitted
    ? "Locked · Submitted"
    : allMandatoryUploaded
      ? "All Mandatory Uploaded"
      : "Awaiting Uploads";

  return (
    <OnboardingShell
      stepNum={2}
      maxAllowed={maxAllowed}
      onNavigate={(n) => navigate(`/applicant/onboarding/${n}`)}
      eyebrow="Onboarding Journey"
      title="Required"
      titleAccent="Documents"
      rightPill={rightPill}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        className="hidden"
        onChange={onFileSelected}
      />

      <p className="text-sm text-on-surface-variant mb-6 max-w-3xl">
        Ensure all digital assets are uploaded and valid for the upcoming technical screening. All documents must be
        clearly legible and within their expiry dates.
      </p>

      <div className="rounded-2xl bg-white border border-outline-variant/10 shadow-sm overflow-hidden">
        <div className="p-5 flex items-center gap-4 border-b border-outline-variant/10">
          <div className="flex items-center gap-2 flex-1 rounded-lg bg-surface-container-lowest px-3 py-2">
            <span className="material-symbols-outlined text-on-surface-variant text-base">search</span>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter documents..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <span className="text-xs font-semibold text-on-surface-variant">
            {uploadedMandatorySet.size} / {mandatoryKeys.length} mandatory
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container-low/50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Document Name
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Expiry Date
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Verification
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-xs text-on-surface-variant">
                    Showing 0 of 0 required documents
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => {
                  const state = getApplicantDocumentRowState(application, row, expiryDraft);
                  const statusForBadge =
                    state.displayStatus === "not_uploaded_neutral" ? "not_uploaded" : state.displayStatus;
                  const hasFile = hasUploadedFile(state.stored);
                  const err = rowErrors[row.key];
                  const label = getApplicantDocumentActionLabel(row, state.stored, state.expiryValue);
                  return (
                    <tr key={row.key} className="hover:bg-surface-container-lowest/60">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={documentIconWrapClass(row, state.displayStatus)}>
                            <span
                              className="material-symbols-outlined text-lg"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {row.icon || "description"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-primary truncate">
                              {row.label}
                              {row.required ? <span className="ml-1 text-red-500">*</span> : null}
                            </p>
                            <p className="text-xs text-on-surface-variant truncate">{state.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">{uploadStatusBadge(statusForBadge)}</td>
                      <td className="px-6 py-5">
                        <input
                          type="date"
                          value={state.expiryValue}
                          disabled={finalSubmitted || state.verification === "verified"}
                          onChange={(e) =>
                            setExpiryDraft((d) => ({ ...d, [row.key]: e.target.value }))
                          }
                          className="w-36 rounded border border-outline-variant/20 bg-white px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="px-6 py-5">{onboardingVerificationBadge(state.verification)}</td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <button
                            type="button"
                            disabled={finalSubmitted || uploadMutation.isPending}
                            onClick={() => handleUploadClick(row.key)}
                            className={`rounded px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition disabled:opacity-50 ${
                              hasFile
                                ? "border border-primary text-primary hover:bg-primary hover:text-white"
                                : "bg-primary text-white hover:bg-secondary"
                            }`}
                          >
                            {label}
                          </button>
                          {err ? <p className="text-[10px] font-medium text-red-600">{err}</p> : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/applicant/onboarding/1")}
          className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Profile
        </button>
        <div className="flex items-center gap-6">
          <div className="text-right">
            {submitError ? (
              <p className="text-xs font-semibold text-error max-w-xs">{submitError}</p>
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Step Progress</p>
                <p className="text-sm font-bold text-primary">
                  {Math.round((uploadedMandatorySet.size / Math.max(1, mandatoryKeys.length)) * 100)}% Complete
                </p>
              </>
            )}
          </div>
          <button
            type="button"
            disabled={finalSubmitted || !allMandatoryUploaded || submitMutation.isPending}
            onClick={() => {
              setSubmitError("");
              submitMutation.mutate();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:opacity-95 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitMutation.isPending ? "Saving…" : "Next Step: Verification"}
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </OnboardingShell>
  );
}
