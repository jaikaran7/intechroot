import { useAuthStore } from "../../../store/authStore";

export default function EmployeeHeader() {
  const { user } = useAuthStore();
  const imageSrc = null;
  const name = user?.name ?? "Employee";
  const role = user?.role ?? "";

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-white/60 backdrop-blur-xl flex justify-between items-center px-8">
      <div className="flex items-center w-96">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            className="w-full bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#4cd7f6]/20 transition-all font-body"
            placeholder="Search tasks or documents..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button type="button" className="material-symbols-outlined text-slate-500 hover:text-[#4cd7f6] transition-colors bg-transparent border-none cursor-pointer">
            notifications
          </button>
          <button type="button" className="material-symbols-outlined text-slate-500 hover:text-[#4cd7f6] transition-colors bg-transparent border-none cursor-pointer">
            help_outline
          </button>
        </div>
        <div className="h-8 w-px bg-outline-variant/20"></div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-primary-container leading-none">{name}</p>
            <p className="text-[10px] text-slate-500">{role}</p>
          </div>
          {imageSrc ? (
            <img alt="User Profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-white" src={imageSrc} />
          ) : (
            <div className="w-10 h-10 rounded-full ring-2 ring-white bg-secondary-container text-white text-xs font-bold flex items-center justify-center">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
