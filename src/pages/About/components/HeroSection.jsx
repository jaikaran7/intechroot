import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-48 overflow-hidden perspective-1000">
      <div className="absolute inset-0 hero-gradient -z-[30]" />
      <div className="mesh-gradient -z-[25]" />
      <div className="absolute inset-0 network-grid-intricate -z-[20]" />

      <div
        className="absolute top-[20%] left-[10%] w-96 h-96 bg-white/5 backdrop-blur-2xl rounded-full -z-[15] floating-element opacity-20"
        style={{ animationDuration: "12s" }}
      />
      <div
        className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-secondary/10 backdrop-blur-3xl rounded-[3rem] -z-[15] floating-element opacity-30"
        style={{ animationDuration: "15s", animationDelay: "-5s" }}
      />

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-24 items-center relative">
        {/* ── Left column: copy ── */}
        <div className="lg:col-span-7 space-y-12 z-10">
          <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl reveal-text stagger-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary-fixed-dim" />
            </span>
            <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.4em]">
              Technology &amp; Consulting Partner
            </span>
          </div>

          <h1 className="text-7xl md:text-9xl font-headline font-extrabold text-white leading-[0.9] tracking-tighter reveal-text stagger-2">
            Where Enterprise
            <br />
            <span className="bg-gradient-to-r from-white via-white to-tertiary-fixed-dim bg-clip-text text-transparent">
              Meets Innovation.
            </span>
          </h1>

          <p className="text-2xl text-white/50 max-w-2xl font-light leading-relaxed reveal-text stagger-3">
            InTechRoot is a global technology and consulting firm engineering digital
            transformation at enterprise scale — from ERP modernization and cloud migration
            to AI-driven automation and custom software development.
          </p>

          <div className="flex flex-wrap gap-8 pt-8 reveal-text stagger-4">
            <Link
              to="/contact"
              className="group relative inline-flex items-center justify-center px-12 py-6 overflow-hidden rounded-2xl transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.4)] hover:shadow-tertiary-fixed-dim/30"
            >
              <div className="absolute inset-0 bg-tertiary-fixed-dim transition-transform group-hover:scale-110" />
              <span className="relative font-headline font-black text-[11px] uppercase tracking-[0.3em] text-primary">
                Contact Us
              </span>
            </Link>
            <Link
              to="/services"
              className="group inline-flex items-center justify-center gap-4 px-12 py-6 rounded-2xl border border-white/20 text-white font-headline font-black text-[11px] uppercase tracking-[0.3em] backdrop-blur-xl hover:bg-white/10 transition-all"
            >
              Explore Services
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

        {/* ── Right column: visual cards ── */}
        <div className="lg:col-span-5 relative h-[700px] flex items-center justify-center">
          {/* Main dark card */}
          <div
            className="relative z-20 w-[380px] h-[480px] glass-card-dark rounded-[3.5rem] p-1 shadow-2xl overflow-hidden floating-element"
            style={{ animationDelay: "-1s" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
            <div className="relative p-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-10">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim text-4xl">corporate_fare</span>
                  </div>
                  <div className="px-4 py-1.5 bg-white/10 rounded-full border border-white/10 text-[9px] text-tertiary-fixed-dim font-black uppercase tracking-widest">
                    Est. 2015
                  </div>
                </div>
                <h4 className="text-3xl font-headline font-bold text-white mb-4">InTechRoot</h4>
                <p className="text-sm text-white/40 leading-relaxed">
                  Architecting enterprise-grade technology solutions for the world's
                  most ambitious organizations.
                </p>
              </div>

              <div className="space-y-6">
                <div className="h-[1px] w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    ["250+", "Projects"],
                    ["20+", "Industries"],
                    ["97%", "Retention"],
                  ].map(([val, label]) => (
                    <div key={label}>
                      <div className="text-2xl font-headline font-black text-tertiary-fixed-dim">{val}</div>
                      <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top-right floating badge */}
          <div
            className="absolute top-8 -right-8 z-30 floating-element"
            style={{ animationDelay: "-3s" }}
          >
            <div className="glass-card p-6 rounded-[2rem] w-56 border-white/40 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse" />
                <div className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">
                  Global Delivery
                </div>
              </div>
              <div className="text-lg font-headline font-black text-primary">24 / 7 Operations</div>
              <div className="text-[10px] text-on-primary-container/60 mt-1">Across all timezones</div>
            </div>
          </div>

          {/* Bottom-left floating tech stack card */}
          <div
            className="absolute -bottom-16 -left-8 z-30 floating-element"
            style={{ animationDelay: "-4s" }}
          >
            <div className="glass-card p-8 rounded-[2.5rem] w-72 border-white/40 shadow-2xl">
              <div className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] mb-4">
                Technology Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {["SAP", "AWS", "Azure", "AI/ML", "React", "GCP"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-secondary/10 rounded-full text-[9px] font-black text-secondary uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
