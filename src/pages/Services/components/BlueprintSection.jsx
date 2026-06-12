import Button from "../../../components/Form/Button";

const STEPS = [
  {
    num: "1",
    bg: "bg-secondary text-white shadow-secondary/20",
    title: "Discover & Define",
    desc: "We analyze your project goals, technical requirements, and cultural fit to create a bespoke talent roadmap.",
  },
  {
    num: "2",
    bg: "bg-tertiary-fixed-dim text-primary shadow-tertiary-fixed-dim/20",
    title: "Deploy Talent / Build Solution",
    desc: "Our engineers integrate with your existing teams or start building your greenfield solution immediately.",
  },
  {
    num: "3",
    bg: "bg-primary-container text-white",
    title: "Deliver & Scale",
    desc: "Continuous optimization and scaling resources based on real-time project velocity and milestones.",
    last: true,
  },
];

export default function BlueprintSection() {
  return (
    <section className="py-14 md:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/3 h-full bg-surface-container-low -z-10 skew-x-[-12deg] translate-x-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 lg:gap-16">
          <div className="lg:col-span-4" data-sr="left">
            <div className="text-secondary font-black text-[11px] uppercase tracking-[0.5em] mb-3">Our Process</div>
            <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-primary tracking-tighter mb-4 md:mb-6">
              Our Blueprint for Success
            </h2>
            <p className="text-sm md:text-base text-on-primary-container mb-6 md:mb-8">
              A streamlined methodology focused on precision hiring and rapid technical execution.
            </p>
            <Button className="bg-primary text-white px-7 md:px-8 py-3.5 md:py-4 rounded-xl font-headline font-bold text-sm uppercase tracking-widest shadow-xl hover:opacity-90 transition-opacity">
              Get Started
            </Button>
          </div>

          <div className="lg:col-span-8 space-y-0">
            {STEPS.map(({ num, bg, title, desc, last }, i) => (
              <div key={num} data-sr="up" data-delay={String(i * 150)} className="flex gap-5 md:gap-8 group">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${bg} flex items-center justify-center font-headline font-black text-lg md:text-xl shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    {num}
                  </div>
                  {!last && <div className="w-[2px] flex-1 bg-outline-variant/20 my-2 group-hover:bg-secondary/30 transition-colors" />}
                </div>
                <div className={`${last ? "pb-0" : "pb-10 md:pb-14"}`}>
                  <h4 className="text-xl md:text-2xl font-headline font-bold mb-2 md:mb-3 group-hover:text-secondary transition-colors">{title}</h4>
                  <p className="text-sm md:text-base text-on-primary-container max-w-xl leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
