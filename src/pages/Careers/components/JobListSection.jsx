import { useMemo } from "react";
import Button from "../../../components/Form/Button";
import { useNavigate } from "react-router-dom";
import { presentJobForCareersList, presentJobForFeatured } from "../utils/presentJob";

export function FeaturedRolesSection({ jobs = [], onViewDetails }) {
  const navigate = useNavigate();
  const cards = useMemo(
    () =>
      jobs.map((raw, idx) => ({
        raw,
        role: presentJobForFeatured(raw, idx),
      })),
    [jobs],
  );

  if (!cards.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-white py-32">
      <div className="relative mx-auto max-w-7xl px-8">
        <div className="mb-20 flex flex-col items-end justify-between gap-12 md:flex-row">
          <div className="max-w-2xl">
            <div className="mb-4 text-[11px] font-black uppercase tracking-[0.4em] text-secondary">Urgent Opportunities</div>
            <h2 className="font-headline text-6xl font-extrabold leading-[0.95] tracking-tighter text-primary">
              Architectural <br />
              Strategic Roles
            </h2>
          </div>
          <div className="hidden text-sm font-medium text-on-surface-variant opacity-50 md:block">Featured roles from your pipeline</div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map(({ raw, role }, idx) => (
            <div
              key={role.id}
              className={`glass-card flex h-full flex-col rounded-[2.5rem] p-10 transition-all duration-700 group hover:-translate-y-3 ${
                idx === 1 ? "z-10 scale-105 border-secondary/20 shadow-2xl" : ""
              } ${onViewDetails ? "cursor-pointer" : ""}`}
              onClick={() => onViewDetails?.(raw)}
            >
              <div className="mb-10 flex items-start justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${idx === 0 ? "bg-secondary/5 transition-colors group-hover:bg-secondary/10" : ""} ${idx === 1 ? "bg-tertiary-fixed/10" : ""} ${idx === 2 ? "bg-primary/5 transition-colors group-hover:bg-primary/10" : ""}`}
                >
                  <span
                    className={`material-symbols-outlined text-3xl ${idx === 0 ? "text-secondary" : ""} ${idx === 1 ? "text-tertiary-fixed" : ""} ${idx === 2 ? "text-primary" : ""}`}
                  >
                    {role.icon}
                  </span>
                </div>
                <span className={`${role.badgeClass} rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-tighter`}>{role.badgeText}</span>
              </div>
              <h3 className={`mb-4 text-2xl font-headline font-bold transition-colors duration-500 ${role.titleHover}`}>{role.title}</h3>
              <p className="mb-10 flex items-center gap-2 text-sm text-on-surface-variant opacity-70">
                <span className="material-symbols-outlined text-sm">location_on</span> {role.location}
              </p>
              <div className="mb-8 mt-auto flex flex-wrap gap-2">
                {role.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-surface-container-high/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-3">
                <Button
                  className={role.buttonClass}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({
                      pathname: "/careers",
                      hash: "#apply",
                      state: {
                        jobId: role.id,
                        jobTitle: role.title,
                        company: "InTechRoot",
                        discipline: role.title,
                        experience: role.experience,
                      },
                    });
                  }}
                >
                  Apply Position
                </Button>
                {onViewDetails ? (
                  <Button
                    type="button"
                    className="w-full rounded-full border border-outline-variant/30 bg-white py-3.5 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm transition-all hover:bg-surface-container-low"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(raw);
                    }}
                  >
                    More details
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function JobListSection({ jobs = [], searchTerm, setSearchTerm, isLoading, isError, onRetry, onViewDetails }) {
  const navigate = useNavigate();

  const rows = useMemo(() => jobs.map((j) => ({ raw: j, view: presentJobForCareersList(j) })), [jobs]);

  return (
    <div className="flex-1 space-y-10">
      <div className="group relative">
        <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-secondary">
          search
        </span>
        <input
          className="glass-card w-full rounded-3xl border-white/40 py-6 pl-16 pr-8 font-medium transition-all placeholder:font-medium placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-4 focus:ring-secondary/5"
          placeholder="Search architectural roles by title, skill or vector..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="glass-card rounded-[2.5rem] border-white/40 p-12 text-center text-on-surface-variant">Loading open roles…</div>
      ) : null}

      {isError ? (
        <div className="glass-card rounded-[2.5rem] border-red-100 bg-red-50/50 p-10 text-center">
          <p className="mb-4 text-sm font-medium text-red-800">We couldn&apos;t load job postings. Check your connection or API configuration.</p>
          {onRetry ? (
            <Button className="rounded-full bg-primary px-8 py-3 text-xs font-bold uppercase tracking-widest text-white" onClick={onRetry} type="button">
              Try again
            </Button>
          ) : null}
        </div>
      ) : null}

      {!isLoading && !isError && rows.length === 0 ? (
        <div className="glass-card rounded-[2.5rem] border-white/40 p-12 text-center text-on-surface-variant">
          No roles match your filters. Try adjusting filters or search.
        </div>
      ) : null}

      {!isLoading &&
        !isError &&
        rows.map(({ raw, view: job }) => (
          <div
            key={job.id}
            className={`glass-card group flex flex-col items-start gap-10 rounded-[2.5rem] border-white/40 p-10 shadow-sm transition-all duration-700 hover:-translate-y-1 hover:shadow-xl md:flex-row md:items-center ${
              onViewDetails ? "cursor-pointer" : ""
            }`}
            onClick={() => onViewDetails?.(raw)}
          >
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-[1.5rem] border border-white/20 bg-surface-container-low text-primary">
              <span className="material-symbols-outlined text-4xl">{job.icon}</span>
            </div>
            <div className="flex-1">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
                <div className="min-w-0">
                  <h3 className="font-headline text-2xl font-extrabold text-primary transition-colors duration-500 group-hover:text-secondary">{job.listTitle}</h3>
                  {job.listSubtitle ? (
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant/70">{job.listSubtitle}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${job.categoryClass}`}>{job.categoryLabel}</span>
                  <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${job.statusClass}`}>{job.statusLabel}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-on-surface-variant opacity-60">
                {job.meta.map((metaItem, idx) => (
                  <span key={`${job.id}-meta-${idx}`} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">{job.metaIcons[idx]}</span>
                    {metaItem}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex w-full flex-col items-stretch gap-3 md:w-auto md:min-w-[10rem]">
              <Button
                className="w-full rounded-full bg-primary py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all duration-500 hover:bg-secondary md:min-w-[9rem]"
                onClick={(e) => {
                  e.stopPropagation();
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
                type="button"
              >
                Apply Now
              </Button>
              {onViewDetails ? (
                <Button
                  type="button"
                  className="w-full rounded-full border border-outline-variant/40 bg-white py-3.5 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm transition-all hover:bg-surface-container-low"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(raw);
                  }}
                >
                  More details
                </Button>
              ) : null}
            </div>
          </div>
        ))}

      {!isLoading && !isError && rows.length > 0 ? (
        <div className="pt-16 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-on-surface-variant/60">Showing all {rows.length} open role{rows.length === 1 ? "" : "s"}</p>
        </div>
      ) : null}
    </div>
  );
}
