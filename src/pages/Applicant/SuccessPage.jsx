import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./success.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { applicationsService } from "../../services/applications.service";
import { documentsService } from "../../services/documents.service";
import UpcomingInterviews from "./components/UpcomingInterviews";
import { onboardingVerificationBadge, uploadStatusBadge } from "@/components/shared/requiredDocumentBadges";
import {
  documentIconWrapClass,
  formatDocumentSubtitle,
  getAllDocumentTemplateRows,
} from "@/utils/applicantDocumentRows";
import { getExpiryBucket, getRowUploadStatusKey, hasUploadedFile, resolveDocVerification } from "@/utils/onboardingDocumentRules";

const DUMMY_FILE_URL = "/sample.pdf";

function triggerDownload(url, name) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name || "sample.pdf";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const ALL_STAGE_NAMES = [
  "Application Submitted",
  "Profile Screening",
  "Technical Evaluation",
  "Client Interview",
  "Offer & Onboarding",
];

const STAGE_DESCRIPTIONS = {
  "Application Submitted": "Initial documentation and resume review.",
  "Profile Screening": "Cultural alignment and executive strategy session.",
  "Technical Evaluation": "Deep-dive into systems architecture and logic.",
  "Client Interview": "Final stakeholder matching and project alignment.",
  "Offer & Onboarding": "Agreement finalization and team integration.",
};

const TALENT_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBT1HDtUAi3Q4U80sSsiV2cs4GSW6-PyZ26aOjvnVCvSqVVVsKfp9ucOyqhIqRtOX2TvGgAroIu-gvEfc7VcL18_HVI9ZQs6bkClOVii2GU7rbxwK9LS7XagczXRciFsHlqrkgqCWd3up8YvummfR1gyY0qXQ5fOlxvVA0t-pWQbULArgLY1czVqa1P_2B8rw8AQqSVKGFSxsRGIffZoit8HJVwwzYDWkJt4GGKhfjKA9k9nze5dJp6jQ-Rd_zPBlUkoBJIlzfUKop1";

function stableApplicationId(email, numericId) {
  if (numericId != null) return `ITR-${String(numericId).padStart(5, "0")}`;
  const base = (email || "applicant").toLowerCase();
  let h = 0;
  for (let i = 0; i < base.length; i += 1) h = (Math.imul(31, h) + base.charCodeAt(i)) | 0;
  const part = Math.abs(h).toString(16).toUpperCase().slice(0, 5).padStart(5, "0");
  return `ITR-${part}`;
}

