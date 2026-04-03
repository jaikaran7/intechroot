import Button from "../../../components/Form/Button";
import Card from "../../../components/Card";
import Typography from "../../../components/Typography";

export default function HeroSection() {
  return (
    <>
      <section className="relative min-h-screen flex items-center pt-32 pb-48 overflow-hidden perspective-1000">
        <div className="absolute inset-0 hero-gradient -z-[30]"></div>
        <div className="mesh-gradient -z-[25]"></div>
        <div className="absolute inset-0 network-grid-intricate -z-[20]"></div>
        <div
          className="absolute top-[20%] left-[10%] w-96 h-96 bg-white/5 backdrop-blur-2xl rounded-full -z-[15] floating-element opacity-20"
          style={{ animationDuration: "12s" }}
        ></div>
        <div
          className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-secondary/10 backdrop-blur-3xl rounded-[3rem] -z-[15] floating-element opacity-30"
          style={{ animationDuration: "15s", animationDelay: "-5s" }}
        ></div>

        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-24 items-center relative">
          <div className="lg:col-span-7 space-y-12 z-10">
            <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl reveal-text stagger-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary-fixed-dim"></span>
              </span>
              <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.4em]">Global Engineering Ecosystem</span>
            </div>

            <Typography as="h1" className="text-7xl md:text-9xl font-headline font-extrabold text-white leading-[0.9] tracking-tighter reveal-text stagger-2">
              InTechRoot.
              <br />
              <span className="bg-gradient-to-r from-white via-white to-tertiary-fixed-dim bg-clip-text text-transparent">Enterprise Trust.</span>
            </Typography>

            <Typography as="p" className="text-2xl text-white/50 max-w-2xl font-light leading-relaxed reveal-text stagger-3">
              Architecting digital monoliths for the world's most ambitious organizations. Scalable teams, pre-vetted and ready for immediate deployment.
            </Typography>

            <div className="flex flex-wrap gap-8 pt-8 reveal-text stagger-4">
              <Button className="group relative px-12 py-6 overflow-hidden rounded-2xl transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.4)] hover:shadow-tertiary-fixed-dim/30">
                <div className="absolute inset-0 bg-tertiary-fixed-dim transition-transform group-hover:scale-110"></div>
                <span className="relative font-headline font-black text-[11px] uppercase tracking-[0.3em] text-primary">Build Your Squad</span>
              </Button>
              <Button className="group px-12 py-6 rounded-2xl border border-white/20 text-white font-headline font-black text-[11px] uppercase tracking-[0.3em] backdrop-blur-xl hover:bg-white/10 transition-all flex items-center gap-4">
                Explore Solutions
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[700px] flex items-center justify-center">
            <Card className="relative z-20 w-[380px] h-[480px] glass-card-dark rounded-[3.5rem] p-1 shadow-2xl overflow-hidden floating-element" style={{ animationDelay: "-1s" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
              <div className="relative p-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-10">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                      <span className="material-symbols-outlined text-tertiary-fixed-dim text-4xl">hub</span>
                    </div>
                    <div className="px-4 py-1.5 bg-white/10 rounded-full border border-white/10 text-[9px] text-tertiary-fixed-dim font-black uppercase tracking-widest">Active Core</div>
                  </div>
                  <h4 className="text-3xl font-headline font-bold text-white mb-4">Network Hub</h4>
                  <p className="text-sm text-white/40 leading-relaxed">Real-time synchronization across 52 global engineering clusters.</p>
                </div>
                <div className="space-y-6">
                  <div className="h-[1px] w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent"></div>
                  <div className="flex items-center gap-5">
                    <div className="flex -space-x-4">
                      <div className="w-12 h-12 rounded-full border-2 border-[#0b1f3a] bg-surface-container-high overflow-hidden shadow-lg">
                        <img
                          className="w-full h-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC61zkM6_8aK-6bDcKkPPAo3iWTAOL-gW_iK8X79opT9YtKKNZIrFsKADePE9HIejIgY_9VbGXpbFFRQcmjJm_rp6t0jzk_u93DMP3CxNnhrW0lrc98LidgWtt4gYtk7bzVRuf5V6VnCHkMUDQisBLVL-1o0FwW6HEg_pQ2b7BU9lU8d71ihqYPbLSNZR0AKoYZF16yXkvVoydGa8HxgYALg9gPCAccjrC6NVv3gvE2wc80sjul5wbO6gJukt9JV-JD9NPlLP5-mkzD"
                          alt=""
                        />
                      </div>
                      <div className="w-12 h-12 rounded-full border-2 border-[#0b1f3a] bg-secondary flex items-center justify-center text-[11px] text-white font-black shadow-lg">+42</div>
                    </div>
                    <div className="text-[11px] text-white/70 font-black uppercase tracking-[0.2em]">Verified Experts</div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="absolute -top-12 -left-16 z-30 floating-element" style={{ animationDelay: "0s" }}>
              <Card className="glass-card px-8 py-6 rounded-3xl w-72 border-white/40 shadow-2xl hover:scale-110 transition-transform">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-secondary via-secondary to-tertiary-fixed-dim p-[2px] shadow-lg">
                    <div className="w-full h-full rounded-[14px] overflow-hidden bg-white">
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC61zkM6_8aK-6bDcKkPPAo3iWTAOL-gW_iK8X79opT9YtKKNZIrFsKADePE9HIejIgY_9VbGXpbFFRQcmjJm_rp6t0jzk_u93DMP3CxNnhrW0lrc98LidgWtt4gYtk7bzVRuf5V6VnCHkMUDQisBLVL-1o0FwW6HEg_pQ2b7BU9lU8d71ihqYPbLSNZR0AKoYZF16yXkvVoydGa8HxgYALg9gPCAccjrC6NVv3gvE2wc80sjul5wbO6gJukt9JV-JD9NPlLP5-mkzD"
                        alt=""
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-primary">Sarah Chen</div>
                    <div className="text-[10px] text-secondary font-black uppercase tracking-widest mt-1">Lead Cloud Architect</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="absolute -bottom-16 -right-16 z-30 floating-element" style={{ animationDelay: "-4s" }}>
              <Card className="glass-card p-8 rounded-[2.5rem] w-80 border-white/40 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">Live Ops</div>
                  <span className="text-[10px] font-bold text-secondary">99.9% Uptime</span>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></span>
                      <div className="text-[12px] font-bold text-primary">Node Clusters</div>
                    </div>
                    <span className="text-[10px] font-black text-secondary/60">DEPLOYED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_15px_rgba(64,89,170,0.6)]"></span>
                      <div className="text-[12px] font-bold text-primary">Sync Protocol</div>
                    </div>
                    <span className="text-[10px] font-black text-secondary/60">88%</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
