const steps = [
  {
    number: "01",
    icon: "search",
    title: "Discovery",
    subtitle: "Understand Before We Build",
    desc: "We begin every engagement with a structured discovery phase — analyzing your business objectives, current technology landscape, constraints, and success criteria before recommending a single solution.",
    color: "bg-secondary",
  },
  {
    number: "02",
    icon: "design_services",
    title: "Planning",
    subtitle: "Architecture Before Code",
    desc: "From discovery insights, we design a detailed implementation roadmap — defining milestones, resource allocation, risk mitigation strategies, and measurable KPIs aligned to your business outcomes.",
    color: "bg-tertiary-fixed-dim",
  },
  {
    number: "03",
    icon: "code_blocks",
    title: "Development",
    subtitle: "Engineering at Pace",
    desc: "Agile delivery cycles with embedded quality gates, continuous integration, and transparent progress reporting. You see progress weekly — not just at the end of a long project phase.",
    color: "bg-secondary",
  },
  {
    number: "04",
    icon: "rocket_launch",
    title: "Implementation",
    subtitle: "Zero-Disruption Deployment",
    desc: "Phased rollout strategies with comprehensive testing, parallel run periods where required, and user enablement programs designed to maximize adoption without operational disruption.",
    color: "bg-tertiary-fixed-dim",
  },
  {
    number: "05",
    icon: "support_agent",
    title: "Support",
    subtitle: "Partnership Beyond Go-Live",
    desc: "Our engagement doesn't end at deployment. We provide structured post-implementation support, performance optimization, and strategic advisory as your technology evolves.",
    color: "bg-secondary",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-52 bg-white relative overflow-hidden">
      {/* Ghost text backdrop */}
      <div className="absolute -bottom-8 -right-8 text-[200px] font-black text-primary/[0.02] select-none leading-none pointer-events-none tracking-tighter">
        HOW
      </div>

      <div className="max-w-7xl mx-auto px-8 relative">
        {/* Header */}
        <div className="text-center mb-32">
          <div className="text-secondary font-black text-[12px] uppercase tracking-[0.5em] mb-6">
            How We Work
          </div>
          <h2 className="text-6xl md:text-8xl font-headline font-extrabold text-primary tracking-tighter leading-[0.9]">
            A Process Built
            <br />
            for Certainty
          </h2>
          <p className="text-xl text-on-primary-container/60 font-light max-w-2xl mx-auto mt-10 leading-relaxed">
            Predictable delivery is not luck — it is the result of a disciplined methodology
            refined across hundreds of enterprise engagements.
          </p>
        </div>

        {/* Steps — desktop horizontal, mobile vertical */}
        <div className="hidden lg:flex items-stretch gap-0 relative mb-24">
          {steps.map(({ number, icon, title, subtitle, desc, color }, i) => (
            <div key={number} className="flex-1 relative group">
              {/* Connector arrow between steps */}
              {i < steps.length - 1 && (
                <div className="absolute top-[3.5rem] -right-4 z-10 w-8 h-8 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-secondary/40 group-hover:text-secondary transition-colors">
                    chevron_right
                  </span>
                </div>
              )}

              <div className="glass-card p-10 rounded-[3rem] mx-3 h-full flex flex-col justify-between hover:-translate-y-4 transition-all duration-700 shadow-xl border-white/60">
                {/* Step number + icon */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform`}>
                      <span className="material-symbols-outlined text-2xl">{icon}</span>
                    </div>
                    <div className="text-[40px] font-black text-primary/[0.06] leading-none">{number}</div>
                  </div>
                  <div className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-3">{subtitle}</div>
                  <h3 className="text-2xl font-headline font-bold text-primary mb-4">{title}</h3>
                  <p className="text-sm text-on-primary-container/60 leading-relaxed font-medium">{desc}</p>
                </div>

                {/* Bottom step indicator */}
                <div className="mt-8 flex items-center gap-3">
                  <div className={`h-1 flex-1 rounded-full ${i === 0 || i % 2 === 0 ? "bg-secondary/30" : "bg-tertiary-fixed-dim/40"}`} />
                  <span className="text-[10px] font-black text-on-primary-container/30 uppercase tracking-[0.2em]">Step {number}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: vertical list */}
        <div className="lg:hidden space-y-6">
          {steps.map(({ number, icon, title, subtitle, desc, color }) => (
            <div key={number} className="glass-card p-10 rounded-[3rem] flex items-start gap-8 shadow-xl border-white/60">
              <div className={`shrink-0 w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
              </div>
              <div>
                <div className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-2">{subtitle}</div>
                <h3 className="text-xl font-headline font-bold mb-3">{title}</h3>
                <p className="text-sm text-on-primary-container/60 leading-relaxed font-medium">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-24">
          <div className="inline-flex items-center gap-6 px-10 py-5 glass-card rounded-full border-white/60 shadow-lg">
            <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
            <span className="text-[12px] font-black text-primary uppercase tracking-[0.4em]">
              Structured · Transparent · Accountable
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