export default function SuccessPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { applicationId, clearAuth } = useAuthStore();
  const [expiryDraft, setExpiryDraft] = useState({});
  const [docErrors, setDocErrors] = useState({});
  const [pendingUploadKey, setPendingUploadKey] = useState(null);
  const [onboardingWelcomeDismissed, setOnboardingWelcomeDismissed] = useState(false);
  const fileInputRef = useRef(null);

  const onboardingWelcomeDismissalKey =
    applicationId != null ? `intech_onboarding_welcome_dismissed_${applicationId}` : null;

  const { data: application = null } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationsService.getById(applicationId),
    staleTime: 30_000,
    enabled: !!applicationId,
  });

  const uploadDocMutation = useMutation({
    mutationFn: ({ key, file, expiry, name }) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("applicationId", applicationId);
      fd.append("templateKey", key);
      fd.append("name", name);
      fd.append("expiryDate", expiry);
      return documentsService.upsert(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
    },
  });

  const onboardingWelcomeOpen = Boolean(
    application?.onboarding?.enabled && !application?.onboarding?.finalSubmitted,
  );

  useEffect(() => {
    if (!onboardingWelcomeDismissalKey) return;
    setOnboardingWelcomeDismissed(sessionStorage.getItem(onboardingWelcomeDismissalKey) === "1");
  }, [onboardingWelcomeDismissalKey]);

  useEffect(() => {
    if (application?.onboarding?.finalSubmitted && onboardingWelcomeDismissalKey) {
      sessionStorage.removeItem(onboardingWelcomeDismissalKey);
      setOnboardingWelcomeDismissed(false);
    }
  }, [application?.onboarding?.finalSubmitted, onboardingWelcomeDismissalKey]);

  const showOnboardingWelcomeModal = onboardingWelcomeOpen && !onboardingWelcomeDismissed;

  useEffect(() => {
    if (!showOnboardingWelcomeModal) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showOnboardingWelcomeModal]);

  const allDocumentRows = useMemo(() => getAllDocumentTemplateRows(application), [application]);

  const formData = useMemo(() => {
    if (!application) {
      return {
        name: "Candidate",
        email: "",
        discipline: "Cloud Infrastructure Architecture",
        experience: "5-8 Years",
      };
    }
    return {
      name: application.name || "Candidate",
      email: application.email || "",
      discipline: application.role || "",
      experience: application.experience || "",
    };
  }, [application]);

  const stages = ALL_STAGE_NAMES.map((name) => {
    const fromApi = application?.stages?.find((s) => s.name === name);
    return {
      name,
      date: fromApi?.date ?? "",
      status: fromApi?.status,
    };
  });
  const rawIdx =
    application?.currentStageIndex != null
      ? application.currentStageIndex
      : ALL_STAGE_NAMES.findIndex((n) => n === application?.status);
  const currentStageIndex = rawIdx >= 0 ? rawIdx : 0;

  const isEmployeeApplicant =
    application?.lifecycleStage === "employee" || application?.status === "Employee";
  /** Offer stage reached but hiring has not enabled the onboarding checklist yet. */
  const awaitingPortalOnboarding =
    Boolean(application) &&
    !isEmployeeApplicant &&
    currentStageIndex >= ALL_STAGE_NAMES.length - 1 &&
    !application.onboarding?.enabled;

  const stableId = stableApplicationId(formData.email, application?.id);
  const fullName = formData.name || application?.name || "Candidate";
  const displayRole = application?.role || formData.discipline || "Principal Architect";
  const displayPhone = (application?.phone || "").trim() || "—";
  const displayEmail = (application?.email || formData.email || "").trim();
  const resumeHref =
    application?.documents?.resume && application.documents.resume !== "#"
      ? application.documents.resume
      : DUMMY_FILE_URL;
  const hasResume = Boolean(application?.documents?.resume);
  const resumeLabel = `Resume_${fullName.replace(/\s+/g, "_")}.pdf`;

  const handleLogout = () => {
    clearAuth();
    navigate("/applicant/login", { replace: true });
  };

  const handleContinueOnboarding = () => {
    if (!application?.onboarding) return;
    const step = application.onboarding.step || 1;
    navigate(`/applicant/onboarding/${step}`);
  };

  const dismissOnboardingWelcome = () => {
    if (onboardingWelcomeDismissalKey) {
      sessionStorage.setItem(onboardingWelcomeDismissalKey, "1");
    }
    setOnboardingWelcomeDismissed(true);
  };

  const handleUploadClick = (rowKey) => {
    if (!application) return;
    const stored = application.onboardingDocuments?.find((d) => d.templateKey === rowKey);
    if (resolveDocVerification(stored) === "verified") return;
    const expiry = (stored?.expiryDate || expiryDraft[rowKey] || "").trim();
    if (!expiry) {
      setDocErrors((e) => ({ ...e, [rowKey]: "Please set an expiry date before uploading." }));
      return;
    }
    setDocErrors((e) => ({ ...e, [rowKey]: "" }));
    setPendingUploadKey(rowKey);
    fileInputRef.current?.click();
  };

  const onFileSelected = (event) => {
    const file = event.target.files?.[0];
    const key = pendingUploadKey;
    event.target.value = "";
    setPendingUploadKey(null);
    if (!file || !key || !application) return;
    const row = allDocumentRows.find((r) => r.key === key);
    const stored = application.onboardingDocuments?.find((d) => d.templateKey === key);
    if (resolveDocVerification(stored) === "verified") return;
    const expiry = (stored?.expiryDate || expiryDraft[key] || "").trim();
    if (!expiry) {
      setDocErrors((er) => ({ ...er, [key]: "Please set an expiry date before uploading." }));
      return;
    }
    const label = row?.label || key;
    uploadDocMutation.mutate(
      { key, file, expiry, name: label },
      {
        onError: () => {
          setDocErrors((er) => ({ ...er, [key]: "Upload failed. Check your connection and try again." }));
        },
      },
    );
  };

  const messages = application?.messages?.length ? application.messages : [];
  const latestMessage = messages.length ? messages[messages.length - 1] : null;
  const latestWhen = latestMessage ? latestMessage.date || latestMessage.timestamp : null;
  const renderApplicantDocumentActions = (row, stored, expiryValue) => {
    const v = resolveDocVerification(stored);
    const hasFile = hasUploadedFile(stored);
    const exp = getExpiryBucket((expiryValue || "").slice(0, 10));

    const uploadPrimaryClass =
      "rounded bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-secondary";
    const viewLinkClass = "text-xs font-bold text-secondary hover:underline";
    const downloadOutlineClass =
      "rounded border border-primary px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-white";

    if (!hasFile) {
      return (
        <button type="button" onClick={() => handleUploadClick(row.key)} className={uploadPrimaryClass}>
          Upload
        </button>
      );
    }

    if (v === "verified") {
      const href = (stored?.fileUrl && String(stored.fileUrl).trim()) || DUMMY_FILE_URL;
      const dlName = stored?.fileName || "document.pdf";
      return (
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
            className={viewLinkClass}
          >
            View
          </button>
          <button
            type="button"
            onClick={() => triggerDownload(href, dlName)}
            className={downloadOutlineClass}
          >
            Download
          </button>
        </div>
      );
    }

    if (exp === "expired" || exp === "expiring_soon") {
      return (
        <button type="button" onClick={() => handleUploadClick(row.key)} className={uploadPrimaryClass}>
          Replace
        </button>
      );
    }

    if (v === "rejected") {
      return (
        <button type="button" onClick={() => handleUploadClick(row.key)} className={uploadPrimaryClass}>
          Re-upload
        </button>
      );
    }

    if (v === "waiting") {
      return (
        <button type="button" onClick={() => handleUploadClick(row.key)} className={uploadPrimaryClass}>
          Replace
        </button>
      );
    }

    if (v === "unapproved") {
      return (
        <button
          type="button"
          onClick={() => console.info("Submit for verification:", row.key)}
          className={uploadPrimaryClass}
        >
          Submit for Verification
        </button>
      );
    }

    return null;
  };

  if (!application) {
    return (
      <div className="success-page bg-surface font-body text-on-surface min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-on-surface-variant mb-6 text-center">Application not found for this session.</p>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-primary-container px-6 py-2.5 font-headline text-sm font-bold text-white"
        >
          Back to applicant login
        </button>
      </div>
    );
  }

  const currentStage = stages[currentStageIndex] || stages[0];
  const currentStageName = currentStage?.name || "Client Interview";
  const progressPercent = Math.min(
    100,
    Math.round((currentStageIndex / Math.max(1, stages.length - 1)) * 100),
  );

  return (
    <div className="success-page bg-surface font-body text-on-surface selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
      <nav className="fixed top-0 z-50 w-full border-b border-[#c4c6ce]/15 bg-white/60 shadow-[0_40px_40px_0px_rgba(0,6,21,0.04)] backdrop-blur-xl dark:bg-[#000615]/60">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-12 py-4">
          <Link to="/" className="font-headline text-2xl font-black tracking-tighter text-[#000615] dark:text-white">
            INTECHROOT
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              to="/services"
              className="font-['Manrope'] text-sm font-bold uppercase tracking-tight text-[#7587a7] transition-colors hover:text-[#000615]"
            >
              Solutions
            </Link>
            <Link
              to="/careers"
              className="border-b-2 border-[#4059aa] pb-1 font-['Manrope'] text-sm font-bold uppercase tracking-tight text-[#4059aa]"
            >
              Careers
            </Link>
            <Link
              to="/careers#apply"
              className="font-['Manrope'] text-sm font-bold uppercase tracking-tight text-[#7587a7] transition-colors hover:text-[#000615]"
            >
              Apply
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handleLogout}
              className="font-['Manrope'] text-sm font-bold uppercase tracking-tight text-[#7587a7] transition-colors hover:text-[#000615]"
            >
              Sign out
            </button>
            <Link
              to="/"
              className="rounded-lg bg-primary-container px-6 py-2.5 font-headline text-sm font-bold tracking-tight text-white transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              Partner With Us
            </Link>
            <div className="h-10 w-10 overflow-hidden rounded-full border border-outline-variant/30">
              <img alt="" className="h-full w-full object-cover" src={TALENT_AVATAR} />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto min-h-screen max-w-[1440px] px-6 pb-24 pt-32 network-grid md:px-12">
        <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={onFileSelected} />
        <header className="mb-16">
          {awaitingPortalOnboarding ? (
            <div
              className="mb-10 rounded-2xl border border-amber-200/90 bg-amber-50/95 px-5 py-4 text-sm text-amber-950 shadow-sm dark:border-amber-800/50 dark:bg-amber-950/35 dark:text-amber-50 md:px-6 md:py-5"
              role="status"
            >
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-800 dark:text-amber-200">
                Offer &amp; onboarding
              </p>
              <p className="font-headline text-base font-bold text-primary dark:text-white md:text-lg">
                Onboarding checklist not unlocked yet
              </p>
              <p className="mt-1 max-w-2xl text-on-surface-variant dark:text-amber-100/90">
                You are in the final hiring stage. Your recruiter still needs to enable the onboarding portal on their side. Refresh this page after they confirm, or check back shortly.
              </p>
            </div>
          ) : null}
          {onboardingWelcomeOpen && onboardingWelcomeDismissed ? (
            <div
              className="mb-10 flex flex-col gap-4 rounded-2xl border border-secondary/25 bg-secondary-container/10 px-5 py-4 shadow-sm backdrop-blur-sm dark:border-secondary/30 dark:bg-secondary/10 md:flex-row md:items-center md:justify-between md:px-6 md:py-5"
              role="region"
              aria-label="Onboarding reminder"
            >
              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-secondary">Offer &amp; onboarding</p>
                <p className="font-headline text-base font-bold text-primary dark:text-white md:text-lg">
                  Continue your onboarding checklist
                </p>
                <p className="mt-1 max-w-xl text-sm text-on-surface-variant dark:text-slate-300">
                  Pick up where you left off — profile, documents, and next steps with our team.
                </p>
              </div>
              <button
                type="button"
                onClick={handleContinueOnboarding}
                className="shrink-0 rounded-xl bg-primary-container px-6 py-3 font-headline text-sm font-bold text-white shadow-md transition hover:opacity-95 active:scale-[0.99] md:px-8"
              >
                Continue onboarding
              </button>
            </div>
          ) : null}
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="mb-4 inline-block rounded bg-secondary-container/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">
                Application ID: {applicationId}
              </span>
              <h1 className="mb-6 font-headline text-5xl font-extrabold leading-[0.95] tracking-tighter text-primary md:text-7xl">
                The Journey to <br />
                <span className="text-secondary">Excellence.</span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-on-surface-variant">
                Welcome, {fullName}. Your progression through the InTechRoot Architectural Intelligence vetting process is
                currently in the <span className="font-semibold text-primary">{currentStageName} Phase</span>.
              </p>
            </div>
            <div className="flex flex-col items-end text-right">
              <p className="mb-1 text-sm font-medium uppercase tracking-widest text-on-surface-variant">Current Status</p>
              <p className="font-headline text-3xl font-bold text-secondary">{currentStageName}</p>
              <div className="mt-4 flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  {stages.map((_, i) => {
                    if (i < currentStageIndex) {
                      return <span key={i} className="h-2 w-2 rounded-full bg-secondary"></span>;
                    }
                    if (i === currentStageIndex) {
                      return (
                        <span key={i} className="h-2 w-2 animate-pulse rounded-full bg-secondary"></span>
                      );
                    }
                    return <span key={i} className="h-2 w-2 rounded-full bg-outline-variant"></span>;
                  })}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{progressPercent}% Complete</p>
              </div>
            </div>
          </div>
        </header>

        <section className="relative mb-20">
          <div className="absolute left-0 top-[40px] z-0 hidden h-[1px] w-full bg-outline-variant/30 md:block"></div>
          <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-5">
            {stages.map((stage, i) => {
              const isCurrent = i === currentStageIndex;
              const isComplete = i < currentStageIndex;
              const title = `${i + 1}. ${stage.name}`;
              const desc = STAGE_DESCRIPTIONS[stage.name] || "";
              const dateLine = isComplete
                ? stage.date && stage.date !== "Pending"
                  ? `Completed ${stage.date}`
                  : "Completed"
                : isCurrent
                  ? "In Progress"
                  : "Upcoming";

              return (
                <div key={stage.name} className="group">
                  <div
                    className={`flex h-full flex-col rounded-xl border-t-4 p-6 transition-all glass-card ${
                      isCurrent
                        ? "border-t-secondary bg-white/80 shadow-[0_20px_40px_rgba(64,89,170,0.12)] ring-2 ring-secondary/25 hover:bg-white"
                        : isComplete
                          ? "border-t-primary-container hover:bg-white"
                          : "border-t-outline-variant hover:bg-white/90"
                    }`}
                  >
                    <div
                      className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${
                        isCurrent
                          ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                          : isComplete
                            ? "bg-primary-container/10 text-primary-container"
                            : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl" style={isComplete ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                        {isComplete ? "check_circle" : isCurrent ? "hub" : "flag"}
                      </span>
                    </div>
                    <h3
                      className={`mb-1 font-headline text-sm font-bold ${
                        isCurrent ? "text-secondary" : isComplete ? "text-primary" : "text-primary"
                      }`}
                    >
                      {title}
                    </h3>
                    <p className="mb-4 text-[11px] font-medium leading-tight text-on-surface-variant">{desc}</p>
                    <span
                      className={`text-[9px] font-bold uppercase ${
                        isCurrent ? "animate-pulse text-secondary" : isComplete ? "text-on-surface-variant/70" : "text-outline-variant"
                      }`}
                    >
                      {dateLine}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-8">
            <h2 className="font-headline text-2xl font-extrabold text-primary">Documents</h2>
            <p className="text-sm text-on-surface-variant">
              Upload documents when ready. Candidate documents are not required to proceed with onboarding at this time.
            </p>
            </div>
          <div className="glass-card overflow-hidden rounded-xl shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant/10 bg-surface-container-low/50">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Document Name
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Status
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Expiry Date
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Verification
                    </th>
                    <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {allDocumentRows.map((row) => {
                    const stored = application.onboardingDocuments?.find((d) => d.templateKey === row.key);
                    const expiryValue = (stored?.expiryDate || expiryDraft[row.key] || "").slice(0, 10);
                    const displayStatus = getRowUploadStatusKey(stored, row, expiryValue);
                    const statusForBadge = displayStatus === "not_uploaded_neutral" ? "not_uploaded" : displayStatus;
                    const err = docErrors[row.key];
                    const verifiedLocked = resolveDocVerification(stored) === "verified";
                    return (
                    <tr key={row.key} className="transition-colors hover:bg-white/40">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={documentIconWrapClass(row, displayStatus)}>
                            <span
                              className="material-symbols-outlined text-xl"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {row.icon}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-primary">
                              {row.label}
                              {row.required ? <span className="ml-1 text-red-500">*</span> : null}
                            </p>
                            <p className="text-xs text-on-surface-variant truncate">
                              {formatDocumentSubtitle(stored, row)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">{uploadStatusBadge(statusForBadge)}</td>
                      <td className="px-8 py-6">
                        <input
                          className={`w-full min-w-[8rem] rounded border border-outline-variant/20 bg-white px-2 py-1 text-xs focus:ring-0 ${
                            displayStatus === "expiring_soon"
                              ? "font-medium text-yellow-700"
                              : displayStatus === "expired"
                                ? "font-medium text-red-700"
                                : "text-on-surface-variant"
                          } ${verifiedLocked ? "cursor-not-allowed opacity-70" : ""}`}
                          type="date"
                          value={expiryValue}
                          disabled={verifiedLocked}
                          onChange={(e) => {
                            setExpiryDraft((d) => ({ ...d, [row.key]: e.target.value }));
                            setDocErrors((er) => ({ ...er, [row.key]: "" }));
                          }}
                        />
                        {err ? <p className="mt-1 text-[10px] font-medium text-red-600">{err}</p> : null}
                      </td>
                      <td className="px-8 py-6">{onboardingVerificationBadge(resolveDocVerification(stored))}</td>
                      <td className="px-8 py-6 text-right">{renderApplicantDocumentActions(row, stored, expiryValue)}</td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-12">
          <div className="relative overflow-hidden rounded-xl p-10 glass-card md:col-span-4">
            <div className="relative z-10">
              <h4 className="mb-8 font-headline text-2xl font-bold">Your profile</h4>
              <div className="mb-8 flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-lg bg-primary-container p-1">
                  <img alt="" className="h-full w-full rounded-md object-cover" src={TALENT_AVATAR} />
                </div>
                <div className="min-w-0">
                  <p className="font-headline text-lg font-bold">{fullName}</p>
                  <p className="text-sm font-medium text-secondary">{displayRole}</p>
                </div>
              </div>
              <ul className="space-y-0">
                <li className="flex items-start justify-between gap-4 border-b border-outline-variant/10 py-3 text-sm">
                  <span className="shrink-0 text-on-surface-variant">Phone</span>
                  <span className="min-w-0 text-right font-semibold text-primary">{displayPhone}</span>
                </li>
                <li className="flex items-start justify-between gap-4 border-b border-outline-variant/10 py-3 text-sm">
                  <span className="shrink-0 text-on-surface-variant">Email</span>
                  {displayEmail ? (
                    <a className="min-w-0 break-all text-right font-semibold text-secondary underline decoration-secondary/30 underline-offset-2 hover:opacity-90" href={`mailto:${displayEmail}`}>
                      {displayEmail}
                    </a>
                  ) : (
                    <span className="font-semibold text-primary">—</span>
                  )}
                </li>
                <li className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="text-on-surface-variant">Resume</span>
                  {hasResume ? (
                    <a
                      className="inline-flex items-center gap-2 font-semibold text-secondary hover:opacity-90"
                      href={resumeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={resumeLabel}
                    >
                      <span className="material-symbols-outlined text-[22px]" data-icon="description">description</span>
                      <span className="max-w-[10rem] truncate sm:max-w-[12rem]" title={resumeLabel}>
                        {resumeLabel}
                      </span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[22px] opacity-60" data-icon="description">description</span>
                      <span>Not uploaded</span>
                    </span>
                  )}
                </li>
              </ul>
            </div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-secondary/5 blur-3xl"></div>
          </div>

          <UpcomingInterviews application={application} />

          <div className="flex h-full flex-col rounded-xl border-2 border-secondary/20 p-10 glass-card md:col-span-3">
            <h4 className="mb-1 font-headline text-2xl font-bold text-primary">Messages</h4>
            <p className="mb-6 text-sm text-on-surface-variant">Updates from your hiring team</p>
            <div className="flex min-h-[8rem] flex-1 flex-col rounded-xl border border-outline-variant/15 bg-white p-8 shadow-[0_8px_24px_rgba(0,6,21,0.06)]">
              {messages.length === 0 || !latestMessage?.text?.trim() ? (
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  No messages yet. We will post updates here.
                </p>
              ) : (
                <div className="flex flex-1 flex-col">
                  <p className="text-sm leading-relaxed text-on-surface">{latestMessage.text.trim()}</p>
                  {latestWhen ? (
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {new Date(latestWhen).toLocaleString()}
                    </p>
                  ) : null}
                  {messages.length > 1 ? (
                    <p className="mt-auto pt-6 text-xs text-on-surface-variant/80">
                      Showing your most recent of {messages.length} updates.
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-[#c4c6ce]/15 bg-[#f7f9fc] px-12 py-12 dark:bg-[#000615]">
        <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-between gap-8 md:flex-row">
          <div className="font-['Manrope'] text-lg font-bold text-[#000615] dark:text-white">INTECHROOT</div>
          <div className="flex gap-8">
            <Link to="/" className="font-['Inter'] text-xs tracking-wide text-[#7587a7] opacity-80 transition-colors duration-200 hover:text-[#4059aa] hover:opacity-100">
              Privacy Policy
            </Link>
            <Link to="/" className="font-['Inter'] text-xs tracking-wide text-[#7587a7] opacity-80 transition-colors duration-200 hover:text-[#4059aa] hover:opacity-100">
              Terms of Service
            </Link>
            <Link to="/" className="font-['Inter'] text-xs tracking-wide text-[#7587a7] opacity-80 transition-colors duration-200 hover:text-[#4059aa] hover:opacity-100">
              Global Compliance
            </Link>
            <Link to="/" className="font-['Inter'] text-xs tracking-wide text-[#7587a7] opacity-80 transition-colors duration-200 hover:text-[#4059aa] hover:opacity-100">
              Cookie Settings
            </Link>
          </div>
          <div className="font-['Inter'] text-xs tracking-wide text-[#7587a7] opacity-80">
            © 2026 InTechRoot Architectural Intelligence. All rights reserved.
          </div>
        </div>
      </footer>

      {showOnboardingWelcomeModal ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-welcome-title"
        >
          <div className="absolute inset-0 bg-[#000615]/45 backdrop-blur-md dark:bg-black/50" aria-hidden="true" />
          <div className="glass-card relative z-10 w-full max-w-[26rem] rounded-2xl border border-white/55 p-8 pt-12 shadow-[0_32px_90px_rgba(0,6,21,0.22)] backdrop-blur-2xl dark:border-white/15 dark:bg-[#0d1528]/80 dark:shadow-[0_32px_90px_rgba(0,0,0,0.55)]">
            <button
              type="button"
              onClick={dismissOnboardingWelcome}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-black/5 hover:text-primary dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close and view dashboard"
            >
              <span className="material-symbols-outlined text-2xl leading-none">close</span>
            </button>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-secondary">Offer &amp; onboarding</p>
            <h2 id="onboarding-welcome-title" className="mb-4 font-headline text-2xl font-extrabold tracking-tight text-primary dark:text-white md:text-3xl">
              You&apos;re selected for onboarding
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-on-surface-variant dark:text-slate-300">
              Congratulations — complete your onboarding checklist and next steps with our team. Use the button below to continue.
            </p>
            <button
              type="button"
              onClick={handleContinueOnboarding}
              className="w-full rounded-xl bg-primary-container px-5 py-3.5 font-headline text-sm font-bold text-white shadow-lg transition hover:opacity-95 active:scale-[0.99]"
            >
              Continue onboarding
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
