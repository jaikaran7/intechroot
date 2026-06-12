const cultureCards = [
  {
    icon: "school",
    title: "Continuous Learning",
    desc: "Every professional at InTechRoot is supported with dedicated learning budgets, certification programs, and access to the latest tools and platforms.",
  },
  {
    icon: "groups",
    title: "Collaborative by Design",
    desc: "Cross-functional teams built around complementary expertise — architects, engineers, and consultants working as a unified delivery unit.",
  },
  {
    icon: "military_tech",
    title: "Elite Talent Standards",
    desc: "We hire the top 1% through a rigorous multi-stage process that evaluates technical depth, problem-solving, and cultural alignment.",
  },
  {
    icon: "emoji_events",
    title: "Outcome-Oriented",
    desc: "Our teams are measured by the outcomes they create for clients, not the hours they log — a culture that rewards initiative and impact.",
  },
];

const attributes = [
  "100+ Certified Professionals",
  "10+ Technology Specializations",
  "Multi-timezone Coverage",
  "Agile & Structured Delivery",
  "Industry-Specific Expertise",
  "Continuous Upskilling Programs",
];

export default function TeamSection() {
  return (
    <section className="py-52 bg-primary-container text-white relative overflow-hidden">
      <div className="absolute inset-0 network-grid-intricate opacity-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute top-[30%] right-[8%] w-[35vw] h-[35vw] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 relative">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div>
            <div className="text-tertiary-fixed-dim font-black text-[12px] uppercase tracking-[0.5em] mb-6">
              Team &amp; Culture
            </div>
            <h2 className="text-6xl md:text-8xl font-headline font-extrabold tracking-tighter leading-[0.9]">
              The People Behind
              <br />
              <span className="text-tertiary-fixed-dim">the Platform</span>
            </h2>
          </div>
          <div className="space-y-8">
            <p className="text-xl text-white/50 font-light leading-relaxed">
              InTechRoot is powered by a community of engineers, architects, and
              consultants who chose this profession because they love solving hard
              problems — and who stay because they are continuously challenged to grow.
            </p>
            <p className="text-xl text-white/50 font-light leading-relaxed">
              We believe the best technical outcomes emerge from diverse, motivated
              teams that are given clear ownership, meaningful challenges, and the
              tools to do their best work.
            </p>
          </div>
        </div>

        {/* Culture cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {cultureCards.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="glass-card-dark p-12 rounded-[3.5rem] border-white/10 hover:-translate-y-3 transition-all duration-700 group flex items-start gap-10"
            >
              <div className="shrink-0 w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-tertiary-fixed-dim transition-all border border-white/10 group-hover:rotate-6">
                <span className="material-symbols-outlined text-3xl text-tertiary-fixed-dim group-hover:text-primary">
                  {icon}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-headline font-bold mb-4 group-hover:text-tertiary-fixed-dim transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed font-medium">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Attribute tags */}
        <div className="p-16 glass-card-dark rounded-[4rem] border-white/10">
          <div className="text-[11px] font-black text-tertiary-fixed-dim uppercase tracking-[0.5em] mb-12 text-center">
            Team Attributes
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {attributes.map((attr) => (
              <span
                key={attr}
                className="px-8 py-4 border border-white/15 rounded-full text-[11px] font-black text-white/70 uppercase tracking-[0.25em] hover:border-tertiary-fixed-dim hover:text-tertiary-fixed-dim transition-all cursor-default"
              >
                {attr}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
