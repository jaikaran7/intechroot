import { useMemo } from "react";
import { getJobs } from "@/fixtures/catalog";

export default function FiltersSection({ filters, setFilters, setSearchTerm }) {
  const jobs = getJobs();

  const uniqueInOrder = (values) => {
    const out = [];
    for (const v of values) if (!out.includes(v)) out.push(v);
    return out;
  };

  const sectorOptions = useMemo(() => uniqueInOrder(jobs.map((job) => job.sector)), [jobs]);
  const seniorityOptions = useMemo(() => uniqueInOrder(jobs.map((job) => job.seniority)), [jobs]);
  const contractOptions = useMemo(() => uniqueInOrder(jobs.map((job) => job.contract)), [jobs]);

  const defaultSector = sectorOptions[0] || "";
  const defaultSeniority = seniorityOptions[0] || "";
  const defaultContract = contractOptions[0] || "";

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
      sector: [defaultSector],
      seniority: [defaultSeniority],
      contract: [defaultContract],
    });
    setSearchTerm("");
  };

  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="sticky top-28 glass-sidebar p-10 rounded-[2rem]">
        <div className="flex items-center justify-between mb-10">
          <h4 className="font-headline font-extrabold text-primary tracking-tight">Filters</h4>
          <button
            className="text-[9px] font-black text-secondary uppercase tracking-widest hover:opacity-50 transition-opacity"
            onClick={resetAll}
            type="button"
          >
            Reset All
          </button>
        </div>
        <div className="space-y-12">
          <div>
            <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-6">Role Sector</label>
            <div className="space-y-4">
              {sectorOptions.map((item) => (
                <label key={item} className="flex items-center gap-4 cursor-pointer group">
                  <input
                    checked={filters.sector.includes(item)}
                    className="w-4 h-4 rounded-md border-outline-variant text-secondary focus:ring-secondary/20 transition-all"
                    type="checkbox"
                    onChange={() => toggle("sector", item)}
                  />
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary">{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-6">Seniority</label>
            <div className="space-y-4">
              {seniorityOptions.map((item) => (
                <label key={item} className="flex items-center gap-4 cursor-pointer group">
                  <input
                    checked={filters.seniority.includes(item)}
                    className="w-4 h-4 rounded-md border-outline-variant text-secondary focus:ring-secondary/20 transition-all"
                    type="checkbox"
                    onChange={() => toggle("seniority", item)}
                  />
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary">{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-6">Contract</label>
            <div className="space-y-4">
              {contractOptions.map((item) => (
                <label key={item} className="flex items-center gap-4 cursor-pointer group">
                  <input
                    checked={filters.contract.includes(item)}
                    className="w-4 h-4 rounded-md border-outline-variant text-secondary focus:ring-secondary/20 transition-all"
                    type="checkbox"
                    onChange={() => toggle("contract", item)}
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
