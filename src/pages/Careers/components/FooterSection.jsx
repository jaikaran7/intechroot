import { Link } from "react-router-dom";

export default function FooterSection() {
  return (
    <footer className="bg-background border-t border-outline-variant/10 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
        <div className="space-y-8">
          <Link className="text-2xl font-black tracking-tighter text-primary font-headline flex items-center gap-2 cursor-pointer" to="/">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-black">ET</span>
            </span>
            ELITE TALENT
          </Link>
          <p className="text-sm text-on-primary-container/60 leading-relaxed max-w-xs font-medium">
            Global architectural intelligence for the modern enterprise. We bridge the human gap in high-stakes technology.
          </p>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center hover:bg-secondary hover:text-white transition-all cursor-pointer group">
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">public</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center hover:bg-secondary hover:text-white transition-all cursor-pointer group">
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">hub</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center hover:bg-secondary hover:text-white transition-all cursor-pointer group">
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">terminal</span>
            </div>
          </div>
        </div>
        <div>
          <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-10">Navigation</h6>
          <ul className="space-y-6 text-sm font-semibold text-on-primary-container/70">
            <li><Link className="hover:text-secondary transition-colors" to="/services">Services</Link></li>
            <li><Link className="hover:text-secondary transition-colors" to="/">Sectors</Link></li>
            <li><Link className="text-primary" to="/careers">Careers</Link></li>
            <li><Link className="hover:text-secondary transition-colors" to="/">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-10">Intelligence</h6>
          <ul className="space-y-6 text-sm font-semibold text-on-primary-container/70">
            <li><Link className="hover:text-secondary transition-colors" to="/">Global Offices</Link></li>
            <li><Link className="hover:text-secondary transition-colors" to="/">Security Core</Link></li>
            <li><Link className="hover:text-secondary transition-colors" to="/">Relocation Support</Link></li>
            <li><Link className="hover:text-secondary transition-colors" to="/">Privacy Hub</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-10">Legal</h6>
          <ul className="space-y-6 text-sm font-semibold text-on-primary-container/70">
            <li><Link className="hover:text-secondary transition-colors" to="/">Privacy Policy</Link></li>
            <li><Link className="hover:text-secondary transition-colors" to="/">Terms of Service</Link></li>
          </ul>
          <div className="mt-16">
            <p className="text-[10px] text-on-primary-container/40 font-bold uppercase tracking-widest">© 2024 ELITE TALENT &amp; GLOBAL SCALE. ARCHITECTURAL INTELLIGENCE RESERVED.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
