const trustPillars = [
  {
    icon: "verified",
    title: "Proven Reliability",
    desc: "98% on-time delivery across 250+ engagements. We maintain SLA commitments even when complexity increases mid-project.",
  },
  {
    icon: "shield_check",
    title: "Uncompromising Quality",
    desc: "Multi-stage code review, automated testing pipelines, and architectural sign-off at every phase ensure production-grade outcomes.",
  },
  {
    icon: "forum",
    title: "Radical Transparency",
    desc: "Regular progress reporting, honest risk assessment, and open access to project metrics. No surprises at go-live.",
  },
  {
    icon: "support_agent",
    title: "Always-On Support",
    desc: "Post-deployment support available 24/7 with defined escalation paths, SLAs, and dedicated account ownership.",
  },
  {
    icon: "trending_up",
    title: "Future-Ready Architecture",
    desc: "We build systems designed to evolve — not lock you in. Scalable, modular designs that grow alongside your business.",
  },
  {
    icon: "diversity_3",
    title: "Long-Term Partnership",
    desc: "A 97% client retention rate is not coincidence. It reflects the depth of trust we build through consistent, excellent work.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-52 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50%] h-full bg-surface-container-low/60 skew-x-[8deg] -translate-x-48 -z-10 border-r border-outline-variant/5" />

      <div className="max-w-7xl mx-auto px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-16 mb-32">
          <div className="max-w-3xl">
            <div className="text-secondary font-black text-[12px] uppercase tracking-[0.5em] mb-6">
              Why Clients Trust Us
            </div>
            <h2 className="text-6xl md:text-8xl font-headline font-extrabold text-primary tracking-tighter leading-[0.9]">
              Trust Is Earned,
              <br />
              Not Assumed
            </h2>
          </div>
          <p className="text-xl text-on-primary-container/60 font-light leading-relaxed max-w-sm">
            Enterprise clients don't choose vendors on features. They choose partners
            on track record, transparency, and long-term alignment.
          </p>
        </div>

        {/* Trust pillars — large featured format */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Feature card */}
          <div className="md:col-span-12 lg:col-span-5 sap-enterprise-card p-16 rounded-[4rem] relative group overflow-hidden text-white shadow-[0_60px_100px_rgba(0,6,21,0.25)]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <div className="text-[11px] font-black text-tertiary-fixed-dim uppercase tracking-[0.5em] mb-12">
                Client Retention Rate
              </div>
              <div className="text-[120px] font-headline font-black text-white leading-none tracking-tighter mb-4">
                97<span className="text-tertiary-fixed-dim">%</span>
              </div>
              <p className="text-white/50 text-xl font-light leading-relaxed max-w-xs">
                The single most honest metric of client trust — measured year over year
                since our founding.
              </p>
              <div className="mt-16 space-y-4">
                {["Consistent delivery standards", "Transparent communication culture", "Long-term roadmap alignment"].map((item) => (
                  <div key={item} className="flex items-center gap-4 text-sm text-white/60 font-medium">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim shadow-[0_0_8px_rgba(76,215,246,0.8)]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: 2 × 3 grid */}
          <div className="md:col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {trustPillars.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="glass-card p-10 rounded-[3rem] hover:-translate-y-3 transition-all duration-700 group flex flex-col gap-6 shadow-lg border-white/60"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary/5 flex items-center justify-center group-hover:bg-secondary/15 transition-all group-hover:rotate-3">
                  <span className="material-symbols-outlined text-3xl text-secondary">{icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-headline font-bold mb-3">{title}</h3>
                  <p className="text-sm text-on-primary-container/60 leading-relaxed font-medium">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
