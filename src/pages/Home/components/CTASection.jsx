import Button from "../../../components/Form/Button";

export default function CTASection() {
  return (
    <section className="py-60 bg-white relative">
      <div className="max-w-7xl mx-auto px-8">
        <div className="relative rounded-[5rem] overflow-hidden bg-primary-container p-32 text-center shadow-[0_100px_150px_rgba(0,6,21,0.4)]">
          <div className="absolute inset-0 mesh-gradient opacity-40"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-secondary/40 via-transparent to-transparent"></div>
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 backdrop-blur-3xl rounded-full floating-element"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-tertiary-fixed-dim/5 backdrop-blur-3xl rounded-full floating-element" style={{ animationDelay: "-3s" }}></div>
          <div className="relative z-10">
            <div className="inline-block px-6 py-3 rounded-full border border-white/10 mb-12 backdrop-blur-2xl">
              <span className="text-[11px] font-black text-tertiary-fixed-dim uppercase tracking-[0.5em]">Future-Proof Your Monolith</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-headline font-extrabold text-white tracking-tighter mb-16 leading-[0.9]">
              Architect Your <br />
              Legend Today.
            </h2>
            <div className="flex flex-col sm:flex-row gap-12 justify-center items-center">
              <Button className="bg-white text-primary px-16 py-8 rounded-2xl font-headline font-black text-sm uppercase tracking-[0.4em] hover:scale-110 transition-transform shadow-[0_40px_80px_rgba(255,255,255,0.2)] glint-effect">
                Schedule Consultation
              </Button>
              <Button className="text-white font-headline font-black text-sm uppercase tracking-[0.4em] flex items-center gap-6 hover:gap-10 transition-all group">
                Talk to an Architect
                <span className="material-symbols-outlined text-tertiary-fixed-dim group-hover:translate-x-3 transition-transform text-3xl">east</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
