export default function StatsSection() {
  return (
    <section className="relative z-40 -mt-10 md:-mt-16 lg:-mt-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-[2rem] lg:rounded-[3rem] overflow-hidden glass-card p-1.5 lg:p-2 border-white/30 backdrop-blur-3xl shadow-2xl">
          {[
            ["100+", "Engineers"],
            ["5+", "Fortune 500"],
            ["10+", "Frameworks"],
            ["24/7", "Operations"],
          ].map(([val, label], i) => (
            <div
              key={label}
              className={`bg-white/40 p-6 sm:p-10 lg:p-14 text-center group hover:bg-white transition-all duration-700 relative overflow-hidden ${i > 0 ? "border-l border-white/20" : ""}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-3xl sm:text-5xl lg:text-6xl font-headline font-black text-primary tracking-tighter mb-2 lg:mb-3 group-hover:scale-110 transition-transform">{val}</div>
                <div className="text-[9px] sm:text-[11px] font-black text-on-primary-container/60 uppercase tracking-[0.3em] sm:tracking-[0.4em]">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
