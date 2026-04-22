import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import OnboardingShell from "./OnboardingShell";
import { onboardingService } from "@/services/onboarding.service";
import { applicationsService } from "@/services/applications.service";
import { getAllDocumentTemplateRows } from "@/utils/applicantDocumentRows";
import { hasUploadedFile, resolveDocVerification } from "@/utils/onboardingDocumentRules";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function splitName(name) {
  const parts = String(name || "").trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

const EDITABLE_FIELDS = ["firstName", "lastName", "phone", "dateOfBirth", "gender", "nationality"];

export default function ReviewStep({ applicationId, onboarding, maxAllowed }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [consent, setConsent] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [editDraft, setEditDraft] = useState("");

  const { data: application } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationsService.getById(applicationId),
    enabled: !!applicationId,
    staleTime: 15_000,
  });

  const rows = useMemo(() => getAllDocumentTemplateRows(application), [application]);
  const mandatoryUploaded = useMemo(() => {
    if (!application) return false;
    return rows
      .filter((r) => r.required)
      .every((r) => {
        const stored = application.onboardingDocuments?.find((d) => d.templateKey === r.key);
        return hasUploadedFile(stored);
      });
  }, [rows, application]);

  const profileComplete = Boolean(onboarding?.profileCompleted);
  const documentsComplete = Boolean(onboarding?.documentsCompleted);
  const bgvAcknowledged = Boolean(onboarding?.bgvApplicantAcknowledged);
  const finalSubmitted = Boolean(onboarding?.finalSubmitted);
  const canSubmit =
    consent && profileComplete && documentsComplete && bgvAcknowledged && mandatoryUploaded && !finalSubmitted;

  const patchMutation = useMutation({
    mutationFn: (payload) => onboardingService.patchProfile(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
      setEditingField(null);
      setEditDraft("");
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => onboardingService.finalSubmit(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
      navigate("/applicant/onboarding/5", { replace: true });
    },
    onError: (err) => {
      setSubmitError(err?.response?.data?.error?.message || "Unable to submit right now. Please try again.");
    },
  });

  if (!application) {
    return (
      <OnboardingShell
        stepNum={4}
        maxAllowed={maxAllowed}
        onNavigate={(n) => navigate(`/applicant/onboarding/${n}`)}
        eyebrow="Step 04 — Final Review"
        title="Review"
        titleAccent="& Submit"
      >
        <p className="text-on-surface-variant">Loading application…</p>
      </OnboardingShell>
    );
  }

  const { firstName, lastName } = splitName(application.name);

  function startEdit(field, currentValue) {
    if (finalSubmitted) return;
    setEditingField(field);
    setEditDraft(currentValue || "");
  }

  function saveEdit() {
    const payload = {};
    if (editingField === "firstName") payload.firstName = editDraft.trim();
    else if (editingField === "lastName") payload.lastName = editDraft.trim();
    else if (editingField === "phone") payload.phone = editDraft.trim();
    else if (editingField === "dateOfBirth") payload.dateOfBirth = editDraft;
    else if (editingField === "gender") payload.gender = editDraft.trim();
    else if (editingField === "nationality") payload.nationality = editDraft.trim();
    // firstName/lastName require the other side for the BE's name concat. Send both.
    if (editingField === "firstName") payload.lastName = lastName;
    if (editingField === "lastName") payload.firstName = firstName;
    if (!Object.keys(payload).length) return;
    patchMutation.mutate(payload);
  }

  return (
    <OnboardingShell
      stepNum={4}
      maxAllowed={maxAllowed}
      onNavigate={(n) => navigate(`/applicant/onboarding/${n}`)}
      eyebrow="Step 04 — Final Review"
      title="Review"
      titleAccent="& Submit"
    >
      <p className="text-sm text-on-surface-variant max-w-3xl mb-8">
        Please conduct a final review of your application data before submission. Accuracy at this stage accelerates the
        final onboarding phase.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-outline-variant/10 bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-headline text-xl font-bold text-primary">Profile Summary</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Core identity details. Tap any row to edit.
                </p>
              </div>
              {application.profilePhotoUrl ? (
                <img
                  src={application.profilePhotoUrl}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border border-outline-variant/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-primary-container text-white flex items-center justify-center font-bold">
                  {(firstName[0] || "?").toUpperCase()}
                  {(lastName[0] || "").toUpperCase()}
                </div>
              )}
            </div>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <EditableRow
                label="First Name"
                field="firstName"
                value={firstName}
                editingField={editingField}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                onEdit={startEdit}
                onSave={saveEdit}
                onCancel={() => setEditingField(null)}
                isPending={patchMutation.isPending}
                disabled={finalSubmitted}
              />
              <EditableRow
                label="Last Name"
                field="lastName"
                value={lastName}
                editingField={editingField}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                onEdit={startEdit}
                onSave={saveEdit}
                onCancel={() => setEditingField(null)}
                isPending={patchMutation.isPending}
                disabled={finalSubmitted}
              />
              <ReadOnlyRow label="Email" value={application.email || "—"} />
              <EditableRow
                label="Phone"
                field="phone"
                type="tel"
                value={application.phone}
                editingField={editingField}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                onEdit={startEdit}
                onSave={saveEdit}
                onCancel={() => setEditingField(null)}
                isPending={patchMutation.isPending}
                disabled={finalSubmitted}
              />
              <EditableRow
                label="Date of Birth"
                field="dateOfBirth"
                type="date"
                value={(application.dateOfBirth || "").slice(0, 10)}
                displayValue={formatDate(application.dateOfBirth)}
                editingField={editingField}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                onEdit={startEdit}
                onSave={saveEdit}
                onCancel={() => setEditingField(null)}
                isPending={patchMutation.isPending}
                disabled={finalSubmitted}
              />
              <EditableRow
                label="Gender"
                field="gender"
                value={application.gender || ""}
                editingField={editingField}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                onEdit={startEdit}
                onSave={saveEdit}
                onCancel={() => setEditingField(null)}
                isPending={patchMutation.isPending}
                disabled={finalSubmitted}
              />
              <EditableRow
                label="Nationality"
                field="nationality"
                value={application.nationality || ""}
                editingField={editingField}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                onEdit={startEdit}
                onSave={saveEdit}
                onCancel={() => setEditingField(null)}
                isPending={patchMutation.isPending}
                disabled={finalSubmitted}
              />
              <ReadOnlyRow label="Role" value={application.role || "—"} />
              <ReadOnlyRow label="Applied On" value={formatDate(application.appliedDate)} />
            </dl>
          </div>

          <div className="rounded-2xl border border-outline-variant/10 bg-white p-7 shadow-sm">
            <h3 className="font-headline text-xl font-bold text-primary mb-4">Document Status</h3>
            <ul className="divide-y divide-outline-variant/10">
              {rows.map((row) => {
                const stored = application.onboardingDocuments?.find((d) => d.templateKey === row.key);
                const uploaded = hasUploadedFile(stored);
                const v = resolveDocVerification(stored);
                return (
                  <li key={row.key} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">
                        {row.label}
                        {row.required ? <span className="ml-1 text-red-500">*</span> : null}
                      </p>
                      <p className="text-[11px] text-on-surface-variant truncate">
                        {uploaded ? stored?.fileName || "Uploaded" : "Not uploaded"}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        v === "verified"
                          ? "bg-green-100 text-green-800"
                          : uploaded
                            ? "bg-blue-100 text-blue-800"
                            : row.required
                              ? "bg-red-100 text-red-800"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {v === "verified" ? "Verified" : uploaded ? "Uploaded" : row.required ? "Missing" : "Optional"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-outline-variant/10 bg-white p-6 shadow-sm">
            <h3 className="font-headline text-base font-bold text-primary mb-4">Final Submission</h3>
            <label className="flex items-start gap-3 text-sm text-on-surface-variant cursor-pointer">
              <input
                type="checkbox"
                className="mt-1"
                checked={consent}
                disabled={finalSubmitted}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                I confirm that all information provided is correct and understand that false information may lead to
                rejection.
              </span>
            </label>
            <button
              type="button"
              disabled={!canSubmit || submitMutation.isPending}
              onClick={() => {
                setSubmitError("");
                submitMutation.mutate();
              }}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:opacity-95 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitMutation.isPending ? "Submitting…" : "Submit for Approval"}
              <span className="material-symbols-outlined text-base">send</span>
            </button>
            {submitError ? (
              <p className="mt-3 text-xs text-error font-medium">{submitError}</p>
            ) : (
              <p className="mt-3 text-[11px] text-on-surface-variant">
                After submission your application will be marked{" "}
                <span className="font-semibold text-primary">Pending Admin Approval</span>.
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-primary-container text-white p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-2">Verification Engine</p>
            <p className="text-sm leading-relaxed">
              Background Verification (BGV) process has been initiated with global screening partners.
            </p>
            <div className="mt-4 space-y-1.5 text-xs">
              <StatusLine label="Profile" done={profileComplete} />
              <StatusLine label="Documents" done={documentsComplete} />
              <StatusLine label="Verification" done={bgvAcknowledged} />
            </div>
          </div>

          <div className="rounded-2xl border border-outline-variant/10 bg-white p-5 text-center">
            <span className="material-symbols-outlined text-primary">lock</span>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Security Protocol
            </p>
            <p className="text-xs text-on-surface-variant mt-1">256-bit encrypted secure data transmission.</p>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

function ReadOnlyRow({ label, value }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-widest text-outline">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-primary break-words">{value || "—"}</dd>
    </div>
  );
}

function EditableRow({
  label,
  field,
  type = "text",
  value,
  displayValue,
  editingField,
  editDraft,
  setEditDraft,
  onEdit,
  onSave,
  onCancel,
  isPending,
  disabled,
}) {
  const isEditing = editingField === field;
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-widest text-outline flex items-center justify-between">
        <span>{label}</span>
        {!isEditing && !disabled ? (
          <button
            type="button"
            onClick={() => onEdit(field, value)}
            className="text-secondary text-[10px] font-bold uppercase hover:underline"
          >
            Edit
          </button>
        ) : null}
      </dt>
      {isEditing ? (
        <div className="mt-1 flex items-center gap-2">
          <input
            type={type}
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            autoFocus
            className="flex-1 rounded border border-outline-variant/30 bg-white px-2 py-1.5 text-sm"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={onSave}
            className="rounded bg-primary text-white text-[10px] font-bold uppercase px-2.5 py-1.5 disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onCancel}
            className="text-[10px] font-bold uppercase text-on-surface-variant"
          >
            Cancel
          </button>
        </div>
      ) : (
        <dd className="mt-1 text-sm font-semibold text-primary break-words">
          {displayValue != null ? displayValue : value || "—"}
        </dd>
      )}
    </div>
  );
}

function StatusLine({ label, done }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${done ? "bg-green-400" : "bg-amber-400"}`}></span>
      <span>
        {label}: <span className="font-semibold">{done ? "Complete" : "Pending"}</span>
      </span>
    </div>
  );
}
