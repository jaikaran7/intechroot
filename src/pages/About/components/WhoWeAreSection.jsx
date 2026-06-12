const identityCards = [
  {
    icon: "settings_applications",
    title: "Technology Architecture",
    desc: "Enterprise-scale system design and implementation across cloud-native, hybrid, and on-premise environments — engineered for performance and longevity.",
  },
  {
    icon: "transform",
    title: "Digital Transformation",
    desc: "End-to-end organizational change management that guides businesses from legacy operations to modern, agile digital platforms without disrupting continuity.",
  },
  {
    icon: "inventory_2",
    title: "Enterprise ERP",
    desc: "Full-lifecycle SAP and Oracle ERP implementations, migrations, and managed services tailored to the operational complexity of large-scale enterprises.",
  },
  {
    icon: "psychology",
    title: "AI & Cloud Enablement",
    desc: "Intelligent automation, ML model deployment, and cloud-native architectures that unlock operational agility, reduce costs, and accelerate innovation.",
  },
];

export default function WhoWeAreSection() {
  return (
    <section className="py-52 bg-white relative overflow-hidden">
      {/* Diagonal background accent */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-surface-container-low/40 skew-x-[-8deg] translate-x-48 -z-10 border-l border-outline-variant/5" />

      <div className="max-w-7xl mx-auto px-8 relative">
        {/* Section header: two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div>
            <div className="text-secondary font-black text-[12px] uppercase tracking-[0.5em] mb-6">
              Our Identity
            </div>
            <h2 className="text-6xl md:text-8xl font-headline font-extrabold text-primary tracking-tighter leading-[0.9]">
              Built for the
              <br />
              Complexity of
              <br />
              Enterprise
            </h2>
          </div>

          <div className="space-y-8">
            <p className="text-xl text-on-primary-container/70 font-light leading-relaxed">
              InTechRoot is not a conventional software vendor. We are a technology
              transformation partner — a firm built specifically to navigate the
              complexity, scale, and strategic demands of enterprise-grade engagements.
            </p>
            <p className="text-xl text-on-primary-container/70 font-light leading-relaxed">
              Founded with the conviction that technology decisions shape business
              outcomes, we combine deep domain expertise, certified professionals,
              and a client-first approach to deliver solutions that endure beyond
              project timelines.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div className="h-px flex-1 bg-gradient-to-r from-secondary/30 to-transparent" />
              <span className="text-[11px] font-black text-secondary uppercase tracking-[0.3em]">
                Since 2015
              </span>
            </div>
          </div>
        </div>

        {/* Identity cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {identityCards.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="glass-card p-12 rounded-[3.5rem] hover:-translate-y-4 transition-all duration-700 group flex flex-col gap-8 shadow-xl border-white/60"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/5 flex items-center justify-center group-hover:bg-secondary/15 transition-all group-hover:rotate-3">
                <span className="material-symbols-outlined text-4xl text-secondary">{icon}</span>
              </div>
              <div>
                <h3 className="text-3xl font-headline font-bold mb-4">{title}</h3>
                <p className="text-sm text-on-primary-container/60 leading-relaxed font-medium">{desc}</p>
              </div>
              <div className="pt-2 flex items-center gap-3 text-primary font-black text-[11px] uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform">
                <span>Learn More</span>
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
