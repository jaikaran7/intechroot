import { Link } from "react-router-dom";
import CompanyLogo from "./CompanyLogo";
import { COMPANY_COPYRIGHT } from "../constants/companyBrand";
import { COMPANY_CONTACT } from "../constants/companyContact";
import { LEGAL_PATHS } from "../constants/legalRoutes";
import CompanyContactBlock from "./CompanyContactBlock";

export default function SiteFooter() {
  return (
    <footer className="bg-[#eceef1] dark:bg-[#000615] w-full border-t border-[#c4c6ce]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 md:py-14 lg:py-16 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
        <div className="col-span-2 md:col-span-1 space-y-6">
          <CompanyLogo markClassName="h-9 w-9 rounded-xl object-cover shadow-md" />
          <p className="text-sm text-[#7587a7] dark:text-[#c4c6ce] leading-relaxed">Global architecture for enterprise scale. We bridge the human gap in technology.</p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#0B1F3A]/5 flex items-center justify-center text-[#0B1F3A] cursor-pointer hover:bg-secondary hover:text-white transition-all">
              <span className="material-symbols-outlined text-lg">share</span>
            </div>
            <a
              className="w-10 h-10 rounded-full bg-[#0B1F3A]/5 flex items-center justify-center text-[#0B1F3A] hover:bg-secondary hover:text-white transition-all"
              href={`mailto:${COMPANY_CONTACT.email}`}
              aria-label={`Email ${COMPANY_CONTACT.email}`}
            >
              <span className="material-symbols-outlined text-lg">mail</span>
            </a>
          </div>
        </div>
        <div>
          <h6 className="font-headline font-bold text-sm text-[#0B1F3A] dark:text-white mb-6 uppercase tracking-widest">Company</h6>
          <ul className="space-y-4 text-sm text-[#7587a7] dark:text-[#c4c6ce]">
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/about">About Us</Link></li>
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/careers">Careers</Link></li>
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/services">Services</Link></li>
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="font-headline font-bold text-sm text-[#0B1F3A] dark:text-white mb-6 uppercase tracking-widest">Contact</h6>
          <CompanyContactBlock />
        </div>
        <div>
          <h6 className="font-headline font-bold text-sm text-[#0B1F3A] dark:text-white mb-6 uppercase tracking-widest">Legal</h6>
          <ul className="space-y-4 text-sm text-[#7587a7] dark:text-[#c4c6ce]">
            <li><Link className="hover:text-[#4059aa] transition-colors" to={LEGAL_PATHS.privacy}>Privacy Policy</Link></li>
            <li><Link className="hover:text-[#4059aa] transition-colors" to={LEGAL_PATHS.terms}>Terms of Service</Link></li>
            <li><Link className="hover:text-[#4059aa] transition-colors" to={LEGAL_PATHS.cookies}>Cookie Settings</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 md:py-8 border-t border-[#c4c6ce]/15">
        <div className="text-xs text-[#7587a7] dark:text-[#c4c6ce] font-body">{COMPANY_COPYRIGHT}</div>
      </div>
    </footer>
  );
}
