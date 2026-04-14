import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getJobs } from "@/fixtures/catalog";
import { useApplicationsSync } from "@/data/applicationsStore";
import { loadJobPostingsFromSession, persistJobPostingsToSession } from "./jobPostingsSession";
function splitTitle(title) {
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return { line1: title, line2: null };
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(" "),
    line2: words.slice(mid).join(" "),
  };
}

function isArchivedStatus(status) {
  return status === "ARCHIVED" || status === "Archived";
}

function jobPostingBadgeCopy(status) {
  if (status === "Active") return "Active Posting";
  if (status === "Closed") return "Closed Posting";
  if (status === "Draft") return "Draft Posting";
  if (isArchivedStatus(status)) return "Archived Posting";
  return `${status} Posting`;
}

function resolveMergedJobs() {
  const fromSession = loadJobPostingsFromSession();
  return Array.isArray(fromSession) && fromSession.length > 0 ? fromSession : [...getJobs()];
}

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications } = useApplicationsSync();
  const [job, setJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(null);

  const reloadJob = useCallback(() => {
    const merged = resolveMergedJobs();
    const found = merged.find((j) => String(j.id) === String(id));
    setJob(found ?? null);
    return found ?? null;
  }, [id]);

  useEffect(() => {
    reloadJob();
    setIsEditing(false);
    setEditDraft(null);
  }, [reloadJob]);

  const jobApplicants = useMemo(
    () => applications.filter((app) => String(app.jobId ?? "") === String(id)),
    [applications, id],
  );

  const employmentLabel = job ? [job.type, job.contract].filter(Boolean).join(", ") : "";

  const salaryDisplay = job ? String(job.salary).replace(/\s*-\s*/, " — ") : "";

  const applicantCount = jobApplicants.length;
  const screeningCount =
    applicantCount > 0 ? Math.max(1, Math.round(applicantCount * 0.29)) : 0;
  const interviewsCount =
    applicantCount > 0 ? Math.max(0, Math.round(applicantCount * 0.12)) : 0;

  const experienceBlurb = job
    ? `Minimum expectations align with ${job.seniority || "the posted level"}${
        job.experience ? ` (${job.experience})` : ""
      }. Key focus areas include ${(job.requirements || []).slice(0, 4).join(", ") || "core role competencies"}.`
    : "";

  const startEdit = () => {
    if (!job) return;
    setEditDraft({
      title: job.title,
      description: job.description || "",
      location: job.location || "",
      salary: job.salary || "",
      category: job.category || "",
    });
    setIsEditing(true);
  };

  const handleSaveDetails = () => {
    if (!job || !editDraft) return;
    const title = editDraft.title.trim();
    if (!title) return;

    const location = editDraft.location.trim() || job.location;
    const salary = editDraft.salary.trim() || job.salary;
    const category = editDraft.category.trim() || job.category;
    const description = editDraft.description.trim();

    const merged = resolveMergedJobs();
    const next = merged.map((j) =>
      String(j.id) === String(id)
        ? {
            ...j,
            title,
            description,
            location,
            salary,
            category,
            sector: category,
            meta: [location, j.type, salary],
          }
        : j,
    );
    persistJobPostingsToSession(next);
    setJob((prev) =>
      prev
        ? {
            ...prev,
            title,
            description,
            location,
            salary,
            category,
            sector: category,
            meta: [location, prev.type, salary],
          }
        : prev,
    );
    setIsEditing(false);
    setEditDraft(null);
  };

  const handleArchive = () => {
    if (!id) return;
    const merged = resolveMergedJobs();
    const next = merged.map((j) =>
      String(j.id) === String(id) ? { ...j, status: "ARCHIVED" } : j,
    );
    persistJobPostingsToSession(next);
    setJob((prev) => (prev ? { ...prev, status: "ARCHIVED" } : prev));
  };

  if (!job) {
    return (
      <>
        <main className="ml-64 min-h-screen bg-surface bg-[radial-gradient(circle_at_2px_2px,rgba(0,6,21,0.05)_1px,transparent_0)] bg-[length:40px_40px] pt-16 font-body text-on-surface font-['Inter']">
          <div className="mx-auto max-w-7xl px-12 py-10">
            <p className="text-on-surface-variant">Job not found.</p>
            <button
              type="button"
              className="mt-6 rounded-lg border border-outline-variant/30 px-6 py-3 text-sm font-bold text-primary-container transition-all hover:bg-surface-container-low"
              onClick={() => navigate("/admin/job-postings")}
            >
              Back to Job Postings
            </button>
          </div>
        </main>
      </>
    );
  }

  const displayTitle = isEditing && editDraft ? editDraft.title : job.title;
  const titleParts = splitTitle(displayTitle);

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
      <header className="fixed right-0 top-0 z-30 flex h-16 w-[calc(100%-16rem)] items-center justify-between border-b border-[#c4c6ce]/15 bg-white/60 px-8 font-['Inter'] text-sm font-medium backdrop-blur-xl dark:bg-[#000615]/60">
        <div className="flex w-1/3 items-center gap-4">
          <div className="group relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-outline">search</span>
            <input
              className="w-full rounded-full border-none bg-surface-container/50 py-2 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-[#4cd7f6]/20"
              placeholder="Search architectural assets..."
              type="search"
              readOnly
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100/50"
          >
            <span className="material-symbols-outlined" data-icon="notifications">
              notifications
            </span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-tertiary-fixed-dim"></span>
          </button>
          <button type="button" className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100/50">
            <span className="material-symbols-outlined" data-icon="help_outline">
              help_outline
            </span>
          </button>
          <div className="mx-2 h-8 w-[1px] bg-outline-variant/30"></div>
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right">
              <p className="text-xs font-bold text-primary">Alex Sterling</p>
              <p className="text-[10px] text-slate-500">Global Admin</p>
            </div>
            <img
              alt="Admin Profile"
              className="h-9 w-9 rounded-full border border-outline-variant/20 bg-slate-200 object-cover"
              data-alt="professional portrait of a senior executive in a modern tech environment with soft cool lighting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7ifhQT3IJ8VG-WDChBmulefO-NpZ3tBYpmQGYLRgejVB-YtCe4PoVlJPM066KiRaZZScWwbpIM8TKxN_RkhbNvbkoD1t-XYUech7PhqPhP6PliCwBTv0sSTBzPwOfILeqmEdm5z01EVnzRVqfuXi2M2S96GQR6mVeVJhxX_hvr79ZchoXlS-_Wks7wRPJPTU0fUl6w96KMUW-7NmXMuxiRO4xaxD8SzVHyLN5ahGec1fYm_2FFaDHQ92c_BRgvoRlIG7ebCo9_KTQ"
            />
          </div>
        </div>
      </header>

      <main className="ml-64 min-h-screen bg-[radial-gradient(circle_at_2px_2px,rgba(0,6,21,0.05)_1px,transparent_0)] bg-[length:40px_40px] pt-16">
        <div className="mx-auto max-w-7xl px-12 py-10">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-outline">
            <Link className="transition-colors hover:text-primary" to="/admin/job-postings">
              Job Postings
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary-container">{displayTitle}</span>
          </nav>

          <section className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-tertiary-fixed/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-tertiary-container">
                {job.status === "Active" ? (
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tertiary-fixed-dim"></span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-outline-variant"></span>
                )}
                {jobPostingBadgeCopy(job.status)}
              </div>
              {isEditing && editDraft ? (
                <input
                  className="max-w-2xl w-full font-headline text-5xl font-black leading-tight tracking-tighter text-primary bg-transparent border-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 rounded-lg px-1"
                  value={editDraft.title}
                  onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))}
                />
              ) : (
                <h2 className="max-w-2xl font-headline text-5xl font-black leading-tight tracking-tighter text-primary">
                  {titleParts.line1}
                  {titleParts.line2 ? (
                    <>
                      <br />
                      {titleParts.line2}
                    </>
                  ) : null}
                </h2>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                className="flex items-center gap-2 rounded-lg bg-primary-container px-6 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary-container/10 transition-all hover:-translate-y-0.5"
                to={`/admin/applications?jobId=${encodeURIComponent(id)}`}
              >
                <span className="material-symbols-outlined text-sm" data-icon="visibility">
                  visibility
                </span>
                View Applicants
              </Link>
              {!isEditing ? (
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-outline-variant/30 px-6 py-3 text-sm font-bold text-primary-container transition-all hover:bg-surface-container-low"
                  onClick={startEdit}
                >
                  <span className="material-symbols-outlined text-sm" data-icon="edit">
                    edit
                  </span>
                  Edit Posting
                </button>
              ) : (
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-outline-variant/30 px-6 py-3 text-sm font-bold text-primary-container transition-all hover:bg-surface-container-low"
                  onClick={handleSaveDetails}
                >
                  <span className="material-symbols-outlined text-sm" data-icon="save">
                    save
                  </span>
                  Save
                </button>
              )}
              <button
                type="button"
                className="rounded-lg border border-outline-variant/30 p-3 text-error transition-all hover:bg-error-container/20"
                onClick={handleArchive}
              >
                <span className="material-symbols-outlined text-sm" data-icon="archive">
                  archive
                </span>
              </button>
            </div>
          </section>

          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 space-y-10 lg:col-span-8">
              <div className="rounded-xl border border-[rgba(196,198,206,0.15)] bg-[rgba(255,255,255,0.7)] p-10 backdrop-blur-[16px]">
                <h3 className="mb-6 flex items-center gap-3 font-headline text-xl font-bold text-primary">
                  Strategic Impact
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-outline-variant/50 to-transparent"></div>
                </h3>
                {isEditing && editDraft ? (
                  <textarea
                    className="text-lg font-medium leading-relaxed text-on-surface-variant w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-1 focus:ring-tertiary-fixed-dim resize-y min-h-[120px]"
                    value={editDraft.description}
                    onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                  />
                ) : (
                  <p className="text-lg font-medium leading-relaxed text-on-surface-variant">{job.description}</p>
                )}
              </div>

              {isEditing && editDraft ? (
                <div className="rounded-xl border border-[rgba(196,198,206,0.15)] bg-[rgba(255,255,255,0.7)] p-6 backdrop-blur-[16px]">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 block">Category</label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-tertiary-fixed-dim"
                    value={editDraft.category}
                    onChange={(e) => setEditDraft((d) => ({ ...d, category: e.target.value }))}
                  />
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-secondary">
                    <span className="material-symbols-outlined text-lg" data-icon="task_alt">
                      task_alt
                    </span>
                    Key Responsibilities
                  </h4>
                  <ul className="space-y-4">
                    {(job.requirements || []).map((item) => (
                      <li key={item} className="flex items-start gap-4">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary-fixed-dim"></span>
                        <span className="text-sm font-medium text-on-surface-variant">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-secondary">
                    <span className="material-symbols-outlined text-lg" data-icon="verified">
                      verified
                    </span>
                    Requirements &amp; Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(job.skills || []).map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-surface-container-high px-4 py-2 text-xs font-bold text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs leading-loose text-outline">{experienceBlurb}</p>
                </div>
              </div>

              <div className="rounded-xl border border-[rgba(196,198,206,0.15)] bg-[rgba(255,255,255,0.7)] p-10 backdrop-blur-[16px]">
                <h3 className="mb-6 flex items-center gap-3 font-headline text-xl font-bold text-primary">
                  Applicants for this role
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-outline-variant/50 to-transparent"></div>
                </h3>
                {jobApplicants.length === 0 ? (
                  <p className="text-sm text-on-surface-variant">No applications linked to this job yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {jobApplicants.map((app) => (
                      <li key={app.id} className="flex items-center justify-between gap-4 border-b border-outline-variant/10 pb-3 last:border-none">
                        <div>
                          <Link
                            className="text-sm font-bold text-primary hover:text-secondary"
                            to={`/admin/applications/${app.id}`}
                          >
                            {app.name}
                          </Link>
                          <p className="text-xs text-on-surface-variant">
                            {app.role} · {app.stage}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-on-surface-variant">{app.status}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="col-span-12 space-y-8 lg:col-span-4">
              <div className="relative overflow-hidden rounded-xl bg-primary-container p-8 text-on-primary shadow-2xl">
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-tertiary-fixed/10 blur-3xl"></div>
                <h4 className="mb-8 text-xs font-bold uppercase tracking-[0.3em] text-tertiary-fixed-dim">Job Overview</h4>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim" data-icon="location_on">
                      location_on
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-[10px] font-bold uppercase text-on-primary-container/60">Location</p>
                      {isEditing && editDraft ? (
                        <input
                          className="w-full rounded bg-on-primary/10 px-2 py-1 text-sm font-bold text-on-primary border-none"
                          value={editDraft.location}
                          onChange={(e) => setEditDraft((d) => ({ ...d, location: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm font-bold">{job.location}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim" data-icon="schedule">
                      schedule
                    </span>
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase text-on-primary-container/60">Employment Type</p>
                      <p className="text-sm font-bold">{employmentLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim" data-icon="payments">
                      payments
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-[10px] font-bold uppercase text-on-primary-container/60">Salary Range</p>
                      {isEditing && editDraft ? (
                        <input
                          className="w-full rounded bg-on-primary/10 px-2 py-1 text-lg font-black tracking-tight text-on-primary border-none"
                          value={editDraft.salary}
                          onChange={(e) => setEditDraft((d) => ({ ...d, salary: e.target.value }))}
                        />
                      ) : (
                        <p className="text-lg font-black tracking-tight">{salaryDisplay}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[rgba(196,198,206,0.15)] bg-[rgba(255,255,255,0.7)] p-8 backdrop-blur-[16px]">
                <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-outline">Application Metrics</h4>
                <div className="space-y-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-headline text-3xl font-black text-primary">{applicantCount}</p>
                      <p className="mt-1 text-[11px] font-bold uppercase text-outline">Total Applicants</p>
                    </div>
                    <div className="text-right">
                      <p className="rounded bg-tertiary-fixed/30 px-2 py-0.5 text-xs font-bold text-on-tertiary-container">
                        +12% vs avg
                      </p>
                    </div>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-surface-container">
                    <div className="h-full bg-primary-container" style={{ width: "28%" }}></div>
                    <div className="h-full bg-secondary" style={{ width: "12%" }}></div>
                    <div className="h-full bg-tertiary-fixed-dim" style={{ width: "60%" }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-surface-container-low p-4">
                      <p className="text-lg font-bold text-primary">{screeningCount}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-outline">Screening</p>
                    </div>
                    <div className="rounded-lg bg-surface-container-low p-4">
                      <p className="text-lg font-bold text-primary">{interviewsCount}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-outline">Interviews</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative h-40 overflow-hidden rounded-xl grayscale transition-all duration-500 hover:grayscale-0">
                <img
                  alt="Location Map"
                  className="h-full w-full object-cover"
                  data-alt="minimalist architectural map of London city center with stylized blue and grey accents"
                  data-location="London"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL7tgc5aMc-aGRhl09sKJRm67eLX8mBGFl1McicTrwxXCECTXyzPw92JNlrBDfnMvW2vpcGPHJgZHqwzfe18Le5_mTCLCeLusj4zls8jMgtqlYOT7fbxzVMM99AnGp4Y0Cqm6bXv5uWQ8SkROO7fsEGkaqkMlFvK21hD4APM92jxwM_KgR3RCDmBnTznvJRK4csf2zE3_nsdR_0itvV8xqdyIoNT6ltxboL3smCHLs5jxeYipFn7mADEGfktyHP9wQkzWNQZL8nPK1"
                />
                <div className="absolute inset-0 bg-primary/20 transition-colors group-hover:bg-transparent"></div>
                <div className="absolute bottom-4 left-4 rounded bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-tighter shadow-sm backdrop-blur">
                  HQ Hub: {String(job.location).split(",")[0]?.trim() || "Global"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
