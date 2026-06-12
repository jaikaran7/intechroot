const coreValues = [
  { icon: "gavel",        title: "Integrity",     desc: "We do what we say. Transparency in communication, honesty in assessment, and accountability in delivery are non-negotiable at every level of engagement." },
  { icon: "diamond",      title: "Excellence",    desc: "Good enough is not a standard we accept. Every solution, every line of code, and every recommendation is held to the highest bar of technical and professional quality." },
  { icon: "lightbulb",    title: "Innovation",    desc: "We continuously explore and invest in emerging technologies to ensure our clients benefit from what's next — not just what's current or comfortable." },
  { icon: "group",        title: "Partnership",   desc: "We view every client relationship as a long-term strategic partnership. Your success is our success — and we engineer our engagements to create lasting value." },
  { icon: "assignment_turned_in", title: "Accountability", desc: "We own outcomes, not just outputs. When challenges arise, we address them head-on, communicate proactively, and resolve them with speed and precision." },
];

export default function ValuesSection() {
  return (
    <section className="py-52 bg-surface-container-low relative overflow-hidden">
      <div className="absolute top-[20%] left-[5%] w-[30vw] h-[30vw] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[25vw] h-[25vw] bg-tertiary-fixed-dim/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 relative">
        {/* Section label */}
        <div className="text-center mb-32">
          <div className="text-secondary font-black text-[12px] uppercase tracking-[0.5em] mb-6">
            Our Values
          </div>
          <h2 className="text-6xl md:text-8xl font-headline font-extrabold text-primary tracking-tighter leading-[0.9]">
            Mission, Vision &amp;
            <br />
            What We Stand For
          </h2>
        </div>

        {/* Mission + Vision cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Mission */}
          <div className="bg-primary-container text-white p-16 rounded-[4rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary-fixed-dim/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-tertiary-fixed-dim/20 flex items-center justify-center border border-tertiary-fixed-dim/30">
                  <span className="material-symbols-outlined text-3xl text-tertiary-fixed-dim">my_location</span>
                </div>
                <div className="text-[11px] font-black text-tertiary-fixed-dim uppercase tracking-[0.4em]">Our Mission</div>
              </div>
              <p className="text-2xl font-light leading-relaxed text-white/90">
                To accelerate enterprise growth by delivering technology solutions that are
                architecturally sound, operationally excellent, and strategically aligned with
                long-term business objectives.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-secondary text-white p-16 rounded-[4rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30">
                  <span className="material-symbols-outlined text-3xl text-white">visibility</span>
                </div>
                <div className="text-[11px] font-black text-white/70 uppercase tracking-[0.4em]">Our Vision</div>
              </div>
              <p className="text-2xl font-light leading-relaxed text-white/90">
                A world where every organization — regardless of size or sector — can access
                the technology expertise and strategic guidance needed to compete, innovate, and
                lead in their industry.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div>
          <div className="text-center mb-20">
            <h3 className="text-4xl font-headline font-bold text-primary tracking-tighter">Core Values</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {coreValues.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white p-10 rounded-[3rem] shadow-lg hover:-translate-y-4 transition-all duration-700 group flex flex-col gap-6 border border-outline-variant/10"
              >
                {/* Accent bar */}
                <div className="w-10 h-1 values-accent rounded-full group-hover:w-full transition-all duration-700" />
                <div className="w-14 h-14 rounded-2xl bg-secondary/5 flex items-center justify-center group-hover:bg-secondary/15 transition-all group-hover:rotate-3">
                  <span className="material-symbols-outlined text-3xl text-secondary">{icon}</span>
                </div>
                <div>
                  <h4 className="text-xl font-headline font-bold mb-3">{title}</h4>
                  <p className="text-xs text-on-primary-container/60 leading-relaxed font-medium">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
