import { useMemo, useState } from "react";

export default function FiltersSection({ jobs = [], filters, setFilters, setSearchTerm }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const uniqueInOrder = (values) => {
    const out = [];
    for (const v of values) if (v != null && v !== "" && !out.includes(v)) out.push(v);
    return out;
  };

  const categoryOptions = useMemo(() => uniqueInOrder(jobs.map((job) => job.category || job.sector)), [jobs]);
  const seniorityOptions = useMemo(() => uniqueInOrder(jobs.map((job) => job.seniority)), [jobs]);
  const jobTypeOptions = useMemo(() => uniqueInOrder(jobs.map((job) => job.jobType || job.type)), [jobs]);

  const toggle = (group, value) => {
    setFilters((prev) => {
      const exists = prev[group].includes(value);
      return {
        ...prev,
        [group]: exists ? prev[group].filter((v) => v !== value) : [...prev[group], value],
      };
    });
  };

  const resetAll = () => {
    setFilters({
      category: [...categoryOptions],
      seniority: [...seniorityOptions],
      jobType: [...jobTypeOptions],
    });
    setSearchTerm("");
  };

  const FilterContent = () => (
    <div className="space-y-10 md:space-y-12">
      {[
        { label: "Role category", key: "category", options: categoryOptions },
        { label: "Seniority", key: "seniority", options: seniorityOptions },
        { label: "Employment type", key: "jobType", options: jobTypeOptions },
      ].map(({ label, key, options }) => (
        <div key={key}>
          <label className="mb-4 md:mb-6 block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">{label}</label>
          <div className="space-y-3 md:space-y-4">
            {options.map((item) => (
              <label key={item} className="group flex cursor-pointer items-center gap-3 md:gap-4">
                <input
                  checked={filters[key].includes(item)}
                  className="h-4 w-4 rounded-md border-outline-variant text-secondary transition-all focus:ring-secondary/20"
                  type="checkbox"
                  onChange={() => toggle(key, item)}
                />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary">{item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <aside className="w-full flex-shrink-0 lg:w-80">
      {/* Mobile: collapsible filter panel */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 glass-card rounded-2xl border border-outline-variant/20 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-xl">filter_list</span>
            <span className="font-headline font-bold text-sm text-primary">Filters</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); resetAll(); }}
              className="text-[9px] font-black uppercase tracking-widest text-secondary hover:opacity-60 transition-opacity"
              type="button"
            >
              Reset
            </button>
            <span className={`material-symbols-outlined text-on-surface-variant text-xl transition-transform duration-300 ${mobileOpen ? "rotate-180" : ""}`}>
              expand_more
            </span>
          </div>
        </button>
        {mobileOpen && (
          <div className="mt-2 glass-card rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
            <FilterContent />
          </div>
        )}
      </div>

      {/* Desktop: always-visible sticky sidebar */}
      <div className="hidden lg:block">
        <div className="glass-sidebar sticky top-28 rounded-[2rem] p-10">
          <div className="mb-10 flex items-center justify-between">
            <h4 className="font-headline font-extrabold tracking-tight text-primary">Filters</h4>
            <button
              className="text-[9px] font-black uppercase tracking-widest text-secondary transition-opacity hover:opacity-50"
              onClick={resetAll}
              type="button"
            >
              Reset All
            </button>
          </div>
          <FilterContent />
        </div>
      </div>
    </aside>
  );
}
