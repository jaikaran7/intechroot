import { useCallback, useEffect, useMemo, useState } from "react";
import { getEmployeeFromStore, replaceEmployeeTimesheets } from "../employeeEmployeesStore";
import { getEmployeeSessionId } from "../employeeSession";
import { addDaysISO, calculateTotal, getWeekStartISO, parseYMD, weekDayRows } from "../timesheetUtils";

const PROJECT_OPTIONS = ["Cloud Migration - Phase 2", "Internal Infrastructure", "Security Audit"];

const DEFAULT_TASKS = {
  mon: "System deployment and stress testing",
  tue: "Client meeting and requirements gathering",
  wed: "Documentation update and peer review",
  thu: "Firewall configuration and testing",
  fri: "Weekly debrief and future planning",
};

const DEFAULT_PROJECTS = {
  mon: PROJECT_OPTIONS[0],
  tue: PROJECT_OPTIONS[0],
  wed: PROJECT_OPTIONS[0],
  thu: PROJECT_OPTIONS[2],
  fri: PROJECT_OPTIONS[1],
};

const emptyWeek = () => ({ mon: 0, tue: 0, wed: 0, thu: 0, fri: 0 });

function ensureRowMeta(sheet) {
  const rm = sheet?.rowMeta || {};
  const keys = ["mon", "tue", "wed", "thu", "fri"];
  const next = { ...rm };
  keys.forEach((k) => {
    if (!next[k]) next[k] = { project: DEFAULT_PROJECTS[k], task: DEFAULT_TASKS[k] };
  });
  return next;
}

