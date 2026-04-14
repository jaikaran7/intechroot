import { useEffect, useMemo, useState } from "react";
import { getEmployeeFromStore, subscribeEmployeesStore } from "@/pages/Employee/employeeEmployeesStore";

/**
 * Timesheet history for one employee — embeds under Employee Details (no standalone chrome).
 */
export default function EmployeeTimesheetHistoryPanel({ id }) {
  const [storeVersion, setStoreVersion] = useState(0);
  useEffect(() => subscribeEmployeesStore(() => setStoreVersion((v) => v + 1)), []);

  const employee = useMemo(() => getEmployeeFromStore(id) || {}, [id, storeVersion]);
  const timesheets = useMemo(
    () =>
      [...(employee.timesheets || [])].sort((a, b) => String(b.weekStart).localeCompare(String(a.weekStart))),
    [employee],
  );
  const visibleTimesheets = timesheets;
  const totalRecords = timesheets.length;
  const showingStart = totalRecords === 0 ? 0 : 1;
  const showingEnd = totalRecords;

  const toISODate = (date) => date.toISOString().slice(0, 10);
  const addDaysISO = (isoDate, days) => {
    const d = new Date(isoDate);
    d.setDate(d.getDate() + days);
    return toISODate(d);
  };
  const formatMonthDay = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const formatMonthDayYear = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const totalHoursSubmitted = timesheets.reduce((sum, t) => sum + Number(t.total || 0), 0);
  const pendingApprovalHours = timesheets
    .filter((t) => t.status === "Pending")
    .reduce((sum, t) => sum + Number(t.total || 0), 0);
  const approvedThisMonthHours = timesheets
    .filter((t) => t.status === "Approved")
    .reduce((sum, t) => sum + Number(t.total || 0), 0);
  const pendingSubmissionCount = timesheets.filter((t) => t.status === "Pending" || t.status === "Draft").length;

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 pb-16">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-on-primary-container font-bold">Personnel File</span>
          <h2 className="font-headline font-extrabold text-5xl text-primary tracking-tighter leading-none">
            {employee.name || "Employee"}
          </h2>
          <div className="flex items-center gap-3 text-on-primary-container/80">
            <span className="font-mono text-xs bg-surface-container-high px-2 py-0.5 rounded">{employee.id || id}</span>
            <span className="h-1 w-1 bg-outline-variant rounded-full"></span>
            <span className="text-sm font-medium">{employee.role || "—"}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="bg-primary-container text-on-primary px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all monolith-shadow"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export Report
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-xl monolith-shadow flex flex-col justify-between group transition-all hover:bg-white/80">
          <span className="text-[11px] uppercase tracking-widest text-on-primary-container font-bold">Total Hours Submitted</span>
          <div className="mt-8 flex items-baseline gap-2">
            <span className="text-4xl font-headline font-extrabold text-primary">{totalHoursSubmitted.toFixed(1)}</span>
            <span className="text-sm text-on-primary-container font-medium">hrs</span>
          </div>
          <div className="mt-4 h-1 w-full bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary-container transition-all"
              style={{ width: `${Math.min(100, totalHoursSubmitted > 0 ? 82 : 0)}%` }}
            ></div>
          </div>
        </div>
        <div className="glass-card p-8 rounded-xl monolith-shadow flex flex-col justify-between group transition-all hover:bg-white/80">
          <span className="text-[11px] uppercase tracking-widest text-on-primary-container font-bold">Pending Approval</span>
          <div className="mt-8 flex items-baseline gap-2">
            <span className="text-4xl font-headline font-extrabold text-primary">{pendingApprovalHours.toFixed(1)}</span>
            <span className="text-sm text-on-primary-container font-medium">hrs</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-secondary-container">
            <span className="material-symbols-outlined text-lg">schedule</span>
            <span className="text-xs font-semibold">
              {pendingSubmissionCount === 0
                ? "No submissions awaiting review"
                : `${pendingSubmissionCount} submission${pendingSubmissionCount === 1 ? "" : "s"} awaiting review`}
            </span>
          </div>
        </div>
        <div className="glass-card p-8 rounded-xl monolith-shadow bg-primary-container/5 flex flex-col justify-between group transition-all hover:bg-white/80 border-tertiary-fixed-dim/20">
          <span className="text-[11px] uppercase tracking-widest text-on-primary-container font-bold">Approved This Month</span>
          <div className="mt-8 flex items-baseline gap-2">
            <span className="text-4xl font-headline font-extrabold text-primary">{approvedThisMonthHours.toFixed(1)}</span>
            <span className="text-sm text-on-primary-container font-medium">hrs</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-green-600">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            <span className="text-xs font-semibold">Targets achieved</span>
          </div>
        </div>
      </section>

      <section className="glass-card p-4 rounded-lg flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-primary-container">search</span>
          <input
            className="w-full pl-12 pr-4 py-2 bg-surface-container-low border-none rounded focus:ring-2 focus:ring-tertiary-fixed-dim transition-all text-sm"
            placeholder="Search by range or status..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            className="bg-surface-container-low border-none rounded text-sm px-4 py-2 font-medium text-on-primary-container focus:ring-2 focus:ring-tertiary-fixed-dim"
            defaultValue="all"
          >
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            className="bg-surface-container-low border-none rounded text-sm px-4 py-2 font-medium text-on-primary-container focus:ring-2 focus:ring-tertiary-fixed-dim"
            defaultValue="recent"
          >
            <option value="recent">Recent</option>
          </select>
          <button
            type="button"
            className="bg-surface-container-high p-2 rounded text-primary hover:bg-outline-variant/30 transition-colors"
          >
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </section>

      <section className="glass-card rounded-xl overflow-hidden monolith-shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary-container/5 border-b border-outline-variant/10">
            <tr>
              <th className="px-8 py-5 text-[11px] uppercase tracking-widest text-on-primary-container font-extrabold">Date Range</th>
              <th className="px-8 py-5 text-[11px] uppercase tracking-widest text-on-primary-container font-extrabold">Total Hours</th>
              <th className="px-8 py-5 text-[11px] uppercase tracking-widest text-on-primary-container font-extrabold">Status</th>
              <th className="px-8 py-5 text-[11px] uppercase tracking-widest text-on-primary-container font-extrabold">Submission Date</th>
              <th className="px-8 py-5 text-[11px] uppercase tracking-widest text-on-primary-container font-extrabold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {visibleTimesheets.map((timesheet, index) => {
              const endISO = addDaysISO(timesheet.weekStart, 4);
              const endYear = new Date(endISO).getFullYear();
              const dateRangeText = `${formatMonthDay(timesheet.weekStart)} - ${formatMonthDay(endISO)}, ${endYear}`;
              const submissionISO = addDaysISO(timesheet.weekStart, 5);
              const submissionText = timesheet.createdAt
                ? new Date(timesheet.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : formatMonthDayYear(submissionISO);
              const projectLine =
                timesheet.projectLabel || timesheet.rowMeta?.mon?.project || employee.client || employee.role || "—";

              const status = timesheet.status;
              const isPending = status === "Pending";
              const isApproved = status === "Approved";
              const isRejected = status === "Rejected";

              const pillClass = isPending
                ? "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200"
                : isApproved
                  ? "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider border border-green-200"
                  : isRejected
                    ? "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-wider border border-red-200"
                    : "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-bold uppercase tracking-wider border border-outline-variant";

              const dotClass = isPending
                ? "h-1.5 w-1.5 rounded-full bg-amber-500"
                : isApproved
                  ? "h-1.5 w-1.5 rounded-full bg-green-500"
                  : isRejected
                    ? "h-1.5 w-1.5 rounded-full bg-red-500"
                    : "h-1.5 w-1.5 rounded-full bg-on-surface-variant";

              return (
                <tr
                  className={
                    index % 2 === 1
                      ? "bg-surface-container-low/30 group hover:bg-surface-container-low transition-colors"
                      : "group hover:bg-surface-container-low transition-colors"
                  }
                  key={timesheet.id}
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-headline font-bold text-primary">{dateRangeText}</span>
                      <span className="text-xs text-on-primary-container">{projectLine}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-mono text-lg font-bold text-primary">{Number(timesheet.total).toFixed(1)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={pillClass}>
                      <span className={dotClass}></span>
                      {timesheet.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-on-primary-container font-medium">{submissionText}</td>
                  <td className="px-8 py-6 text-right">
                    <button
                      type="button"
                      className="p-2 rounded-lg text-primary hover:bg-tertiary-fixed-dim/20 transition-all active:scale-90"
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-8 py-6 bg-surface-container-lowest border-t border-outline-variant/10 flex items-center justify-between">
          <span className="text-xs text-on-primary-container font-medium">
            Showing {showingStart}-{showingEnd} of {totalRecords} records
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-primary-container hover:text-primary transition-colors disabled:opacity-30"
              disabled
            >
              Prev
            </button>
            <button
              type="button"
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-tertiary-fixed-dim"
            >
              1
            </button>
            <button
              type="button"
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-primary-container hover:text-primary transition-colors"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
