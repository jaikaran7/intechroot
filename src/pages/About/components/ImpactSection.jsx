import { useCountUp } from "../hooks/useCountUp";

const stats = [
  { target: 250, suffix: "+", label: "Projects Delivered", sub: "Across industries and geographies" },
  { target: 20,  suffix: "+", label: "Industries Served",  sub: "From healthcare to financial services" },
  { target: 97,  suffix: "%", label: "Client Satisfaction", sub: "Measured through post-engagement reviews" },
  { target: 100, suffix: "+", label: "Skilled Professionals", sub: "Certified engineers and consultants" },
  { target: 10,  suffix: "+", label: "Years of Expertise",   sub: "Combined technology and consulting experience" },
];

function StatCard({ target, suffix, label, sub }) {
  const { count, ref } = useCountUp(target, 2200);
  return (
    <div
      ref={ref}
      className="bg-white/40 p-14 text-center group hover:bg-white transition-all duration-700 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="text-6xl font-headline font-black text-primary tracking-tighter mb-3 group-hover:scale-110 transition-transform count-pulse">
          {count}{suffix}
        </div>
        <div className="text-[11px] font-black text-on-primary-container/70 uppercase tracking-[0.4em] mb-2">{label}</div>
        <div className="text-xs text-on-primary-container/40 font-medium leading-snug">{sub}</div>
      </div>
    </div>
  );
}

export default function ImpactSection() {
  return (
    <section className="py-52 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="text-secondary font-black text-[12px] uppercase tracking-[0.5em] mb-6">
            Impact &amp; Achievements
          </div>
          <h2 className="text-6xl md:text-8xl font-headline font-extrabold text-primary tracking-tighter leading-[0.9] mb-10">
            Outcomes That
            <br />
            Speak for Themselves
          </h2>
          <p className="text-xl text-on-primary-container/60 font-light max-w-2xl mx-auto leading-relaxed">
            Numbers earned through years of deliberate focus on client outcomes, technical
            quality, and long-term partnership.
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-white/10 rounded-[3rem] overflow-hidden glass-card p-2 border-white/30 backdrop-blur-3xl shadow-2xl">
          {stats.map((stat, i) => (
            <div key={stat.label} className={i > 0 ? "border-l border-white/20" : ""}>
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* Supporting text */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            ["Consistent Delivery", "98% of projects delivered on time and within agreed scope, regardless of complexity or scale."],
            ["Zero-Disruption Transitions", "Our phased implementation methodology ensures business continuity throughout every transformation."],
            ["Measurable ROI", "Clients consistently report 30–60% operational efficiency gains within 12 months of deployment."],
          ].map(([title, text]) => (
            <div key={title} className="space-y-4">
              <div className="w-12 h-1 values-accent rounded-full mx-auto" />
              <h4 className="text-xl font-headline font-bold text-primary">{title}</h4>
              <p className="text-sm text-on-primary-container/60 leading-relaxed font-medium">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
