import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Form/Button";
import { formatPostedDate, iconForJob } from "../utils/presentJob";

export default function JobDetailModal({ job, open, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !job) return null;

  const skills = Array.isArray(job.skills) ? job.skills.filter(Boolean) : [];
  const requirements = Array.isArray(job.requirements) ? job.requirements.filter(Boolean) : [];
  const posted = formatPostedDate(job.postedDate);
  const icon = iconForJob(job);
  const employment = job.jobType || job.type || "";
  const category = (job.category || job.sector || "").trim();

  const content = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true" aria-labelledby="job-detail-title">
      <button
        type="button"
        className="absolute inset-0 bg-[#0b1f3a]/60 backdrop-blur-sm"
        aria-label="Close job details"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[min(90vh,880px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/30 bg-white shadow-[0_40px_100px_-20px_rgba(0,6,21,0.35)]">
        <div className="hero-gradient flex shrink-0 items-start justify-between gap-4 px-8 py-7 text-white">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <span className="material-symbols-outlined text-3xl text-tertiary-fixed">{icon}</span>
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.28em] text-white/70">Role overview</p>
              <h2 id="job-detail-title" className="font-headline text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
                {job.title}
              </h2>
              {posted ? <p className="mt-2 text-xs font-medium text-white/60">Posted {posted}</p> : null}
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-xl p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
          <div className="mb-6 flex flex-wrap gap-2">
            {category ? (
              <span className="rounded-full bg-primary-container/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary ring-1 ring-primary-container/20">
                {category}
              </span>
            ) : null}
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                job.status === "Active"
                  ? "bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-500/20"
                  : job.status === "Closed"
                    ? "bg-red-500/10 text-red-700 ring-1 ring-red-500/15"
                    : "bg-amber-500/10 text-amber-900 ring-1 ring-amber-500/20"
              }`}
            >
              {job.status}
            </span>
          </div>

          <dl className="mb-8 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div className="glass-card rounded-2xl border border-outline-variant/10 p-4">
              <dt className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Location</dt>
              <dd className="mt-1 font-semibold text-primary">{job.location || "—"}</dd>
            </div>
            <div className="glass-card rounded-2xl border border-outline-variant/10 p-4">
              <dt className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Salary</dt>
              <dd className="mt-1 font-semibold text-primary">{(job.salary || "").trim() || "—"}</dd>
            </div>
            <div className="glass-card rounded-2xl border border-outline-variant/10 p-4">
              <dt className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Seniority</dt>
              <dd className="mt-1 font-semibold text-primary">{job.seniority || "—"}</dd>
            </div>
            <div className="glass-card rounded-2xl border border-outline-variant/10 p-4">
              <dt className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Employment</dt>
              <dd className="mt-1 font-semibold text-primary">
                {[employment, job.contract].filter(Boolean).join(" · ") || "—"}
              </dd>
            </div>
          </dl>

          <section className="mb-8">
            <h3 className="mb-3 font-headline text-xs font-black uppercase tracking-[0.2em] text-primary">Job description</h3>
            <div className="glass-card rounded-2xl border border-outline-variant/10 p-5 text-sm leading-relaxed text-on-surface">
              {job.description?.trim() ? (
                job.description.split(/\n+/).map((para, i) => (
                  <p key={i} className={i > 0 ? "mt-3" : ""}>
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-on-surface-variant">No description provided yet.</p>
              )}
            </div>
          </section>

          {skills.length > 0 ? (
            <section className="mb-8">
              <h3 className="mb-3 font-headline text-xs font-black uppercase tracking-[0.2em] text-primary">Skills &amp; expertise</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg bg-tertiary-fixed/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary ring-1 ring-tertiary-fixed/25"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {requirements.length > 0 ? (
            <section className="mb-4">
              <h3 className="mb-3 font-headline text-xs font-black uppercase tracking-[0.2em] text-primary">Key requirements</h3>
              <ul className="list-inside list-disc space-y-2 text-sm text-on-surface-variant">
                {requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-outline-variant/15 bg-surface-container-low/40 px-8 py-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            className="order-2 w-full rounded-full border border-outline-variant/30 bg-white px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm sm:order-1 sm:w-auto"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="button"
            className="order-1 w-full rounded-full bg-primary-container px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg sm:order-2 sm:w-auto"
            onClick={() => {
              onClose();
              navigate({
                pathname: "/careers",
                hash: "#apply",
                state: {
                  jobId: job.id,
                  jobTitle: job.title,
                  company: "InTechRoot",
                  discipline: job.title,
                  experience: job.experience || "",
                },
              });
            }}
          >
            Apply for this role
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
