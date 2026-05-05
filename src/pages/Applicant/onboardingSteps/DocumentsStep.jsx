import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import OnboardingShell from "./OnboardingShell";
import { onboardingService } from "@/services/onboarding.service";
import { documentsService } from "@/services/documents.service";
import { applicationsService } from "@/services/applications.service";
import {
  getAllDocumentTemplateRows,
  getApplicantDocumentRowState,
  documentIconWrapClass,
} from "@/utils/applicantDocumentRows";
import AdminDocumentPreviewModal from "@/components/admin/AdminDocumentPreviewModal";
import ApplicantDocumentActionButtons from "@/components/applicant/ApplicantDocumentActionButtons";
import {
  uploadStatusBadge,
  onboardingVerificationBadge,
} from "@/components/shared/requiredDocumentBadges";
import { hasUploadedFile } from "@/utils/onboardingDocumentRules";
import { documentRowRequiresExpiryDate } from "@/constants/documentUploadRules";

const MIN_ACTION_MS = 600;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function isPastExpiryDate(value) {
  if (!value) return false;
  return String(value).slice(0, 10) < todayISO();
}

export default function DocumentsStep({ applicationId, onboarding, maxAllowed }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const pendingExpiryConfirmRef = useRef(null);
  const actionTimersRef = useRef([]);
  const [pendingUploadKey, setPendingUploadKey] = useState(null);
  const [expiryDraft, setExpiryDraft] = useState({});
  const [rowErrors, setRowErrors] = useState({});
  const [filter, setFilter] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [docPreview, setDocPreview] = useState(null);
  const [expiryConfirm, setExpiryConfirm] = useState(null);
  const [rowActionStates, setRowActionStates] = useState({});

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

  useEffect(() => {
    return () => {
      actionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function queueActionTimer(callback, delay) {
    const timer = window.setTimeout(callback, delay);
    actionTimersRef.current.push(timer);
    return timer;
  }

  function startRowAction(key, phase, message, extra = {}) {
    setRowActionStates((prev) => ({
      ...prev,
      [key]: { phase, message, startedAt: Date.now(), ...extra },
    }));
  }

  function updateRowAction(key, phase, message) {
    setRowActionStates((prev) => {
      const current = prev[key];
      if (!current) return prev;
      return { ...prev, [key]: { ...current, phase, message } };
    });
  }

  function finishRowAction(key, phase, message) {
    setRowActionStates((prev) => {
      const current = prev[key];
      if (!current) return prev;
      return { ...prev, [key]: { ...current, phase, message } };
    });
    const startedAt = rowActionStates[key]?.startedAt || Date.now();
    const remaining = Math.max(0, MIN_ACTION_MS - (Date.now() - startedAt));
    queueActionTimer(() => {
      setRowActionStates((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }, remaining);
  }

  function removeRowAction(key) {
    setRowActionStates((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  const uploadMutation = useMutation({
    mutationFn: ({ key, file, expiry, name }) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("applicationId", applicationId);
      fd.append("templateKey", key);
      fd.append("name", name);
      if (documentRowRequiresExpiryDate(key)) fd.append("expiryDate", String(expiry).trim().slice(0, 10));
      return documentsService.upsert(fd);
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ['application', applicationId] });
      const previousApplication = queryClient.getQueryData(['application', applicationId]);
      startRowAction(vars.key, "uploading", "Uploading document…", { fileName: vars.file?.name });
      queueActionTimer(() => updateRowAction(vars.key, "processing", "Processing upload…"), 250);
      queryClient.setQueryData(['application', applicationId], (old) => {
        if (!old) return old;
        const optimisticDoc = {
          id: `optimistic-${vars.key}`,
          templateKey: vars.key,
          name: vars.name,
          fileName: vars.file?.name || "Document",
          fileUrl: "",
          storagePath: "",
          expiryDate: vars.expiry,
          status: "uploaded",
          verification: "unapproved",
          uploadedAt: new Date().toISOString(),
        };
        const docs = old.onboardingDocuments || [];
        return {
          ...old,
          onboardingDocuments: [
            ...docs.filter((doc) => doc.templateKey !== vars.key),
            optimisticDoc,
          ],
        };
      });
      return { previousApplication };
    },
    onSuccess: (doc, vars) => {
      updateRowAction(vars.key, "processing", "Finalizing document…");
      queryClient.setQueryData(['application', applicationId], (old) => {
        if (!old || !doc) return old;
        const docs = old.onboardingDocuments || [];
        return {
          ...old,
          onboardingDocuments: [...docs.filter((item) => item.templateKey !== vars.key), doc],
        };
      });
      finishRowAction(vars.key, "uploaded", "Upload complete");
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
    },
    onError: (err, vars, context) => {
      if (context?.previousApplication) {
        queryClient.setQueryData(['application', applicationId], context.previousApplication);
      }
      removeRowAction(vars.key);
      setRowErrors((e) => ({ ...e, [vars.key]: err?.response?.data?.error?.message || "Upload failed. Try again." }));
    },
  });

  const clearDocumentMutation = useMutation({
    mutationFn: ({ id }) => documentsService.delete(id),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
      setRowErrors((e) => ({
        ...e,
        [vars.key]: "Changing expiry date requires re-uploading the document.",
      }));
    },
    onError: (err, vars) => {
      setRowErrors((e) => ({
        ...e,
        [vars.key]: err?.response?.data?.error?.message || "Could not clear this document. Please try again.",
      }));
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
    const row = allRows.find((r) => r.key === rowKey);
    const stored = application?.onboardingDocuments?.find((d) => d.templateKey === rowKey);
    const expiry = (expiryDraft[rowKey] || stored?.expiryDate || "").slice(0, 10);
    if (documentRowRequiresExpiryDate(rowKey)) {
      if (!expiry) {
        setRowErrors((e) => ({ ...e, [rowKey]: "Select an expiry date before uploading a document." }));
        return;
      }
      if (isPastExpiryDate(expiry)) {
        setRowErrors((e) => ({ ...e, [rowKey]: "Expiry date must be in the future" }));
        return;
      }
    }
    if (stored?.verification === "verified") {
      setRowErrors((e) => ({ ...e, [rowKey]: "Document approved. Changes are not allowed" }));
      return;
    }
    if (!row) return;
    setPendingUploadKey(rowKey);
    fileInputRef.current?.click();
  }

  function handleExpiryChange(row, stored, nextValue) {
    const key = row.key;
    const previousValue = (expiryDraft[key] || stored?.expiryDate || "").slice(0, 10);
    pendingExpiryConfirmRef.current = null;
    if (stored?.verification === "verified") {
      setRowErrors((e) => ({ ...e, [key]: "Document approved. Changes are not allowed" }));
      return;
    }
    if (isPastExpiryDate(nextValue)) {
      setRowErrors((e) => ({ ...e, [key]: "Expiry date must be in the future" }));
      setExpiryDraft((d) => ({ ...d, [key]: previousValue }));
      return;
    }
    if (hasUploadedFile(stored) && nextValue !== previousValue) {
      pendingExpiryConfirmRef.current = {
        key,
        documentId: stored.id,
        previousValue,
        nextValue,
        label: row.label,
      };
      return;
    }
    setExpiryDraft((d) => ({ ...d, [key]: nextValue }));
    setRowErrors((e) => ({ ...e, [key]: "" }));
  }

  function openPendingExpiryConfirm(rowKey) {
    const pending = pendingExpiryConfirmRef.current;
    if (!pending || pending.key !== rowKey) return;
    pendingExpiryConfirmRef.current = null;
    setExpiryConfirm(pending);
  }

  const openDocPreview = useCallback((stored, row) => {
    const href = (stored?.fileUrl && String(stored.fileUrl).trim()) || "";
    if (!href) return;
    setDocPreview({
      url: href,
      title: stored?.fileName || row?.label || "Document",
      downloadFileName: stored?.fileName || "document.pdf",
    });
  }, []);

  function onFileSelected(event) {
    const file = event.target.files?.[0];
    const key = pendingUploadKey;
    event.target.value = "";
    setPendingUploadKey(null);
    if (!file || !key || !application) return;
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setRowErrors((e) => ({
        ...e,
        [key]: "File exceeds the 2MB limit. Please upload a smaller file (under 2MB).",
      }));
      return;
    }
    const row = allRows.find((r) => r.key === key);
    const stored = application.onboardingDocuments?.find((d) => d.templateKey === key);
    const expiry = (expiryDraft[key] || stored?.expiryDate || "").trim();
    if (documentRowRequiresExpiryDate(key)) {
      if (!expiry) {
        setRowErrors((e) => ({ ...e, [key]: "Select an expiry date before uploading a document." }));
        return;
      }
      if (isPastExpiryDate(expiry)) {
        setRowErrors((e) => ({ ...e, [key]: "Expiry date must be in the future" }));
        return;
      }
    }
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
        If you already uploaded a document earlier (for example from your applicant dashboard), it appears here — use{" "}
        <strong>View</strong> to preview it. Upload only what is still missing. Each file must be clearly legible and at
        most 2MB. IDs and permits need a future expiry date before you can replace them; incorporation and banking items
        do not require an expiry date.
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
                  const rowAction = rowActionStates[row.key];
                  const statusForBadge =
                    rowAction?.phase === "uploading"
                      ? "uploading"
                      : rowAction?.phase === "processing"
                        ? "processing"
                        : rowAction?.phase === "uploaded"
                          ? "uploaded"
                          : state.displayStatus === "not_uploaded_neutral" ? "not_uploaded" : state.displayStatus;
                  const err = rowErrors[row.key];
                  const approved = state.verification === "verified";
                  const hasDocFile = hasUploadedFile(state.stored);
                  const uploadBlockedByExpiry =
                    documentRowRequiresExpiryDate(row.key) &&
                    (!state.expiryValue || isPastExpiryDate(state.expiryValue));
                  const interactionBusy =
                    finalSubmitted ||
                    Boolean(rowAction) ||
                    clearDocumentMutation.isPending ||
                    approved;
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
                            <p className="text-xs text-on-surface-variant truncate">
                              {rowAction?.fileName ? `${rowAction.fileName} • ${rowAction.message}` : state.subtitle}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">{uploadStatusBadge(statusForBadge)}</td>
                      <td className="px-6 py-5">
                        <input
                          type="date"
                          min={todayISO()}
                          value={state.expiryValue}
                          disabled={finalSubmitted || approved}
                          onChange={(e) => handleExpiryChange(row, state.stored, e.target.value)}
                          onBlur={() => openPendingExpiryConfirm(row.key)}
                          className="w-36 rounded border border-outline-variant/20 bg-white px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="px-6 py-5">{onboardingVerificationBadge(state.verification)}</td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <ApplicantDocumentActionButtons
                            row={row}
                            stored={state.stored}
                            expiryValue={state.expiryValue}
                            onOpenPreview={openDocPreview}
                            onUploadClick={handleUploadClick}
                            interactionBusy={interactionBusy}
                            uploadBlockedByExpiry={uploadBlockedByExpiry}
                            approved={approved}
                          />
                          {hasDocFile && uploadBlockedByExpiry && !approved ? (
                            <p className="text-[10px] text-amber-800 max-w-[14rem] text-right leading-snug">
                              Set a valid expiry date to replace this file. Preview is available anytime.
                            </p>
                          ) : null}
                          {approved ? (
                            <p className="text-[10px] font-medium text-on-surface-variant">
                              Document approved. Changes are not allowed
                            </p>
                          ) : null}
                          {rowAction?.message ? (
                            <p className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-700">
                              <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
                              {rowAction.message}
                            </p>
                          ) : null}
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
      <AdminDocumentPreviewModal
        open={docPreview != null}
        onClose={() => setDocPreview(null)}
        url={docPreview?.url || ""}
        title={docPreview?.title || "Document preview"}
        downloadFileName={docPreview?.downloadFileName}
        requireInterestForDownload
      />
      {expiryConfirm ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#000615]/35 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/30 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-primary">Re-upload required</h4>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                  Changing expiry date requires re-uploading the document
                  {expiryConfirm.label ? ` for ${expiryConfirm.label}` : ""}.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-primary hover:bg-slate-50"
                onClick={() => {
                  setExpiryDraft((d) => ({ ...d, [expiryConfirm.key]: expiryConfirm.previousValue }));
                  setExpiryConfirm(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-secondary"
                onClick={() => {
                  setExpiryDraft((d) => ({ ...d, [expiryConfirm.key]: expiryConfirm.nextValue }));
                  setRowErrors((e) => ({ ...e, [expiryConfirm.key]: "" }));
                  clearDocumentMutation.mutate({ id: expiryConfirm.documentId, key: expiryConfirm.key });
                  setExpiryConfirm(null);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </OnboardingShell>
  );
}
