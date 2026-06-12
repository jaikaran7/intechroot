import Card from "../../../components/Card";

const SOLUTIONS = [
  { icon: "badge", title: "IT Staffing", desc: "Elite developers and architects deployed within 48 hours.", featured: false },
  { icon: "database", title: "SAP & Enterprise", desc: "Full-lifecycle implementation and optimization of enterprise ecosystems.", featured: true },
  { icon: "insights", title: "BI & Data", desc: "Transforming raw data into predictive business intelligence.", featured: false },
  { icon: "devices", title: "App Development", desc: "Custom mobile and web applications built for scale.", featured: false },
  { icon: "cloud", title: "Cloud & DevOps", desc: "Modernize your infrastructure with seamless CI/CD pipelines.", featured: false },
  { icon: "verified_user", title: "QA Testing", desc: "Rigorous automated and manual quality assurance workflows.", featured: false },
  { icon: "router", title: "Infrastructure", desc: "Resilient network architecture for mission-critical operations.", featured: false },
  { icon: "rocket_launch", title: "Project Delivery", desc: "End-to-end management from concept to global deployment.", featured: false },
];

export default function SolutionsSection() {
  return (
    <section className="py-14 md:py-20 lg:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 md:gap-8 mb-10 md:mb-16">
          <div className="max-w-2xl" data-sr="left">
            <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-primary tracking-tighter mb-3 md:mb-4">
              Architectural Solutions for Digital Dominance
            </h2>
            <p className="text-sm md:text-base text-on-primary-container">
              Strategic IT services designed to bridge the gap between complex engineering and business growth.
            </p>
          </div>
          <div data-sr="right" className="flex items-center gap-4 text-sm font-bold text-secondary uppercase tracking-widest">
            <span>View All Services</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {SOLUTIONS.map(({ icon, title, desc, featured }, i) => (
            <Card
              key={title}
              data-sr="up"
              data-delay={String((i % 4) * 100)}
              className={`${featured ? "sap-enterprise-card text-white shadow-[0_20px_30px_rgba(0,6,21,0.12)]" : "glass-card"} p-6 md:p-8 rounded-xl hover:translate-y-[-6px] transition-all duration-300 group relative overflow-hidden`}
            >
              <div className="absolute bottom-0 left-0 right-0 h-0.5 accent-line scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <span className={`material-symbols-outlined text-2xl md:text-3xl mb-4 md:mb-6 block ${featured ? "text-tertiary-fixed-dim" : "text-secondary"}`}>
                {icon}
              </span>
              <h3 className={`text-base md:text-lg font-headline font-bold mb-2 md:mb-3 ${featured ? "text-white" : ""}`}>{title}</h3>
              <p className={`text-sm leading-relaxed ${featured ? "text-white/70" : "text-on-primary-container"}`}>{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
