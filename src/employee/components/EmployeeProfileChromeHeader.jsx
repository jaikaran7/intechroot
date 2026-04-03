import { Link } from "react-router-dom";
import { getEmployeeFromStore } from "../employeeEmployeesStore";
import { getEmployeeSessionId } from "../employeeSession";

export default function EmployeeProfileChromeHeader() {
  const id = getEmployeeSessionId();
  const employee = id ? getEmployeeFromStore(id) : null;
  const imageSrc = employee?.performance?.panelImage;
  const line1 = employee?.name ?? "—";
  const line2 = employee?.role ?? "Employee";

  return (
    <header className="fixed top-0 right-0 z-40 flex h-16 w-[calc(100%-16rem)] items-center justify-between border-b border-slate-200/80 bg-slate-50/60 px-8 tonal-shift shadow-[0_40px_40px_0_rgba(0,6,21,0.04)] backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <Link
          to="/employee/dashboard"
          className="rounded-full p-2 transition-colors duration-200 hover:bg-slate-200/50 active:scale-95"
          aria-label="Back to dashboard"
        >
          <span className="material-symbols-outlined text-slate-600">arrow_back</span>
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
          <button
            type="button"
            className="cursor-pointer border-none bg-transparent p-0 text-slate-500 transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            type="button"
            className="cursor-pointer border-none bg-transparent p-0 text-slate-500 transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900">{line1}</p>
            <p className="text-[10px] text-slate-500">{line2}</p>
          </div>
          {imageSrc ? (
            <img alt="" className="h-8 w-8 rounded-full bg-slate-200 object-cover" src={imageSrc} />
          ) : (
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          )}
        </div>
      </div>
    </header>
  );
}
