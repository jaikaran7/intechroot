import { COMPANY_CONTACT, CONSULTATION_MAILTO } from "../../../constants/companyContact";

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="bg-primary-container rounded-3xl p-16 text-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/30 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-tertiary-fixed-dim/30 rounded-full blur-[100px]"></div>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white tracking-tighter mb-8 relative">
            Ready to Build Your Team Today?
          </h2>
          <div className="flex flex-col items-center gap-6 relative">
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href={CONSULTATION_MAILTO}
                className="inline-flex items-center justify-center bg-tertiary-fixed-dim text-primary px-10 py-5 rounded-lg font-headline font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Get a Free Quote
              </a>
              <a
                href={`tel:${COMPANY_CONTACT.phoneTel}`}
                className="inline-flex items-center justify-center border border-white/20 text-white px-10 py-5 rounded-lg font-headline font-bold text-sm uppercase tracking-widest backdrop-blur-md hover:bg-white/10 transition-colors"
              >
                Talk to an Expert
              </a>
            </div>
            <p className="text-sm text-white/60">
              <a href={`mailto:${COMPANY_CONTACT.email}`} className="hover:text-tertiary-fixed-dim hover:underline">
                {COMPANY_CONTACT.email}
              </a>
              {" · "}
              <a href={`tel:${COMPANY_CONTACT.phoneTel}`} className="hover:text-tertiary-fixed-dim hover:underline">
                {COMPANY_CONTACT.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
