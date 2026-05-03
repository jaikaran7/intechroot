import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { employeesService } from "../../services/employees.service";
import { timesheetsService } from "../../services/timesheets.service";
import { calculateTotal, formatHourCell, formatTimesheetRangeLabel } from "../Employee/timesheetUtils";
import PageSkeleton from "../../components/PageSkeleton";
import ErrorState from "../../components/ErrorState";

const ASSIGNMENT_KEYS = ["adminId", "assignedAdminId", "managerId", "supervisorId", "reportingToId", "ownerId"];

function getAssignedEmployeeIds(adminUser, employees) {
  const ids = new Set();
  const adminId = adminUser?.id;
  const adminEmail = String(adminUser?.email || "").toLowerCase();

  const fromUser = [
    ...(Array.isArray(adminUser?.assignedEmployeeIds) ? adminUser.assignedEmployeeIds : []),
    ...(Array.isArray(adminUser?.employees) ? adminUser.employees : []),
  ];
  fromUser.forEach((id) => ids.add(String(id)));

  for (const employee of employees) {
    const employeeId = String(employee?.id || "");
    if (!employeeId) continue;
    const assignedByKey = ASSIGNMENT_KEYS.some((key) => {
      const value = employee?.[key];
      return value != null && String(value) === String(adminId);
    });
    const assignedByEmail =
      String(employee?.managerEmail || "").toLowerCase() === adminEmail ||
      String(employee?.adminEmail || "").toLowerCase() === adminEmail;
    if (assignedByKey || assignedByEmail) {
      ids.add(employeeId);
    }
  }

  return ids;
}