export default function EmployeeTimesheetsPage() {
  const employeeId = getEmployeeSessionId();
  const [storeVersion, setStoreVersion] = useState(0);
  const refresh = useCallback(() => setStoreVersion((v) => v + 1), []);

  const employee = useMemo(
    () => (employeeId ? getEmployeeFromStore(employeeId) : null),
    [employeeId, storeVersion],
  );

  const timesheets = useMemo(() => {
    const list = [...(employee?.timesheets ?? [])];
    return list.sort((a, b) => String(b.weekStart).localeCompare(String(a.weekStart)));
  }, [employee]);

  const currentWeekStart = getWeekStartISO(new Date());
  const [selectedId, setSelectedId] = useState(null);
  const [lastSavedLabel, setLastSavedLabel] = useState("Today at 04:32 PM");

  const active = useMemo(() => timesheets.find((t) => t.id === selectedId) ?? null, [timesheets, selectedId]);

  useEffect(() => {
    if (timesheets.length === 0) {
      setSelectedId(null);
      return;
    }
    if (selectedId && timesheets.some((t) => t.id === selectedId)) return;
    const draft = timesheets.find((t) => getWeekStartISO(t.weekStart) === currentWeekStart && t.status === "Draft");
    const any = timesheets.find((t) => getWeekStartISO(t.weekStart) === currentWeekStart);
    setSelectedId((draft || any || timesheets[0]).id);
  }, [timesheets, selectedId, currentWeekStart]);

  const weekStart = active?.weekStart ?? currentWeekStart;
  const dayRows = useMemo(() => weekDayRows(weekStart), [weekStart]);

  const [hours, setHours] = useState(emptyWeek());
  const [rowMeta, setRowMeta] = useState(() => ensureRowMeta({}));

  useEffect(() => {
    if (!active) {
      setHours(emptyWeek());
      setRowMeta(ensureRowMeta({}));
      return;
    }
    const wd = active.weekData || {};
    setHours({
      mon: Number(wd.mon ?? 0),
      tue: Number(wd.tue ?? 0),
      wed: Number(wd.wed ?? 0),
      thu: Number(wd.thu ?? 0),
      fri: Number(wd.fri ?? 0),
    });
    setRowMeta(ensureRowMeta(active));
  }, [active]);

  const weekRangeLabel = useMemo(() => {
    const start = parseYMD(weekStart);
    const end = parseYMD(addDaysISO(weekStart, 6));
    const o = { month: "short", day: "numeric", year: "numeric" };
    return `${start.toLocaleDateString("en-US", o)} - ${end.toLocaleDateString("en-US", o)}`;
  }, [weekStart]);

  const total = calculateTotal(hours);

  const persistSheet = (patch) => {
    if (!employeeId || !active) return;
    const nextList = timesheets.map((t) => (t.id === active.id ? { ...t, ...patch } : t));
    replaceEmployeeTimesheets(employeeId, nextList);
    refresh();
    setLastSavedLabel(
      `Today at ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`,
    );
  };

  const setHour = (key, val) => {
    const n = Number(val);
    setHours((h) => ({ ...h, [key]: Number.isNaN(n) ? 0 : n }));
  };

  const setMeta = (key, field, value) => {
    setRowMeta((m) => ({ ...m, [key]: { ...m[key], [field]: value } }));
  };

  const saveDraft = () => {
    if (!active) return;
    persistSheet({
      weekData: { ...hours },
      rowMeta: { ...rowMeta },
      status: "Draft",
      total: calculateTotal(hours),
    });
  };

  const submitTimesheet = () => {
    if (!active) return;
    persistSheet({
      weekData: { ...hours },
      rowMeta: { ...rowMeta },
      status: "Pending",
      total: calculateTotal(hours),
      rejectionNote: "",
    });
  };

  const addNewTimesheet = () => {
    if (!employeeId) return;
    const ws = currentWeekStart;
    if (timesheets.some((t) => getWeekStartISO(t.weekStart) === ws)) {
      const existing = timesheets.find((t) => getWeekStartISO(t.weekStart) === ws);
      setSelectedId(existing.id);
      return;
    }
    const id = `${employeeId}-${ws}`;
    const row = {
      id,
      weekStart: ws,
      weekData: { mon: 8, tue: 8, wed: 8, thu: 8, fri: 8 },
      rowMeta: ensureRowMeta({}),
      total: 40,
      status: "Draft",
      rejectionNote: "",
    };
    replaceEmployeeTimesheets(employeeId, [row, ...timesheets]);
    refresh();
    setSelectedId(id);
  };

  const canEdit = !active || active.status === "Draft";

  return (
    <>
      <main className="ml-64 pt-24 pb-12 px-8 min-h-screen bg-surface font-body text-on-background antialiased">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              type="button"
              className="px-6 py-2.5 bg-primary-container text-white font-semibold rounded-lg shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2"
              onClick={addNewTimesheet}
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add New Timesheet
            </button>
            {timesheets.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Week</span>
                <select
                  className="bg-surface-container-low border-none rounded-lg text-sm font-medium px-3 py-2 focus:ring-2 focus:ring-[#4cd7f6]/20"
                  value={selectedId ?? ""}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  {timesheets.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.weekStart} — {t.status}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary mb-2">Weekly Timesheet</h2>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">calendar_today</span>
                <span className="text-lg font-medium">Current Week ({weekRangeLabel})</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {active?.status === "Pending" && (
                <div className="px-4 py-2 rounded-full bg-[#FFF9C4] text-[#827717] text-xs font-bold tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    pending
                  </span>
                  PENDING APPROVAL
                </div>
              )}
              {active?.status === "Approved" && (
                <div className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  APPROVED
                </div>
              )}
              {active?.status === "Draft" && (
                <div className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-widest flex items-center gap-2">
                  DRAFT
                </div>
              )}
              <button type="button" className="material-symbols-outlined p-2 hover:bg-surface-container rounded-lg transition-colors text-slate-500 bg-transparent border-none cursor-pointer">
                print
              </button>
              <button type="button" className="material-symbols-outlined p-2 hover:bg-surface-container rounded-lg transition-colors text-slate-500 bg-transparent border-none cursor-pointer">
                more_vert
              </button>
            </div>
          </div>

          <div className="glass-card rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant">
                  <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px] w-48">Day</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px]">Project</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px]">Task</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px] text-right w-32">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {dayRows.map((row, idx) => {
                  const groupCls =
                    idx % 2 === 1
                      ? "bg-surface-container-low/30 group hover:bg-surface-container-lowest transition-colors"
                      : "group hover:bg-surface-container-lowest transition-colors";
                  const meta = rowMeta[row.key] || { project: PROJECT_OPTIONS[0], task: "" };
                  return (
                    <tr className={groupCls} key={row.key}>
                      <td className="px-8 py-6 font-semibold text-primary">
                        {row.label} <span className="block text-xs font-normal text-slate-500">{row.dateStr}</span>
                      </td>
                      <td className="px-6 py-6">
                        <select
                          className="bg-transparent border-none text-sm font-medium text-primary focus:ring-0 w-full"
                          disabled={!canEdit}
                          value={meta.project}
                          onChange={(e) => setMeta(row.key, "project", e.target.value)}
                        >
                          {PROJECT_OPTIONS.map((p) => (
                            <option key={p}>{p}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-6">
                        <input
                          className="bg-transparent border-none text-sm text-on-surface-variant focus:ring-0 w-full placeholder:italic"
                          disabled={!canEdit}
                          type="text"
                          value={meta.task}
                          onChange={(e) => setMeta(row.key, "task", e.target.value)}
                        />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <input
                          className="w-20 bg-surface-container-low border-none rounded-lg px-3 py-2 text-right text-sm font-bold text-[#0B1F3A] focus:ring-2 focus:ring-[#4cd7f6]/20"
                          disabled={!canEdit}
                          step="0.5"
                          type="number"
                          value={hours[row.key]}
                          onChange={(e) => setHour(row.key, e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-primary text-white">
                  <td className="px-8 py-5 font-bold uppercase tracking-widest text-xs" colSpan={3}>
                    Total Weekly Hours
                  </td>
                  <td className="px-8 py-5 text-right font-headline text-xl font-extrabold tracking-tight">
                    {total.toFixed(1)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 px-1">Rejection Notes &amp; Comments</h3>
              <div className="bg-surface-container-low min-h-[120px] rounded-xl border border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-slate-400">
                {active?.rejectionNote ? (
                  <p className="text-sm text-on-surface px-4 text-center">{active.rejectionNote}</p>
                ) : (
                  <>
                    <span className="material-symbols-outlined mb-2 text-3xl opacity-20">chat_bubble</span>
                    <p className="text-sm italic">No notes found for this submission.</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 px-1">Actions</h3>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-primary-container text-white font-bold hover:translate-y-[-2px] transition-all duration-200 shadow-md disabled:opacity-50 border-none cursor-pointer"
                disabled={!canEdit}
                onClick={submitTimesheet}
              >
                <span className="material-symbols-outlined text-xl">send</span>
                Submit Timesheet
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg border-2 border-outline-variant text-primary-container font-bold hover:bg-surface-container-low transition-all duration-200 bg-transparent border-solid cursor-pointer disabled:opacity-50"
                disabled={!canEdit}
                onClick={saveDraft}
              >
                <span className="material-symbols-outlined text-xl">save</span>
                Save Draft
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2">Last saved: {lastSavedLabel}</p>
            </div>
          </div>
        </div>
      </main>
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]">
        <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
          <pattern height="10" id="grid" patternUnits="userSpaceOnUse" width="10">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1"></path>
          </pattern>
          <rect fill="url(#grid)" height="100%" width="100%"></rect>
        </svg>
      </div>
    </>
  );
}
