export default function StatsSection() {
  return (
    <section className="relative z-40 -mt-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-[3rem] overflow-hidden glass-card p-2 border-white/30 backdrop-blur-3xl shadow-2xl">
          <div className="bg-white/40 p-14 text-center group hover:bg-white transition-all duration-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-secondary/10 font-black text-8xl absolute -left-4 -top-4 group-hover:text-secondary/20 transition-all select-none">01</div>
            <div className="relative">
              <div className="text-6xl font-headline font-black text-primary tracking-tighter mb-3 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-[11px] font-black text-on-primary-container/60 uppercase tracking-[0.4em]">Engineers</div>
            </div>
          </div>
          <div className="bg-white/40 p-14 text-center group hover:bg-white transition-all duration-700 relative overflow-hidden border-l border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-secondary/10 font-black text-8xl absolute -left-4 -top-4 group-hover:text-secondary/20 transition-all select-none">02</div>
            <div className="relative">
              <div className="text-6xl font-headline font-black text-primary tracking-tighter mb-3 group-hover:scale-110 transition-transform">50+</div>
              <div className="text-[11px] font-black text-on-primary-container/60 uppercase tracking-[0.4em]">Fortune 500</div>
            </div>
          </div>
          <div className="bg-white/40 p-14 text-center group hover:bg-white transition-all duration-700 relative overflow-hidden border-l border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-secondary/10 font-black text-8xl absolute -left-4 -top-4 group-hover:text-secondary/20 transition-all select-none">03</div>
            <div className="relative">
              <div className="text-6xl font-headline font-black text-primary tracking-tighter mb-3 group-hover:scale-110 transition-transform">10+</div>
              <div className="text-[11px] font-black text-on-primary-container/60 uppercase tracking-[0.4em]">Frameworks</div>
            </div>
          </div>
          <div className="bg-white/40 p-14 text-center group hover:bg-white transition-all duration-700 relative overflow-hidden border-l border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-secondary/10 font-black text-8xl absolute -left-4 -top-4 group-hover:text-secondary/20 transition-all select-none">04</div>
            <div className="relative">
              <div className="text-6xl font-headline font-black text-primary tracking-tighter mb-3 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-[11px] font-black text-on-primary-container/60 uppercase tracking-[0.4em]">Operations</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
