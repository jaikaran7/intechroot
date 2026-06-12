import { COMPANY_CONTACT, CONSULTATION_MAILTO } from "../../../constants/companyContact";

export default function CTASection() {
  return (
    <section className="py-14 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div
          data-sr="scale"
          className="bg-primary-container rounded-[2rem] md:rounded-[3rem] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-[0_40px_80px_rgba(0,6,21,0.2)]"
        >
          <div className="absolute inset-0 network-grid opacity-10" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/30 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-tertiary-fixed-dim/30 rounded-full blur-[100px]"></div>

          <div className="relative z-10">
            <div className="text-tertiary-fixed-dim font-black text-[10px] uppercase tracking-[0.5em] mb-4">
              Let's Get Started
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-extrabold text-white tracking-tighter mb-4 md:mb-6 md:mb-8">
              Ready to Build Your Team Today?
            </h2>
            <p className="text-white/50 text-sm md:text-base max-w-lg mx-auto mb-8 md:mb-10 font-light leading-relaxed">
              From strategy to execution — InTechRoot delivers the talent and solutions your enterprise needs to scale.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 md:mb-8">
              <a
                href={CONSULTATION_MAILTO}
                className="inline-flex items-center justify-center bg-tertiary-fixed-dim text-primary px-8 md:px-10 py-4 md:py-5 rounded-xl font-headline font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_20px_40px_rgba(76,215,246,0.25)] glint-effect"
              >
                Get a Free Quote
              </a>
              <a
                href={`tel:${COMPANY_CONTACT.phoneTel}`}
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-headline font-bold text-sm uppercase tracking-widest backdrop-blur-md hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-base">call</span>
                Talk to an Expert
              </a>
            </div>

            <p className="text-sm text-white/40">
              <a href={`mailto:${COMPANY_CONTACT.email}`} className="hover:text-tertiary-fixed-dim hover:underline transition-colors">
                {COMPANY_CONTACT.email}
              </a>
              {" · "}
              <a href={`tel:${COMPANY_CONTACT.phoneTel}`} className="hover:text-tertiary-fixed-dim hover:underline transition-colors">
                {COMPANY_CONTACT.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
