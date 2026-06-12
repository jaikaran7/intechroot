import Card from "../../../components/Card";

export default function StatsSection() {
  const stats = [
    { icon: "group", color: "text-secondary", val: "100+", label: "Consultants" },
    { icon: "business", color: "text-tertiary-fixed-dim", val: "5+", label: "Global Clients" },
    { icon: "terminal", color: "text-secondary", val: "10+", label: "Tech Stacks" },
    { icon: "support_agent", color: "text-tertiary-fixed-dim", val: "24/7", label: "Direct Support" },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-surface relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {stats.map(({ icon, color, val, label }, i) => (
            <Card
              key={label}
              data-sr="up"
              data-delay={String(i * 100)}
              className="glass-card p-5 sm:p-7 md:p-10 rounded-xl group hover:bg-white transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 right-0 h-0.5 accent-line scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className={`${color} mb-4 group-hover:scale-110 transition-transform duration-500`}>
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-headline font-black text-primary">{val}</div>
              <div className="text-xs md:text-sm font-bold text-on-primary-container uppercase tracking-widest mt-2">{label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
