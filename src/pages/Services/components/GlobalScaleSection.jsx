const FEATURES = [
  { icon: "verified",    title: "Pre-vetted Talent",  sub: "Top 1% Global Experts"  },
  { icon: "speed",       title: "Fast Deployment",    sub: "Ready within 48h"       },
  { icon: "language",    title: "Global Model",       sub: "24/7 Delivery Cycles"   },
  { icon: "handshake",   title: "Flexible Terms",     sub: "Agile Engagement"       },
  { icon: "trending_up", title: "Scalable Teams",     sub: "Grow as you build"      },
];

export default function GlobalScaleSection({ children }) {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-primary text-white overflow-hidden relative">
      <div className="absolute inset-0 network-grid opacity-5"></div>
      <div className="absolute top-[20%] right-[5%] w-[30vw] h-[30vw] bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <div data-sr="up" className="text-tertiary-fixed-dim font-black text-[11px] uppercase tracking-[0.5em] mb-3">
            Why InTechRoot
          </div>
          <h2 data-sr="up" data-delay="100" className="text-3xl md:text-4xl lg:text-5xl font-headline font-extrabold tracking-tighter mb-4 md:mb-6">
            Built for the Modern Global Scale
          </h2>
          <p data-sr="up" data-delay="200" className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
            Why the world's leading enterprises trust InTechRoot with their most critical engineering challenges.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 mb-12 md:mb-16 lg:mb-24">
          {FEATURES.map(({ icon, title, sub }, i) => (
            <div
              key={title}
              data-sr="up"
              data-delay={String(i * 80)}
              className="text-center group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-tertiary-fixed-dim/20 group-hover:border-tertiary-fixed-dim/30 transition-all duration-300">
                <span className="material-symbols-outlined text-tertiary-fixed-dim">{icon}</span>
              </div>
              <h5 className="text-xs md:text-sm font-bold uppercase tracking-widest mb-1 md:mb-2">{title}</h5>
              <p className="text-[10px] md:text-xs text-white/50">{sub}</p>
            </div>
          ))}
        </div>

        {children}
      </div>
    </section>
  );
}
