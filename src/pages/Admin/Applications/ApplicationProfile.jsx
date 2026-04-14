import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { hireApplicantAsEmployee } from "@/data/applicationEmployeeSync";
import AdminDocumentApproval from "./applicationReview/AdminDocumentApproval";
import AdminFinalApproval from "./applicationReview/AdminFinalApproval";
import AdminProfileReview from "./applicationReview/AdminProfileReview";
import {
  adminApproveOnboardingDocumentsBundle,
  adminApproveOnboardingProfile,
  getOnboardingAdminStep,
  moveApplicationToNextStage,
  setOnboardingVerification,
  updateApplication,
  OFFER_STAGE_INDEX,
  useApplicationsSync,
} from "@/data/applicationsStore";
import {
  documentIconWrapClass,
  formatDocumentSubtitle,
  formatExpiryForDisplay,
  getAllDocumentTemplateRows,
} from "@/utils/applicantDocumentRows";
import { onboardingVerificationBadge, uploadStatusBadge } from "@/components/shared/requiredDocumentBadges";
import { getRowUploadStatusKey, hasUploadedFile, resolveDocVerification } from "@/utils/onboardingDocumentRules";
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
  const numericId = Number(id);
  const { applications: appsRaw } = useApplicationsSync();
  const applications = Array.isArray(appsRaw) ? appsRaw : [];
  const [activeTab, setActiveTab] = useState("details");
  const applicationData = useMemo(() => {
    if (!applications.length) return null;
    return applications.find((profile) => Number(profile.id) === numericId) ?? null;
  }, [applications, numericId]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [isMessageSentPopupOpen, setIsMessageSentPopupOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  /** When set, interview modal updates this row instead of creating a new one. */
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [stageMoveError, setStageMoveError] = useState("");
  const [hireMessage, setHireMessage] = useState("");
  const [interviewForm, setInterviewForm] = useState({
    type: INTERVIEW_TYPES[0],
    date: "",
    time: "",
    link: "",
    notes: "",
  });
  useEffect(() => {
    if (!isMessageSentPopupOpen) return undefined;
    const timeout = window.setTimeout(() => setIsMessageSentPopupOpen(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [isMessageSentPopupOpen]);
  const getDisplayValue = (value) => (value ? value : "Not Provided");
  const stages = applicationData?.stages?.length ? applicationData.stages : [];
  const stageIndex = Number.isFinite(Number(applicationData?.currentStageIndex))
    ? applicationData.currentStageIndex
    : 0;
  const progressPercent =
    stages.length > 1 ? (stageIndex / (stages.length - 1)) * 100 : 0;
  const moveToNextDisabled =
    applicationData?.lifecycleStage === "employee" ||
    (Boolean(applicationData?.onboarding?.enabled) && stageIndex >= OFFER_STAGE_INDEX);
  const handleMoveToNextStage = () => {
    if (!Number.isFinite(numericId)) return;
    setStageMoveError("");
    const result = moveApplicationToNextStage(numericId);
    if (!result.success) {
      setStageMoveError(result.error || "Unable to move stage.");
    }
  };
  const handleSendMessage = () => {
    if (!messageDraft.trim() || !Number.isFinite(numericId)) return;
    updateApplication(numericId, (prev) => ({
      ...prev,
      messages: [...(prev.messages || []), { text: messageDraft.trim(), date: new Date().toISOString() }],
    }));
    setMessageDraft("");
    setIsMessageModalOpen(false);
    setIsMessageSentPopupOpen(true);
  };
  const openNewInterviewModal = () => {
    setRescheduleTarget(null);
    setInterviewForm({ type: INTERVIEW_TYPES[0], date: "", time: "", link: "", notes: "" });
    setIsInterviewModalOpen(true);
  };

  const openRescheduleInterviewModal = (iv, index) => {
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
    setRescheduleTarget(null);
    setIsInterviewModalOpen(false);
    setInterviewForm({ type: INTERVIEW_TYPES[0], date: "", time: "", link: "", notes: "" });
  };

  const handleScheduleInterviewSubmit = () => {
    if (!Number.isFinite(numericId) || !applicationData) return;
    const displayTime = formatTimeFromInput(interviewForm.time);
    const patch = {
      title: interviewForm.type,
      type: interviewForm.type,
      date: interviewForm.date,
      time: displayTime || interviewForm.time,
      status: "scheduled",
      link: interviewForm.link?.trim() || "",
      notes: interviewForm.notes?.trim() || "",
    };

    if (rescheduleTarget) {
      updateApplication(numericId, (prev) => {
        const list = [...(prev.interviews || [])];
        let ix = -1;
        if (rescheduleTarget.id) {
          ix = list.findIndex((x) => x.id === rescheduleTarget.id);
        }
        if (ix < 0 && rescheduleTarget.index != null && rescheduleTarget.index < list.length) {
          ix = rescheduleTarget.index;
        }
        if (ix >= 0) {
          const prevRow = list[ix];
          list[ix] = { ...prevRow, ...patch, id: prevRow.id || `int_${Date.now()}` };
        }
        return {
          ...prev,
          interview: {
            type: interviewForm.type,
            date: interviewForm.date,
            time: interviewForm.time,
            link: interviewForm.link,
            notes: interviewForm.notes,
            status: "scheduled",
          },
          interviews: list,
        };
      });
    } else {
      const newInterview = {
        id: `int_${Date.now()}`,
        ...patch,
      };
      updateApplication(numericId, (prev) => ({
        ...prev,
        interview: {
          type: interviewForm.type,
          date: interviewForm.date,
          time: interviewForm.time,
          link: interviewForm.link,
          notes: interviewForm.notes,
          status: "scheduled",
        },
        interviews: [...(prev.interviews || []), newInterview],
      }));
    }
    closeInterviewModal();
  };

  const recentMessagesSorted = useMemo(() => {
    const list = [...(applicationData?.messages || [])];
    list.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    return list.slice(0, 12);
  }, [applicationData?.messages]);

  if (!applicationData) {
    return (
      <main className="ml-64 pt-24 px-12">
        <p className="text-on-surface-variant">Application not found.</p>
      </main>
    );
  }

  const isOnboardingAdminView =
    applicationData.lifecycleStage === "onboarding" && Boolean(applicationData.onboarding?.enabled);
  const onboardingAdminStep = getOnboardingAdminStep(applicationData.onboarding);
  const onboardingStepName =
    onboardingAdminStep === 1
      ? "Profile Review"
      : onboardingAdminStep === 2
        ? "Document Approval"
        : "Final Approval";

  const notifyApplicationsUpdated = () => window.dispatchEvent(new Event("applications-updated"));
  const handleAdminApproveProfile = () => {
    adminApproveOnboardingProfile(numericId);
    notifyApplicationsUpdated();
  };
  const handleAdminApproveDocuments = () => {
    adminApproveOnboardingDocumentsBundle(numericId);
    notifyApplicationsUpdated();
  };
  const handleFinalHire = () => {
    const r = hireApplicantAsEmployee(numericId);
    if (!r.ok) setHireMessage(r.error || "Hire failed");
    else setHireMessage(`Promoted to employee (${r.employeeId}).`);
    notifyApplicationsUpdated();
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
      <p className="text-sm font-semibold text-slate-900">Admin User</p>
      <p className="text-[10px] uppercase tracking-widest text-slate-500">Administrator</p>
      </div>
      <img alt="Administrator Profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" data-alt="professional portrait of a middle-aged male executive with glasses in a modern office setting, clean lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDifDCiYCf_dEptp9cENBPzuFkKq99YFIJyURBnrDIZIc6iv9E4Os0NYgOCZdoUkK7fEgo4uZvT8xDxwPzRXWu1Zpkxjz3XD-cJSMPb1vAbSsE_pTbhjNcglADIHrqRXZ3wrUW04DjydXo3bZOt7-fgCwy5uvzpQPPNgU_rcsh0JFoEto18vm3A0lD0wXiiIY4aLF5h28y6g6h9xbFnQfIBOzets_nbUQnxSr8vqkvGG8G7SdsNXBrSn9G5pZTzJCIu8t8oBpmLZHTA"/>
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
          <Link className="hover:text-primary transition-colors" to={`/admin/applications/${numericId}`}>
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

      {isOnboardingAdminView ? (
        <div className="w-full">
          {onboardingAdminStep === 1 && (
            <AdminProfileReview application={applicationData} onApproveProfile={handleAdminApproveProfile} />
          )}
          {onboardingAdminStep === 2 && (
            <AdminDocumentApproval application={applicationData} onApproveDocuments={handleAdminApproveDocuments} />
          )}
          {onboardingAdminStep === 3 && (
            <AdminFinalApproval application={applicationData} onFinalHire={handleFinalHire} hireMessage={hireMessage} />
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
      <img alt={applicationData.name} className="w-32 h-32 rounded-xl object-cover ring-4 ring-white/10" data-alt="professional portrait of a young woman with a confident smile, wearing business attire, neutral studio background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUPh2QBggh7tgZWw6ie4X6_Ob3-jRSIg1u_wAD5ig4eBbIR8cmuD8laaubaQdBHSJSU3g5twn8LgVbSeHds32d4HhLCiR2NzAPCbpDLK7gh4pz0bgD5_FdSipeMhQNDo5J_ISFEx1Bz9dkJGggj9HItsfWJ2qSi2Qg70LRU8eKgSzLc8pMCPVqx6JHbM-Ane8R8qc_s2zQqOdbSxbICxUdplLvoHgI3WeA3j76eA53Gabt5J4Hna6lPbSOrA2vxPOTD1dfDyx1RpTQ"/>
      <div className="absolute -bottom-2 -right-2 bg-tertiary-fixed-dim text-on-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase shadow-lg">
                                  Verified
                              </div>
      </div>
      <div>
      <div className="flex items-center gap-3 mb-2">
      <h2 className="font-headline font-extrabold text-4xl text-white tracking-tight">{applicationData.name}</h2>
      <span className="px-3 py-1 bg-tertiary-container text-tertiary-fixed text-xs font-semibold rounded-full border border-tertiary-fixed/20">
                                      {stages[stageIndex]?.name}
                                  </span>
      </div>
      <p className="font-headline text-lg text-primary-fixed-dim mb-4">{applicationData.role}</p>
      <div className="flex flex-wrap gap-5 text-sm text-white/70">
      <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-tertiary-fixed-dim text-lg" data-icon="location_on">location_on</span>
                                      {applicationData.location}
                                  </div>
      <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-tertiary-fixed-dim text-lg" data-icon="language">language</span>
      <Link className="hover:text-white underline underline-offset-4 decoration-tertiary-fixed-dim/30 transition-all" to="#">linkedin.com/in/elenanova</Link>
      </div>
      </div>
      </div>
      </div>
      <div className="flex flex-col items-end gap-3">
      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Application Date</p>
      <p className="text-white font-medium">{getDisplayValue(applicationData.appliedDate)}</p>
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
      <div className="absolute top-5 left-12 h-0.5 bg-secondary z-0" style={{ width: `calc((100% - 6rem) * ${progressPercent}%)` }}></div>
      {stages.map((stage, index) => (
      <div className={`relative z-10 flex flex-col items-center gap-3 group ${index > stageIndex ? "opacity-40" : ""}`} key={stage.name}>
      {index < stageIndex ? (
      <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg shadow-secondary/20">
      <span className="material-symbols-outlined text-xl" data-icon="check" style={{fontVariationSettings: "'wght' 700"}}>check</span>
      </div>
      ) : index === stageIndex ? (
      <div className="w-10 h-10 rounded-full bg-white border-4 border-secondary text-secondary flex items-center justify-center ring-8 ring-secondary/10">
      <span className="material-symbols-outlined text-xl" data-icon="diversity_3">diversity_3</span>
      </div>
      ) : (
      <div className="w-10 h-10 rounded-full bg-surface-container-high text-outline flex items-center justify-center">
      <span className="material-symbols-outlined text-xl" data-icon="flag">flag</span>
      </div>
      )}
      <div className="text-center">
      <p className={`text-xs font-bold uppercase tracking-wider ${index < stageIndex ? "text-secondary" : index === stageIndex ? "text-primary" : ""}`}>{stage.name}</p>
      <p className={`text-[10px] ${index === stageIndex ? "text-on-tertiary-fixed-variant font-medium" : "text-outline"}`}>{stage.date}</p>
      </div>
      </div>
      ))}
      </div>
      </div>

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
      {row.href ? (
      <a
      className="text-sm font-semibold text-secondary hover:underline shrink-0"
      href={row.href === "#" ? "#" : row.href}
      onClick={row.href === "#" ? (e) => e.preventDefault() : undefined}
      >
      {row.action}
      </a>
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
      const expiryValue = (stored?.expiryDate || row.expiry || "").slice(0, 10);
      const displayStatus = getRowUploadStatusKey(stored, row, expiryValue);
      const hasFile = hasUploadedFile(stored);
      const v = resolveDocVerification(stored);
      const previewUrl = stored?.fileData?.trim() ? stored.fileData : stored?.fileUrl?.trim() || "/sample.pdf";
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
      <td className="px-6 py-4">{uploadStatusBadge(displayStatus)}</td>
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
      if (hasFile) window.open(previewUrl, "_blank", "noopener,noreferrer");
      }}
      className="text-xs font-bold text-secondary hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
      >
      View
      </button>
      <button
      type="button"
      disabled={!canApprove}
      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-green-50 text-green-800 border border-green-200 hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed"
      onClick={() => {
      if (Number.isFinite(numericId) && canApprove) setOnboardingVerification(numericId, row.key, "verified");
      }}
      >
      Approve
      </button>
      <button
      type="button"
      disabled={!hasFile || v === "verified"}
      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
      onClick={() => {
      if (Number.isFinite(numericId) && hasFile && v !== "verified") setOnboardingVerification(numericId, row.key, "rejected");
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
        { label: "Application Date", value: getDisplayValue(applicationData.appliedDate) },
        { label: "Current Stage", value: getDisplayValue(stages[stageIndex]?.name) },
        { label: "Status", value: getDisplayValue(applicationData.status) },
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
      <p className="font-semibold text-primary">{getDisplayValue(applicationData.documents?.portfolio)}</p>
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
      type="url"
      placeholder="https://"
      value={interviewForm.link}
      onChange={(e) => setInterviewForm((f) => ({ ...f, link: e.target.value }))}
      />
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
      <div className="mt-4 flex justify-end gap-2">
      <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-lg" onClick={closeInterviewModal} type="button">Cancel</button>
      <button className="px-4 py-2 text-xs font-bold bg-primary-container text-white rounded-lg" onClick={handleScheduleInterviewSubmit} type="button">{rescheduleTarget ? "Save schedule" : "Schedule Interview"}</button>
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
