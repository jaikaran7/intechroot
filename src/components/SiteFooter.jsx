import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="bg-[#eceef1] dark:bg-[#000615] w-full border-t border-[#c4c6ce]/15">
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="text-lg font-bold text-[#0B1F3A] dark:text-white font-headline">INTECH ROAD</div>
          <p className="text-sm text-[#7587a7] dark:text-[#c4c6ce] leading-relaxed">Global architecture for enterprise scale. We bridge the human gap in technology.</p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#0B1F3A]/5 flex items-center justify-center text-[#0B1F3A] cursor-pointer hover:bg-secondary hover:text-white transition-all">
              <span className="material-symbols-outlined text-lg">share</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0B1F3A]/5 flex items-center justify-center text-[#0B1F3A] cursor-pointer hover:bg-secondary hover:text-white transition-all">
              <span className="material-symbols-outlined text-lg">mail</span>
            </div>
          </div>
        </div>
        <div>
          <h6 className="font-headline font-bold text-sm text-[#0B1F3A] dark:text-white mb-6 uppercase tracking-widest">Solutions</h6>
          <ul className="space-y-4 text-sm text-[#7587a7] dark:text-[#c4c6ce]">
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/">Staffing Solutions</Link></li>
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/">Consulting Services</Link></li>
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/">Global Delivery</Link></li>
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/">Digital Transformation</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="font-headline font-bold text-sm text-[#0B1F3A] dark:text-white mb-6 uppercase tracking-widest">Company</h6>
          <ul className="space-y-4 text-sm text-[#7587a7] dark:text-[#c4c6ce]">
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/">About Us</Link></li>
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/careers">Careers</Link></li>
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/">Global Offices</Link></li>
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/">Security</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="font-headline font-bold text-sm text-[#0B1F3A] dark:text-white mb-6 uppercase tracking-widest">Legal</h6>
          <ul className="space-y-4 text-sm text-[#7587a7] dark:text-[#c4c6ce]">
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/">Privacy Policy</Link></li>
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/">Terms of Service</Link></li>
            <li><Link className="hover:text-[#4059aa] transition-colors" to="/">Cookie Settings</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-8 border-t border-[#c4c6ce]/15 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xs text-[#7587a7] dark:text-[#c4c6ce] font-body">© 2024 InTech Road &amp; Global Scale. Architectural Intelligence Reserved.</div>
        <div className="flex gap-6 text-xs font-bold text-[#0B1F3A] dark:text-white uppercase tracking-tighter">
          <span>EN</span>
          <span className="opacity-30">DE</span>
          <span className="opacity-30">FR</span>
        </div>
      </div>
    </footer>
  );
}
