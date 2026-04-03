import Button from "../Form/Button";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const isActive = (path) => pathname === path;

  const navLinkClass = (path) =>
    `font-headline font-bold tracking-[0.2em] text-[10px] uppercase transition-all relative group ${
      isActive(path) ? "text-primary" : "text-on-surface-variant hover:text-primary"
    }`;

  return (
    <nav className="fixed top-0 w-full z-[100] transition-all duration-700">
      <div className="absolute inset-0 bg-white/40 dark:bg-[#000615]/40 backdrop-blur-3xl border-b border-white/20 dark:border-white/5"></div>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-6 relative">
        <Link className="text-2xl font-black tracking-tighter text-primary dark:text-white font-headline flex items-center gap-3" to="/">
          <span className="w-10 h-10 bg-primary dark:bg-white rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:rotate-12">
            <span className="text-white dark:text-primary text-base font-black">IR</span>
          </span>
          <span className="tracking-[0.15em] text-lg">INTECHROOT</span>
        </Link>
        <div className="hidden md:flex items-center gap-14">
          <Link className={navLinkClass("/")} to="/">
            Home
            <span
              className={`absolute -bottom-2 left-0 h-[2px] bg-secondary transition-all duration-500 ${
                isActive("/") ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>
          <Link className={navLinkClass("/services")} to="/services">
            Services
            <span
              className={`absolute -bottom-2 left-0 h-[2px] bg-secondary transition-all duration-500 ${
                isActive("/services") ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>
          <Link className={navLinkClass("/careers")} to="/careers">
            Careers
            <span
              className={`absolute -bottom-2 left-0 h-[2px] bg-secondary transition-all duration-500 ${
                isActive("/careers") ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>
          <Link className={navLinkClass("/about")} to="/about">
            About
            <span
              className={`absolute -bottom-2 left-0 h-[2px] bg-secondary transition-all duration-500 ${
                isActive("/about") ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Button className="bg-primary-container text-white px-8 py-3.5 rounded-full font-headline font-bold text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(11,31,58,0.25)] glint-effect border border-white/10">
            Contact Us
          </Button>
        </div>
      </div>
    </nav>
  );
}
