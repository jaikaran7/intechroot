import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { adminPanelService } from "../../services/adminPanel.service";

function getInitials(name) {
  return String(name || "?")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminLockedDashboard() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const dashboardQuery = useQuery({
    queryKey: ["admin-panel-dashboard"],
    queryFn: adminPanelService.getDashboard,
    staleTime: 30_000,
    enabled: role === "ADMIN",
  });

  const dashboard = dashboardQuery.data || { assignedEmployees: 0, employees: [], timesheets: {} };
  const employees = Array.isArray(dashboard.employees) ? dashboard.employees : [];

  function handleLogout() {
    clearAuth();
    window.location.assign("/login");
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-tertiary-fixed-dim selection:text-primary">
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-[#000615] flex flex-col gap-4 py-8 shadow-[40px_0_40px_rgba(0,6,21,0.04)] z-[60]">
        <div className="px-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-400 flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-[#0B1F3A] text-lg font-bold">corporate_fare</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tighter font-headline">InTechRoot</h1>
              <p className="font-['Manrope'] tracking-tight text-[10px] uppercase font-bold text-sky-400">Enterprise Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <Link className="text-white bg-white/10 rounded-lg mx-4 px-4 py-3 border-l-4 border-secondary flex items-center gap-3 font-['Manrope'] tracking-tight text-sm uppercase font-bold transition-all" to="/admin-panel/dashboard">
            <span className="material-symbols-outlined text-white" data-icon="dashboard">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link className="text-white/70 hover:text-white px-4 py-3 mx-4 transition-all hover:bg-white/10 flex items-center gap-3 font-['Manrope'] tracking-tight text-sm uppercase font-bold" to="/admin-panel/timesheets">
            <span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
            <span>Timesheets</span>
          </Link>
        </nav>
      </aside>

      <header className="fixed top-0 right-0 left-64 z-50 bg-white/60 dark:bg-[#0B1F3A]/60 backdrop-blur-[24px] border-b border-[#c4c6ce]/15 flex justify-between items-center h-16 px-8 transition-all duration-300">
        <div className="flex items-center w-96">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-tertiary-fixed-dim/20 transition-all" placeholder="Search resources or employees..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="hover:bg-slate-100/50 dark:hover:bg-white/10 rounded-full p-2 transition-all relative" type="button">
            <span className="material-symbols-outlined text-slate-500" data-icon="notifications">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button type="button" className="hover:bg-slate-100/50 dark:hover:bg-white/10 rounded-full p-2 transition-all" onClick={handleLogout} aria-label="Sign out">
            <span className="material-symbols-outlined text-slate-500" data-icon="settings">settings</span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#0B1F3A] font-headline">{user?.name || "Administrator"}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Admin</p>
            </div>
          </div>
        </div>
      </header>

      <main className="ml-64 pt-24 pb-12 px-12 min-h-screen">
        <div className="mb-10 flex items-end">
          <div className="space-y-1">
            <span className="text-sky-600 font-bold tracking-widest text-[11px] uppercase">Overview Control Center</span>
            <h2 className="text-4xl font-extrabold text-primary tracking-tight font-headline">Admin Control</h2>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 mb-12">
          <div className="col-span-12 lg:col-span-8 glass-card rounded-xl p-8 shadow-sm flex items-center justify-between overflow-hidden relative group">
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-24 h-24 rounded-xl bg-surface-container text-primary text-2xl font-bold flex items-center justify-center shadow-lg border-2 border-white">
                {getInitials(user?.name || "Admin")}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-bold text-primary font-headline">{user?.name || "Administrator"}</h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">Active</span>
                </div>
                <p className="text-on-surface-variant font-medium text-sm mb-4">{user?.email || "—"}</p>
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Company</p>
                    <p className="text-sm font-semibold text-primary">InTechRoot</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Role</p>
                    <p className="text-sm font-semibold text-primary">Admin</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-16 w-[1px] bg-outline-variant/20 hidden md:block"></div>
            <div className="text-right relative z-10">
              <div className="flex flex-col items-end">
                <span className="text-5xl font-black text-primary font-headline tracking-tighter">{dashboard.assignedEmployees || 0}</span>
                <span className="text-sm font-bold text-on-surface mb-1">Total Employees Assigned</span>
                <p className="text-xs text-on-surface-variant max-w-[180px] leading-relaxed">Employees assigned for timesheet management</p>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 glass-card rounded-xl p-8 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Weekly Efficiency</p>
                <h4 className="text-xl font-bold text-primary font-headline">Strategic Pulse</h4>
              </div>
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">Timesheets Pending</span>
                <span className="font-bold text-primary">{dashboard.timesheets?.pending || 0}</span>
              </div>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full">
                <div className="bg-secondary h-full rounded-full" style={{ width: `${Math.min(100, (dashboard.timesheets?.pending || 0) * 10)}%` }}></div>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-tight">Pending timesheets are scoped to your assigned employees.</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="text-lg font-bold text-primary font-headline">Assigned Managed Team</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-surface-container-low/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Employee Name</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Department</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {employees.map((employee, index) => (
                <tr className={index % 2 === 1 ? "bg-surface-container-low/30 hover:bg-surface-container-lowest/80 transition-colors" : "hover:bg-surface-container-lowest/80 transition-colors"} key={employee.id}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container text-primary text-xs font-bold flex items-center justify-center">
                        {getInitials(employee.name)}
                      </div>
                      <span className="font-bold text-primary text-sm">{employee.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">{employee.email}</td>
                  <td className="px-8 py-5 text-sm">
                    <span className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-[11px] font-bold">{employee.department}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-semibold text-on-surface">{employee.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Link className="text-secondary font-bold text-sm hover:underline decoration-2 underline-offset-4" to="/admin-panel/timesheets">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td className="px-8 py-8 text-sm text-on-surface-variant" colSpan={5}>
                    {dashboardQuery.isLoading ? "Loading assigned employees..." : "No employees assigned yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-8 py-4 bg-surface-container-low/30 border-t border-outline-variant/10 flex justify-between items-center">
            <p className="text-xs text-on-surface-variant">Showing {employees.length} of {dashboard.assignedEmployees || 0} employees assigned</p>
          </div>
        </div>
      </main>
    </div>
  );
}
