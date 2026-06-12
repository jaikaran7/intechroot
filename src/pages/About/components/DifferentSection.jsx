const differentiators = [
  {
    icon: "handshake",
    number: "01",
    title: "Client-First Philosophy",
    desc: "Every engagement begins with understanding your business goals, not our service catalog. We align our capabilities to your outcomes — not the other way around.",
  },
  {
    icon: "verified_user",
    number: "02",
    title: "Deep Domain Expertise",
    desc: "Certified professionals with 10+ years of specialized experience in ERP, cloud, AI, and enterprise software — vetted through rigorous technical and cultural assessment.",
  },
  {
    icon: "open_in_full",
    number: "03",
    title: "Scalable Delivery",
    desc: "Teams that grow with your needs, from focused pilot projects to organization-wide digital transformations, without sacrificing quality or coherence.",
  },
  {
    icon: "public",
    number: "04",
    title: "Global Reach, Local Presence",
    desc: "Delivery capability across time zones, with dedicated account managers who understand your business context and ensure continuity at every phase.",
  },
  {
    icon: "lab_research",
    number: "05",
    title: "Innovation-Driven Mindset",
    desc: "Continuous investment in emerging technologies means our clients benefit from what's coming, not just what's current — staying ahead of industry shifts.",
  },
  {
    icon: "support_agent",
    number: "06",
    title: "End-to-End Partnership",
    desc: "Full lifecycle support from strategy and architecture through deployment, training, and long-term optimization — one partner, one accountability structure.",
  },
];

export default function DifferentSection() {
  return (
    <section className="py-52 bg-white relative overflow-hidden">
      {/* Large ghosted text watermark */}
      <div className="absolute -top-16 -left-8 text-[200px] md:text-[280px] font-black text-primary/[0.025] select-none leading-none pointer-events-none tracking-tighter">
        WHY
      </div>

      <div className="max-w-7xl mx-auto px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-16 mb-32">
          <div className="max-w-3xl">
            <div className="text-secondary font-black text-[12px] uppercase tracking-[0.5em] mb-6">
              What Sets Us Apart
            </div>
            <h2 className="text-6xl md:text-8xl font-headline font-extrabold text-primary tracking-tighter leading-[0.9]">
              Six Reasons Enterprises Choose InTechRoot
            </h2>
          </div>
          <p className="text-xl text-on-primary-container/60 font-light leading-relaxed max-w-sm">
            Expertise alone is not differentiation. These are the principles that define how we work and why clients stay.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentiators.map(({ icon, number, title, desc }) => (
            <div
              key={number}
              className="glass-card p-12 rounded-[3.5rem] hover:-translate-y-5 transition-all duration-700 group flex flex-col justify-between shadow-xl border-white/60 relative overflow-hidden"
            >
              {/* Ghost number */}
              <div className="absolute top-6 right-8 text-[80px] font-black text-primary/[0.04] select-none leading-none">
                {number}
              </div>

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-secondary/5 flex items-center justify-center mb-10 group-hover:bg-secondary/15 transition-all group-hover:rotate-3">
                  <span className="material-symbols-outlined text-4xl text-secondary">{icon}</span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4">{title}</h3>
                <p className="text-sm text-on-primary-container/60 leading-relaxed font-medium">{desc}</p>
              </div>

              <div className="pt-10 flex items-center gap-3 text-primary font-black text-[11px] uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform">
                <span>{number}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-secondary/40 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
