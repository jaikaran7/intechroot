import Card from "../../../components/Card";

export default function SolutionsSection() {
  return (
    <section className="py-14 md:py-20 lg:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 md:gap-8 mb-10 md:mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-primary tracking-tighter mb-3 md:mb-4">Architectural Solutions for Digital Dominance</h2>
            <p className="text-sm md:text-base text-on-primary-container">Strategic IT services designed to bridge the gap between complex engineering and business growth.</p>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold text-secondary uppercase tracking-widest">
            <span>View All Services</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="glass-card p-6 md:p-8 rounded-xl hover:translate-y-[-6px] md:hover:translate-y-[-8px] transition-all duration-300 group">
            <span className="material-symbols-outlined text-2xl md:text-3xl text-secondary mb-4 md:mb-6 block">badge</span>
            <h3 className="text-base md:text-lg font-headline font-bold mb-2 md:mb-3">IT Staffing</h3>
            <p className="text-sm text-on-primary-container leading-relaxed">Elite developers and architects deployed within 48 hours.</p>
          </Card>
          <Card className="sap-enterprise-card p-6 md:p-8 rounded-xl text-white shadow-[0_20px_30px_rgba(0,6,21,0.12)] md:shadow-[0_40px_40px_rgba(0,6,21,0.12)] hover:translate-y-[-6px] md:hover:translate-y-[-8px] transition-all duration-300">
            <span className="material-symbols-outlined text-2xl md:text-3xl text-tertiary-fixed-dim mb-4 md:mb-6 block">database</span>
            <h3 className="text-base md:text-lg font-headline font-bold mb-2 md:mb-3 text-white">SAP &amp; Enterprise</h3>
            <p className="text-sm text-white/70 leading-relaxed">Full-lifecycle implementation and optimization of enterprise ecosystems.</p>
          </Card>
          <Card className="glass-card p-6 md:p-8 rounded-xl hover:translate-y-[-6px] md:hover:translate-y-[-8px] transition-all duration-300">
            <span className="material-symbols-outlined text-2xl md:text-3xl text-secondary mb-4 md:mb-6 block">insights</span>
            <h3 className="text-base md:text-lg font-headline font-bold mb-2 md:mb-3">BI &amp; Data</h3>
            <p className="text-sm text-on-primary-container leading-relaxed">Transforming raw data into predictive business intelligence.</p>
          </Card>
          <Card className="glass-card p-6 md:p-8 rounded-xl hover:translate-y-[-6px] md:hover:translate-y-[-8px] transition-all duration-300">
            <span className="material-symbols-outlined text-2xl md:text-3xl text-secondary mb-4 md:mb-6 block">devices</span>
            <h3 className="text-base md:text-lg font-headline font-bold mb-2 md:mb-3">App Development</h3>
            <p className="text-sm text-on-primary-container leading-relaxed">Custom mobile and web applications built for scale.</p>
          </Card>
          <Card className="glass-card p-6 md:p-8 rounded-xl hover:translate-y-[-6px] md:hover:translate-y-[-8px] transition-all duration-300">
            <span className="material-symbols-outlined text-2xl md:text-3xl text-secondary mb-4 md:mb-6 block">cloud</span>
            <h3 className="text-base md:text-lg font-headline font-bold mb-2 md:mb-3">Cloud &amp; DevOps</h3>
            <p className="text-sm text-on-primary-container leading-relaxed">Modernize your infrastructure with seamless CI/CD pipelines.</p>
          </Card>
          <Card className="glass-card p-6 md:p-8 rounded-xl hover:translate-y-[-6px] md:hover:translate-y-[-8px] transition-all duration-300">
            <span className="material-symbols-outlined text-2xl md:text-3xl text-secondary mb-4 md:mb-6 block">verified_user</span>
            <h3 className="text-base md:text-lg font-headline font-bold mb-2 md:mb-3">QA Testing</h3>
            <p className="text-sm text-on-primary-container leading-relaxed">Rigorous automated and manual quality assurance workflows.</p>
          </Card>
          <Card className="glass-card p-6 md:p-8 rounded-xl hover:translate-y-[-6px] md:hover:translate-y-[-8px] transition-all duration-300">
            <span className="material-symbols-outlined text-2xl md:text-3xl text-secondary mb-4 md:mb-6 block">router</span>
            <h3 className="text-base md:text-lg font-headline font-bold mb-2 md:mb-3">Infrastructure</h3>
            <p className="text-sm text-on-primary-container leading-relaxed">Resilient network architecture for mission-critical operations.</p>
          </Card>
          <Card className="glass-card p-6 md:p-8 rounded-xl hover:translate-y-[-6px] md:hover:translate-y-[-8px] transition-all duration-300">
            <span className="material-symbols-outlined text-2xl md:text-3xl text-secondary mb-4 md:mb-6 block">rocket_launch</span>
            <h3 className="text-base md:text-lg font-headline font-bold mb-2 md:mb-3">Project Delivery</h3>
            <p className="text-sm text-on-primary-container leading-relaxed">End-to-end management from concept to global deployment.</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
