import Input from "../../../components/Form/Input";
import Button from "../../../components/Form/Button";

export default function ApplicationProcessStep({
  form,
  errors,
  onChange,
  onSelectChange,
  onFileChange,
  onSkillAdd,
  onSkillRemove,
}) {
  const handleSkillInputKeyDown = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const v = e.currentTarget.value.trim();
    if (!v) return;
    onSkillAdd(v);
    e.currentTarget.value = "";
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
      <div className="col-span-full mb-2 text-center">
        <h2 className="text-xl font-headline font-bold text-primary tracking-tight">Application process</h2>
      </div>

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

      <div className="col-span-full relative">
        <label className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block" htmlFor="discipline-select">
          Primary Discipline
        </label>
        <select
          id="discipline-select"
          className="w-full bg-surface-container-low border-0 border-b border-outline-variant py-3 px-4 rounded-t focus:ring-0 focus:border-tertiary-fixed-dim text-sm font-medium appearance-none"
          name="discipline"
          value={form.discipline}
          onChange={onSelectChange}
        >
          {form.discipline &&
          ![
            "Cloud Infrastructure Architecture",
            "Enterprise Strategy & Operations",
            "Cybersecurity Intelligence",
            "Data Engineering & AI Systems",
          ].includes(form.discipline) ? (
            <option>{form.discipline}</option>
          ) : null}
          <option>Cloud Infrastructure Architecture</option>
          <option>Enterprise Strategy &amp; Operations</option>
          <option>Cybersecurity Intelligence</option>
          <option>Data Engineering &amp; AI Systems</option>
        </select>
        <div className="absolute right-3 bottom-3 pointer-events-none">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
        </div>
      </div>

      <div className="col-span-full">
        <label className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">Core Skills &amp; Expertise</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {(form.skills || []).map((skill, idx) => (
            <span
              key={`${skill}-${idx}`}
              className="px-3 py-1 bg-tertiary-fixed/20 text-on-tertiary-container rounded-full text-xs font-bold border border-tertiary-fixed/30 inline-flex items-center gap-1"
            >
              {skill}
              <button
                type="button"
                className="material-symbols-outlined text-[14px] leading-none p-0 border-0 bg-transparent cursor-pointer text-on-tertiary-container hover:opacity-80"
                onClick={() => onSkillRemove(idx)}
                aria-label={`Remove ${skill}`}
              >
                close
              </button>
            </span>
          ))}
        </div>
        <div className="floating-label-group relative">
          <Input
            className="block w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-tertiary-fixed-dim transition-all text-on-surface font-medium"
            id="skills_input"
            placeholder=" "
            type="text"
            onKeyDown={handleSkillInputKeyDown}
          />
          <label className="absolute left-0 top-3 text-on-surface-variant pointer-events-none transition-all duration-200 font-medium text-sm" htmlFor="skills_input">
            Add skills (press enter to add)
          </label>
        </div>
      </div>

      <div className="col-span-full">
        <label className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">Professional Resume / CV</label>
        <div className="border-2 border-dashed border-outline-variant/50 rounded-lg p-10 flex flex-col items-center justify-center bg-surface-container-low/30 hover:bg-surface-container-low/50 hover:border-tertiary-fixed-dim transition-all group cursor-pointer text-center">
          <input className="hidden" id="resume" name="resume" type="file" accept=".pdf,.doc,.docx,application/pdf" onChange={onFileChange} />
          <label className="cursor-pointer flex flex-col items-center w-full" htmlFor="resume">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
            </div>
            <p className="text-on-surface font-semibold mb-1 text-center">
              Drag &amp; drop your files or <span className="text-secondary underline underline-offset-4">browse</span>
            </p>
            <p className="text-on-surface-variant text-xs text-center">PDF, DOCX up to 10MB. Please ensure file is unlocked.</p>
          </label>
          {errors.resume ? <p className="text-[10px] text-error mt-3">{errors.resume}</p> : null}
        </div>
      </div>

      <div className="col-span-full pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-outline-variant/10">
        <p className="text-[10px] text-on-surface-variant max-w-xl text-center md:text-left leading-relaxed">
          By proceeding, you agree to our recruitment data processing terms and global privacy policy.
        </p>
        <Button
          className="w-full md:w-auto bg-primary-container text-on-primary px-10 py-4 rounded-lg font-bold text-sm tracking-wide hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary-container/20 flex items-center justify-center gap-3"
          type="submit"
        >
          Submit
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </Button>
      </div>
    </section>
  );
}
