import { useEffect, useState } from "react";

const CUSTOM = "__CUSTOM__";

const ROLE_CATEGORY_PRESETS = [
  "Engineering",
  "Design",
  "Frontend",
  "Infrastructure",
  "Product Design",
  "Data",
  "Security",
  "Management",
];

const EXPERIENCE_PRESETS = ["0-1 years", "1-2 years", "1-3 years", "3-5 years", "5-8 years", "8+ years"];

const emptyForm = {
  title: "",
  roleCategorySelect: "",
  categoryCustom: "",
  experienceSelect: "",
  experienceCustom: "",
  location: "",
  employment: "Full-time",
  salary: "",
  description: "",
  status: "Active",
  featured: false,
};

function jobTypeFromApi(job) {
  if (!job) return "Full-time";
  const jt = job.jobType || job.type;
  if (jt === "Contract" || job.contract === "Consulting") return "Contract";
  return "Full-time";
}

function splitCategoryFromJob(job) {
  const cat = (job?.category || "").trim();
  if (!cat) return { roleCategorySelect: "", categoryCustom: "" };
  if (ROLE_CATEGORY_PRESETS.includes(cat)) return { roleCategorySelect: cat, categoryCustom: "" };
  return { roleCategorySelect: CUSTOM, categoryCustom: cat };
}

function splitExperienceFromJob(job) {
  const exp = (job?.experience || job?.seniority || "").trim();
  if (!exp) return { experienceSelect: "", experienceCustom: "" };
  if (EXPERIENCE_PRESETS.includes(exp)) return { experienceSelect: exp, experienceCustom: "" };
  return { experienceSelect: CUSTOM, experienceCustom: exp };
}

function formFromJob(job) {
  if (!job) return { ...emptyForm };
  const { roleCategorySelect, categoryCustom } = splitCategoryFromJob(job);
  const { experienceSelect, experienceCustom } = splitExperienceFromJob(job);
  return {
    ...emptyForm,
    title: job.title || "",
    roleCategorySelect,
    categoryCustom,
    experienceSelect,
    experienceCustom,
    location: job.location || "",
    employment: jobTypeFromApi(job),
    salary: job.salary || "",
    description: job.description || "",
    status: job.status === "Active" || job.status === "Draft" || job.status === "Closed" ? job.status : "Draft",
    featured: Boolean(job.featured),
  };
}

