import { useMemo } from "react";

export default function FiltersSection({ jobs = [], filters, setFilters, setSearchTerm }) {
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

  return (
    <aside className="w-full flex-shrink-0 lg:w-80">
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
        <div className="space-y-12">
          <div>
            <label className="mb-6 block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Role category</label>
            <div className="space-y-4">
              {categoryOptions.map((item) => (
                <label key={item} className="group flex cursor-pointer items-center gap-4">
                  <input
                    checked={filters.category.includes(item)}
                    className="h-4 w-4 rounded-md border-outline-variant text-secondary transition-all focus:ring-secondary/20"
                    type="checkbox"
                    onChange={() => toggle("category", item)}
                  />
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary">{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-6 block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Seniority</label>
            <div className="space-y-4">
              {seniorityOptions.map((item) => (
                <label key={item} className="group flex cursor-pointer items-center gap-4">
                  <input
                    checked={filters.seniority.includes(item)}
                    className="h-4 w-4 rounded-md border-outline-variant text-secondary transition-all focus:ring-secondary/20"
                    type="checkbox"
                    onChange={() => toggle("seniority", item)}
                  />
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary">{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-6 block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Employment type</label>
            <div className="space-y-4">
              {jobTypeOptions.map((item) => (
                <label key={item} className="group flex cursor-pointer items-center gap-4">
                  <input
                    checked={filters.jobType.includes(item)}
                    className="h-4 w-4 rounded-md border-outline-variant text-secondary transition-all focus:ring-secondary/20"
                    type="checkbox"
                    onChange={() => toggle("jobType", item)}
                  />
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
