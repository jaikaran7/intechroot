import { COMPANY_CONTACT, CONSULTATION_MAILTO } from "../../../constants/companyContact";

export default function CTASection() {
  return (
    <section className="py-16 md:py-28 lg:py-60 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div data-sr="scale" className="relative rounded-[2.5rem] md:rounded-[4rem] lg:rounded-[5rem] overflow-hidden bg-primary-container p-8 sm:p-14 md:p-20 lg:p-32 text-center shadow-[0_40px_80px_rgba(0,6,21,0.3)] lg:shadow-[0_100px_150px_rgba(0,6,21,0.4)]">
          <div className="absolute inset-0 mesh-gradient opacity-40"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-secondary/40 via-transparent to-transparent"></div>
          <div className="absolute top-6 left-6 lg:top-10 lg:left-10 w-24 h-24 lg:w-40 lg:h-40 bg-white/5 backdrop-blur-3xl rounded-full floating-element"></div>
          <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 w-36 h-36 lg:w-60 lg:h-60 bg-tertiary-fixed-dim/5 backdrop-blur-3xl rounded-full floating-element" style={{ animationDelay: "-3s" }}></div>
          <div className="relative z-10">
            <div className="inline-block px-5 py-2.5 md:px-6 md:py-3 rounded-full border border-white/10 mb-8 md:mb-12 backdrop-blur-2xl">
              <span className="text-[10px] md:text-[11px] font-black text-tertiary-fixed-dim uppercase tracking-[0.5em]">Scale With InTechRoot</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-headline font-extrabold text-white tracking-tighter mb-10 md:mb-16 leading-[0.9]">
              Architect Your <br />
              Legend Today.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-8 lg:gap-12 justify-center items-center">
              <a
                href={CONSULTATION_MAILTO}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-primary px-10 md:px-16 py-5 md:py-8 rounded-xl md:rounded-2xl font-headline font-black text-[11px] md:text-sm uppercase tracking-[0.4em] hover:scale-105 transition-transform shadow-[0_20px_40px_rgba(255,255,255,0.15)] md:shadow-[0_40px_80px_rgba(255,255,255,0.2)] glint-effect"
              >
                Schedule Consultation
              </a>
              <a
                href={`tel:${COMPANY_CONTACT.phoneTel}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-4 md:gap-6 text-white font-headline font-black text-[11px] md:text-sm uppercase tracking-[0.4em] hover:gap-6 md:hover:gap-10 transition-all group"
              >
                Talk to an Architect
                <span className="material-symbols-outlined text-tertiary-fixed-dim group-hover:translate-x-2 md:group-hover:translate-x-3 transition-transform text-2xl md:text-3xl">
                  east
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
