import Card from "../../../components/Card";

export default function StatsSection() {
  return (
    <section className="py-24 bg-surface relative">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="glass-card p-10 rounded-xl group hover:bg-white transition-all duration-500">
            <div className="text-secondary mb-4 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                group
              </span>
            </div>
            <div className="text-4xl font-headline font-black text-primary">500+</div>
            <div className="text-sm font-bold text-on-primary-container uppercase tracking-widest mt-2">Consultants</div>
          </Card>
          <Card className="glass-card p-10 rounded-xl group hover:bg-white transition-all duration-500">
            <div className="text-tertiary-fixed-dim mb-4 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                business
              </span>
            </div>
            <div className="text-4xl font-headline font-black text-primary">50+</div>
            <div className="text-sm font-bold text-on-primary-container uppercase tracking-widest mt-2">Global Clients</div>
          </Card>
          <Card className="glass-card p-10 rounded-xl group hover:bg-white transition-all duration-500">
            <div className="text-secondary mb-4 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                terminal
              </span>
            </div>
            <div className="text-4xl font-headline font-black text-primary">10+</div>
            <div className="text-sm font-bold text-on-primary-container uppercase tracking-widest mt-2">Tech Stacks</div>
          </Card>
          <Card className="glass-card p-10 rounded-xl group hover:bg-white transition-all duration-500">
            <div className="text-tertiary-fixed-dim mb-4 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                support_agent
              </span>
            </div>
            <div className="text-4xl font-headline font-black text-primary">24/7</div>
            <div className="text-sm font-bold text-on-primary-container uppercase tracking-widest mt-2">Direct Support</div>
          </Card>
        </div>
      </div>
    </section>
  );
}
