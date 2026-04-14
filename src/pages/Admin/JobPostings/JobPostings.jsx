import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs } from "@/fixtures/catalog";
import { loadJobPostingsFromSession, persistJobPostingsToSession } from "./jobPostingsSession";
import CreateJobModal from "../components/CreateJobModal";

export default function JobPostings() {
  const navigate = useNavigate();

  const [jobsData, setJobsData] = useState(() => {
    const fromSession = loadJobPostingsFromSession();
    if (Array.isArray(fromSession) && fromSession.length > 0) return fromSession;
    return [...getJobs()];
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    category: "All",
    seniority: "All",
    type: "All",
  });

  const isArchivedStatus = (status) => status === "ARCHIVED" || status === "Archived";

  useEffect(() => {
    persistJobPostingsToSession(jobsData);
  }, [jobsData]);

  const categoryOptions = useMemo(() => {
    const set = new Set(jobsData.map((j) => j.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [jobsData]);

  const seniorityOptions = useMemo(() => {
    const set = new Set(jobsData.map((j) => j.seniority).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [jobsData]);

  const typeOptions = useMemo(() => {
    const set = new Set(jobsData.map((j) => j.type).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [jobsData]);

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobsData.filter((job) => {
      if (!showArchived && isArchivedStatus(job.status)) return false;

      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        (job.category || "").toLowerCase().includes(q) ||
        (job.location || "").toLowerCase().includes(q);

      const matchCategory = filters.category === "All" || job.category === filters.category;
      const matchType = filters.type === "All" || job.type === filters.type;
      const matchSeniority = filters.seniority === "All" || job.seniority === filters.seniority;

      return matchSearch && matchCategory && matchType && matchSeniority;
    });
  }, [search, filters, jobsData, showArchived]);

  const totalActiveJobs = jobsData.filter((job) => job.status === "Active").length;
  const totalApplications = jobsData.reduce((sum, job) => sum + Number(job.applicants || 0), 0);
  const closedPositions = jobsData.filter((job) => job.status === "Closed").length;
  const openPositions = jobsData.length - closedPositions;
  const closedPositionsDisplay = String(closedPositions).padStart(2, "0");

  const jobsTotal = filteredData.length;
  const jobsShowingStart = jobsTotal === 0 ? 0 : 1;
  const jobsShowingEnd = jobsTotal;

  const formatPostedDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const openCreatePanel = () => {
    setEditingJob(null);
    setIsCreateOpen(true);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setIsCreateOpen(true);
  };

  const handleDelete = (jobId) => {
    setJobsData((prev) => prev.filter((job) => job.id !== jobId));
  };

  const handleCloseModal = () => {
    setEditingJob(null);
    setIsCreateOpen(false);
  };

  const handleSaveJob = (jobData) => {
    if (editingJob) {
      setJobsData((prev) => prev.map((j) => (j.id === editingJob.id ? { ...j, ...jobData } : j)));
    } else {
      const jobWithId = {
        ...jobData,
        id: Date.now().toString(),
        status: "Active",
        applicants: 0,
        postedDate: jobData.postedDate || new Date().toISOString().slice(0, 10),
        requirements: jobData.requirements?.length ? jobData.requirements : [],
      };
      setJobsData((prev) => [jobWithId, ...prev]);
    }
    setEditingJob(null);
    setIsCreateOpen(false);
  };

  const clearFilters = () => {
    setFilters({ category: "All", seniority: "All", type: "All" });
    setSearch("");
  };

  return (
    <>
      <main className="ml-64 min-h-screen relative flex flex-col">
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-[#ffffff]/60 dark:bg-[#000615]/60 backdrop-blur-2xl flex justify-between items-center px-8">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm" data-icon="search">
                search
              </span>
              <input
                className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:ring-1 focus:ring-tertiary-fixed-dim transition-all"
                placeholder="Search resources..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors relative">
              <span className="material-symbols-outlined text-on-surface-variant" data-icon="notifications">
                notifications
              </span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant" data-icon="help_outline">
                help_outline
              </span>
            </button>
            <div className="h-6 w-[1px] bg-outline-variant/30 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <span className="text-xs font-medium text-primary group-hover:text-secondary transition-colors">Admin Portal</span>
              <span className="material-symbols-outlined text-xs" data-icon="expand_more">
                expand_more
              </span>
            </div>
          </div>
        </header>

        <div className="pt-24 px-8 pb-12 flex-1">
          <div className="min-w-0">
            <header className="mb-10">
              <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-2">Job Postings</h1>
              <p className="text-on-surface-variant font-body leading-relaxed max-w-2xl">
                Manage and publish job openings that appear on the careers page. Streamline your hiring pipeline from a single command center.
              </p>
              <button
                type="button"
                className="mt-4 px-6 py-2.5 bg-primary-container text-white font-semibold rounded-lg shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2"
                onClick={openCreatePanel}
              >
                <span className="material-symbols-outlined text-sm" data-icon="add">
                  add
                </span>
                Create New Posting
              </button>
            </header>

            <div className="grid grid-cols-4 gap-6 mb-12">
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[40px_0_40px_rgba(0,6,21,0.04)] border border-outline-variant/10 group hover:translate-y-[-2px] transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-secondary-fixed/30 rounded-lg">
                    <span className="material-symbols-outlined text-secondary" data-icon="assignment">
                      assignment
                    </span>
                  </div>
                  <span className="text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                    +12%{" "}
                    <span className="material-symbols-outlined text-[14px]" data-icon="trending_up">
                      trending_up
                    </span>
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-primary mb-1">{totalActiveJobs}</div>
                <div className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Total Active Jobs</div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[40px_0_40px_rgba(0,6,21,0.04)] border border-outline-variant/10 group hover:translate-y-[-2px] transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-tertiary-fixed/30 rounded-lg">
                    <span className="material-symbols-outlined text-on-tertiary-container" data-icon="group">
                      group
                    </span>
                  </div>
                  <span className="text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                    +8%{" "}
                    <span className="material-symbols-outlined text-[14px]" data-icon="trending_up">
                      trending_up
                    </span>
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-primary mb-1">{totalApplications}</div>
                <div className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Total Applications</div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[40px_0_40px_rgba(0,6,21,0.04)] border border-outline-variant/10 group hover:translate-y-[-2px] transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary-fixed/30 rounded-lg">
                    <span className="material-symbols-outlined text-on-primary-fixed-variant" data-icon="door_open">
                      door_open
                    </span>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1 bg-surface-container px-2 py-1 rounded">
                    Stable{" "}
                    <span className="material-symbols-outlined text-[14px]" data-icon="horizontal_rule">
                      horizontal_rule
                    </span>
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-primary mb-1">{openPositions}</div>
                <div className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Open Positions</div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[40px_0_40px_rgba(0,6,21,0.04)] border border-outline-variant/10 group hover:translate-y-[-2px] transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-error-container/30 rounded-lg">
                    <span className="material-symbols-outlined text-error" data-icon="lock">
                      lock
                    </span>
                  </div>
                  <span className="text-xs font-bold text-error flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
                    -2%{" "}
                    <span className="material-symbols-outlined text-[14px]" data-icon="trending_down">
                      trending_down
                    </span>
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-primary mb-1">{closedPositionsDisplay}</div>
                <div className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Closed Positions</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 mb-8 flex flex-wrap items-center gap-4">
              <div className="relative max-w-[400px] w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" data-icon="search">
                  search
                </span>
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-tertiary-fixed-dim"
                  placeholder="Search job titles, roles..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="bg-surface-container-low border-none rounded-lg px-4 py-2.5 text-sm text-on-surface-variant focus:ring-1 focus:ring-tertiary-fixed-dim cursor-pointer"
                value={filters.category}
                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "Role Category" : c}
                  </option>
                ))}
              </select>
              <select
                className="bg-surface-container-low border-none rounded-lg px-4 py-2.5 text-sm text-on-surface-variant focus:ring-1 focus:ring-tertiary-fixed-dim cursor-pointer"
                value={filters.seniority}
                onChange={(e) => setFilters((f) => ({ ...f, seniority: e.target.value }))}
              >
                {seniorityOptions.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "Seniority" : s}
                  </option>
                ))}
              </select>
              <select
                className="bg-surface-container-low border-none rounded-lg px-4 py-2.5 text-sm text-on-surface-variant focus:ring-1 focus:ring-tertiary-fixed-dim cursor-pointer"
                value={filters.type}
                onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
              >
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t === "All" ? "Employment Type" : t}
                  </option>
                ))}
              </select>
              <button type="button" className="px-4 py-2.5 text-sm font-semibold text-secondary hover:bg-secondary-fixed/20 rounded-lg transition-colors" onClick={clearFilters}>
                Clear Filters
              </button>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant">
                <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="rounded border-outline-variant" />
                Show archived
              </label>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-[40px_0_40px_rgba(0,6,21,0.04)] border border-outline-variant/10 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Job Title</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Location</th>
                    <th className="px-4 py-4">Salary</th>
                    <th className="px-4 py-4 text-center">Applicants</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-outline-variant/10">
                  {filteredData.map((job, index) => {
                    const status = job.status;
                    const dateLabel = isArchivedStatus(status)
                      ? "Archived"
                      : status === "Active"
                        ? "Posted"
                        : status === "Closed"
                          ? "Closed"
                          : "Updated";
                    const statusPill =
                      status === "Active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                          {status}
                        </span>
                      ) : status === "Closed" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                          {status}
                        </span>
                      ) : isArchivedStatus(status) ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                          Archived
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                          {status}
                        </span>
                      );

                    const applicants = Number(job.applicants || 0);
                    const applicantsPill =
                      applicants === 0 ? (
                        <span className="bg-surface-container text-outline px-3 py-1 rounded-full text-xs font-bold">{applicants}</span>
                      ) : (
                        <span className="bg-secondary-fixed/20 text-secondary px-3 py-1 rounded-full text-xs font-bold">{applicants}</span>
                      );

                    return (
                      <tr
                        className={
                          index % 2 === 1
                            ? "hover:bg-surface-container-low/30 transition-colors bg-surface-container-low/10 cursor-pointer"
                            : "hover:bg-surface-container-low/30 transition-colors cursor-pointer"
                        }
                        key={job.id}
                        onClick={() => navigate(`/admin/job-postings/${job.id}`, { state: { job } })}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-primary">{job.title}</span>
                            <span className="text-[11px] text-on-surface-variant">
                              {dateLabel}: {formatPostedDate(job.postedDate)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-on-surface-variant">{job.category}</td>
                        <td className="px-4 py-4 text-on-surface-variant">{job.location}</td>
                        <td className="px-4 py-4 text-primary font-medium">{job.salary}</td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">{applicantsPill}</div>
                        </td>
                        <td className="px-4 py-4">{statusPill}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              className="p-2 hover:bg-surface-container rounded-lg text-outline transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/job-postings/${job.id}`, { state: { job } });
                              }}
                            >
                              <span className="material-symbols-outlined text-[20px]" data-icon="visibility">
                                visibility
                              </span>
                            </button>
                            <button
                              type="button"
                              className="p-2 hover:bg-surface-container rounded-lg text-outline transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(job);
                              }}
                            >
                              <span className="material-symbols-outlined text-[20px]" data-icon="edit">
                                edit
                              </span>
                            </button>
                            <button
                              type="button"
                              className="p-2 hover:bg-error-container/20 rounded-lg text-error transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(job.id);
                              }}
                            >
                              <span className="material-symbols-outlined text-[20px]" data-icon="delete">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="bg-surface-container-lowest px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">
                  Showing {jobsShowingStart} to {jobsShowingEnd} of {jobsTotal} positions
                </span>
                <div className="flex gap-2">
                  <button type="button" className="p-2 border border-outline-variant/20 rounded-lg text-outline hover:bg-surface-container transition-all">
                    <span className="material-symbols-outlined text-[18px]" data-icon="chevron_left">
                      chevron_left
                    </span>
                  </button>
                  <button type="button" className="p-2 border border-outline-variant/20 rounded-lg text-outline hover:bg-surface-container transition-all">
                    <span className="material-symbols-outlined text-[18px]" data-icon="chevron_right">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {isCreateOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 cursor-default border-none bg-black/10 backdrop-blur-sm"
            aria-label="Close dialog"
            onClick={handleCloseModal}
          />
          <div className="relative z-10 max-h-[90vh] w-[600px] overflow-y-auto">
            <CreateJobModal editingJob={editingJob} onClose={handleCloseModal} onSave={handleSaveJob} />
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <svg className="absolute w-full h-full opacity-[0.03]" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path className="text-primary" d="M0,50 Q25,25 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.1"></path>
          <path className="text-primary" d="M0,30 Q35,65 70,30 T100,30" fill="none" stroke="currentColor" strokeWidth="0.1"></path>
          <circle className="text-secondary" cx="20" cy="40" fill="currentColor" r="0.5"></circle>
          <circle className="text-secondary" cx="60" cy="80" fill="currentColor" r="0.5"></circle>
          <circle className="text-secondary" cx="85" cy="20" fill="currentColor" r="0.5"></circle>
        </svg>
      </div>
    </>
  );
}
