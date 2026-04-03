import { Link, useLocation } from "react-router-dom";
import { ADMIN_NAV_ITEMS, isNavActive } from "../navConfig";

export default function AdminSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col gap-y-2 border-r border-white/5 bg-[#000615] py-8">
      <div className="mb-10 px-8">
        <h1 className="text-2xl font-black tracking-tighter text-white">InTechRoot</h1>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-tertiary-fixed-dim opacity-70">Enterprise Admin</p>
      </div>
      <nav className="flex flex-col gap-y-1">
        {ADMIN_NAV_ITEMS.map(({ to, label, icon }) => {
          const active = isNavActive(pathname, to);
          return (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-4 px-8 py-3 font-headline text-sm font-semibold tracking-wide transition-all duration-200 border-l-4 hover:translate-x-[2px] ${
                active
                  ? "border-secondary bg-white/10 text-white"
                  : "border-transparent text-white/70 hover:bg-white/10 hover:text-white"
              } `}
            >
              <span
                className={`material-symbols-outlined shrink-0 ${active ? "text-white" : "text-white/70 group-hover:text-white"}`}
                data-icon={icon}
              >
                {icon}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
