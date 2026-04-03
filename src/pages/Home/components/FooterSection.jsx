export default function FooterSection() {
  return (
    <footer className="bg-background border-t border-outline-variant/10 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
        <div className="space-y-12">
          <div className="text-3xl font-black tracking-tighter font-headline text-primary flex items-center gap-4">
            <span className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-black">ET</span>
            </span>
            <span className="tracking-[0.1em]">INTECHROOT</span>
          </div>
          <p className="text-base text-on-primary-container/60 leading-relaxed font-medium">
            Architectural intelligence for the modern enterprise. Bridging the gap between vision and structural reality.
          </p>
          <div className="flex gap-6">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center hover:bg-secondary hover:text-white transition-all cursor-pointer shadow-sm hover:rotate-6">
              <span className="material-symbols-outlined text-xl">public</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center hover:bg-secondary hover:text-white transition-all cursor-pointer shadow-sm hover:-rotate-6">
              <span className="material-symbols-outlined text-xl">mail</span>
            </div>
          </div>
        </div>
        <div>
          <h6 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-12">Intelligence</h6>
          <ul className="space-y-8 text-sm font-bold text-on-primary-container/70">
            <li><a className="hover:text-secondary transition-colors tracking-widest" href="#">Squad Deployment</a></li>
            <li><a className="hover:text-secondary transition-colors tracking-widest" href="#">ERP Migration</a></li>
            <li><a className="hover:text-secondary transition-colors tracking-widest" href="#">Cloud Strategies</a></li>
            <li><a className="hover:text-secondary transition-colors tracking-widest" href="#">BI Frameworks</a></li>
          </ul>
        </div>
        <div>
          <h6 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-12">Ecosystem</h6>
          <ul className="space-y-8 text-sm font-bold text-on-primary-container/70">
            <li><a className="hover:text-secondary transition-colors tracking-widest" href="#">Our Philosophy</a></li>
            <li><a className="hover:text-secondary transition-colors tracking-widest" href="#">Global Nodes</a></li>
            <li><a className="hover:text-secondary transition-colors tracking-widest" href="#">Talent Portal</a></li>
            <li><a className="hover:text-secondary transition-colors tracking-widest" href="#">Security Core</a></li>
          </ul>
        </div>
        <div>
          <h6 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-12">Intel Feed</h6>
          <p className="text-xs text-on-primary-container/50 mb-8 font-medium">Subscribe for monthly architectural insights.</p>
          <div className="flex flex-col gap-5">
            <input className="bg-surface-container-high border-none rounded-2xl px-6 py-4 text-xs focus:ring-2 focus:ring-secondary/50 outline-none font-medium shadow-inner" placeholder="Enterprise Email" type="email" />
            <button className="bg-primary text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-secondary transition-all shadow-xl">
              Secure Subscription
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-10 border-t border-outline-variant/5 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-[11px] text-on-primary-container/40 font-bold uppercase tracking-[0.3em]">© 2024 INTECHROOT HOLDINGS. ALL ARCHITECTURE RESERVED.</div>
        <div className="flex gap-12 text-[11px] font-black text-primary uppercase tracking-[0.3em]">
          <a className="hover:text-secondary transition-colors" href="#">Privacy</a>
          <a className="hover:text-secondary transition-colors" href="#">Terms</a>
          <a className="hover:text-secondary transition-colors" href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
