import { useEffect, useMemo, useState } from "react";
import {
  getEmployeeFromStore,
  patchEmployeeTimesheet,
  replaceEmployeeTimesheets,
  subscribeEmployeesStore,
} from "./employeeEmployeesStore";
import { getEmployeeSessionId } from "./employeeSession";
import { addDaysISO, calculateTotal, getWeekStartISO, parseYMD } from "./timesheetUtils";

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri"];

function formatWorkWeekRangeLabel(weekStartISO) {
  const start = parseYMD(weekStartISO);
  const end = parseYMD(addDaysISO(weekStartISO, 4));
  const a = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const b = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${a} – ${b}`;
}

function projectSubtext(sheet, employee) {
  return (
    sheet.projectLabel ||
    sheet.rowMeta?.mon?.project ||
    sheet.rowMeta?.tue?.project ||
    employee?.client ||
    employee?.role ||
    "—"
  );
}

function canEmployeeEditTimesheet(status) {
  return status === "Draft" || status === "Pending";
}

function formatRejectionTimestamp(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

const defaultWeekData = () => ({ mon: 8, tue: 8, wed: 8, thu: 8, fri: 8 });

export default function EmployeeTimesheetsPage() {
  const employeeId = getEmployeeSessionId();
  const [storeVersion, setStoreVersion] = useState(0);

  useEffect(() => subscribeEmployeesStore(() => setStoreVersion((v) => v + 1)), []);

  const employee = useMemo(
    () => (employeeId ? getEmployeeFromStore(employeeId) : null),
    [employeeId, storeVersion],
  );

  const timesheets = useMemo(() => {
    const list = [...(employee?.timesheets ?? [])];
    return list.sort((a, b) => String(b.weekStart).localeCompare(String(a.weekStart)));
  }, [employee]);

  const [editingRowId, setEditingRowId] = useState(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newWeekPick, setNewWeekPick] = useState("");
  const [newProjectLabel, setNewProjectLabel] = useState("");
  const [newModalError, setNewModalError] = useState("");
  /** @type {null | { sheetId: string; weekLabel: string; note: string; rejectedAt: string | null }} */
  const [rejectionFeedback, setRejectionFeedback] = useState(null);
  const [viewRowId, setViewRowId] = useState(null);

  const openRejectionFeedbackModal = (sheet) => {
    setRejectionFeedback({
      sheetId: sheet.id,
      weekLabel: formatWorkWeekRangeLabel(sheet.weekStart),
      note: sheet.rejectionNote || "No details were provided.",
      rejectedAt: sheet.rejectedAt ?? null,
    });
  };

  const acknowledgeAndEditRejected = () => {
    if (!employeeId || !rejectionFeedback) return;
    patchEmployeeTimesheet(employeeId, rejectionFeedback.sheetId, {
      status: "Draft",
      rejectionNote: "",
      rejectedAt: "",
    });
    setEditingRowId(rejectionFeedback.sheetId);
    setRejectionFeedback(null);
  };

  useEffect(() => {
    setEditingRowId((prev) => {
      if (!prev) return prev;
      const row = timesheets.find((t) => t.id === prev);
      if (!row || !canEmployeeEditTimesheet(row.status)) return null;
      return prev;
    });
  }, [timesheets]);

  const openNewModal = () => {
    const mon = getWeekStartISO(new Date());
    setNewWeekPick(mon);
    setNewProjectLabel("");
    setNewModalError("");
    setNewModalOpen(true);
  };

  const submitNewTimesheet = () => {
    if (!employeeId || !newWeekPick) {
      setNewModalError("Choose a week.");
      return;
    }
    const ws = getWeekStartISO(newWeekPick);
    if (timesheets.some((t) => getWeekStartISO(t.weekStart) === ws)) {
      setNewModalError("You already have a timesheet for this week.");
      return;
    }
    const id = `${employeeId}-${ws}`;
    const row = {
      id,
      weekStart: ws,
      weekData: defaultWeekData(),
      rowMeta: employee?.timesheets?.[0]?.rowMeta,
      total: calculateTotal(defaultWeekData()),
      status: "Draft",
      rejectionNote: "",
      projectLabel: newProjectLabel.trim(),
      createdAt: new Date().toISOString(),
    };
    replaceEmployeeTimesheets(employeeId, [row, ...timesheets]);
    setNewModalOpen(false);
    setEditingRowId(id);
  };

  const handleDayChange = (tsId, day, value) => {
    if (!employeeId) return;
    const emp = getEmployeeFromStore(employeeId);
    const sheet = emp?.timesheets?.find((t) => t.id === tsId);
    if (!sheet || !canEmployeeEditTimesheet(sheet.status)) return;
    const normalizedValue = String(value).replace(/[^0-9.]/g, "");
    const numericValue = Number(normalizedValue);
    const updatedWeekData = {
      ...(sheet.weekData || {}),
      [day]: Number.isNaN(numericValue) ? 0 : numericValue,
    };
    patchEmployeeTimesheet(employeeId, tsId, { weekData: updatedWeekData });
  };

  const submitDraftRow = (tsId) => {
    if (!employeeId) return;
    const emp = getEmployeeFromStore(employeeId);
    const sheet = emp?.timesheets?.find((t) => t.id === tsId);
    if (!sheet || sheet.status !== "Draft") return;
    patchEmployeeTimesheet(employeeId, tsId, { status: "Pending", rejectionNote: "" });
    setEditingRowId(null);
  };

  const viewRow = useMemo(() => timesheets.find((t) => t.id === viewRowId) ?? null, [timesheets, viewRowId]);

  if (!employeeId) {
    return (
      <main className="ml-64 pt-24 pb-12 px-8 min-h-screen bg-surface font-body">
        <p className="text-slate-600">Sign in to manage timesheets.</p>
      </main>
    );
  }

  return (
    <>
      <main className="ml-64 pt-24 pb-12 px-8 min-h-screen bg-surface font-body text-on-background antialiased">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary">Weekly Timesheet</h2>
              <p className="text-on-primary-container mt-2 font-body">Your submissions and history (newest first).</p>
            </div>
            <button
              type="button"
              className="px-6 py-2.5 bg-primary-container text-white font-semibold rounded-lg shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2"
              onClick={openNewModal}
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add New Timesheet
            </button>
          </div>

          <section className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Date Range
                    </th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      M
                    </th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      T
                    </th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      W
                    </th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      T
                    </th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      F
                    </th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">
                      Total
                    </th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      <div className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">edit</span>
                        <span>Edit</span>
                      </div>
                    </th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {timesheets.map((sheet, rowIndex) => {
                    const stripeClass = rowIndex % 2 === 1 ? "bg-surface-container-low/30" : "";
                    const weekData = {
                      mon: Number(sheet?.weekData?.mon ?? 0),
                      tue: Number(sheet?.weekData?.tue ?? 0),
                      wed: Number(sheet?.weekData?.wed ?? 0),
                      thu: Number(sheet?.weekData?.thu ?? 0),
                      fri: Number(sheet?.weekData?.fri ?? 0),
                    };
                    const total = calculateTotal(weekData);
                    const canEdit = employee && canEmployeeEditTimesheet(sheet.status);
                    const isRejected = sheet.status === "Rejected";
                    return (
                      <tr
                        className={`${stripeClass} hover:bg-slate-50 transition-colors ${isRejected ? "cursor-pointer" : ""}`}
                        key={sheet.id}
                        onClick={() => {
                          if (isRejected) openRejectionFeedbackModal(sheet);
                        }}
                      >
                        <td className={`px-8 py-5 ${sheet.status === "Rejected" ? "border-l-4 border-error" : ""}`}>
                          <p className="text-sm font-bold text-primary">{formatWorkWeekRangeLabel(sheet.weekStart)}</p>
                          {editingRowId === sheet.id && canEdit ? (
                            <input
                              className="mt-1 w-full max-w-[16rem] text-[10px] text-slate-600 border border-slate-200 rounded px-2 py-1"
                              defaultValue={projectSubtext(sheet, employee)}
                              key={`${sheet.id}-proj-${sheet.projectLabel ?? ""}`}
                              placeholder="Project / Client"
                              onBlur={(e) => {
                                const v = e.target.value.trim();
                                patchEmployeeTimesheet(employeeId, sheet.id, { projectLabel: v });
                              }}
                            />
                          ) : (
                            <p className="text-[10px] text-slate-400">{projectSubtext(sheet, employee)}</p>
                          )}
                        </td>
                        {DAY_KEYS.map((day) => (
                          <td className="px-6 py-5 text-center text-sm font-medium" key={`${sheet.id}-${day}`}>
                            {editingRowId === sheet.id && canEdit ? (
                              <input
                                className="w-12 bg-transparent border border-slate-200 rounded text-center text-sm font-medium focus:ring-0"
                                onChange={(e) => handleDayChange(sheet.id, day, e.target.value)}
                                type="text"
                                value={weekData[day]}
                              />
                            ) : (
                              Number(weekData[day]).toFixed(1)
                            )}
                          </td>
                        ))}
                        <td className="px-8 py-5 text-right text-sm font-extrabold text-primary">{total.toFixed(1)}</td>
                        <td className="px-8 py-5">
                          <span
                            className={
                              sheet.status === "Approved"
                                ? "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 uppercase tracking-tight"
                                : sheet.status === "Rejected"
                                  ? "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-error-container text-error uppercase tracking-tight cursor-pointer"
                                  : sheet.status === "Draft"
                                    ? "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 uppercase tracking-tight"
                                    : "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 uppercase tracking-tight"
                            }
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                sheet.status === "Approved"
                                  ? "bg-emerald-500"
                                  : sheet.status === "Rejected"
                                    ? "bg-error"
                                    : sheet.status === "Draft"
                                      ? "bg-slate-400"
                                      : "bg-amber-500"
                              }`}
                            ></span>
                            {sheet.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <button
                            type="button"
                            className={`w-8 h-8 inline-flex items-center justify-center rounded-lg border text-slate-500 transition-all ${
                              sheet.status === "Approved"
                                ? "border-slate-100 opacity-40 cursor-not-allowed"
                                : isRejected
                                  ? "border-slate-200 hover:text-primary hover:bg-slate-50"
                                  : canEdit
                                    ? "border-slate-200 hover:text-primary hover:bg-slate-50"
                                    : "border-slate-100 opacity-40 cursor-not-allowed"
                            }`}
                            disabled={sheet.status === "Approved"}
                            title={isRejected ? "View feedback and edit" : "Edit"}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (sheet.status === "Approved") return;
                              if (isRejected) {
                                openRejectionFeedbackModal(sheet);
                                return;
                              }
                              setEditingRowId((p) => (p === sheet.id ? null : sheet.id));
                            }}
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                        </td>
                        <td className="px-8 py-5 text-right">
                          {sheet.status === "Draft" && (
                            <button
                              type="button"
                              className="px-3 py-1.5 text-[10px] font-bold bg-primary-container text-white rounded-lg uppercase tracking-tight hover:shadow-md transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                submitDraftRow(sheet.id);
                              }}
                            >
                              Submit
                            </button>
                          )}
                          {sheet.status === "Pending" && <span className="text-[10px] text-slate-400">—</span>}
                          {sheet.status === "Approved" && (
                            <button
                              type="button"
                              className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-50"
                              title="View"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewRowId(sheet.id);
                              }}
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </button>
                          )}
                          {isRejected && (
                            <span className="text-[10px] font-medium text-slate-500">Tap row for details</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {timesheets.length === 0 && (
                    <tr>
                      <td className="px-8 py-8 text-sm text-slate-500" colSpan={10}>
                        No timesheets yet. Add a new timesheet to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {newModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md font-body">
          <div className="glass-card rounded-xl p-6 w-[min(92vw,28rem)]">
            <h4 className="text-lg font-bold text-primary mb-3">New timesheet</h4>
            <p className="text-xs text-slate-500 mb-4">Pick the week (Monday–Friday). A date in that week is fine—we align to the Monday start.</p>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Week *</label>
            <input
              type="date"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm mb-4"
              value={newWeekPick}
              onChange={(e) => setNewWeekPick(e.target.value)}
            />
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Project / Client
            </label>
            <input
              type="text"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm mb-2"
              placeholder="Optional"
              value={newProjectLabel}
              onChange={(e) => setNewProjectLabel(e.target.value)}
            />
            {newModalError && <p className="text-xs text-error mb-2">{newModalError}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold border border-slate-200 rounded"
                onClick={() => setNewModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold bg-primary-container text-white rounded"
                onClick={submitNewTimesheet}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectionFeedback && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md p-4 font-body">
          <div className="relative bg-white rounded-xl shadow-xl shadow-slate-900/10 w-full max-w-md p-8 border border-slate-100">
            <button
              type="button"
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Dismiss"
              onClick={() => setRejectionFeedback(null)}
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
            <div className="flex flex-col items-center text-center pt-2">
              <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center mb-5 shadow-md shadow-red-500/20">
                <span className="material-symbols-outlined text-3xl text-white font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                  priority_high
                </span>
              </div>
              <h4 className="text-xl font-extrabold text-[#0B1F3A] font-headline tracking-tight">Rejection feedback</h4>
              <p className="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
                Your timesheet for <span className="font-semibold text-slate-700">{rejectionFeedback.weekLabel}</span> was declined
              </p>
            </div>
            <div className="mt-6">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#5c7a8a] mb-2">Admin comments</p>
              <div className="w-full bg-slate-50 border border-slate-200/80 rounded-lg p-4 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {rejectionFeedback.note}
              </div>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="material-symbols-outlined text-base text-slate-400">history</span>
              Rejection date: {formatRejectionTimestamp(rejectionFeedback.rejectedAt)}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full py-3 px-4 text-sm font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setRejectionFeedback(null)}
              >
                Dismiss
              </button>
              <button
                type="button"
                className="w-full py-3 px-4 text-sm font-bold rounded-lg bg-[#0B1F3A] text-white hover:bg-slate-800 transition-colors"
                onClick={acknowledgeAndEditRejected}
              >
                Acknowledge &amp; edit
              </button>
            </div>
          </div>
        </div>
      )}

      {viewRowId && viewRow && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md font-body">
          <div className="glass-card rounded-xl p-6 w-[min(92vw,36rem)]">
            <h4 className="text-lg font-bold text-primary mb-1">Timesheet</h4>
            <p className="text-sm text-slate-500 mb-4">{formatWorkWeekRangeLabel(viewRow.weekStart)}</p>
            <p className="text-xs text-slate-400 mb-4">{projectSubtext(viewRow, employee)}</p>
            <div className="grid grid-cols-5 gap-2 text-center text-sm mb-4">
              {DAY_KEYS.map((d) => (
                <div key={d} className="bg-slate-50 rounded-lg py-2">
                  <div className="text-[10px] font-bold uppercase text-slate-400">{d}</div>
                  <div className="font-extrabold text-primary">{Number(viewRow.weekData?.[d] ?? 0).toFixed(1)}</div>
                </div>
              ))}
            </div>
            <p className="text-right text-sm font-extrabold text-primary">
              Total: {calculateTotal(viewRow.weekData || {}).toFixed(1)}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold bg-primary-container text-white rounded"
                onClick={() => setViewRowId(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]">
        <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
          <pattern height="10" id="grid-ts" patternUnits="userSpaceOnUse" width="10">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1"></path>
          </pattern>
          <rect fill="url(#grid-ts)" height="100%" width="100%"></rect>
        </svg>
      </div>
    </>
  );
}