export default function CreateJobModal({ editingJob, onClose, onSave }) {
  const [createForm, setCreateForm] = useState(() => formFromJob(editingJob));
  const [createSkills, setCreateSkills] = useState(() =>
    Array.isArray(editingJob?.skills) && editingJob.skills.length ? [...editingJob.skills] : [],
  );
  const [skillInput, setSkillInput] = useState("");
  const [createRequirements, setCreateRequirements] = useState(() =>
    Array.isArray(editingJob?.requirements) && editingJob.requirements.length ? [...editingJob.requirements] : [],
  );
  const [requirementInput, setRequirementInput] = useState("");

  useEffect(() => {
    setCreateForm(formFromJob(editingJob));
    setCreateSkills(Array.isArray(editingJob?.skills) && editingJob.skills.length ? [...editingJob.skills] : []);
    setSkillInput("");
    setCreateRequirements(
      Array.isArray(editingJob?.requirements) && editingJob.requirements.length ? [...editingJob.requirements] : [],
    );
    setRequirementInput("");
  }, [editingJob]);

  const flushSkillFromInput = () => {
    const next = skillInput.trim();
    if (!next) return;
    setCreateSkills((prev) => (prev.includes(next) ? prev : [...prev, next]));
    setSkillInput("");
  };

  const flushRequirementFromInput = () => {
    const next = requirementInput.trim();
    if (!next) return;
    setCreateRequirements((prev) => (prev.includes(next) ? prev : [...prev, next]));
    setRequirementInput("");
  };

  const buildPayload = () => {
    const title = createForm.title.trim();
    if (!title) return null;

    const category =
      createForm.roleCategorySelect === CUSTOM
        ? createForm.categoryCustom.trim() || "Engineering"
        : createForm.roleCategorySelect.trim() || "Engineering";

    const experienceBand =
      createForm.experienceSelect === CUSTOM
        ? createForm.experienceCustom.trim() || "3-5 years"
        : createForm.experienceSelect.trim() || "3-5 years";

    const location = createForm.location.trim() || "Remote";
    const salary = createForm.salary.trim() || "TBD";
    const isContract = createForm.employment === "Contract";
    const status =
      createForm.status === "Active" || createForm.status === "Draft" || createForm.status === "Closed"
        ? createForm.status
        : "Draft";

    return {
      title,
      sector: category,
      category,
      seniority: experienceBand,
      contract: isContract ? "Consulting" : "Permanent",
      jobType: isContract ? "Contract" : "Full-time",
      location,
      salary,
      description: createForm.description.trim() || "",
      requirements: [...createRequirements],
      skills: createSkills.length > 0 ? [...createSkills] : [],
      experience: experienceBand,
      status,
      featured: Boolean(createForm.featured),
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
            <div className="min-w-0">
              <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Role category</label>
              <select
                className="focus:ring-tertiary-fixed-dim w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-1"
                value={createForm.roleCategorySelect}
                onChange={(e) => setCreateForm((f) => ({ ...f, roleCategorySelect: e.target.value }))}
              >
                <option value="">Select…</option>
                {ROLE_CATEGORY_PRESETS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value={CUSTOM}>Custom…</option>
              </select>
              {createForm.roleCategorySelect === CUSTOM ? (
                <input
                  className="focus:ring-tertiary-fixed-dim mt-2 w-full rounded-lg border-none bg-surface-container-low px-4 py-2.5 text-sm focus:ring-1"
                  placeholder="e.g. Solutions Architecture"
                  type="text"
                  value={createForm.categoryCustom}
                  onChange={(e) => setCreateForm((f) => ({ ...f, categoryCustom: e.target.value }))}
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Experience (years)</label>
              <select
                className="focus:ring-tertiary-fixed-dim w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-1"
                value={createForm.experienceSelect}
                onChange={(e) => setCreateForm((f) => ({ ...f, experienceSelect: e.target.value }))}
              >
                <option value="">Select…</option>
                {EXPERIENCE_PRESETS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
                <option value={CUSTOM}>Custom…</option>
              </select>
              {createForm.experienceSelect === CUSTOM ? (
                <input
                  className="focus:ring-tertiary-fixed-dim mt-2 w-full rounded-lg border-none bg-surface-container-low px-4 py-2.5 text-sm focus:ring-1"
                  placeholder="e.g. 10-12 years"
                  type="text"
                  value={createForm.experienceCustom}
                  onChange={(e) => setCreateForm((f) => ({ ...f, experienceCustom: e.target.value }))}
                />
              ) : null}
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
          <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Publish status</label>
          <p className="text-on-surface-variant mb-2 text-[10px] leading-relaxed">Active jobs appear on the public careers page. Draft and Closed are hidden.</p>
          <select
            className="focus:ring-tertiary-fixed-dim w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-1"
            value={createForm.status}
            onChange={(e) => setCreateForm((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="Active">Active — live on careers</option>
            <option value="Draft">Draft — internal only</option>
            <option value="Closed">Closed — not accepting applications</option>
          </select>
        </div>

        <label className="bg-surface-container-low flex cursor-pointer items-center justify-between gap-4 rounded-lg p-4 ring-1 ring-outline-variant/10">
          <div>
            <span className="text-xs font-bold text-primary">Featured on careers</span>
            <p className="text-on-surface-variant mt-0.5 max-w-[22rem] text-[10px] leading-relaxed">
              When enabled, this role is highlighted in the &quot;Architectural Strategic Roles&quot; strip (up to six featured roles).
            </p>
          </div>
          <input
            checked={createForm.featured}
            className="h-5 w-5 shrink-0 rounded border-outline-variant text-secondary focus:ring-secondary/30"
            type="checkbox"
            onChange={(e) => setCreateForm((f) => ({ ...f, featured: e.target.checked }))}
          />
        </label>

        <div>
          <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Job description</label>
          <textarea
            className="focus:ring-tertiary-fixed-dim w-full resize-none rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-1"
            placeholder="Describe the role, impact, and what success looks like…"
            rows={5}
            value={createForm.description}
            onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        <div>
          <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Key requirements</label>
          <p className="text-on-surface-variant mb-2 text-[10px]">Bullet-style expectations (e.g. certifications, stack, clearance). Enter or Add for each line.</p>
          <div className="bg-surface-container-low flex min-h-[48px] flex-wrap items-center gap-2 rounded-lg p-2 ring-1 ring-outline-variant/10">
            {createRequirements.map((req) => (
              <span
                key={req}
                className="border-outline-variant/30 inline-flex max-w-full items-center gap-1 rounded border bg-white px-2 py-1 text-xs font-medium"
              >
                <span className="truncate">{req}</span>
                <button
                  type="button"
                  className="material-symbols-outlined flex h-5 w-5 shrink-0 items-center justify-center rounded text-[14px] text-on-surface-variant hover:bg-surface-container"
                  aria-label={`Remove ${req}`}
                  onClick={() => setCreateRequirements((prev) => prev.filter((r) => r !== req))}
                >
                  close
                </button>
              </span>
            ))}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <input
                className="min-w-0 flex-1 border-none bg-transparent px-2 py-2 text-sm focus:ring-0"
                placeholder="Type a requirement…"
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    flushRequirementFromInput();
                  }
                }}
              />
              <button
                type="button"
                className="shrink-0 rounded-lg bg-primary-container px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white hover:opacity-90"
                onMouseDown={(e) => e.preventDefault()}
                onClick={flushRequirementFromInput}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-on-surface-variant mb-1.5 block text-[11px] font-bold uppercase tracking-wider">Skills (tags)</label>
          <p className="text-on-surface-variant mb-2 text-[10px]">Press Enter or click Add after typing. Tags save with the posting.</p>
          <div className="bg-surface-container-low flex min-h-[48px] flex-wrap items-center gap-2 rounded-lg p-2 ring-1 ring-outline-variant/10">
            {createSkills.map((skill) => (
              <span
                key={skill}
                className="border-outline-variant/30 inline-flex items-center gap-1 rounded border bg-white px-2 py-1 text-xs font-medium"
              >
                {skill}
                <button
                  type="button"
                  className="material-symbols-outlined flex h-5 w-5 items-center justify-center rounded text-[14px] text-on-surface-variant hover:bg-surface-container"
                  aria-label={`Remove ${skill}`}
                  onClick={() => setCreateSkills((prev) => prev.filter((s) => s !== skill))}
                >
                  close
                </button>
              </span>
            ))}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <input
                className="min-w-0 flex-1 border-none bg-transparent px-2 py-2 text-sm focus:ring-0"
                placeholder="Type a skill…"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    flushSkillFromInput();
                  }
                }}
              />
              <button
                type="button"
                className="shrink-0 rounded-lg bg-primary-container px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white hover:opacity-90"
                onMouseDown={(e) => e.preventDefault()}
                onClick={flushSkillFromInput}
              >
                Add
              </button>
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
