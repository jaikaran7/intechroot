import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsService } from "../../../services/applications.service";
import { documentsService } from "../../../services/documents.service";
import { onboardingService } from "../../../services/onboarding.service";
import AdminDocumentApproval from "./applicationReview/AdminDocumentApproval";
import AdminFinalApproval from "./applicationReview/AdminFinalApproval";
import AdminProfileReview from "./applicationReview/AdminProfileReview";
import {
  documentIconWrapClass,
  formatDocumentSubtitle,
  formatExpiryForDisplay,
  getAllDocumentTemplateRows,
} from "@/utils/applicantDocumentRows";
import { onboardingVerificationBadge, uploadStatusBadge } from "@/components/shared/requiredDocumentBadges";
import { getRowUploadStatusKey, hasUploadedFile, resolveDocVerification } from "@/utils/onboardingDocumentRules";
import PageSkeleton from "../../../components/PageSkeleton";
import ErrorState from "../../../components/ErrorState";
import AdminDocumentPreviewModal from "@/components/admin/AdminDocumentPreviewModal";
import EntityAvatar from "@/components/shared/EntityAvatar";
import {
  compactUrlLabel,
  formatAppliedDateDisplay,
  normalizeExternalHref,
} from "@/utils/applicantDisplayHelpers";
import { useAuthStore } from "@/store/authStore";

const OFFER_STAGE_INDEX = 4; // "Offer & Onboarding" stage

/** LinkedIn “in” mark (monochrome via currentColor). */
function LinkedInLogoIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function isLinkedInUrl(href) {
  return Boolean(href && /linkedin\.com/i.test(String(href)));
}

/** Admin onboarding wizard step: 1=profile, 2=documents, 3=final hire */
function getOnboardingAdminStep(onboarding) {
  const ob = onboarding || {};
  if (!ob.adminProfileApproved) return 1;
  if (!ob.documentsCompleted) return 2;
  return 3;
}
const INTERVIEW_TYPES = ["Technical", "Client", "Culture Fit", "HR", "Final"];

