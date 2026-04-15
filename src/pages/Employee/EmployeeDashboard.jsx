import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { employeesService } from "../../services/employees.service";
import { timesheetsService } from "../../services/timesheets.service";
import { addDaysISO, calculateTotal, formatTimesheetRangeLabel, getWeekStartISO, parseYMD } from "./timesheetUtils";

function documentStatusLabel(expiryDateStr) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDateStr);
  exp.setHours(0, 0, 0, 0);
  if (Number.isNaN(exp.getTime())) return "valid";
  if (exp < now) return "expired";
  const soon = new Date(now);
  soon.setDate(soon.getDate() + 30);
  if (exp <= soon) return "expiring";
  return "valid";
}

export default function EmployeeDashboard() {
  const { employeeId } = useAuthStore();

  const { data: employee } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => employeesService.getById(employeeId),
    staleTime: 120_000,
    enabled: !!employeeId,
  });

  const { data: tsData } = useQuery({
    queryKey: ['timesheets', employeeId],
    queryFn: () => timesheetsService.getByEmployee(employeeId, { limit: 10 }),
    staleTime: 30_000,
    enabled: !!employeeId,
  });

  const timesheets = useMemo(() => {
    const list = tsData?.data;
    return Array.isArray(list) ? list : [];
  }, [tsData]);

  const currentWeekStart = useMemo(() => getWeekStartISO(new Date()), []);
  const weekTs = useMemo(() => {
    return timesheets.find((t) => getWeekStartISO(t.weekStart) === currentWeekStart) ?? timesheets[0];
  }, [timesheets, currentWeekStart]);

  const hours = useMemo(() => {
    const wd = weekTs?.weekData ?? {};
    return {
      mon: Number(wd.mon ?? 8.5),
      tue: Number(wd.tue ?? 8),
      wed: Number(wd.wed ?? 9),
      thu: Number(wd.thu ?? 7.5),
      fri: Number(wd.fri ?? 7.5),
      sat: Number(wd.sat ?? 0),
      sun: Number(wd.sun ?? 0),
    };
  }, [weekTs]);

  const maxH = useMemo(() => Math.max(1, ...Object.values(hours)), [hours]);
  const barPct = (v) => `${Math.min(100, Math.round((Number(v) / maxH) * 100))}%`;

  const totalWeek = useMemo(() => calculateTotal(hours), [hours]);
  const pendingCount = useMemo(
    () => timesheets.filter((t) => t.status === "Pending" || t.status === "Draft").length,
    [timesheets],
  );
  const approvedCount = useMemo(
    () => timesheets.filter((t) => t.status === "Approved").length,
    [timesheets],
  );

  const deadlinesCount = useMemo(() => {
    const docs = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const soon = new Date(now);
    soon.setDate(soon.getDate() + 45);
    return docs.filter((d) => {
      const st = documentStatusLabel(d.expiryDate);
      if (st === "expired") return true;
      if (st === "expiring") return true;
      const exp = new Date(d.expiryDate);
      return exp <= soon && exp >= now;
    }).length;
  }, [employee]);

  const chartPeriodLabel = useMemo(() => {
    if (weekTs) return formatTimesheetRangeLabel(weekTs);
    const start = parseYMD(currentWeekStart);
    const end = parseYMD(addDaysISO(currentWeekStart, 4));
    const opts = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}`;
  }, [weekTs, currentWeekStart]);

  const summaryStatus = weekTs?.status === "Approved" ? "Approved" : weekTs?.status === "Rejected" ? "Rejected" : "Pending approval";
  const summaryDotClass =
    weekTs?.status === "Approved" ? "bg-emerald-500" : weekTs?.status === "Rejected" ? "bg-error" : "bg-slate-400";

  const firstName = employee?.name?.split(" ")?.[0] ?? "there";
  const dept = employee?.department ?? "Engineering Department";
  const displayId = employee?.id ? `#${employee.id}` : "#ITR-29041";
  const loc = employee?.personal?.address?.split(",").slice(-2).join(",").trim() ?? "London, UK";

  const recentTs = useMemo(() => {
    return [...timesheets]
      .sort((a, b) => String(b.weekStart).localeCompare(String(a.weekStart)))
      .slice(0, 5);
  }, [timesheets]);
  const recentDoc = null;

  return (
    <main className="ml-64 pt-16 min-h-screen bg-surface flex flex-col md:flex-row">
      <div className="flex-1 p-8">
        <section className="mb-10">
          <p className="text-secondary font-semibold text-xs uppercase tracking-widest mb-2">Internal Dashboard</p>
          <h2 className="text-4xl font-headline font-extrabold text-primary tracking-tight mb-2">Welcome back, {firstName}.</h2>
          <p className="text-on-surface-variant font-body">Here is what&apos;s happening with your deployments and paperwork today.</p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 shadow-[0_4px_20px_rgba(0,6,21,0.02)] group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary-container rounded-lg text-[#acedff]">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <span className="text-xs font-bold text-on-tertiary-container bg-tertiary-fixed px-2 py-1 rounded">On Track</span>
            </div>
            <p className="text-on-surface-variant text-sm font-medium mb-1">Total Hours This Week</p>
            <h3 className="text-3xl font-headline font-bold text-primary">{totalWeek.toFixed(1)}</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 shadow-[0_4px_20px_rgba(0,6,21,0.02)] group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-surface-container rounded-lg text-secondary">
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm font-medium mb-1">Pending Timesheets</p>
            <h3 className="text-3xl font-headline font-bold text-primary">{pendingCount}</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 shadow-[0_4px_20px_rgba(0,6,21,0.02)] group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-surface-container rounded-lg text-[#0094ac]">
                <span className="material-symbols-outlined">verified</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm font-medium mb-1">Approved Timesheets</p>
            <h3 className="text-3xl font-headline font-bold text-primary">{approvedCount}</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 shadow-[0_4px_20px_rgba(0,6,21,0.02)] group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-error-container rounded-lg text-error">
                <span className="material-symbols-outlined">event_busy</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm font-medium mb-1">Upcoming Deadlines</p>
            <div className="flex items-center gap-2">
              <h3 className="text-3xl font-headline font-bold text-primary">{deadlinesCount}</h3>
              <span className="text-[10px] bg-error-container text-error px-2 py-0.5 rounded font-bold">VISA / CONTRACT</span>
            </div>
          </div>
        </section>
        <section className="grid grid-cols-1 gap-8 mb-8">
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 shadow-[0_8px_32px_rgba(0,6,21,0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary-fixed/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="flex justify-between items-end mb-10 relative z-10">
              <div>
                <h4 className="text-lg font-headline font-bold text-primary mb-1">Weekly Timesheet Summary</h4>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                  <p className="text-xs text-on-surface-variant">Current Period: {chartPeriodLabel}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high rounded-full text-on-surface-variant text-xs font-semibold">
                  <span className={`w-1.5 h-1.5 rounded-full ${summaryDotClass}`}></span>
                  {summaryStatus}
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between h-48 gap-4 px-4 relative z-10">
              {[
                { key: "mon", label: "MON", h: hours.mon },
                { key: "tue", label: "TUE", h: hours.tue },
                { key: "wed", label: "WED", h: hours.wed },
                { key: "thu", label: "THU", h: hours.thu },
                { key: "fri", label: "FRI", h: hours.fri },
                { key: "sat", label: "ST", h: hours.sat },
                { key: "sun", label: "S", h: hours.sun },
              ].map((day) => (
                <div className="flex-1 flex flex-col items-center gap-4" key={day.key}>
                  <div className="w-full bg-surface-container-low rounded-t-lg relative group h-[100%] transition-all">
                    <div
                      className="absolute bottom-0 w-full bg-primary-container rounded-t-lg group-hover:bg-secondary transition-colors"
                      style={{ height: barPct(day.h) }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] px-2 py-1 rounded">
                      {Number(day.h).toFixed(1)}h
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 font-headline">{day.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-headline font-bold text-primary">Recent Activity</h4>
            <Link
              className="text-xs font-bold text-secondary hover:underline transition-all"
              to="/employee/timesheets"
            >
              View Full History
            </Link>
          </div>
          <div className="space-y-4">
            {recentTs.map((ts) => (
              <div
                className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg border-l-4 border-secondary-container"
                key={ts.id}
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary shadow-sm">
                  <span className="material-symbols-outlined text-xl">upload_file</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface">Timesheet {ts.status?.toLowerCase() || "updated"}</p>
                  <p className="text-xs text-on-surface-variant">Week starting {ts.weekStart}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold py-1 px-2 rounded bg-surface-container-highest text-on-surface">{ts.status}</span>
                </div>
              </div>
            ))}
            {recentDoc && (
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg border-l-4 border-tertiary-fixed-dim">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-on-tertiary-fixed-variant shadow-sm">
                  <span className="material-symbols-outlined text-xl">article</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface">Document &apos;{recentDoc.name}&apos; on file</p>
                  <p className="text-xs text-on-surface-variant">Expiry {recentDoc.expiryDate}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold py-1 px-2 rounded bg-tertiary-fixed text-on-tertiary-fixed">VERIFICATION</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg border-l-4 border-[#0094ac]">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0094ac] shadow-sm">
                <span className="material-symbols-outlined text-xl">verified_user</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-on-surface">Profile and payroll records synced</p>
                <p className="text-xs text-on-surface-variant">Enterprise directory</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold py-1 px-2 rounded bg-[#acedff] text-[#004e5c]">SYSTEM</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      <aside className="w-full md:w-80 bg-surface-container-low border-l border-outline-variant/10 p-8 flex flex-col gap-8">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 shadow-[0_12px_40px_rgba(0,6,21,0.04)] text-center">
          <div className="relative inline-block mb-4">
            {employee?.performance?.panelImage ? (
              <img alt={employee.name} className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-tertiary-fixed" src={employee.performance.panelImage} />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto ring-4 ring-tertiary-fixed bg-secondary-container text-white flex items-center justify-center text-lg font-bold">
                {firstName.slice(0, 1)}
              </div>
            )}
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#0094ac] rounded-full border-2 border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check
              </span>
            </div>
          </div>
          <h3 className="text-xl font-headline font-extrabold text-primary mb-1">{employee?.name ?? "Alex Sterling"}</h3>
          <p className="text-sm font-medium text-secondary mb-1">{employee?.role ?? "Senior Solutions Architect"}</p>
          <p className="text-xs text-on-surface-variant mb-6">{dept}</p>
          <div className="pt-6 border-t border-outline-variant/10 grid grid-cols-2 gap-4">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Employee ID</p>
              <p className="text-xs font-semibold text-primary">{displayId}</p>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Location</p>
              <p className="text-xs font-semibold text-primary">{loc}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h5 className="text-xs font-bold text-primary uppercase tracking-widest px-1">Quick Actions</h5>
          <Link
            className="w-full flex items-center gap-3 p-3 bg-primary-container text-white rounded-lg hover:bg-primary transition-all group"
            to="/employee/timesheets"
          >
            <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">add_circle</span>
            <span className="text-sm font-medium">New Timesheet</span>
          </Link>
          <Link
            className="w-full flex items-center gap-3 p-3 bg-white border border-outline-variant/30 text-on-surface rounded-lg hover:bg-surface-container-low transition-all group"
            to="/employee/documents"
          >
            <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-secondary transition-colors">cloud_upload</span>
            <span className="text-sm font-medium">Upload Document</span>
          </Link>
          <button
            type="button"
            className="w-full flex items-center gap-3 p-3 bg-white border border-outline-variant/30 text-on-surface rounded-lg hover:bg-surface-container-low transition-all group"
          >
            <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-secondary transition-colors">request_quote</span>
            <span className="text-sm font-medium">Expenses Claim</span>
          </button>
        </div>
        <div className="p-6 bg-[#000615] rounded-xl text-white relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
          <h5 className="text-xs font-bold text-[#acedff] uppercase tracking-widest mb-4">Critical Alerts</h5>
          <div className="space-y-4 relative z-10">
            {deadlinesCount > 0 ? (
              <div className="flex gap-3">
                <div className="w-1 h-auto bg-error rounded"></div>
                <div>
                  <p className="text-xs font-bold">Document deadlines</p>
                  <p className="text-[10px] text-slate-400">{deadlinesCount} item(s) need attention</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="w-1 h-auto bg-tertiary-fixed rounded"></div>
                <div>
                  <p className="text-xs font-bold">All clear</p>
                  <p className="text-[10px] text-slate-400">No urgent items</p>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <div className="w-1 h-auto bg-tertiary-fixed rounded"></div>
              <div>
                <p className="text-xs font-bold">Contract Update</p>
                <p className="text-[10px] text-slate-400">Review by Friday</p>
              </div>
            </div>
          </div>
          <button type="button" className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 text-[10px] font-bold rounded uppercase tracking-widest transition-colors border-none cursor-pointer">
            Resolve Alerts
          </button>
        </div>
      </aside>
    </main>
  );
}
