const domains = [
  {
    icon: "database",
    title: "ERP Solutions",
    subtitle: "SAP · Oracle · Microsoft",
    desc: "Full-lifecycle ERP implementations, S/4HANA migrations, and managed services for complex enterprise environments. We build the operational backbone that scales with your business.",
    featured: true,
  },
  {
    icon: "cloud",
    title: "Cloud Services",
    subtitle: "AWS · Azure · GCP",
    desc: "Multi-cloud strategy, architecture, migration, and managed cloud operations. Scalable, secure, and cost-optimized infrastructure built for enterprise workloads.",
  },
  {
    icon: "code",
    title: "Software Development",
    subtitle: "Custom · Enterprise · API",
    desc: "Custom enterprise applications, microservices architectures, and API platforms built with modern frameworks and embedded DevSecOps practices.",
  },
  {
    icon: "insights",
    title: "Data & Analytics",
    subtitle: "BI · Warehousing · Pipelines",
    desc: "Business intelligence platforms, enterprise data warehouses, and real-time analytics pipelines that convert raw data into strategic business intelligence.",
  },
  {
    icon: "smart_toy",
    title: "AI & Automation",
    subtitle: "ML · RPA · Intelligent Agents",
    desc: "Intelligent process automation, ML model deployment, and AI-driven decision support systems that reduce manual overhead and surface actionable insights.",
  },
  {
    icon: "hub",
    title: "IT Consulting",
    subtitle: "Strategy · Architecture · Roadmap",
    desc: "Strategic technology advisory, enterprise architecture reviews, and digital roadmap planning that aligns technology investment with business outcomes.",
  },
  {
    icon: "rocket_launch",
    title: "Digital Transformation",
    subtitle: "Change · Platform · Culture",
    desc: "End-to-end organizational and technology transformation programs — from legacy modernization to new platform adoption and workforce enablement.",
  },
];

export default function ExpertiseSection() {
  const [featured, ...rest] = domains;

  return (
    <section className="py-52 bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 network-grid-intricate opacity-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Ambient light blob */}
      <div className="absolute top-1/3 right-[10%] w-[35vw] h-[35vw] bg-tertiary-fixed-dim/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-16 mb-32">
          <div className="max-w-3xl">
            <div className="text-tertiary-fixed-dim font-black text-[12px] uppercase tracking-[0.5em] mb-6">
              Core Expertise
            </div>
            <h2 className="text-6xl md:text-8xl font-headline font-extrabold tracking-tighter leading-[0.9]">
              Seven Pillars of
              <br />
              <span className="text-tertiary-fixed-dim">Enterprise Capability</span>
            </h2>
          </div>
          <p className="text-white/40 max-w-sm text-xl font-light leading-relaxed">
            A complete technology capability stack for organizations that demand
            precision, scale, and measurable outcomes.
          </p>
        </div>

        {/* Featured card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 sap-enterprise-card p-16 rounded-[4rem] relative group overflow-hidden text-white shadow-[0_60px_100px_rgba(0,6,21,0.4)] border border-white/10 expertise-card">
            <div className="absolute top-0 right-0 w-80 h-80 bg-tertiary-fixed-dim/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-16">
              <div>
                <div className="flex items-start justify-between mb-12">
                  <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 group-hover:rotate-6 transition-transform">
                    <span className="material-symbols-outlined text-5xl text-tertiary-fixed-dim">{featured.icon}</span>
                  </div>
                  <div className="px-5 py-2 bg-tertiary-fixed-dim/10 rounded-full border border-tertiary-fixed-dim/20 text-[9px] text-tertiary-fixed-dim font-black uppercase tracking-[0.3em]">
                    Core Domain
                  </div>
                </div>
                <h3 className="text-5xl font-headline font-bold mb-4">{featured.title}</h3>
                <div className="text-[11px] font-black text-tertiary-fixed-dim uppercase tracking-[0.3em] mb-8">{featured.subtitle}</div>
                <p className="text-xl text-white/50 max-w-xl leading-relaxed">{featured.desc}</p>
              </div>
              <ul className="grid grid-cols-2 gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-tertiary-fixed-dim">
                {["S/4HANA Modernization", "Custom ABAP Protocols", "Cloud ERP Fusion", "Multi-org Architecture"].map((item) => (
                  <li key={item} className="flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim shadow-[0_0_10px_rgba(76,215,246,0.8)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Second card in right column */}
          <div className="lg:col-span-4 glass-card-dark p-12 rounded-[4rem] border-white/10 group hover:-translate-y-3 transition-all duration-700 flex flex-col justify-between expertise-card">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-10 group-hover:bg-tertiary-fixed-dim transition-all group-hover:rotate-3 border border-white/15">
                <span className="material-symbols-outlined text-4xl text-tertiary-fixed-dim group-hover:text-primary">{rest[0].icon}</span>
              </div>
              <h3 className="text-3xl font-headline font-bold mb-2">{rest[0].title}</h3>
              <div className="text-[10px] font-black text-tertiary-fixed-dim uppercase tracking-[0.3em] mb-6">{rest[0].subtitle}</div>
              <p className="text-sm text-white/40 leading-relaxed font-medium">{rest[0].desc}</p>
            </div>
            <div className="pt-10 flex items-center gap-3 text-white font-black text-[11px] uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform">
              <span>Explore</span>
              <span className="material-symbols-outlined text-lg text-tertiary-fixed-dim">chevron_right</span>
            </div>
          </div>
        </div>

        {/* Remaining 5 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {rest.slice(1).map(({ icon, title, subtitle, desc }) => (
            <div
              key={title}
              className="glass-card-dark p-10 rounded-[3rem] border-white/10 group hover:-translate-y-3 transition-all duration-700 flex flex-col justify-between expertise-card"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 group-hover:bg-tertiary-fixed-dim transition-all group-hover:rotate-3 border border-white/10">
                  <span className="material-symbols-outlined text-3xl text-tertiary-fixed-dim group-hover:text-primary">{icon}</span>
                </div>
                <h3 className="text-xl font-headline font-bold mb-2">{title}</h3>
                <div className="text-[9px] font-black text-tertiary-fixed-dim uppercase tracking-[0.25em] mb-5">{subtitle}</div>
                <p className="text-xs text-white/40 leading-relaxed font-medium">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
