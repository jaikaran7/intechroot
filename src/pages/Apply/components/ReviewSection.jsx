export default function ReviewSection({ form, onSelectChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative">
        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block">Primary Discipline</label>
        <select
          className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant py-3 px-4 rounded-t focus:ring-0 focus:border-secondary text-sm font-medium appearance-none"
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
      <div className="relative">
        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block">Years of Experience</label>
        <select
          className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant py-3 px-4 rounded-t focus:ring-0 focus:border-secondary text-sm font-medium appearance-none"
          name="experience"
          value={form.experience}
          onChange={onSelectChange}
        >
          <option>5-8 Years</option>
          <option>8-12 Years</option>
          <option>12-15 Years</option>
          <option>15+ Years (Executive)</option>
        </select>
        <div className="absolute right-3 bottom-3 pointer-events-none">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
        </div>
      </div>
    </div>
  );
}
