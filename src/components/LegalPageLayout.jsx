import { Link } from "react-router-dom";
import SiteFooter from "./SiteFooter";
import { LEGAL_PATHS } from "../constants/legalRoutes";

export function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="font-headline text-xl font-bold text-primary mb-3">{title}</h2>
      <div className="text-sm text-on-primary-container leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function LegalPageLayout({ title, intro, children }) {
  return (
    <>
      <main className="min-h-screen bg-background font-body text-on-surface pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-8">
          <nav className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-on-primary-container mb-10">
            <Link className="hover:text-secondary transition-colors" to={LEGAL_PATHS.privacy}>
              Privacy
            </Link>
            <Link className="hover:text-secondary transition-colors" to={LEGAL_PATHS.terms}>
              Terms
            </Link>
            <Link className="hover:text-secondary transition-colors" to={LEGAL_PATHS.cookies}>
              Cookies
            </Link>
          </nav>
          <p className="text-secondary text-[11px] font-black uppercase tracking-[0.4em] mb-4">Legal</p>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-6">{title}</h1>
          {intro ? <p className="text-base text-on-primary-container/80 mb-12 leading-relaxed">{intro}</p> : null}
          <div className="space-y-10">{children}</div>
          <p className="text-xs text-on-primary-container/50 mt-16">Last updated: May 2026</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