export default function AdminPanelTimesheets() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const usesAdminPanelApi = role === "ADMIN";

  const employeesQuery = useQuery({
    queryKey: ["employees-admin-panel"],
    queryFn: () => employeesService.getAll({ limit: 500 }),
    staleTime: 60_000,
    enabled: !usesAdminPanelApi,
  });

  const timesheetsQuery = useQuery({
    queryKey: ["timesheets-admin-panel", usesAdminPanelApi ? "ADMIN" : "legacy"],
    queryFn: () =>
      usesAdminPanelApi
        ? timesheetsService.getAdminPanel({ limit: 500 })
        : timesheetsService.getAll({ limit: 500 }),
    staleTime: 30_000,
  });

  const approveMutation = useMutation({
    mutationFn: (id) =>
      usesAdminPanelApi
        ? timesheetsService.approveAdminPanel(id)
        : timesheetsService.approve(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["timesheets-admin-panel"] }),
  });
  const rejectMutation = useMutation({
    mutationFn: (id) =>
      usesAdminPanelApi
        ? timesheetsService.rejectAdminPanel(id, "Rejected by admin")
        : timesheetsService.reject(id, "Rejected by admin"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["timesheets-admin-panel"] }),
  });

  const employees = useMemo(() => (Array.isArray(employeesQuery.data?.data) ? employeesQuery.data.data : []), [employeesQuery.data]);
  const timesheets = useMemo(() => (Array.isArray(timesheetsQuery.data?.data) ? timesheetsQuery.data.data : []), [timesheetsQuery.data]);

  const assignedEmployeeIds = useMemo(() => getAssignedEmployeeIds(user, employees), [user, employees]);

  const visibleRows = useMemo(() => {
    const assignedScoped =
      usesAdminPanelApi
        ? timesheets
        : assignedEmployeeIds.size > 0
        ? timesheets.filter((sheet) => assignedEmployeeIds.has(String(sheet?.employee?.id || sheet?.employeeId || "")))
        : timesheets;

    return assignedScoped
      .map((sheet) => ({
        id: sheet.id,
        employeeName: sheet?.employee?.name || "Unknown Employee",
        employeeEmail: sheet?.employee?.email || "—",
        dateLabel: formatTimesheetRangeLabel(sheet),
        hours: calculateTotal(sheet?.weekData || {}),
        weekData: sheet?.weekData || {},
        status: sheet?.status || "Pending",
      }))
      .filter((row) => {
        const q = search.trim().toLowerCase();
        const matchesSearch =
          q.length === 0 ||
          row.employeeName.toLowerCase().includes(q) ||
          row.employeeEmail.toLowerCase().includes(q) ||
          row.dateLabel.toLowerCase().includes(q);
        const matchesStatus = statusFilter === "All" || row.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [assignedEmployeeIds, search, statusFilter, timesheets, usesAdminPanelApi]);

  const stats = useMemo(() => {
    const pending = visibleRows.filter((r) => r.status === "Pending").length;
    const approved = visibleRows.filter((r) => r.status === "Approved").length;
    const rejected = visibleRows.filter((r) => r.status === "Rejected").length;
    const totalHours = visibleRows.reduce((sum, row) => sum + row.hours, 0);
    return { pending, approved, rejected, totalHours };
  }, [visibleRows]);

  function handleLogout() {
    clearAuth();
    window.location.assign("/login");
  }

  if ((!usesAdminPanelApi && employeesQuery.isLoading) || timesheetsQuery.isLoading) return <PageSkeleton />;
  if ((!usesAdminPanelApi && employeesQuery.isError) || timesheetsQuery.isError) {
    return <ErrorState message="Failed to load admin timesheets." onRetry={() => { employeesQuery.refetch(); timesheetsQuery.refetch(); }} />;
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
          <Link className="text-white/70 hover:text-white px-4 py-3 mx-4 transition-all hover:bg-white/10 flex items-center gap-3 font-['Manrope'] tracking-tight text-sm uppercase font-bold" to="/admin-panel/dashboard">
            <span className="material-symbols-outlined text-white/70">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link className="text-white bg-white/10 rounded-lg mx-4 px-4 py-3 border-l-4 border-secondary flex items-center gap-3 font-['Manrope'] tracking-tight text-sm uppercase font-bold transition-all" to="/admin-panel/timesheets">
            <span className="material-symbols-outlined text-white">calendar_today</span>
            <span>Timesheets</span>
          </Link>
        </nav>
      </aside>

      <header className="fixed top-0 right-0 left-64 z-50 bg-white/60 dark:bg-[#0B1F3A]/60 backdrop-blur-[24px] border-b border-[#c4c6ce]/15 flex justify-between items-center h-16 px-8 transition-all duration-300">
        <div className="flex items-center w-96">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-tertiary-fixed-dim/20 transition-all" placeholder="Search records, employees, or status..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button type="button" className="hover:bg-slate-100/50 dark:hover:bg-white/10 rounded-full p-2 transition-all relative">
            <span className="material-symbols-outlined text-slate-500">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button type="button" className="hover:bg-slate-100/50 dark:hover:bg-white/10 rounded-full p-2 transition-all" onClick={handleLogout}>
            <span className="material-symbols-outlined text-slate-500">settings</span>
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
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold text-primary tracking-tight font-headline">Timesheet Management</h2>
            <p className="text-on-surface-variant">Review and manage weekly employee hours and billing status.</p>
          </div>
          <div className="flex gap-3">
            <button type="button" className="px-6 py-2.5 border border-primary-container text-primary-container font-semibold rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">file_download</span>
              Export CSV
            </button>
            <button type="button" className="px-6 py-2.5 bg-primary-container text-white font-semibold rounded-lg shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              Manual Entry
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">Pending</p>
            <p className="text-3xl font-extrabold font-headline mt-1">{stats.pending}</p>
          </div>
          <div className="glass-card rounded-xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-on-tertiary-container">Approved</p>
            <p className="text-3xl font-extrabold font-headline mt-1">{stats.approved}</p>
          </div>
          <div className="glass-card rounded-xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-error">Rejected</p>
            <p className="text-3xl font-extrabold font-headline mt-1">{stats.rejected}</p>
          </div>
          <div className="glass-card rounded-xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-tertiary-fixed-dim">Total Hours</p>
            <p className="text-3xl font-extrabold font-headline mt-1">
              {(Number.isFinite(stats.totalHours) ? stats.totalHours : 0).toFixed(1)}
            </p>
          </div>
        </div>

        <section className="glass-card rounded-xl overflow-hidden">
          <div className="px-8 py-5 flex items-center justify-between bg-surface-container-low/50">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">View:</span>
                <span className="text-sm font-semibold">All periods</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Status:</span>
              </div>
              <select className="bg-transparent border-none text-sm font-semibold focus:ring-0 cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="material-symbols-outlined">filter_list</span>
              <span className="text-xs font-bold">More Filters</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Employee</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">M</th>
                  <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">T</th>
                  <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">W</th>
                  <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">T</th>
                  <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">F</th>
                  <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">ST</th>
                  <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">S</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <div>
                        <p className="text-sm font-bold text-primary">{row.employeeName}</p>
                        <p className="text-[11px] text-slate-400">{row.employeeEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-primary">{row.dateLabel}</td>
                    <td className="px-4 py-5 text-center text-sm font-medium">{formatHourCell(row.weekData.mon)}</td>
                    <td className="px-4 py-5 text-center text-sm font-medium">{formatHourCell(row.weekData.tue)}</td>
                    <td className="px-4 py-5 text-center text-sm font-medium">{formatHourCell(row.weekData.wed)}</td>
                    <td className="px-4 py-5 text-center text-sm font-medium">{formatHourCell(row.weekData.thu)}</td>
                    <td className="px-4 py-5 text-center text-sm font-medium">{formatHourCell(row.weekData.fri)}</td>
                    <td className="px-4 py-5 text-center text-sm font-medium">{formatHourCell(row.weekData.sat)}</td>
                    <td className="px-4 py-5 text-center text-sm font-medium">{formatHourCell(row.weekData.sun)}</td>
                    <td className="px-6 py-5 text-sm font-extrabold text-primary">{row.hours.toFixed(1)}</td>
                    <td className="px-6 py-5">
                      <span className={row.status === "Approved" ? "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 uppercase tracking-tight" : row.status === "Rejected" ? "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-error-container text-error uppercase tracking-tight" : "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 uppercase tracking-tight"}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {row.status === "Pending" ? (
                        <div className="inline-flex gap-2">
                          <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg border border-error-container text-error hover:bg-error-container/20 transition-all" onClick={() => rejectMutation.mutate(row.id)} title="Reject">
                            <span className="material-symbols-outlined text-lg">close</span>
                          </button>
                          <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-container text-tertiary-fixed hover:shadow-md transition-all" onClick={() => approveMutation.mutate(row.id)} title="Approve">
                            <span className="material-symbols-outlined text-lg">check</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {visibleRows.length === 0 && (
                  <tr>
                    <td className="px-8 py-8 text-sm text-slate-500" colSpan={13}>
                      No assigned employee timesheets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
