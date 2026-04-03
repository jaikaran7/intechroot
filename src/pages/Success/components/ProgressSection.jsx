export default function ProgressSection() {
  return (
    <section className="relative mb-20">
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant/20 -translate-y-1/2 z-0 hidden md:block"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        {[
          ["Review", "Portfolio & Background Analysis Complete", "Completed"],
          ["Screening", "Cultural Alignment & Strategy Session", "Completed"],
          ["Technical", "Systems Architecture Deep-Dive", "Completed"],
          ["Finalized", "Executive Partnership Confirmed", "Completed"],
        ].map(([title, text, status]) => (
          <div key={title} className="group">
            <div className="glass-card p-8 rounded-xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 border-l-4 border-l-secondary md:border-l-0 md:border-t-4 md:border-t-secondary">
              <div className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center mb-6 shadow-xl">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <h3 className="font-headline font-bold text-lg mb-2">{title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{text}</p>
              <span className="mt-4 text-[10px] font-bold text-secondary uppercase">{status}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
