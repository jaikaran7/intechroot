const milestones = [
  {
    year: "2015",
    title: "Founded with Purpose",
    desc: "InTechRoot was established to bridge the technology talent and delivery gap in enterprise organizations — combining speed, quality, and deep domain expertise from day one.",
  },
  {
    year: "2017",
    title: "First Enterprise Partnerships",
    desc: "Expanded into cloud services and secured our first Fortune 500 partnerships, proving our delivery methodology at scale and earning long-term client relationships.",
  },
  {
    year: "2019",
    title: "Full-Service Digital Transformation",
    desc: "Launched our AI and Data Analytics practice, evolving into a comprehensive digital transformation firm with end-to-end capabilities across the enterprise technology stack.",
  },
  {
    year: "2021",
    title: "100+ Professional Milestone",
    desc: "Scaled our certified professional network past 100 engineers, architects, and consultants — enabling concurrent global engagements without compromising quality.",
  },
  {
    year: "2023",
    title: "Global Delivery Presence",
    desc: "Established delivery operations across North America, Europe, and Asia-Pacific, enabling follow-the-sun execution and localized account management for enterprise clients worldwide.",
  },
  {
    year: "2025",
    title: "Recognized Industry Leader",
    desc: "Achieved 95%+ client retention and recognition as a leading enterprise technology partner across multiple industry verticals — a reflection of outcomes over promises.",
  },
];

export default function JourneySection() {
  return (
    <section className="py-52 bg-primary-container text-white relative overflow-hidden">
      <div className="absolute inset-0 network-grid-intricate opacity-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Ambient glows */}
      <div className="absolute top-[20%] right-[5%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[30vw] h-[30vw] bg-tertiary-fixed-dim/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 relative">
        {/* Header */}
        <div className="text-center mb-32">
          <div className="text-tertiary-fixed-dim font-black text-[12px] uppercase tracking-[0.5em] mb-6">
            Our Story
          </div>
          <h2 className="text-6xl md:text-8xl font-headline font-extrabold tracking-tighter leading-[0.9]">
            A Decade of
            <br />
            <span className="text-tertiary-fixed-dim">Engineering Excellence</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-xl font-light mt-10">
            A timeline of growth, commitment, and the milestones that shaped who we are today.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical center line — desktop only */}
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px timeline-connector hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {milestones.map(({ year, title, desc }, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={year}
                  className="relative grid grid-cols-1 lg:grid-cols-[1fr_5rem_1fr] items-start lg:mb-12"
                >
                  {/* Left cell */}
                  {isLeft ? (
                    <div className="glass-card-dark p-10 rounded-[2.5rem] border-white/10 hover:-translate-y-2 transition-all duration-500 lg:mr-8 group">
                      <div className="text-tertiary-fixed-dim font-black text-[11px] uppercase tracking-[0.4em] mb-4">
                        {year}
                      </div>
                      <h3 className="text-2xl font-headline font-bold mb-4 group-hover:text-tertiary-fixed-dim transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-white/50 leading-relaxed font-medium">{desc}</p>
                    </div>
                  ) : (
                    <div className="hidden lg:block" />
                  )}

                  {/* Center: year badge + connector */}
                  <div className="hidden lg:flex flex-col items-center gap-4 pt-8">
                    <div className="w-14 h-14 shrink-0 rounded-full bg-tertiary-fixed-dim text-primary flex items-center justify-center font-headline font-black text-sm shadow-[0_0_30px_rgba(76,215,246,0.4)] z-10">
                      {year.slice(2)}
                    </div>
                  </div>

                  {/* Right cell */}
                  {!isLeft ? (
                    <div className="glass-card-dark p-10 rounded-[2.5rem] border-white/10 hover:-translate-y-2 transition-all duration-500 lg:ml-8 group">
                      <div className="text-tertiary-fixed-dim font-black text-[11px] uppercase tracking-[0.4em] mb-4">
                        {year}
                      </div>
                      <h3 className="text-2xl font-headline font-bold mb-4 group-hover:text-tertiary-fixed-dim transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-white/50 leading-relaxed font-medium">{desc}</p>
                    </div>
                  ) : (
                    <div className="hidden lg:block" />
                  )}

                  {/* Mobile: show cards linearly */}
                  {isLeft ? null : (
                    <div className="glass-card-dark p-10 rounded-[2.5rem] border-white/10 lg:hidden group">
                      <div className="text-tertiary-fixed-dim font-black text-[11px] uppercase tracking-[0.4em] mb-4">
                        {year}
                      </div>
                      <h3 className="text-2xl font-headline font-bold mb-4">{title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed font-medium">{desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
