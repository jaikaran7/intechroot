import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePaginatedQuery } from "../../../hooks/usePaginatedQuery";
import { applicationsService } from "../../../services/applications.service";
import PageSkeleton from "../../../components/PageSkeleton";
import ErrorState from "../../../components/ErrorState";
import AdminDocumentPreviewModal from "@/components/admin/AdminDocumentPreviewModal";
import EntityAvatar from "@/components/shared/EntityAvatar";
import { useAuthStore } from "@/store/authStore";
import { resolveApplicationResumeUrl } from "@/utils/resolveApplicationResumeUrl";

const EMPTY_STATS = {
  kpis: {
    totalApplications: 0,
    newApplicationsTrendPercent: 0,
    underReview: 0,
    underReviewProgress: 0,
    interviewScheduled: 0,
    selected: 0,
    selectedSharePercent: 0,
    rejected: 0,
    rejectedRatePercent: 0,
  },
  pipeline: {
    applied: 0,
    screening: 0,
    technical: 0,
    hrInterview: 0,
    selected: 0,
  },
};

function formatCount(n) {
  return typeof n === "number" && Number.isFinite(n) ? n.toLocaleString() : "0";
}

/** Normalize `skills` from API (string[], JSON string, or comma-separated). */
function applicationSkillsList(application) {
  const raw = application?.skills;
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) return [];
    try {
      const parsed = JSON.parse(t);
      if (Array.isArray(parsed)) {
        return parsed.map(String).map((s) => s.trim()).filter(Boolean);
      }
    } catch {
      /* fall through */
    }
    return t.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function AdminResumePreviewLink({ application, onOpenPreview }) {
  const resumeUrl = resolveApplicationResumeUrl(application);
  const resumeLabel = `Resume_${application.name.replace(/\s+/g, "_")}.pdf`;
  if (!resumeUrl) {
    return (
      <span className="min-w-0 flex-1 break-words text-left text-on-surface-variant leading-snug">
        No resume URL (open application for full files)
      </span>
    );
  }
  return (
    <button
      type="button"
      className="min-w-0 flex-1 break-words text-left text-secondary underline font-medium leading-snug"
      onClick={() =>
        onOpenPreview({
          url: resumeUrl,
          title: "Resume",
          fileName: resumeLabel,
        })
      }
    >
      {resumeLabel}
    </button>
  );
}

