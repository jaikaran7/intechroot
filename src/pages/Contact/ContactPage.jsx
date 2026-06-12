import { useEffect } from "react";
import CompanyContactBlock from "../../components/CompanyContactBlock";
import SiteFooter from "../../components/SiteFooter";
import { COMPANY_NAME } from "../../constants/companyBrand";
import { COMPANY_CONTACT, CONSULTATION_MAILTO } from "../../constants/companyContact";

export default function ContactPage() {
  useEffect(() => {
    document.body.className =
      "bg-background font-body text-on-surface selection:bg-tertiary-fixed-dim selection:text-on-tertiary-fixed overflow-x-hidden";
  }, []);

  return (
    <>
      <main className="min-h-screen bg-background font-body text-on-surface pt-24 md:pt-28 lg:pt-32 pb-14 md:pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <p className="text-secondary text-[11px] font-black uppercase tracking-[0.4em] mb-4">Get in touch</p>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4 md:mb-6">Contact</h1>
          <p className="text-base text-on-primary-container/80 mb-12 leading-relaxed">
            Reach the {COMPANY_NAME} team for partnerships, staffing inquiries, or general questions. We typically respond
            within one business day.
          </p>

          <div className="rounded-2xl border border-outline-variant/20 bg-white/70 dark:bg-[#000615]/40 p-8 shadow-sm space-y-8">
            <div>
              <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-primary mb-4">Office</h2>
              <CompanyContactBlock className="text-on-primary-container" linkClassName="hover:text-secondary transition-colors" />
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                className="inline-flex items-center justify-center rounded-full bg-primary-container px-8 py-3.5 font-headline text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-transform hover:scale-105 active:scale-95"
                href={CONSULTATION_MAILTO}
              >
                Schedule a consultation
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-outline-variant/30 px-8 py-3.5 font-headline text-[10px] font-bold uppercase tracking-[0.3em] text-primary transition-colors hover:border-secondary hover:text-secondary"
                href={`mailto:${COMPANY_CONTACT.email}`}
              >
                Email us
              </a>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
