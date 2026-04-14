import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  category: "",
  seniority: "",
  location: "",
  employment: "Full-time",
  salary: "",
  description: "",
};

function formFromJob(job) {
  if (!job) return { ...emptyForm };
  const isContract = job.type === "Contract" || job.contract === "Consulting";
  return {
    title: job.title || "",
    category: job.category || "",
    seniority: job.seniority || "",
    location: job.location || "",
    employment: isContract ? "Contract" : "Full-time",
    salary: job.salary || "",
    description: job.description || "",
  };
}

export default function CreateJobModal({ editingJob, onClose, onSave }) {
  const [createForm, setCreateForm] = useState(() => formFromJob(editingJob));
  const [createSkills, setCreateSkills] = useState(() =>
    editingJob?.skills?.length ? [...editingJob.skills] : [],
  );
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    setCreateForm(formFromJob(editingJob));
    setCreateSkills(editingJob?.skills?.length ? [...editingJob.skills] : []);
    setSkillInput("");
  }, [editingJob]);

  const addSkillFromInput = () => {
    const next = skillInput.trim();
    if (!next) return;
    setCreateSkills((prev) => (prev.includes(next) ? prev : [...prev, next]));
    setSkillInput("");
  };

  const buildPayload = () => {
    const title = createForm.title.trim();
    if (!title) return null;

    const category = createForm.category.trim() || "Engineering";
    const seniority = createForm.seniority.trim() || "Senior (5-10 yrs)";
    const location = createForm.location.trim() || "Remote";
    const salary = createForm.salary.trim() || "TBD";
    const isContract = createForm.employment === "Contract";

    return {
      title,
      sector: category,
      category,
      seniority,
      contract: isContract ? "Consulting" : "Permanent",
      type: isContract ? "Contract" : "Full-time",
      location,
      salary,
      description: createForm.description.trim() || "",
      requirements: editingJob?.requirements?.length ? [...editingJob.requirements] : [],
      skills: createSkills.length > 0 ? [...createSkills] : ["General"],
      icon: editingJob?.icon || "work",
      experience: seniority,
      badge: editingJob?.badge || "Active",
      badgeClass: editingJob?.badgeClass || "bg-primary-container/10 text-primary",
      meta: [location, isContract ? "Contract" : "Full-time", salary],
      metaIcons: ["location_on", "schedule", "payments"],
      postedDate: editingJob?.postedDate || new Date().toISOString().slice(0, 10),
    };
  };

  const handleSaveClick = () => {
    const payload = buildPayload();
    if (!payload) return;
    onSave(payload);
  };

  return (
    <div className="bg-surface-container-lowest relative flex max-h-[90vh] w-[600px] flex-col overflow-hidden rounded-xl border border-outline-variant/10 shadow-[40px_0_40px_rgba(0,6,21,0.04)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/5 to-tertiary-fixed-dim/10"></div>
      <div className="relative z-10 flex items-center justify-between border-b border-outline-variant/10 bg-white/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
          <span className="material-symbols-outlined text-secondary" data-icon="add_circle">
            add_circle
          </span>
          {editingJob ? "Edit Posting" : "Create New Posting"}
        </h2>
        <button type="button" className="rounded-lg p-2 text-outline hover:bg-surface-container" onClick={onClose}>
          <span className="material-symbols-outlined" data-icon="close">
            close
          </span>
        </button>
      </div>
      <div className="relative z-10 max-h-[calc(90vh-8rem)] flex-1 space-y-6 overflow-y-auto p-6">
        <div className="space-y-4">
          <div>
            <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Job Title</label>
            <input
              className="focus:ring-tertiary-fixed-dim w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm transition-shadow focus:ring-1"
              placeholder="e.g. Senior Frontend Engineer"
              type="text"
              value={createForm.title}
              onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Role Category</label>
              <select
                className="focus:ring-tertiary-fixed-dim w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-1"
                value={createForm.category}
                onChange={(e) => setCreateForm((f) => ({ ...f, category: e.target.value }))}
              >
                <option value="">Select...</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Management">Management</option>
              </select>
            </div>
            <div>
              <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Seniority</label>
              <select
                className="focus:ring-tertiary-fixed-dim w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-1"
                value={createForm.seniority}
                onChange={(e) => setCreateForm((f) => ({ ...f, seniority: e.target.value }))}
              >
                <option value="">Select...</option>
                <option value="Senior (5-10 yrs)">Senior (5-10 yrs)</option>
                <option value="Executive (10+ yrs)">Executive (10+ yrs)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Location</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline" data-icon="location_on">
                location_on
              </span>
              <input
                className="focus:ring-tertiary-fixed-dim w-full rounded-lg border-none bg-surface-container-low py-3 pl-10 pr-4 text-sm focus:ring-1"
                placeholder="London, UK or Remote"
                type="text"
                value={createForm.location}
                onChange={(e) => setCreateForm((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Employment</label>
              <select
                className="focus:ring-tertiary-fixed-dim w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-1"
                value={createForm.employment}
                onChange={(e) => setCreateForm((f) => ({ ...f, employment: e.target.value }))}
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Salary Range</label>
              <input
                className="focus:ring-tertiary-fixed-dim w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-1"
                placeholder="$100k - $140k"
                type="text"
                value={createForm.salary}
                onChange={(e) => setCreateForm((f) => ({ ...f, salary: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Responsibilities</label>
          <textarea
            className="focus:ring-tertiary-fixed-dim w-full resize-none rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-1"
            placeholder="Describe the day-to-day impact of this role..."
            rows={4}
            value={createForm.description}
            onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Skills (Tags)</label>
          <div className="bg-surface-container-low flex min-h-[44px] flex-wrap items-center gap-2 rounded-lg p-2">
            {createSkills.map((skill) => (
              <span
                key={skill}
                className="border-outline-variant/30 flex items-center gap-1 rounded border bg-white px-2 py-1 text-xs font-medium"
              >
                {skill}{" "}
                <span
                  className="material-symbols-outlined cursor-pointer text-[14px]"
                  data-icon="close"
                  role="presentation"
                  onClick={() => setCreateSkills((prev) => prev.filter((s) => s !== skill))}
                >
                  close
                </span>
              </span>
            ))}
            <input
              className="min-w-[60px] flex-1 border-none bg-transparent p-0 text-sm focus:ring-0"
              placeholder="Add skill..."
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkillFromInput();
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="bg-surface-container-low flex items-center justify-between rounded-lg p-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary">Featured Job</span>
              <span className="text-on-surface-variant text-[10px]">Pin to the top of careers page</span>
            </div>
            <div className="bg-tertiary-fixed-dim relative h-5 w-10 cursor-pointer rounded-full">
              <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"></div>
            </div>
          </div>
          <div className="bg-surface-container-low flex items-center justify-between rounded-lg p-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary">Publish Status</span>
              <span className="text-on-surface-variant text-[10px]">Immediately visible to candidates</span>
            </div>
            <div className="bg-outline-variant/30 relative h-5 w-10 cursor-pointer rounded-full">
              <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 border-t border-outline-variant/10 bg-white/60 p-6 backdrop-blur-md">
        <button
          type="button"
          className="bg-primary-container shadow-primary-container/20 hover:translate-y-[-2px] active:scale-95 w-full rounded-lg py-3.5 text-sm font-bold text-white shadow-lg transition-all"
          onClick={handleSaveClick}
        >
          Save Job Posting
        </button>
      </div>
    </div>
  );
}