export default function Applications() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobIdFilter = searchParams.get("jobId");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const PAGE_SIZE = 6;
  const [searchFilter, setSearchFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("Any");
  const [documentPreview, setDocumentPreview] = useState(null);
  const [actionBanner, setActionBanner] = useState({ type: "", message: "" });

  const approvePortalMutation = useMutation({
    mutationFn: (id) => applicationsService.approvePortal(id),
    onSuccess: (_, applicationId) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["application", applicationId] });
      setActionBanner({
        type: "success",
        message: "Portal approved. The applicant has been emailed sign-in instructions and a temporary password.",
      });
      setTimeout(() => setActionBanner({ type: "", message: "" }), 4500);
    },
    onError: (err) => {
      setActionBanner({
        type: "error",
        message: err?.response?.data?.error?.message || "Could not approve portal access.",
      });
    },
  });

  const rejectApplicationMutation = useMutation({
    mutationFn: (id) => applicationsService.rejectApplication(id),
    onSuccess: (_, applicationId) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["application", applicationId] });
      setSelectedApplicationId(null);
      setActionBanner({
        type: "success",
        message: "Application marked as rejected and portal access removed.",
      });
      setTimeout(() => setActionBanner({ type: "", message: "" }), 4500);
    },
    onError: (err) => {
      setActionBanner({
        type: "error",
        message: err?.response?.data?.error?.message || "Could not reject this application.",
      });
    },
  });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchFilter.trim()), 350);
    return () => clearTimeout(t);
  }, [searchFilter]);

  const {
    data: apiData,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    totalPages,
    total,
  } = usePaginatedQuery(
    [
      'applications',
      {
        search: debouncedSearch || undefined,
        role: roleFilter !== "All" ? roleFilter : undefined,
        jobId: jobIdFilter || undefined,
      },
    ],
    applicationsService.getAll,
    { staleTime: 30_000, limit: PAGE_SIZE }
  );

  const { data: statsPayload, isLoading: statsLoading } = useQuery({
    queryKey: ['applications', 'stats', { jobId: jobIdFilter || null }],
    queryFn: () => applicationsService.getStats({ jobId: jobIdFilter || undefined }),
    staleTime: 30_000,
  });

  const stats = statsPayload && typeof statsPayload === 'object' ? statsPayload : EMPTY_STATS;
  const { kpis, pipeline } = stats;

  const applications = Array.isArray(apiData?.data) ? apiData.data : [];

  const handleView = (id) => {
    navigate(`/admin/applications/${id}`);
  };

  const roleOptions = ["All", ...Array.from(new Set(applications.map((application) => application.role)))];

  // Server handles search/role filtering — experience filter is client-side for now
  const getExperienceValue = (experience) => parseInt(experience, 10);
  const filteredApplications = experienceFilter === "Any"
    ? applications
    : applications.filter((app) => {
        const years = getExperienceValue(app.experience);
        if (experienceFilter === "5+ Years") return years >= 5;
        if (experienceFilter === "10+ Years") return years >= 10;
        return true;
      });

  const selectedApplication =
    selectedApplicationId != null
      ? filteredApplications.find((application) => application.id === selectedApplicationId)
      : undefined;

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, roleFilter, experienceFilter, jobIdFilter]);

  useEffect(() => {
    if (selectedApplicationId == null) return;
    if (!filteredApplications.some((application) => application.id === selectedApplicationId)) {
      setSelectedApplicationId(null);
    }
  }, [filteredApplications, selectedApplicationId]);

  useEffect(() => {
    setActionBanner({ type: "", message: "" });
  }, [selectedApplicationId]);
  return (
    <>
      <main className="ml-64 min-h-screen">

      <header className="fixed top-0 right-0 left-64 h-16 bg-slate-50/60 backdrop-blur-xl shadow-[0_40px_40px_0px_rgba(0,6,21,0.04)] flex items-center justify-between px-8 w-full z-40">
      <div className="flex items-center gap-6">
      <h2 className="text-xl font-bold text-[#000615] font-['Manrope'] tracking-tight">Applications</h2>
      <div className="h-6 w-[1px] bg-outline-variant opacity-30"></div>
      <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-lg">
      <span className="material-symbols-outlined text-outline text-sm" data-icon="search">search</span>
      <input
        className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-outline/60"
        placeholder="Search applications..."
        type="search"
        value={searchFilter}
        onChange={(event) => setSearchFilter(event.target.value)}
        aria-label="Search applications"
      />
      </div>
      </div>
      <div className="flex items-center gap-4">
      <button className="p-2 rounded-full hover:bg-slate-200/50 transition-all scale-95 active:scale-90 duration-200 text-on-surface-variant">
      <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
      </button>
      <button className="p-2 rounded-full hover:bg-slate-200/50 transition-all scale-95 active:scale-90 duration-200 text-on-surface-variant">
      <span className="material-symbols-outlined" data-icon="help">help</span>
      </button>
      <EntityAvatar name={user?.name || user?.email || "Admin"} size="md" className="border border-outline-variant" />
      </div>
      </header>

      <div className="pt-24 px-8 pb-12">

      <div className="grid grid-cols-5 gap-6 mb-8">
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
      <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">Total Applications</p>
      <div className="flex items-end justify-between gap-2">
      <h3 className="text-3xl font-bold text-primary font-headline tabular-nums">
        {statsLoading ? "…" : formatCount(kpis.totalApplications)}
      </h3>
      <span
        className={
          kpis.newApplicationsTrendPercent > 0
            ? "text-secondary font-bold text-sm shrink-0"
            : kpis.newApplicationsTrendPercent < 0
              ? "text-error font-bold text-sm shrink-0"
              : "text-outline font-bold text-sm shrink-0"
        }
        title="New applications in the last 30 days vs the prior 30 days"
      >
        {statsLoading ? "" : `${kpis.newApplicationsTrendPercent > 0 ? "+" : ""}${kpis.newApplicationsTrendPercent}%`}
      </span>
      </div>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
      <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">Under Review</p>
      <div className="flex items-end justify-between gap-2">
      <h3 className="text-3xl font-bold text-primary font-headline tabular-nums">
        {statsLoading ? "…" : formatCount(kpis.underReview)}
      </h3>
      <div className="w-10 h-1 bg-secondary/20 rounded-full overflow-hidden shrink-0" title="Share of all applications still in early pipeline stages">
      <div
        className="bg-secondary h-full transition-all"
        style={{ width: `${Math.min(100, Math.round((kpis.underReviewProgress || 0) * 100))}%` }}
      />
      </div>
      </div>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
      <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">Interview Scheduled</p>
      <div className="flex items-end justify-between">
      <h3 className="text-3xl font-bold text-primary font-headline tabular-nums">
        {statsLoading ? "…" : formatCount(kpis.interviewScheduled)}
      </h3>
      <span className="material-symbols-outlined text-tertiary-fixed-variant" data-icon="event">event</span>
      </div>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 border-l-4 border-l-on-tertiary-container">
      <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">Selected</p>
      <div className="flex items-end justify-between gap-2">
      <h3 className="text-3xl font-bold text-primary font-headline tabular-nums">
        {statsLoading ? "…" : formatCount(kpis.selected)}
      </h3>
      <span className="text-on-tertiary-container font-bold text-sm text-right leading-tight" title="Offer stage, onboarding, or hired">
        {statsLoading ? "" : `${kpis.selectedSharePercent}% of total`}
      </span>
      </div>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
      <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">Rejected</p>
      <div className="flex items-end justify-between gap-2">
      <h3 className="text-3xl font-bold text-primary font-headline tabular-nums">
        {statsLoading ? "…" : formatCount(kpis.rejected)}
      </h3>
      <span className="text-error text-sm font-medium shrink-0">{statsLoading ? "" : `${kpis.rejectedRatePercent}% rate`}</span>
      </div>
      </div>
      </div>

      <section className="bg-primary-container text-white p-8 rounded-xl mb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <h4 className="text-sm font-semibold mb-8 flex items-center gap-2">
      <span className="material-symbols-outlined text-tertiary-fixed-dim" data-icon="analytics">analytics</span>
                          Active Recruitment Pipeline
                      </h4>
      <div className="flex items-center justify-between relative">

      <div className="absolute h-0.5 w-full bg-white/10 top-5 left-0"></div>

      <div className="flex flex-col items-center gap-3 relative z-10">
      <div className="w-10 h-10 rounded-full bg-tertiary-fixed-dim text-primary flex items-center justify-center font-bold">1</div>
      <p className="text-xs font-bold uppercase tracking-widest">Applied</p>
      <p className="text-xl font-headline font-bold tabular-nums">{statsLoading ? "…" : formatCount(pipeline.applied)}</p>
      </div>
      <div className="flex flex-col items-center gap-3 relative z-10">
      <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold">2</div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Screening</p>
      <p className="text-xl font-headline font-bold tabular-nums">{statsLoading ? "…" : formatCount(pipeline.screening)}</p>
      </div>
      <div className="flex flex-col items-center gap-3 relative z-10">
      <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-bold border border-white/20">3</div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Technical</p>
      <p className="text-xl font-headline font-bold tabular-nums">{statsLoading ? "…" : formatCount(pipeline.technical)}</p>
      </div>
      <div className="flex flex-col items-center gap-3 relative z-10">
      <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-bold border border-white/20">4</div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">HR Interview</p>
      <p className="text-xl font-headline font-bold tabular-nums">{statsLoading ? "…" : formatCount(pipeline.hrInterview)}</p>
      </div>
      <div className="flex flex-col items-center gap-3 relative z-10">
      <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-bold border border-white/20">5</div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Selected</p>
      <p className="text-xl font-headline font-bold tabular-nums">{statsLoading ? "…" : formatCount(pipeline.selected)}</p>
      </div>
      </div>
      </section>

      <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">

      <div className="col-span-12 lg:col-span-9 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden flex flex-col">
      <div className="p-6 flex items-center justify-between border-b border-surface-container shrink-0">
      <h4 className="font-bold text-primary font-headline">Recent Applications</h4>
      <div className="flex items-center gap-3">
      <input
        className="text-xs font-medium border-none bg-surface-container-low rounded-lg focus:ring-0 py-1.5 w-44"
        placeholder="Search table"
        type="search"
        value={searchFilter}
        onChange={(event) => setSearchFilter(event.target.value)}
        aria-label="Filter recent applications table"
      />
      <select className="text-xs font-medium border-none bg-surface-container-low rounded-lg focus:ring-0 py-1.5 w-44" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
      {roleOptions.map((role) => (
        <option key={role} value={role}>
          {role === "All" ? "Role: All" : role}
        </option>
      ))}
      </select>
      <select className="text-xs font-medium border-none bg-surface-container-low rounded-lg focus:ring-0 py-1.5 w-44" value={experienceFilter} onChange={(event) => setExperienceFilter(event.target.value)}>
      <option value="Any">Experience: Any</option>
      <option value="5+ Years">5+ Years</option>
      <option value="10+ Years">10+ Years</option>
      </select>
      <button className="p-1.5 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors" onClick={() => {
        setSearchFilter("");
        setRoleFilter("All");
        setExperienceFilter("Any");
      }}>
      <span className="material-symbols-outlined text-lg" data-icon="filter_list">filter_list</span>
      </button>
      </div>
      </div>
      <div className="overflow-x-hidden">
      <table className="w-full max-w-full table-auto text-left">
      <thead className="bg-surface-container-low border-b border-surface-container">
      <tr>
      <th className="px-4 lg:px-6 py-4 text-[10px] font-bold uppercase tracking-wide text-outline align-top">Candidate</th>
      <th className="px-4 lg:px-6 py-4 text-[10px] font-bold uppercase tracking-wide text-outline align-top whitespace-normal min-w-[6rem]">Role</th>
      <th className="px-3 lg:px-5 py-4 text-[10px] font-bold uppercase tracking-wide text-outline align-top whitespace-nowrap">Experience</th>
      <th className="px-3 lg:px-5 py-4 text-[10px] font-bold uppercase tracking-wide text-outline align-top whitespace-normal min-w-[6rem]">Stage</th>
      <th className="px-3 lg:px-5 py-4 text-[10px] font-bold uppercase tracking-wide text-outline align-top whitespace-normal min-w-[6rem]">Status</th>
      <th className="px-3 py-4 pr-4 lg:pr-6 text-[10px] font-bold uppercase tracking-wide text-outline text-right whitespace-nowrap w-24">Action</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-surface-container">
      {isLoading && <tr><td colSpan={6}><PageSkeleton rows={PAGE_SIZE} /></td></tr>}
      {isError && <tr><td colSpan={6}><ErrorState message="Failed to load applications." onRetry={refetch} /></td></tr>}
      {!isLoading && !isError && filteredApplications.map((application, index) => (
        <tr
          className={selectedApplicationId === application.id ? "bg-secondary/5 border-l-4 border-l-secondary cursor-pointer transition-colors" : index % 2 === 0 ? "hover:bg-surface-container-low transition-colors cursor-pointer" : "bg-surface-container-low/30 hover:bg-surface-container-low transition-colors cursor-pointer"}
          key={application.id}
          onClick={() => setSelectedApplicationId(application.id)}
        >
          <td className="px-4 lg:px-6 py-4 min-w-0 align-top">
            <div className="flex items-start gap-3 min-w-0">
              <div className="mt-0.5 w-10 h-10 shrink-0 rounded-full border border-outline-variant bg-surface-container-low flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {application.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 break-words">
                <p className="font-semibold text-primary text-sm leading-snug">{application.name}</p>
                <p className="text-[11px] text-outline leading-snug">{application.location}</p>
              </div>
            </div>
          </td>
          <td className="px-4 lg:px-6 py-4 text-sm font-medium text-on-surface-variant align-top break-words leading-snug">{application.role}</td>
          <td className="px-3 lg:px-5 py-4 text-sm text-outline align-top whitespace-nowrap">{application.experience}</td>
          <td className="px-3 lg:px-5 py-4 align-top">
            <span
              className={
                application.stage === "Technical Evaluation"
                  ? "inline-block max-w-full px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded uppercase tracking-tight leading-snug break-words"
                  : application.stage === "Offer & Onboarding" || application.stage === "Employee"
                    ? "inline-block max-w-full px-2 py-1 bg-on-tertiary-container/10 text-on-tertiary-container text-[10px] font-bold rounded uppercase tracking-tight leading-snug break-words"
                    : "inline-block max-w-full px-2 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded uppercase tracking-tight leading-snug break-words"
              }
            >
              {application.stage}
            </span>
          </td>
          <td className="px-3 lg:px-5 py-4 align-top">
            <div className="flex items-start gap-2">
              <div
                className={
                  application.status === "In Progress"
                    ? "mt-1.5 w-2 h-2 shrink-0 rounded-full bg-secondary"
                    : application.status === "Offer Sent" || application.status === "Employee"
                      ? "mt-1.5 w-2 h-2 shrink-0 rounded-full bg-on-tertiary-container"
                      : "mt-1.5 w-2 h-2 shrink-0 rounded-full bg-outline-variant"
                }
              ></div>
              <span className="text-xs font-medium text-primary leading-snug break-words">{application.status}</span>
            </div>
          </td>
          <td className="px-3 py-4 pr-4 lg:pr-6 text-right whitespace-nowrap align-top w-24">
            <button
              type="button"
              className="inline-flex items-center justify-center p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container-low"
              onClick={(event) => {
                event.stopPropagation();
                handleView(application.id);
              }}
              aria-label={`View ${application.name}`}
            >
              <span className="material-symbols-outlined text-xl leading-none" data-icon="visibility">visibility</span>
            </button>
          </td>
        </tr>
      ))}
      {!isLoading && !isError && filteredApplications.length === 0 && (
        <tr>
          <td className="px-6 py-8 text-sm text-outline text-center" colSpan={6}>
            No applications found.
          </td>
        </tr>
      )}
      </tbody>
      </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-surface-container bg-surface-container-low/40 shrink-0">
        <p className="text-xs text-outline">
          {total === 0 ? "0 applicants" : `${total} applicants — page ${page} of ${totalPages}`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-surface-container-low text-primary border border-outline-variant/20 hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-xs font-semibold text-on-surface-variant tabular-nums px-1">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-surface-container-low text-primary border border-outline-variant/20 hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
      </div>

      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 min-w-0">
      {selectedApplication ? (
      <div className="min-w-0 w-full bg-white/70 backdrop-blur-md rounded-xl shadow-[0_40px_40px_0px_rgba(0,6,21,0.04)] border border-white/40 p-8">
      <div className="mb-6 text-center">
      <div className="mx-auto mb-4 flex w-24 justify-center">
      <EntityAvatar name={selectedApplication.name} size="xl" rounded="xl" className="border-2 border-white shadow-lg" />
      </div>
      <h5 className="text-xl font-bold text-primary font-headline break-words leading-snug px-0.5">{selectedApplication.name}</h5>
      <p className="text-secondary font-semibold text-sm break-words leading-snug mt-1 px-0.5">{selectedApplication.role}</p>
      </div>
      <div className="space-y-4 mb-8 min-w-0">
      <div className="flex items-start gap-3 text-sm min-w-0">
      <span className="material-symbols-outlined text-outline shrink-0 mt-0.5" data-icon="location_on">location_on</span>
      <span className="min-w-0 flex-1 text-on-surface-variant break-words leading-snug">{selectedApplication.location}</span>
      </div>
      <div className="flex items-start gap-3 text-sm min-w-0">
      <span className="material-symbols-outlined text-outline shrink-0 mt-0.5" data-icon="mail">mail</span>
      <Link className="min-w-0 flex-1 break-all text-left text-on-surface-variant leading-snug" to={`mailto:${selectedApplication.email}`}>{selectedApplication.email}</Link>
      </div>
      <div className="flex items-start gap-3 text-sm min-w-0">
      <span className="material-symbols-outlined text-outline shrink-0 mt-0.5" data-icon="attach_file">attach_file</span>
      <AdminResumePreviewLink application={selectedApplication} onOpenPreview={setDocumentPreview} />
      </div>
      </div>
      <div className="mb-2">
      <h6 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-3">Core Skills</h6>
      <div className="flex flex-wrap gap-2">
        {applicationSkillsList(selectedApplication).length === 0 ? (
          <p className="text-xs text-outline leading-snug">No skills listed for this application.</p>
        ) : (
          applicationSkillsList(selectedApplication).map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[11px] font-semibold rounded-full border border-outline-variant/10 max-w-full break-words"
            >
              {skill}
            </span>
          ))
        )}
      </div>
      </div>
      {actionBanner.message && selectedApplication?.id ? (
        <p
          className={
            actionBanner.type === "error"
              ? "mb-3 rounded-lg border border-error/30 bg-error-container/10 px-3 py-2 text-xs font-medium text-error"
              : "mb-3 rounded-lg border border-secondary/30 bg-secondary/5 px-3 py-2 text-xs font-medium text-primary"
          }
        >
          {actionBanner.message}
        </p>
      ) : null}
      {Boolean(selectedApplication?.portalApprovedAt) && (
        <p className="mb-3 text-xs font-semibold text-secondary">Portal access already granted — applicant was emailed.</p>
      )}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          title="Approves this application and emails the applicant their portal login, temporary password, and next steps."
          className="w-full py-3 bg-primary-container text-white rounded-lg font-bold text-sm hover:translate-y-[-2px] transition-transform shadow-md disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          disabled={
            approvePortalMutation.isPending ||
            rejectApplicationMutation.isPending ||
            Boolean(selectedApplication?.portalApprovedAt) ||
            /reject/i.test(selectedApplication?.status || "") ||
            selectedApplication?.lifecycleStage === "employee"
          }
          onClick={() => {
            if (!selectedApplication?.id) return;
            approvePortalMutation.mutate(selectedApplication.id);
          }}
        >
          {approvePortalMutation.isPending ? "Working…" : "Select"}
        </button>
        <button
          type="button"
          className="w-full py-2.5 border border-error/20 text-error font-semibold text-sm rounded-lg hover:bg-error/5 transition-all disabled:opacity-45 disabled:cursor-not-allowed"
          disabled={
            rejectApplicationMutation.isPending ||
            approvePortalMutation.isPending ||
            /reject/i.test(selectedApplication?.status || "") ||
            selectedApplication?.lifecycleStage === "employee"
          }
          onClick={() => {
            if (!selectedApplication?.id) return;
            if (
              !window.confirm(
                `Reject application for ${selectedApplication.name}? They will lose portal access if it was granted.`
              )
            ) {
              return;
            }
            rejectApplicationMutation.mutate(selectedApplication.id);
          }}
        >
          {rejectApplicationMutation.isPending ? "Rejecting…" : "Reject"}
        </button>
        <button
          type="button"
          className="w-full py-2 text-xs font-semibold text-secondary border border-outline-variant/30 rounded-lg hover:bg-surface-container-low/80"
          onClick={() => handleView(selectedApplication.id)}
        >
          Open full profile
        </button>
      </div>
      </div>
      ) : (
      <div
        className="bg-surface-container-lowest/40 rounded-xl border border-outline-variant/15 border-dashed min-h-[28rem] shadow-sm"
        aria-hidden="true"
      />
      )}
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
    </>
  );
}
