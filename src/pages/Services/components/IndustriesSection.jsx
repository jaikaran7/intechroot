const INDUSTRIES = ["Finance", "Healthcare", "Retail", "Manufacturing", "Technology", "Energy", "Logistics"];

export default function IndustriesSection() {
  return (
    <div data-sr="up" className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 md:gap-12">
        <div className="lg:w-1/3">
          <div className="text-tertiary-fixed-dim font-black text-[10px] uppercase tracking-[0.5em] mb-3">Verticals</div>
          <h4 className="text-xl md:text-2xl font-headline font-bold mb-3">Industries of Focus</h4>
          <p className="text-white/60 text-sm leading-relaxed">
            Specialized domain knowledge across high-stakes industrial sectors.
          </p>
        </div>
        <div className="lg:w-2/3 flex flex-wrap gap-3">
          {INDUSTRIES.map((name, i) => (
            <div
              key={name}
              data-sr="up"
              data-delay={String(i * 60)}
              className="px-5 py-2.5 rounded-full border border-white/20 text-sm font-medium hover:border-tertiary-fixed-dim hover:text-tertiary-fixed-dim hover:bg-tertiary-fixed-dim/5 transition-all duration-300 cursor-default"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
