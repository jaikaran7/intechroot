import { useRef } from "react";
import Input from "../../../components/Form/Input";
import Button from "../../../components/Form/Button";

export default function ApplicationProcessStep({
  form,
  errors,
  jobs = [],
  jobsLoading,
  onChange,
  onJobChange,
  onFileChange,
  onRemoveResume,
  resumePreviewUrl,
  isPending,
  submitError,
  onSkillAdd,
  onSkillRemove,
}) {
  const resumeInputRef = useRef(null);
  const jobKnown = jobs.some((j) => j.id === form.jobId);
  const showOrphanOption = Boolean(form.jobId && !jobKnown && form.discipline);

  const clearResumeFile = () => {
    onRemoveResume();
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  };
  const handleSkillInputKeyDown = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const v = e.currentTarget.value.trim();
    if (!v) return;
    onSkillAdd(v);
    e.currentTarget.value = "";
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-10 gap-y-8">
      <div className="floating-label-group relative">
        <Input
          className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-tertiary-fixed-dim transition-all text-on-surface font-medium"
          id="firstName"
          name="firstName"
          placeholder=" "
          type="text"
          value={form.firstName}
          onChange={onChange}
        />
        <label className="absolute left-0 top-3 text-on-surface-variant pointer-events-none transition-all duration-200 font-medium text-sm" htmlFor="firstName">
          First Name
        </label>
        {errors.firstName ? <p className="text-[10px] text-error mt-2">{errors.firstName}</p> : null}
      </div>

      <div className="floating-label-group relative">
        <Input
          className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-tertiary-fixed-dim transition-all text-on-surface font-medium"
          id="lastName"
          name="lastName"
          placeholder=" "
          type="text"
          value={form.lastName}
          onChange={onChange}
        />
        <label className="absolute left-0 top-3 text-on-surface-variant pointer-events-none transition-all duration-200 font-medium text-sm" htmlFor="lastName">
          Last Name
        </label>
        {errors.lastName ? <p className="text-[10px] text-error mt-2">{errors.lastName}</p> : null}
      </div>

      <div className="floating-label-group relative">
        <Input
          className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-tertiary-fixed-dim transition-all text-on-surface font-medium"
          id="email"
          name="email"
          placeholder=" "
          type="email"
          value={form.email}
          onChange={onChange}
        />
        <label className="absolute left-0 top-3 text-on-surface-variant pointer-events-none transition-all duration-200 font-medium text-sm" htmlFor="email">
          Professional Email
        </label>
        {errors.email ? <p className="text-[10px] text-error mt-2">{errors.email}</p> : null}
      </div>

      <div className="floating-label-group relative">
        <Input
          className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-tertiary-fixed-dim transition-all text-on-surface font-medium"
          id="phone"
          name="phone"
          placeholder=" "
          type="tel"
          value={form.phone}
          onChange={onChange}
        />
        <label className="absolute left-0 top-3 text-on-surface-variant pointer-events-none transition-all duration-200 font-medium text-sm" htmlFor="phone">
          Phone Number
        </label>
        {errors.phone ? <p className="text-[10px] text-error mt-2">{errors.phone}</p> : null}
      </div>

      <div className="floating-label-group relative">
        <Input
          className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-tertiary-fixed-dim transition-all text-on-surface font-medium"
          id="location"
          name="location"
          placeholder=" "
          type="text"
          value={form.location}
          onChange={onChange}
        />
        <label className="absolute left-0 top-3 text-on-surface-variant pointer-events-none transition-all duration-200 font-medium text-sm" htmlFor="location">
          Applicant Location (City, Country)
        </label>
      </div>

      <div className="floating-label-group relative">
        <Input
          className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-tertiary-fixed-dim transition-all text-on-surface font-medium [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          id="experience"
          name="experience"
          placeholder=" "
          type="number"
          inputMode="numeric"
          min={0}
          max={80}
          step={1}
          value={form.experience}
          onChange={onChange}
        />
        <label className="absolute left-0 top-3 text-on-surface-variant pointer-events-none transition-all duration-200 font-medium text-sm" htmlFor="experience">
          Years of Experience
        </label>
        {errors.experience ? <p className="text-[10px] text-error mt-2">{errors.experience}</p> : null}
      </div>

      <div className="floating-label-group relative">
        <Input
          className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-tertiary-fixed-dim transition-all text-on-surface font-medium"
          id="linkedIn"
          name="linkedIn"
          placeholder=" "
          type="url"
          value={form.linkedIn}
          onChange={onChange}
        />
        <label className="absolute left-0 top-3 text-on-surface-variant pointer-events-none transition-all duration-200 font-medium text-sm" htmlFor="linkedIn">
          LinkedIn Profile URL
        </label>
      </div>

      <div className="floating-label-group relative">
        <Input
          className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-tertiary-fixed-dim transition-all text-on-surface font-medium"
          id="portfolio"
          name="portfolio"
          placeholder=" "
          type="url"
          value={form.portfolio}
          onChange={onChange}
        />
        <label className="absolute left-0 top-3 text-on-surface-variant pointer-events-none transition-all duration-200 font-medium text-sm" htmlFor="portfolio">
          Portfolio Website URL
        </label>
      </div>

      <div className="col-span-full grid grid-cols-1 gap-y-4 lg:grid-cols-2 lg:items-end lg:gap-x-10 lg:gap-y-4">
        <div className="min-w-0">
          <select
            id="discipline-select"
            className="discipline-select-clean w-full cursor-pointer border-0 border-b border-outline-variant bg-transparent py-3 pl-0 pr-9 text-sm font-medium leading-normal text-on-surface focus:border-tertiary-fixed-dim focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            name="jobId"
            value={form.jobId || ""}
            disabled={jobsLoading}
            onChange={onJobChange}
          >
            <option value="">{jobsLoading ? "Loading open roles…" : "Select job role"}</option>
            {showOrphanOption ? (
              <option value={form.jobId}>{form.discipline}</option>
            ) : null}
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          {errors.jobId ? <p className="mt-2 text-[10px] text-error">{errors.jobId}</p> : null}
          {!jobsLoading && jobs.length === 0 ? (
            <p className="mt-2 text-[11px] text-on-surface-variant">No active roles right now. Check back soon.</p>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          {(form.skills || []).length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {(form.skills || []).map((skill, idx) => (
                <span
                  key={`${skill}-${idx}`}
                  className="inline-flex items-center gap-0.5 rounded-full border border-tertiary-fixed/30 bg-tertiary-fixed/20 px-2.5 py-0.5 text-[11px] font-bold text-on-tertiary-container"
                >
                  {skill}
                  <button
                    type="button"
                    className="material-symbols-outlined cursor-pointer border-0 bg-transparent p-0 text-[13px] leading-none text-on-tertiary-container hover:opacity-80"
                    onClick={() => onSkillRemove(idx)}
                    aria-label={`Remove ${skill}`}
                  >
                    close
                  </button>
                </span>
              ))}
            </div>
          ) : null}
          <div className="floating-label-group relative w-full">
            <Input
              className="block w-full border-0 border-b border-outline-variant bg-transparent px-0 py-3 text-sm font-medium leading-normal text-on-surface transition-all focus:border-tertiary-fixed-dim focus:ring-0"
              id="skills_input"
              placeholder=" "
              type="text"
              onKeyDown={handleSkillInputKeyDown}
            />
            <label
              className="pointer-events-none absolute left-0 top-3 text-sm font-medium leading-normal text-on-surface-variant transition-all duration-200"
              htmlFor="skills_input"
            >
              Add skills (press enter to add)
            </label>
          </div>
        </div>
      </div>

      <div className="col-span-full">
        <label className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">Professional Resume / CV</label>
        <div className="space-y-3">
          <div className="group flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-outline-variant/50 bg-surface-container-low/30 px-4 py-4 text-center transition-all hover:border-tertiary-fixed-dim hover:bg-surface-container-low/50 md:flex-row md:gap-5 md:py-3 md:text-left">
            <input
              ref={resumeInputRef}
              className="hidden"
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf"
              onChange={onFileChange}
            />
            <label className="flex cursor-pointer flex-col items-center gap-2 md:flex-row md:items-center md:gap-4" htmlFor="resume">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-105">
                <span className="material-symbols-outlined text-xl text-primary">upload_file</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-on-surface">
                  Drag &amp; drop your files or <span className="text-secondary underline underline-offset-4">browse</span>
                </p>
                <p className="mt-0.5 text-xs text-on-surface-variant">PDF, DOCX up to 10MB. Unlocked files only.</p>
              </div>
            </label>
          </div>
          {form.resume ? (
            <div className="flex flex-col gap-3 rounded-lg border border-outline-variant/20 bg-surface-container-low/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex items-start gap-3">
                <span className="material-symbols-outlined mt-0.5 shrink-0 text-secondary" data-icon="description">
                  description
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary" title={form.resume.name}>
                    {form.resume.name}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    {(form.resume.size / 1024).toFixed(1)} KB · {form.resume.type || "file"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {resumePreviewUrl ? (
                  <a
                    className="inline-flex items-center gap-1 rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-secondary transition-colors hover:bg-surface-container-low"
                    href={resumePreviewUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-[16px]" data-icon="visibility">
                      visibility
                    </span>
                    Preview
                  </a>
                ) : (
                  <span className="text-[11px] text-on-surface-variant">Preview opens in a new tab for PDF files.</span>
                )}
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg border border-outline-variant/30 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-on-surface-variant transition-colors hover:bg-error-container/15 hover:text-error"
                  onClick={clearResumeFile}
                >
                  <span className="material-symbols-outlined text-[16px]" data-icon="delete">
                    delete
                  </span>
                  Remove
                </button>
              </div>
            </div>
          ) : null}
          {errors.resume ? <p className="text-[10px] text-error">{errors.resume}</p> : null}
        </div>
      </div>

      <div className="col-span-full pt-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-outline-variant/10">
        <p className="text-[10px] text-on-surface-variant max-w-xl text-center md:text-left leading-relaxed">
          By proceeding, you agree to our recruitment data processing terms and global privacy policy.
        </p>
        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{submitError}</p>
          )}
          <Button
            className="w-full md:w-auto bg-primary-container text-on-primary px-10 py-4 rounded-lg font-bold text-sm tracking-wide hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary-container/20 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Submitting…" : "Submit"}
            {!isPending && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
          </Button>
        </div>
      </div>
    </section>
  );
}
