import { Link, useLocation } from "react-router-dom";

function navClass(isActive) {
  return isActive
    ? "flex items-center gap-3 px-4 py-3 text-[#acedff] font-bold border-r-2 border-[#acedff] bg-white/5 transition-transform active:scale-95"
    : "flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200";
}

export default function EmployeeSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r border-white/10 bg-[#000615] flex flex-col py-8 px-4 z-50 shadow-[40px_0_40px_rgba(0,6,21,0.04)]">
      <div className="mb-10 px-4">
        <h1 className="text-xl font-bold text-white tracking-[-0.02em] font-headline">InTechRoot</h1>
        <p className="text-xs text-slate-500 font-medium">Employee Portal</p>
      </div>
      <nav className="flex-1 space-y-2">
        <Link className={navClass(pathname === "/employee/dashboard" || pathname === "/employee")} to="/employee/dashboard">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-['Manrope'] tracking-tight">Dashboard</span>
        </Link>
        <Link className={navClass(pathname === "/employee/profile")} to="/employee/profile">
          <span className="material-symbols-outlined">badge</span>
          <span className="font-['Manrope'] tracking-tight">Profile</span>
        </Link>
        <Link className={navClass(pathname === "/employee/timesheets")} to="/employee/timesheets">
          <span className="material-symbols-outlined">history_toggle_off</span>
          <span className="font-['Manrope'] tracking-tight">Timesheets</span>
        </Link>
        <Link className={navClass(pathname === "/employee/documents")} to="/employee/documents">
          <span className="material-symbols-outlined">folder_open</span>
          <span className="font-['Manrope'] tracking-tight">Documents</span>
        </Link>
      </nav>
      <div className="mt-auto pt-6 border-t border-white/5">
        <span className="flex items-center gap-3 px-4 py-3 text-slate-400 cursor-default">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-['Manrope'] tracking-tight">Settings</span>
        </span>
      </div>
    </aside>
  );
}
