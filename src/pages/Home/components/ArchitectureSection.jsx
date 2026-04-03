export default function ArchitectureSection() {
  return (
    <section className="py-52 bg-background relative overflow-hidden">
      <div className="absolute left-0 bottom-0 w-full h-[60%] bg-surface-container-low/20 -z-10"></div>
      <div className="absolute top-[10%] right-[10%] w-[30%] aspect-square bg-primary-container/5 backdrop-blur-3xl rounded-[10rem] rotate-12 -z-10"></div>
      <div className="max-w-7xl mx-auto px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-32 -left-32 text-[250px] font-black text-primary/5 select-none leading-none z-0">CORE</div>
            <h2 className="text-6xl md:text-7xl font-headline font-extrabold text-primary tracking-tighter mb-12 relative z-10 leading-[0.9]">Architectural Velocity</h2>
            <p className="text-xl text-on-primary-container/70 mb-16 max-w-md font-light">Our deployment methodology bypasses bureaucratic inertia, focusing purely on high-fidelity technical output and rapid integration.</p>
            <div className="glass-card p-14 rounded-[4rem] border-secondary/20 relative shadow-2xl inner-glow">
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center shadow-2xl shadow-secondary/40 animate-bounce" style={{ animationDuration: "4s" }}>
                <span className="material-symbols-outlined text-white text-3xl">bolt</span>
              </div>
              <div className="space-y-16">
                {[
                  ["01", "Deep Audit", "A comprehensive forensic deep-dive into legacy technical debt and future-state vision.", "group-hover:bg-primary group-hover:text-white group-hover:border-primary"],
                  ["02", "Squad Fusion", "Onboarding senior architectural talent perfectly aligned to your stack and culture within 48h.", "group-hover:bg-secondary group-hover:text-white group-hover:border-secondary"],
                  ["03", "Continuous Evolution", "Dynamic resource scaling based on project velocity, milestones, and emergent complexity.", "group-hover:bg-tertiary-fixed-dim group-hover:text-primary group-hover:border-tertiary-fixed-dim"],
                ].map(([num, title, text, hoverClass]) => (
                  <div key={num} className="flex gap-10 group">
                    <div className={`shrink-0 w-16 h-16 rounded-full border-2 border-primary/10 flex items-center justify-center text-xl font-black text-primary transition-all ${hoverClass} group-hover:scale-110`}>
                      {num}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold mb-3">{title}</h4>
                      <p className="text-sm text-on-primary-container/60 leading-relaxed font-medium">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 relative">
            <div className="relative w-full aspect-square max-w-3xl mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-tertiary-fixed-dim/10 to-transparent rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute w-[70%] h-[50%] glass-card rounded-[3rem] -rotate-12 translate-x-[-15%] translate-y-[-25%] border-white/50 shadow-2xl z-10 flex items-center justify-center floating-element" style={{ animationDuration: "10s" }}>
                <span className="text-[140px] opacity-[0.03] font-black tracking-widest">BUILD</span>
              </div>
              <div className="absolute w-[70%] h-[50%] glass-card rounded-[3rem] rotate-6 translate-x-[20%] translate-y-[15%] border-white/50 shadow-2xl z-20 flex items-center justify-center floating-element" style={{ animationDuration: "12s", animationDelay: "-2s" }}>
                <span className="text-[140px] opacity-[0.03] font-black tracking-widest">DEPLOY</span>
              </div>
              <div className="absolute w-[60%] h-[35%] bg-primary-container/95 rounded-[3rem] -rotate-2 translate-x-[5%] translate-y-[35%] shadow-[0_50px_100px_rgba(0,0,0,0.6)] z-30 flex flex-col p-10 text-white glint-effect border border-white/20">
                <div className="flex items-center justify-between mb-auto">
                  <div className="text-[11px] font-black uppercase tracking-[0.4em] text-tertiary-fixed-dim">Revision v4.2.10</div>
                  <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,1)]"></span>
                </div>
                <div className="text-4xl font-headline font-black tracking-tighter">INTEGRITY VERIFIED</div>
                <div className="mt-6 text-[10px] font-bold text-white/40 uppercase tracking-widest">All Core Systems Synchronized</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
