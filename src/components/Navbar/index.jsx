import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import CompanyLogo from "../CompanyLogo";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/careers", label: "Careers" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (path) => pathname === path;

  return (
    <>
      {/* ── Nav bar ───────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-[100] transition-all duration-700">
        <div className="absolute inset-0 bg-white/40 dark:bg-[#000615]/40 backdrop-blur-3xl border-b border-white/20 dark:border-white/5" />
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-8 py-4 lg:py-6 relative">
          <CompanyLogo
            linkClassName="inline-flex items-center gap-3 transition-transform hover:scale-[1.02] font-headline text-primary dark:text-white"
            markClassName="h-8 w-8 lg:h-10 lg:w-10 rounded-xl object-cover shadow-lg transform transition-transform hover:rotate-3"
          />

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-14">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`font-headline font-bold tracking-[0.2em] text-sm uppercase transition-all relative group ${
                  isActive(to) ? "text-primary" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-2 left-0 h-[2px] bg-secondary transition-all duration-500 ${
                    isActive(to) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <Link
              className="hidden lg:inline-flex bg-primary-container text-white px-8 py-3.5 rounded-full font-headline font-bold text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(11,31,58,0.25)] glint-effect border border-white/10 items-center justify-center"
              to="/careers#apply"
            >
              Apply Now
            </Link>

            {/* Hamburger (mobile + tablet) */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-xl bg-primary/8 border border-primary/10 text-primary z-[110] transition-colors hover:bg-primary/15 active:scale-95"
            >
              <span className={`block w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Overlay ───────────────────────────────────────────── */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[95] bg-primary/25 backdrop-blur-sm lg:hidden transition-all duration-400 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Drawer ────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 right-0 h-full w-[min(82vw,340px)] z-[100] bg-white border-l border-outline-variant/15 shadow-[−20px_0_80px_rgba(0,6,21,0.12)] lg:hidden flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-5 border-b border-outline-variant/10">
          <CompanyLogo
            linkClassName="inline-flex items-center gap-2.5 font-headline text-primary"
            markClassName="h-8 w-8 rounded-xl object-cover shadow-md"
          />
          <button
            onClick={() => setOpen(false)}
            className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors active:scale-90"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col px-4 py-6 gap-1 overflow-y-auto">
          {NAV_LINKS.map(({ to, label }, i) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${i * 55}ms` : "0ms" }}
              className={`flex items-center justify-between px-4 py-4 rounded-2xl font-headline font-bold text-lg tracking-tight transition-all duration-300 ${
                isActive(to)
                  ? "bg-secondary/8 text-secondary"
                  : "text-primary hover:bg-surface-container-low hover:text-secondary"
              } ${open ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"}`}
            >
              {label}
              <span className={`material-symbols-outlined text-lg ${isActive(to) ? "text-secondary" : "text-on-surface-variant/40"}`}>
                {isActive(to) ? "check" : "chevron_right"}
              </span>
            </Link>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div className="px-4 pb-8 pt-4 border-t border-outline-variant/10 space-y-3">
          <Link
            to="/careers#apply"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-full bg-primary-container text-white py-4 rounded-2xl font-headline font-bold text-[11px] uppercase tracking-[0.3em] shadow-lg hover:opacity-90 transition-opacity active:scale-95"
          >
            Apply Now
          </Link>
          <p className="text-center text-[9px] text-on-surface-variant/40 font-black uppercase tracking-widest">
            Global Engineering Partner
          </p>
        </div>
      </div>
    </>
  );
}
