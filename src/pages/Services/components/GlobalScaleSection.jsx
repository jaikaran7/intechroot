export default function GlobalScaleSection({ children }) {
  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
      <div className="absolute inset-0 network-grid opacity-5"></div>
      <div className="max-w-7xl mx-auto px-8 relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter mb-6">Built for the Modern Global Scale</h2>
          <p className="text-white/60 max-w-2xl mx-auto">Why the world's leading enterprises trust InTech Road with their most critical engineering challenges.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-24">
          <div className="text-center group">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-tertiary-fixed-dim/20 transition-colors">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">verified</span>
            </div>
            <h5 className="text-sm font-bold uppercase tracking-widest mb-2">Pre-vetted Talent</h5>
            <p className="text-xs text-white/50">Top 1% Global Experts</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-tertiary-fixed-dim/20 transition-colors">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">speed</span>
            </div>
            <h5 className="text-sm font-bold uppercase tracking-widest mb-2">Fast Deployment</h5>
            <p className="text-xs text-white/50">Ready within 48h</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-tertiary-fixed-dim/20 transition-colors">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">language</span>
            </div>
            <h5 className="text-sm font-bold uppercase tracking-widest mb-2">Global Model</h5>
            <p className="text-xs text-white/50">24/7 Delivery Cycles</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-tertiary-fixed-dim/20 transition-colors">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">handshake</span>
            </div>
            <h5 className="text-sm font-bold uppercase tracking-widest mb-2">Flexible Terms</h5>
            <p className="text-xs text-white/50">Agile Engagement</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-tertiary-fixed-dim/20 transition-colors">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">trending_up</span>
            </div>
            <h5 className="text-sm font-bold uppercase tracking-widest mb-2">Scalable Teams</h5>
            <p className="text-xs text-white/50">Grow as you build</p>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