function formatTimeFromInput(time24) {
  if (!time24 || typeof time24 !== "string") return "";
  const [h, m] = time24.split(":").map((x) => Number(x));
  if (!Number.isFinite(h)) return time24;
  const d = new Date(2000, 0, 1, h, Number.isFinite(m) ? m : 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

/** Map stored display time (e.g. "2:36 AM") back to <input type="time" value. */
function displayTimeToTimeInput(displayTime) {
  if (!displayTime || typeof displayTime !== "string") return "";
  const t = displayTime.trim();
  if (/^\d{1,2}:\d{2}$/.test(t)) {
    const [h, m] = t.split(":").map((x) => Number(x));
    if (Number.isFinite(h) && Number.isFinite(m)) {
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }
  }
  const parsed = new Date(`January 1, 2000 ${t}`);
  if (!Number.isNaN(parsed.getTime())) {
    return `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`;
  }
  return "";
}

function formatMessageWhen(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Match server normalization so pasted host-only links persist and appear on the applicant dashboard. */
function normalizeInterviewMeetingLink(raw) {
  const s = (raw || "").trim();
  if (!s) return "";
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(s)) return s;
  return `https://${s}`;
}

function formatInterviewSaveError(err) {
  const details = err?.response?.data?.error?.details;
  if (Array.isArray(details) && details.length) {
    return details.map((d) => (d.field ? `${d.field}: ${d.message}` : d.message)).join(" · ");
  }
  return err?.response?.data?.error?.message || "Unable to save interview.";
}

function resolveInterviewTypeForForm(iv) {
  if (!iv) return INTERVIEW_TYPES[0];
  if (iv.type && INTERVIEW_TYPES.includes(iv.type)) return iv.type;
  if (iv.title && INTERVIEW_TYPES.includes(iv.title)) return iv.title;
  return INTERVIEW_TYPES[0];
}

function formatInterviewWhen(iv) {
  const d = iv?.date ? new Date(`${iv.date}T12:00:00`) : null;
  const dateStr =
    d && !Number.isNaN(d.getTime())
      ? d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "";
  return [dateStr, iv?.time].filter(Boolean).join(", ");
}

function interviewStatusBadge(status) {
  const s = String(status || "").toLowerCase();
  if (s === "completed")
    return <span className="text-[10px] font-bold uppercase text-green-700">Completed</span>;
  return <span className="text-[10px] font-bold uppercase text-secondary">Scheduled</span>;
}

export default function ApplicationProfile() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("details");
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [isMessageSentPopupOpen, setIsMessageSentPopupOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  /** When set, interview modal updates this row instead of creating a new one. */
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [stageMoveError, setStageMoveError] = useState("");
  const [documentVerifyError, setDocumentVerifyError] = useState("");
  const [hireMessage, setHireMessage] = useState("");
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingNote, setOnboardingNote] = useState("");
  const [onboardingGateBusy, setOnboardingGateBusy] = useState(false);
  const [documentPreview, setDocumentPreview] = useState(null);
  // Admin may freely move between stages via the stage switcher — null falls back to derived step.
  const [forcedOnboardingStep, setForcedOnboardingStep] = useState(null);
  const { user } = useAuthStore();

  // ── API data ──────────────────────────────────────────────
  const { data: applicationData, isLoading, isError, refetch } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationsService.getById(id),
    staleTime: 20_000,
    enabled: !!id,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['applications'] });
    queryClient.invalidateQueries({ queryKey: ['application', id] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
  };

  const advanceStageMutation = useMutation({
    mutationFn: (note) => applicationsService.advanceStage(id, note),
    onSuccess: invalidate,
    onError: (err) => setStageMoveError(err.response?.data?.error?.message || "Unable to advance stage."),
  });

  const hireMutation = useMutation({
    mutationFn: () => applicationsService.hire(id),
    onSuccess: () => {
      setHireMessage("Applicant successfully hired and converted to employee.");
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (err) => setHireMessage(err.response?.data?.error?.message || "Hire failed."),
  });

  const rejectMutation = useMutation({
    mutationFn: () => applicationsService.rejectApplication(id),
    onSuccess: () => {
      setHireMessage("Application rejected. The applicant has been notified.");
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (err) => setHireMessage(err.response?.data?.error?.message || "Failed to reject application."),
  });

  const addInterviewMutation = useMutation({
    mutationFn: (data) => applicationsService.createInterview(id, data),
  });

  const updateInterviewMutation = useMutation({
    mutationFn: ({ iid, data }) => applicationsService.updateInterview(id, iid, data),
  });

  const verifyDocumentMutation = useMutation({
    mutationFn: ({ documentId, verification }) => documentsService.verify(documentId, verification),
    onSuccess: () => {
      setDocumentVerifyError("");
      queryClient.invalidateQueries({ queryKey: ['application', id] });
    },
    onError: (err) => {
      setDocumentVerifyError(err?.response?.data?.error?.message || "Could not update document verification.");
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (text) => applicationsService.createMessage(id, text),
    onSuccess: () => {
      setMessageDraft("");
      setIsMessageModalOpen(false);
      setIsMessageSentPopupOpen(true);
      invalidate();
    },
  });
  const [interviewForm, setInterviewForm] = useState({
    type: INTERVIEW_TYPES[0],
    date: "",
    time: "",
    link: "",
    notes: "",
  });
  const [interviewModalError, setInterviewModalError] = useState("");
  useEffect(() => {
    if (!isMessageSentPopupOpen) return undefined;
    const timeout = window.setTimeout(() => setIsMessageSentPopupOpen(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [isMessageSentPopupOpen]);
  const getDisplayValue = (value) => (value ? value : "Not Provided");

  const ALL_STAGES = [
    'Application Submitted',
    'Profile Screening',
    'Technical Evaluation',
    'Client Interview',
    'Offer & Onboarding',
  ];
  const stages = ALL_STAGES.map((name) => ({
    name,
    date: applicationData?.stages?.find((s) => s.name === name)?.date ?? '',
  }));
  const stageIndex = Number.isFinite(Number(applicationData?.currentStageIndex))
    ? applicationData.currentStageIndex
    : 0;
  const isEmployee =
    applicationData?.lifecycleStage === "employee" ||
    applicationData?.status === "Employee";

  const journeyStages = useMemo(() => {
    const base = ALL_STAGES.map((name) => ({
      name,
      date: applicationData?.stages?.find((s) => s.name === name)?.date ?? "",
    }));
    if (applicationData?.lifecycleStage === "employee") {
      return [...base, { name: "Employee", date: "Hired" }];
    }
    return base;
  }, [applicationData]);

  const activeJourneyIndex = isEmployee ? journeyStages.length - 1 : stageIndex;

  const journeyProgressPercent =
    journeyStages.length > 1 ? (activeJourneyIndex / (journeyStages.length - 1)) * 100 : 0;

  const atFinalPipelineStage = stageIndex >= OFFER_STAGE_INDEX;
  const needsOnboardingPortalEnable =
    !isEmployee && atFinalPipelineStage && !Boolean(applicationData?.onboarding?.enabled);

  const moveToNextDisabled =
    applicationData?.lifecycleStage === "employee" ||
    atFinalPipelineStage ||
    advanceStageMutation.isPending;

  const handleConfirmOnboarding = async () => {
    setStageMoveError("");
    setOnboardingGateBusy(true);
    try {
      await applicationsService.advanceStage(id, onboardingNote);
      await onboardingService.enableOnboarding(id);
      invalidate();
      setShowOnboardingModal(false);
      setOnboardingNote("");
    } catch (err) {
      const msg = String(err.response?.data?.error?.message || err.message || "");
      if (/final stage/i.test(msg)) {
        try {
          await onboardingService.enableOnboarding(id);
          invalidate();
          setShowOnboardingModal(false);
          setOnboardingNote("");
        } catch (e2) {
          setStageMoveError(
            e2.response?.data?.error?.message ||
              "Stage is already at Offer & Onboarding, but enabling the portal failed. Use Enable onboarding portal below.",
          );
        }
      } else {
        setStageMoveError(
          msg ||
            "Could not advance to offer or enable the onboarding portal. Try again, or use Enable onboarding below if the stage already moved.",
        );
      }
    } finally {
      setOnboardingGateBusy(false);
    }
  };

  const handleEnableOnboardingOnly = async () => {
    setStageMoveError("");
    setOnboardingGateBusy(true);
    try {
      await onboardingService.enableOnboarding(id);
      invalidate();
    } catch (err) {
      setStageMoveError(err.response?.data?.error?.message || "Failed to enable onboarding portal.");
    } finally {
      setOnboardingGateBusy(false);
    }
  };

  const handleMoveToNextStage = () => {
    setStageMoveError("");
    // Moving from Client Interview (index 3) → Offer & Onboarding requires enable onboarding
    if (stageIndex === 3) {
      setOnboardingNote("");
      setShowOnboardingModal(true);
      return;
    }
    advanceStageMutation.mutate();
  };
  const handleSendMessage = () => {
    if (!messageDraft.trim()) return;
    sendMessageMutation.mutate(messageDraft.trim());
  };
  const openNewInterviewModal = () => {
    setInterviewModalError("");
    setRescheduleTarget(null);
    setInterviewForm({ type: INTERVIEW_TYPES[0], date: "", time: "", link: "", notes: "" });
    setIsInterviewModalOpen(true);
  };

  const openRescheduleInterviewModal = (iv, index) => {
    setInterviewModalError("");
    setRescheduleTarget({ id: iv?.id ?? null, index });
    setInterviewForm({
      type: resolveInterviewTypeForForm(iv),
      date: iv?.date || "",
      time: displayTimeToTimeInput(iv?.time) || "",
      link: iv?.link || "",
      notes: iv?.notes || "",
    });
    setIsInterviewModalOpen(true);
  };

  const closeInterviewModal = () => {
    setInterviewModalError("");
    setRescheduleTarget(null);
    setIsInterviewModalOpen(false);
    setInterviewForm({ type: INTERVIEW_TYPES[0], date: "", time: "", link: "", notes: "" });
  };

  const handleScheduleInterviewSubmit = () => {
    if (!applicationData) return;
    setInterviewModalError("");
    const displayTime = formatTimeFromInput(interviewForm.time);
    const linkTrimmed = interviewForm.link?.trim() || "";
    const linkNormalized = linkTrimmed ? normalizeInterviewMeetingLink(linkTrimmed) : "";
    const payload = {
      title: interviewForm.type,
      type: interviewForm.type,
      date: interviewForm.date,
      time: displayTime || interviewForm.time,
      ...(linkNormalized && { link: linkNormalized }),
      ...(interviewForm.notes?.trim() && { notes: interviewForm.notes.trim() }),
    };

    const onInterviewSaved = () => {
      setInterviewModalError("");
      invalidate();
      closeInterviewModal();
    };
    const onInterviewSaveError = (err) => setInterviewModalError(formatInterviewSaveError(err));

    if (rescheduleTarget?.id) {
      updateInterviewMutation.mutate(
        { iid: rescheduleTarget.id, data: { ...payload, status: "scheduled" } },
        { onSuccess: onInterviewSaved, onError: onInterviewSaveError }
      );
    } else {
      addInterviewMutation.mutate(payload, { onSuccess: onInterviewSaved, onError: onInterviewSaveError });
    }
  };

  const recentMessagesSorted = useMemo(() => {
    const list = [...(applicationData?.messages || [])];
    list.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    return list.slice(0, 12);
  }, [applicationData?.messages]);

  const derivedOnboardingStep = getOnboardingAdminStep(applicationData?.onboarding);
  useEffect(() => {
    if (forcedOnboardingStep == null) return;
    if (forcedOnboardingStep > derivedOnboardingStep) {
      setForcedOnboardingStep(derivedOnboardingStep);
    }
  }, [forcedOnboardingStep, derivedOnboardingStep]);

  if (isLoading) return <main className="ml-64 pt-24 px-12"><PageSkeleton rows={8} /></main>;
  if (isError) return <main className="ml-64 pt-24 px-12"><ErrorState message="Failed to load application." onRetry={refetch} /></main>;
  if (!applicationData) return <main className="ml-64 pt-24 px-12"><p className="text-on-surface-variant">Application not found.</p></main>;

  const linkedInTrim = (applicationData.linkedIn || "").trim();
  const portfolioTrim = (
    (applicationData.portfolio != null && String(applicationData.portfolio).trim()) ||
    (applicationData.documents?.portfolio != null && String(applicationData.documents.portfolio).trim()) ||
    ""
  ).trim();
  const primaryWebHref = linkedInTrim
    ? normalizeExternalHref(linkedInTrim)
    : portfolioTrim
      ? normalizeExternalHref(portfolioTrim)
      : "";
  const primaryWebLabel = linkedInTrim
    ? compactUrlLabel(linkedInTrim)
    : portfolioTrim
      ? compactUrlLabel(portfolioTrim)
      : "";

  /** Offer stage uses lifecycle `offer` until enable runs (`onboarding`). Any `enabled` means show admin onboarding tools. */
  const isOnboardingAdminView =
    Boolean(applicationData.onboarding?.enabled) && !isEmployee;
  const onboardingAdminStep = forcedOnboardingStep ?? derivedOnboardingStep;

  const onboardingStepName =
    onboardingAdminStep === 1
      ? "Profile Review"
      : onboardingAdminStep === 2
        ? "Document Approval"
        : "Final Approval";

  const handleAdminApproveProfile = () => {
    setStageMoveError("");
    onboardingService
      .adminApproveProfile(id)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['application', id] });
        setForcedOnboardingStep(2);
      })
      .catch((err) => {
        setStageMoveError(err.response?.data?.error?.message || "Could not approve profile.");
      });
  };
  const handleAdminApproveDocuments = () => {
    onboardingService.adminApproveDocuments(id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      setForcedOnboardingStep(3);
    }).catch((err) => {
      setStageMoveError(err.response?.data?.error?.message || "Failed to approve documents.");
    });
  };
  const handleFinalHire = () => {
    hireMutation.mutate();
  };

  return (
    <>
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-white/60 backdrop-blur-xl border-b border-slate-200/15 flex items-center justify-between px-8 h-16 shadow-[0_40px_40px_rgba(0,6,21,0.04)]">
      <div className="flex items-center bg-surface-container rounded-full px-4 py-1.5 w-96 group transition-all focus-within:ring-2 focus-within:ring-tertiary-fixed-dim/20">
      <span className="material-symbols-outlined text-outline text-sm" data-icon="search">search</span>
      <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline font-['Inter']" placeholder="Search applicants, roles, or skills..." type="text"/>
      </div>
      <div className="flex items-center gap-6">
      <button className="relative p-2 text-slate-500 hover:bg-slate-100/50 rounded-full transition-all active:scale-95 duration-200">
      <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
      <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
      </button>
      <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
      <div className="text-right">
      <p className="text-sm font-semibold text-slate-900">{user?.name || "Admin"}</p>
      <p className="text-[10px] uppercase tracking-widest text-slate-500">
        {(user?.role && String(user.role).replace(/_/g, " ")) || "Administrator"}
      </p>
      </div>
      <EntityAvatar name={user?.name || user?.email || "Admin"} size="md" className="ring-2 ring-slate-100" />
      </div>
      </div>
      </header>

      <main className="ml-64 pt-24 pb-12 px-12 min-h-screen">

      <nav className="flex items-center gap-2 text-xs font-medium text-outline mb-8 tracking-wide flex-wrap">
      <Link className="hover:text-primary transition-colors" to="/admin">Dashboard</Link>
      <span className="material-symbols-outlined text-[14px]" data-icon="chevron_right">chevron_right</span>
      <Link className="hover:text-primary transition-colors" to="/admin/applications">Applications</Link>
      <span className="material-symbols-outlined text-[14px]" data-icon="chevron_right">chevron_right</span>
      {isOnboardingAdminView ? (
        <>
          <Link className="hover:text-primary transition-colors" to={`/admin/applications/${id}`}>
            Applicant Profile
          </Link>
          <span className="material-symbols-outlined text-[14px]" data-icon="chevron_right">chevron_right</span>
          <span className="text-on-surface-variant">Onboarding Process</span>
          <span className="material-symbols-outlined text-[14px]" data-icon="chevron_right">chevron_right</span>
          <span className="text-primary-container">{onboardingStepName}</span>
        </>
      ) : (
        <span className="text-primary-container">Applicant Profile</span>
      )}
      </nav>

      {stageMoveError && isOnboardingAdminView ? (
        <div className="mb-6 rounded-xl border border-error/30 bg-error-container/10 px-6 py-4 text-sm font-semibold text-error">
          {stageMoveError}
        </div>
      ) : null}

      {isOnboardingAdminView ? (
        <div className="w-full">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              {[
                { step: 1, label: "Profile" },
                { step: 2, label: "Documents" },
                { step: 3, label: "Final" },
              ].map((stage, idx) => {
                const active = onboardingAdminStep === stage.step;
                const enabled = stage.step <= derivedOnboardingStep;
                return (
                  <button
                    key={stage.step}
                    type="button"
                    disabled={!enabled}
                    onClick={() => {
                      if (!enabled) return;
                      setForcedOnboardingStep(stage.step);
                    }}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      active
                        ? "bg-primary text-white border-primary"
                        : enabled
                          ? "bg-white text-primary border-outline-variant/40 hover:bg-surface-container-low"
                          : "bg-surface-container-low text-outline border-outline-variant/30 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <span className="mr-2 opacity-70">0{idx + 1}</span>
                    {stage.label}
                  </button>
                );
              })}
            </div>
            <Link
              to={`/admin/applications/${id}`}
              onClick={() => setForcedOnboardingStep(null)}
              className="text-xs font-bold text-primary underline-offset-4 hover:underline"
            >
              ← Back to applicant detail
            </Link>
          </div>
          {onboardingAdminStep === 1 && (
            <AdminProfileReview application={applicationData} onApproveProfile={handleAdminApproveProfile} />
          )}
          {onboardingAdminStep === 2 && (
            <AdminDocumentApproval application={applicationData} onApproveDocuments={handleAdminApproveDocuments} />
          )}
          {onboardingAdminStep === 3 && (
            <AdminFinalApproval
              application={applicationData}
              onFinalHire={handleFinalHire}
              onReject={() => rejectMutation.mutate()}
              rejectPending={rejectMutation.isPending}
              hireMessage={hireMessage}
            />
          )}
        </div>
      ) : (
        <>
      <section className="relative mb-12 rounded-xl overflow-hidden monolith-shadow">
      <div className="absolute inset-0 bg-primary-container overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#4cd7f6_0%,transparent_70%)]"></div>
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-tertiary-fixed-dim/10 rounded-full blur-[120px]"></div>
      </div>
      <div className="relative z-10 p-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-8">
      <div className="flex items-center gap-8">
      <div className="relative">
      <EntityAvatar
      name={applicationData.name}
      size="hero"
      rounded="xl"
      className="ring-4 ring-white/10"
      title={applicationData.name || "Applicant"}
      />
      <div className="absolute -bottom-2 -right-2 bg-tertiary-fixed-dim text-on-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase shadow-lg">
                                  Verified
                              </div>
      </div>
      <div>
      <div className="flex items-center gap-3 mb-2">
      <h2 className="font-headline font-extrabold text-4xl text-white tracking-tight">{applicationData.name}</h2>
      <span className="px-3 py-1 bg-tertiary-container text-tertiary-fixed text-xs font-semibold rounded-full border border-tertiary-fixed/20">
                                      {isEmployee ? "Employee" : stages[stageIndex]?.name}
                                  </span>
      </div>
      <p className="font-headline text-lg text-primary-fixed-dim mb-4">{applicationData.role}</p>
      <div className="flex flex-wrap gap-5 text-sm text-white/70">
      <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-tertiary-fixed-dim text-lg" data-icon="location_on">location_on</span>
                                      {applicationData.location}
                                  </div>
      <div className="flex items-center gap-2 min-w-0">
      {primaryWebHref ? (
        linkedInTrim || isLinkedInUrl(primaryWebHref) ? (
          <LinkedInLogoIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-tertiary-fixed-dim" />
        ) : (
          <span className="material-symbols-outlined text-tertiary-fixed-dim text-lg shrink-0" data-icon="link">link</span>
        )
      ) : (
        <span className="material-symbols-outlined text-tertiary-fixed-dim text-lg shrink-0 opacity-40" data-icon="link_off">link_off</span>
      )}
      {primaryWebHref ? (
      <a
      href={primaryWebHref}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white underline underline-offset-4 decoration-tertiary-fixed-dim/30 transition-all truncate break-all"
      >
      {primaryWebLabel}
      </a>
      ) : (
      <span className="text-white/60">Not provided</span>
      )}
      </div>
      </div>
      </div>
      </div>
      <div className="flex flex-col items-end gap-3">
      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Application Date</p>
      <p className="text-white font-medium">{formatAppliedDateDisplay(applicationData.appliedDate)}</p>
      <div className="flex gap-2 mt-2">
      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-all">
      <span className="material-symbols-outlined" data-icon="share">share</span>
      </button>
      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-all">
      <span className="material-symbols-outlined" data-icon="download">download</span>
      </button>
      </div>
      </div>
      </div>
      </section>

      <div className="grid grid-cols-12 gap-8 items-start">

      <div className="col-span-12 lg:col-span-8 space-y-8">

      <div className="glass-card rounded-xl p-8 monolith-shadow">
      <h3 className="font-headline font-bold text-xl mb-8 flex items-center gap-3">
      <span className="material-symbols-outlined text-secondary" data-icon="route">route</span>
                              Application Journey
                          </h3>
      <div className="flex items-center justify-between relative px-4">
      <div className="absolute top-5 left-12 right-12 h-0.5 bg-surface-container-high z-0"></div>
      <div className="absolute top-5 left-12 h-0.5 bg-secondary z-0" style={{ width: `calc((100% - 6rem) * ${journeyProgressPercent}%)` }}></div>
      {journeyStages.map((stage, index) => (
      <div className="relative z-10 flex flex-col items-center gap-3 group" key={`${stage.name}-${index}`}>
      {index < activeJourneyIndex ? (
      <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg shadow-secondary/20">
      <span className="material-symbols-outlined text-xl" data-icon="check" style={{fontVariationSettings: "'wght' 700"}}>check</span>
      </div>
      ) : index === activeJourneyIndex ? (
      <div className="w-10 h-10 rounded-full bg-white border-4 border-secondary text-secondary flex items-center justify-center ring-8 ring-secondary/10">
      <span className="material-symbols-outlined text-xl" data-icon="diversity_3">diversity_3</span>
      </div>
      ) : (
      <div className="w-10 h-10 rounded-full bg-surface-container-high text-outline flex items-center justify-center">
      <span className="material-symbols-outlined text-xl" data-icon="flag">flag</span>
      </div>
      )}
      <div className="text-center">
      <p className={`text-xs font-bold uppercase tracking-wider ${index < activeJourneyIndex ? "text-secondary" : index === activeJourneyIndex ? "text-primary" : ""}`}>{stage.name}</p>
      <p className={`text-[10px] ${index === activeJourneyIndex ? "text-on-tertiary-fixed-variant font-medium" : "text-outline"}`}>{stage.date}</p>
      </div>
      </div>
      ))}
      </div>
      </div>

      {needsOnboardingPortalEnable ? (
        <div className="mb-6 rounded-xl border border-amber-200/80 bg-amber-50/90 px-6 py-4 text-sm text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-100">
          <p className="font-bold text-primary dark:text-white mb-1">Onboarding portal is not enabled yet</p>
          <p className="text-on-surface-variant dark:text-amber-100/90 mb-4 max-w-3xl">
            This applicant is already at Offer &amp; Onboarding in the pipeline, but they cannot open the onboarding checklist until you enable it. Use the button below (for example if a previous attempt failed after the stage moved).
          </p>
          <button
            type="button"
            disabled={onboardingGateBusy}
            onClick={handleEnableOnboardingOnly}
            className="rounded-lg bg-primary-container px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
          >
            {onboardingGateBusy ? "Enabling…" : "Enable onboarding portal"}
          </button>
        </div>
      ) : null}

      <footer className="bg-primary-container/5 rounded-xl p-6 border border-primary-container/10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
      <button className="w-full px-6 py-3 border border-primary-container text-primary-container font-bold text-sm rounded-lg hover:bg-primary-container/5 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed" disabled={moveToNextDisabled} onClick={handleMoveToNextStage} type="button">
                          Move to Next Stage
                      </button>
      <button className="w-full px-6 py-3 border border-primary-container text-primary-container font-bold text-sm rounded-lg hover:bg-primary-container/5 transition-all active:scale-95 flex items-center justify-center gap-2" onClick={openNewInterviewModal} type="button">
      <span className="material-symbols-outlined text-sm" data-icon="calendar_today">calendar_today</span>
                          Schedule Interview
                      </button>
      <button className="w-full px-6 py-3 border border-primary-container text-primary-container font-bold text-sm rounded-lg hover:bg-primary-container/5 transition-all active:scale-95 flex items-center justify-center gap-2" onClick={() => setIsMessageModalOpen(true)} type="button">
      <span className="material-symbols-outlined text-sm" data-icon="mail">mail</span>
                          Send Message
                      </button>
      </div>
      </footer>

      {stageMoveError ? (
        <div className="mb-6 rounded-xl border border-error/30 bg-error-container/10 px-6 py-4 text-sm font-semibold text-error">
          {stageMoveError}
        </div>
      ) : null}

      {applicationData.employeeId && (applicationData.timesheets || []).length > 0 ? (
        <div className="glass-card rounded-xl p-8 monolith-shadow mb-8">
          <h3 className="font-headline font-bold text-xl mb-4">Timesheets (synced from employee portal)</h3>
          <div className="overflow-x-auto rounded-lg border border-outline-variant/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low/50 text-[10px] uppercase tracking-widest text-outline">
                <tr>
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {(applicationData.timesheets || []).map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-3 font-medium text-primary">{t.dateRange || t.weekStart || "—"}</td>
                    <td className="px-4 py-3">{Number(t.total || 0).toFixed(1)}</td>
                    <td className="px-4 py-3 capitalize">{t.status || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="glass-card rounded-xl p-8 monolith-shadow">
      <div className="flex items-center gap-3 mb-6">
      <span className="material-symbols-outlined text-secondary" data-icon="history_edu">history_edu</span>
      <h3 className="font-headline font-bold text-xl">Application Details</h3>
      </div>
      <div className="flex flex-wrap gap-8 border-b border-outline-variant/20">
      {[
        { key: "details", label: "Application Details" },
        { key: "documents", label: "Document Verification" },
        { key: "info", label: "Applicant Info" },
      ].map((tab) => (
      <button
      key={tab.key}
      type="button"
      onClick={() => setActiveTab(tab.key)}
      className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
        activeTab === tab.key
          ? "text-secondary border-secondary"
          : "text-outline border-transparent hover:text-on-surface-variant"
      }`}
      >
      {tab.label}
      </button>
      ))}
      </div>
      <div className="pt-8">
      {activeTab === "details" && (
      <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-6">Application Assets</p>
      <div className="space-y-4">
      {[
        {
          key: "resume",
          icon: "picture_as_pdf",
          iconWrap: "bg-red-50 text-red-600",
          title: `${(applicationData.name || "Candidate").replace(/\s+/g, "_")}_Resume_2024.pdf`,
          meta: "PDF • 2.4 MB",
          href: applicationData.documents?.resume,
          action: "View Document",
        },
        {
          key: "cover",
          icon: "description",
          iconWrap: "bg-secondary/10 text-secondary",
          title: `Cover_Letter_${(applicationData.role || "Role").replace(/\s+/g, "_")}.pdf`,
          meta: "PDF • 1.1 MB",
          href: applicationData.documents?.coverLetter,
          action: "View Document",
        },
        {
          key: "portfolio",
          icon: "link",
          iconWrap: "bg-green-50 text-green-700",
          title: "Portfolio & Case Studies",
          meta: applicationData.documents?.portfolio
            ? `External URL • ${String(applicationData.documents.portfolio).replace(/^https?:\/\//, "").slice(0, 40)}`
            : "External URL • Not provided",
          href: applicationData.documents?.portfolio,
          action: "Open Link",
        },
      ].map((row) => (
      <div
      key={row.key}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-surface-container-low/40 border border-outline-variant/10"
      >
      <div className="flex items-start gap-4 min-w-0">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${row.iconWrap}`}>
      <span className="material-symbols-outlined text-xl">{row.icon}</span>
      </div>
      <div className="min-w-0">
      <p className="font-bold text-sm text-primary truncate">{row.title}</p>
      <p className="text-xs text-on-surface-variant mt-0.5">{row.meta}</p>
      </div>
      </div>
      {row.href && row.href !== "#" ? (
      <button
      type="button"
      className="text-sm font-semibold text-secondary hover:underline shrink-0"
      onClick={() =>
      setDocumentPreview({
      url: String(row.href),
      title: row.key === "portfolio" ? "Portfolio link" : row.title,
      fileName: row.key === "portfolio" ? undefined : row.title,
      })
      }
      >
      {row.action}
      </button>
      ) : (
      <span className="text-xs text-outline shrink-0">Not Provided</span>
      )}
      </div>
      ))}
      </div>
      </div>
      )}
      {activeTab === "documents" && (
      <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-6">Document Verification</p>
      {documentVerifyError ? (
      <p className="mb-4 text-sm text-error font-medium" role="alert">{documentVerifyError}</p>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-outline-variant/10">
      <table className="w-full border-collapse text-left">
      <thead>
      <tr className="border-b border-outline-variant/10 bg-surface-container-low/50">
      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Document Name</th>
      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Expiry Date</th>
      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Verification</th>
      <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Actions</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant/10">
      {getAllDocumentTemplateRows(applicationData).map((row) => {
      const stored = applicationData.onboardingDocuments?.find((d) => d.templateKey === row.key);
      const expiryValue = (stored?.expiryDate || "").slice(0, 10);
      const displayStatus = getRowUploadStatusKey(stored, row, expiryValue);
      const statusForBadge = displayStatus === "not_uploaded_neutral" ? "not_uploaded" : displayStatus;
      const hasFile = hasUploadedFile(stored);
      const v = resolveDocVerification(stored);
      const previewUrl =
        stored?.fileData?.trim() || stored?.fileUrl?.trim() || "/sample.pdf";
      const canApprove = hasFile && v !== "verified";
      const expStr = formatExpiryForDisplay(expiryValue, v);
      return (
      <tr key={row.key} className="transition-colors hover:bg-surface-container-low/30">
      <td className="px-6 py-4">
      <div className="flex items-center gap-3 min-w-0">
      <div className={documentIconWrapClass(row, displayStatus)}>
      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
      {row.icon}
      </span>
      </div>
      <div className="min-w-0">
      <span className="text-sm font-semibold text-primary">
      {row.label}
      {row.required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      <p className="text-xs text-on-surface-variant truncate">{formatDocumentSubtitle(stored, row)}</p>
      </div>
      </div>
      </td>
      <td className="px-6 py-4">{uploadStatusBadge(statusForBadge)}</td>
      <td className="px-6 py-4">
      <span
      className={`text-xs ${
      displayStatus === "expiring_soon"
      ? "font-medium text-yellow-700"
      : displayStatus === "expired"
      ? "font-medium text-red-700"
      : "text-on-surface-variant"
      }`}
      >
      {expStr}
      </span>
      </td>
      <td className="px-6 py-4">{onboardingVerificationBadge(v)}</td>
      <td className="px-6 py-4 text-right">
      <div className="flex flex-wrap items-center justify-end gap-2">
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
      className="text-xs font-bold text-secondary hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
      >
      View
      </button>
      <button
      type="button"
      disabled={!canApprove || !stored?.id || verifyDocumentMutation.isPending}
      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-green-50 text-green-800 border border-green-200 hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed"
      onClick={() => {
      if (!stored?.id || !canApprove) return;
      setDocumentVerifyError("");
      verifyDocumentMutation.mutate({ documentId: stored.id, verification: "verified" });
      }}
      >
      Approve
      </button>
      <button
      type="button"
      disabled={!hasFile || v === "verified" || !stored?.id || verifyDocumentMutation.isPending}
      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
      onClick={() => {
      if (!stored?.id || !hasFile || v === "verified") return;
      if (!window.confirm("Reject this document? The applicant can upload a new version.")) return;
      setDocumentVerifyError("");
      verifyDocumentMutation.mutate({ documentId: stored.id, verification: "rejected" });
      }}
      >
      Reject
      </button>
      </div>
      </td>
      </tr>
      );
      })}
      </tbody>
      </table>
      </div>
      </div>
      )}
      {activeTab === "info" && (
      <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-6">Applicant Info</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      {[
        { label: "Role Applied", value: getDisplayValue(applicationData.role) },
        { label: "Experience", value: getDisplayValue(applicationData.experience) },
        { label: "Location", value: getDisplayValue(applicationData.location) },
        { label: "LinkedIn", value: getDisplayValue(applicationData.linkedIn) },
        { label: "Portfolio / website", value: getDisplayValue(portfolioTrim || applicationData.documents?.portfolio) },
        { label: "Application Date", value: formatAppliedDateDisplay(applicationData.appliedDate) },
        { label: "Current Stage", value: isEmployee ? "Employee" : getDisplayValue(stages[stageIndex]?.name) },
        { label: "Status", value: isEmployee ? "Employee" : getDisplayValue(applicationData.status) },
      ].map((row) => (
      <div key={row.label}>
      <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1.5">{row.label}</p>
      <p className="text-sm font-semibold text-primary">{row.value}</p>
      </div>
      ))}
      </div>
      </div>
      )}
      </div>
      </div>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-8">

      <div className="glass-card rounded-xl p-8 monolith-shadow">
      <h3 className="font-headline font-bold text-xl mb-6">Contact</h3>
      <div className="space-y-6">
      <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
      <span className="material-symbols-outlined" data-icon="mail">mail</span>
      </div>
      <div>
      <p className="text-xs text-outline font-medium uppercase tracking-widest mb-0.5">Email Address</p>
      <p className="font-semibold text-primary">{applicationData.email}</p>
      </div>
      </div>
      <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
      <span className="material-symbols-outlined" data-icon="phone">phone</span>
      </div>
      <div>
      <p className="text-xs text-outline font-medium uppercase tracking-widest mb-0.5">Phone Number</p>
      <p className="font-semibold text-primary">{applicationData.phone}</p>
      </div>
      </div>
      <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
      <span className="material-symbols-outlined" data-icon="public">public</span>
      </div>
      <div>
      <p className="text-xs text-outline font-medium uppercase tracking-widest mb-0.5">Portfolio</p>
      {portfolioTrim ? (
      <a
      href={normalizeExternalHref(portfolioTrim)}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-secondary hover:underline break-all"
      >
      {compactUrlLabel(portfolioTrim)}
      </a>
      ) : (
      <p className="font-semibold text-primary">Not Provided</p>
      )}
      </div>
      </div>
      </div>
      </div>

      <div className="glass-card rounded-xl p-8 monolith-shadow">
      <h3 className="font-headline font-bold text-xl mb-6">Core Skills Matrix</h3>
      <div className="flex flex-wrap gap-2">
      {(applicationData.skills || []).map((skill, idx) => (
        <span
          key={skill}
          className={
            idx < 4
              ? "px-4 py-2 bg-primary-container text-white text-xs font-semibold rounded-lg"
              : "px-4 py-2 bg-surface-container text-on-surface-variant text-xs font-semibold rounded-lg"
          }
        >
          {skill}
        </span>
      ))}
      </div>
      </div>

      <div className="glass-card rounded-xl p-8 monolith-shadow">
      <h3 className="font-headline font-bold text-xl mb-6">Recent Interviews</h3>
      {(applicationData.interviews || []).length === 0 ? (
      <p className="text-sm text-on-surface-variant">No interviews recorded yet.</p>
      ) : (
      <div className="space-y-4">
      {(applicationData.interviews || []).map((iv, idx) => (
      <div
      key={iv.id || idx}
      role="button"
      tabIndex={0}
      title="Click to reschedule"
      onClick={() => openRescheduleInterviewModal(iv, idx)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openRescheduleInterviewModal(iv, idx);
        }
      }}
      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/5 border border-secondary/10 cursor-pointer transition-colors hover:bg-secondary/10 hover:border-secondary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
      >
      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
      <span className="material-symbols-outlined">
      {idx % 2 === 0 ? "videocam" : "manage_accounts"}
      </span>
      </div>
      <div className="flex-1 min-w-0">
      <p className="font-bold text-sm text-primary break-words">{iv.title || iv.type}</p>
      <p className="text-xs text-on-surface-variant mt-0.5 break-words">{formatInterviewWhen(iv)}</p>
      {iv.link && (
        <a
          href={iv.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-secondary underline break-all mt-0.5 inline-block"
          onClick={(e) => e.stopPropagation()}
        >
          Join meeting
        </a>
      )}
      </div>
      <div className="shrink-0">{interviewStatusBadge(iv.status)}</div>
      </div>
      ))}
      </div>
      )}
      </div>

      <div className="glass-card rounded-xl p-8 monolith-shadow">
      <h3 className="font-headline font-bold text-xl mb-6">Recent Messages</h3>
      {recentMessagesSorted.length === 0 ? (
      <p className="text-sm text-on-surface-variant">No messages yet. Use Send Message to notify the candidate.</p>
      ) : (
      <div className="space-y-4">
      {recentMessagesSorted.map((msg, midx) => (
      <div
      key={`${msg.date || midx}-${midx}`}
      className="flex items-start gap-4 p-4 rounded-xl bg-secondary/5 border border-secondary/10"
      >
      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
      <span className="material-symbols-outlined">chat</span>
      </div>
      <div className="flex-1 min-w-0">
      <p className="text-xs font-bold uppercase tracking-wide text-secondary mb-1">From hiring team</p>
      <p className="text-sm text-primary leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
      {msg.date ? (
      <p className="text-[10px] text-on-surface-variant mt-2 font-medium uppercase tracking-wider">{formatMessageWhen(msg.date)}</p>
      ) : null}
      </div>
      </div>
      ))}
      </div>
      )}
      </div>
      </div>
      </div>
      </>
      )}
      </main>
      {isInterviewModalOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/30 backdrop-blur-md">
      <div className="glass-card rounded-xl p-6 w-[min(92vw,32rem)] shadow-2xl border border-white/20">
      <h4 className="text-lg font-bold text-primary mb-3">{rescheduleTarget ? "Reschedule Interview" : "Schedule Interview"}</h4>
      <div className="space-y-3 text-sm">
      <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Interview Type</label>
      <select
      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-0 text-sm"
      value={interviewForm.type}
      onChange={(e) => setInterviewForm((f) => ({ ...f, type: e.target.value }))}
      >
      {INTERVIEW_TYPES.map((t) => (
      <option key={t} value={t}>{t}</option>
      ))}
      </select>
      </div>
      <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Date</label>
      <input
      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-0 text-sm"
      type="date"
      value={interviewForm.date}
      onChange={(e) => setInterviewForm((f) => ({ ...f, date: e.target.value }))}
      />
      </div>
      <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Time</label>
      <input
      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-0 text-sm"
      type="time"
      value={interviewForm.time}
      onChange={(e) => setInterviewForm((f) => ({ ...f, time: e.target.value }))}
      />
      </div>
      <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Meeting Link</label>
      <input
      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-0 text-sm"
      type="text"
      inputMode="url"
      autoComplete="url"
      placeholder="https://meet.google.com/… or meet.google.com/…"
      value={interviewForm.link}
      onChange={(e) => setInterviewForm((f) => ({ ...f, link: e.target.value }))}
      />
      <p className="mt-1 text-[10px] text-on-surface-variant">https:// is added automatically if you omit it.</p>
      </div>
      <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Notes</label>
      <textarea
      className="w-full h-24 border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-0 text-sm"
      value={interviewForm.notes}
      onChange={(e) => setInterviewForm((f) => ({ ...f, notes: e.target.value }))}
      placeholder="Optional notes for the candidate"
      />
      </div>
      </div>
      {interviewModalError ? (
      <p className="mt-3 text-xs text-error font-medium" role="alert">{interviewModalError}</p>
      ) : null}
      <div className="mt-4 flex justify-end gap-2">
      <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-lg" onClick={closeInterviewModal} type="button">Cancel</button>
      <button
      className="px-4 py-2 text-xs font-bold bg-primary-container text-white rounded-lg disabled:opacity-60"
      onClick={handleScheduleInterviewSubmit}
      type="button"
      disabled={addInterviewMutation.isPending || updateInterviewMutation.isPending}
      >{rescheduleTarget ? "Save schedule" : "Schedule Interview"}</button>
      </div>
      </div>
      </div>
      )}
      {isMessageModalOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md">
      <div className="glass-card rounded-xl p-6 w-[min(92vw,32rem)]">
      <h4 className="text-lg font-bold text-primary mb-3">Send Message</h4>
      <textarea className="w-full h-28 bg-white border border-slate-200 rounded p-3 text-sm focus:ring-0" onChange={(event) => setMessageDraft(event.target.value)} placeholder="Enter message / notes" value={messageDraft}></textarea>
      <div className="mt-4 flex justify-end gap-2">
      <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded" onClick={() => setIsMessageModalOpen(false)}>Cancel</button>
      <button className="px-4 py-2 text-xs font-bold bg-primary-container text-white rounded" onClick={handleSendMessage}>Send</button>
      </div>
      </div>
      </div>
      )}
      {isMessageSentPopupOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md">
      <div className="glass-card rounded-2xl p-8 w-[min(90vw,26rem)] border border-white/30 shadow-2xl text-center">
      <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#0094ac]/20 flex items-center justify-center animate-pulse">
      <span className="material-symbols-outlined text-3xl text-[#0094ac]" data-icon="check_circle">check_circle</span>
      </div>
      <h4 className="text-xl font-bold text-primary">Message Sent</h4>
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

      {showOnboardingModal && applicationData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/30 backdrop-blur-md">
          <div className="glass-card rounded-xl p-6 w-[min(92vw,34rem)] shadow-2xl border border-white/20">
            <h4 className="text-lg font-bold text-primary mb-1">Move to Offer & Onboarding</h4>
            <p className="text-xs text-on-surface-variant mb-4">
              This will advance <span className="font-semibold text-primary">{applicationData.name}</span> ({applicationData.role}) from
              Client Interview to the Offer & Onboarding stage and enable their onboarding portal access.
            </p>
            <div className="space-y-2 mb-4 text-xs bg-surface-container-low rounded-lg p-4 border border-outline-variant/10">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Applicant</span>
                <span className="font-semibold text-primary">{applicationData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Email</span>
                <span className="font-semibold text-primary">{applicationData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Role</span>
                <span className="font-semibold text-primary">{applicationData.role}</span>
              </div>
            </div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-outline mb-1">
              Admin notes (optional)
            </label>
            <textarea
              className="w-full h-20 bg-white border border-slate-200 rounded p-3 text-sm focus:ring-0 mb-4"
              placeholder="Add any notes for this stage advance…"
              value={onboardingNote}
              onChange={(e) => setOnboardingNote(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-lg"
                onClick={() => setShowOnboardingModal(false)}
                disabled={onboardingGateBusy}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold bg-primary-container text-white rounded-lg disabled:opacity-60"
                onClick={handleConfirmOnboarding}
                disabled={onboardingGateBusy}
              >
                {onboardingGateBusy ? "Processing…" : "Confirm & Enable Onboarding"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]">
      <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
      <pattern height="40" id="network-dots" patternUnits="userSpaceOnUse" width="40" x="0" y="0">
      <circle cx="2" cy="2" fill="#000615" r="1"></circle>
      </pattern>
      </defs>
      <rect fill="url(#network-dots)" height="100%" width="100%"></rect>
      </svg>
      </div>
    </>
  );
}
