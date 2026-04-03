export default function FeaturesSection() {
  return (
    <>
      <section className="py-52 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-surface-container-low/40 skew-x-[-8deg] translate-x-48 -z-10 border-l border-outline-variant/5"></div>
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-end gap-16 mb-32">
            <div className="max-w-3xl">
              <div className="text-secondary font-black text-[12px] uppercase tracking-[0.5em] mb-6">Expertise Vectors</div>
              <h2 className="text-6xl md:text-8xl font-headline font-extrabold text-primary tracking-tighter leading-[0.9] mb-10">Structural Engineering for the Enterprise</h2>
              <p className="text-xl text-on-primary-container/70 font-light leading-relaxed">We don't just provide talent; we deploy architectural solutions designed for permanence and performance.</p>
            </div>
            <div className="group flex items-center gap-8 cursor-pointer pb-2">
              <div className="text-[12px] font-black text-on-primary-container uppercase tracking-[0.4em] group-hover:text-primary transition-colors">Full Portfolio</div>
              <div className="w-16 h-16 rounded-full border border-outline-variant flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:scale-110 transition-all shadow-xl">
                <span className="material-symbols-outlined text-2xl group-hover:text-white transition-colors">arrow_outward</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-8 glass-card p-16 rounded-[4rem] relative group overflow-hidden bg-primary-container text-white border-none shadow-[0_60px_100px_rgba(0,6,21,0.25)]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-tertiary-fixed-dim/15 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-16">
                <div>
                  <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-12 backdrop-blur-2xl border border-white/20 group-hover:rotate-6 transition-transform">
                    <span className="material-symbols-outlined text-5xl text-tertiary-fixed-dim">database</span>
                  </div>
                  <h3 className="text-5xl font-headline font-bold mb-8">SAP &amp; Enterprise Core</h3>
                  <p className="text-xl text-white/50 max-w-xl leading-relaxed">Engineered center of excellence for full-lifecycle ERP migrations. We build the backbone of modern global commerce.</p>
                </div>
                <ul className="grid grid-cols-2 gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-tertiary-fixed-dim">
                  <li className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim shadow-[0_0_10px_rgba(76,215,246,0.8)]"></span> S/4HANA Modernization</li>
                  <li className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim shadow-[0_0_10px_rgba(76,215,246,0.8)]"></span> Custom ABAP Protocols</li>
                  <li className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim shadow-[0_0_10px_rgba(76,215,246,0.8)]"></span> Cloud Fusion Layers</li>
                  <li className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim shadow-[0_0_10px_rgba(76,215,246,0.8)]"></span> Real-time Audit Node</li>
                </ul>
              </div>
            </div>
            {[
              ["badge", "Elite Staffing", "Access the top 1% of global technical talent, vetted through rigorous algorithmic and human verification.", "Talent Access"],
              ["insights", "BI Architectures", "Converting fragmented data into structured intelligence streams for predictive decision making.", "Data Insights"],
              ["cloud", "Cloud Native", "Scalable serverless environments and automated CI/CD pipelines built for infinite growth.", "Modernize"],
              ["verified_user", "Cyber Integrity", "End-to-end technical resilience via rigorous automated testing and zero-trust penetration protocols.", "Verify Core"],
            ].map(([icon, title, text, cta]) => (
              <div key={title} className="md:col-span-4 glass-card p-12 rounded-[3.5rem] hover:-translate-y-5 transition-all duration-700 group flex flex-col justify-between shadow-xl border-white/60">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-secondary/5 flex items-center justify-center mb-10 group-hover:bg-secondary/15 transition-all group-hover:rotate-3">
                    <span className="material-symbols-outlined text-4xl text-secondary">{icon}</span>
                  </div>
                  <h3 className="text-3xl font-headline font-bold mb-5">{title}</h3>
                  <p className="text-sm text-on-primary-container/60 leading-relaxed font-medium">{text}</p>
                </div>
                <div className="pt-10 flex items-center gap-3 text-primary font-black text-[11px] uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform">
                  <span>{cta}</span>
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-52 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 network-grid-intricate opacity-15"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="text-center mb-40">
            <h2 className="text-6xl md:text-8xl font-headline font-extrabold tracking-tighter mb-10 leading-tight">
              Powering the <br />
              <span className="text-tertiary-fixed-dim">Global Vanguard</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-xl font-light">Why industrial titans choose InTechRoot for high-velocity transformation.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-16 mb-40 opacity-40 grayscale hover:opacity-100 transition-all duration-1000">
            <div className="flex items-center justify-center hover:scale-110 transition-transform"><span className="font-black text-3xl tracking-tighter">TECH_CORE</span></div>
            <div className="flex items-center justify-center hover:scale-110 transition-transform"><span className="font-black text-3xl tracking-tighter">FINANCE_A</span></div>
            <div className="flex items-center justify-center hover:scale-110 transition-transform"><span className="font-black text-3xl tracking-tighter">RETAIL_PRO</span></div>
            <div className="flex items-center justify-center hover:scale-110 transition-transform"><span className="font-black text-3xl tracking-tighter">HEALTH_NET</span></div>
            <div className="flex items-center justify-center hover:scale-110 transition-transform"><span className="font-black text-3xl tracking-tighter">AUTO_GEN</span></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5 rounded-[4rem] overflow-hidden glass-card-dark border-white/10 shadow-2xl">
            <div className="p-24 border-r border-white/10 relative group">
              <div className="absolute top-12 left-12">
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-8xl opacity-10 group-hover:opacity-25 transition-opacity">format_quote</span>
              </div>
              <div className="relative z-10">
                <p className="text-4xl font-light italic leading-snug mb-16 text-white/90">
                  "InTechRoot provided a strategic brain-trust that restructured our entire global architecture for the decentralized era."
                </p>
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-3xl bg-white/10 overflow-hidden shadow-xl p-1">
                    <img
                      className="w-full h-full object-cover rounded-2xl"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_LgOhCaTkCs8cq6TGtac_7S7U46X8VOsoLwinvvlmyc6jpcq3G2A53tDIWG_H2St8HM1rggKJ0UgJt4n8lFcgZagovO0HQhz0WxUqif2uzNb-ugpN10fexXWwEKAw-DUGDSNLtyAKILAUQcljlbsMhtd1_Uqk9yOplLwRomh1krvI1OLNyMGo55t5fSJtFNxh0e2sDuaVuagQzrBAnYql4iVQSubQP8oWN0d50moXZo8ztF-nrtFOC-B1XONXWdhs4f0bCocGw_no"
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Marcus Thorne</div>
                    <div className="text-[11px] text-tertiary-fixed-dim uppercase tracking-[0.4em] font-black mt-2">CTO, Global Finance Corp</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-24 flex flex-col justify-center gap-16">
              {[
                ["speed", "48h Integration", "From architecture audit to active engineering squad."],
                ["public", "Global Sync", "Follow-the-sun development cycles across all timezones."],
                ["verified", "Zero-Trust Vetting", "Rigorous security clearance for all high-stakes personnel."],
              ].map(([icon, title, text]) => (
                <div key={title} className="flex items-center gap-10 group cursor-default">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-tertiary-fixed-dim transition-all group-hover:text-primary shadow-lg border border-white/10 group-hover:rotate-6">
                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2">{title}</h4>
                    <p className="text-sm text-white/40 font-medium">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
