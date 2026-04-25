import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { timesheetsService } from "../../services/timesheets.service";
import {
  TIMESHEET_DAY_KEYS,
  addDaysISO,
  buildWeekDataForPeriod,
  calculateTotal,
  formatHourCell,
  formatTimesheetRangeLabel,
  formatWeekOfCalendarRange,
  formatWeekRangeWithWeekdays,
  getPickerWeekBounds,
  getWeekStartISO,
  parseYMD,
  toYMD,
  toYmdFromAny,
  weekMondayISOFromDb,
} from "./timesheetUtils";

const DAY_HEADER_SHORT = { mon: "M", tue: "T", wed: "W", thu: "T", fri: "F", sat: "ST", sun: "S" };

const NAV_DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatNavDayCell(mondayISO, index) {
  const d = parseYMD(mondayISO);
  d.setDate(d.getDate() + index);
  const start = parseYMD(mondayISO);
  const end = parseYMD(addDaysISO(mondayISO, 6));
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) return String(d.getDate());
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
  // Only drafts and rejected rows are editable in the grid (pending = awaiting review, read-only).
  return status === "Draft" || status === "Rejected";
}

function formatRejectionTimestamp(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

function weekDataInputFromSheet(sheet) {
  const o = {};
  TIMESHEET_DAY_KEYS.forEach((k) => {
    const v = sheet.weekData?.[k];
    if (v === null || v === undefined || v === "") o[k] = "";
    else o[k] = String(v);
  });
  return o;
}

function weekDataPayloadFromInput(input) {
  const o = {};
  TIMESHEET_DAY_KEYS.forEach((k) => {
    const t = String(input[k] ?? "").trim();
    if (t === "") o[k] = null;
    else {
      const n = Number(t);
      o[k] = Number.isNaN(n) ? null : Math.min(24, Math.max(0, n));
    }
  });
  return o;
}

export default function EmployeeTimesheetsPage() {
  const { employeeId } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: tsData, isError: timesheetsQueryError, refetch: refetchTimesheets } = useQuery({
    queryKey: ['timesheets', employeeId],
    queryFn: () => timesheetsService.getByEmployee(employeeId, { limit: 50 }),
    staleTime: 30_000,
    enabled: !!employeeId,
    retry: 1,
  });

  const mergeTimesheetIntoCache = (newSheet) => {
    queryClient.setQueryData(['timesheets', employeeId], (old) => {
      if (!old || !Array.isArray(old.data)) return old;
      const list = old.data;
      const idx = list.findIndex((t) => t.id === newSheet.id);
      const nextList = idx >= 0 ? list.map((t) => (t.id === newSheet.id ? newSheet : t)) : [newSheet, ...list];
      nextList.sort((a, b) => String(b.weekStart).localeCompare(String(a.weekStart)));
      const meta =
        old.meta && idx < 0 ? { ...old.meta, total: (old.meta.total ?? list.length) + 1 } : old.meta;
      return { ...old, data: nextList, meta };
    });
    queryClient.invalidateQueries({ queryKey: ['timesheets', employeeId] });
    queryClient.invalidateQueries({ queryKey: ['timesheets'] });
  };

  const saveDraftMutation = useMutation({
    mutationFn: (data) => timesheetsService.saveDraft(employeeId, data),
    onSuccess: (newSheet) => {
      mergeTimesheetIntoCache(newSheet);
      setDraftEdit((prev) =>
        prev?.id === newSheet.id ? { id: newSheet.id, weekData: weekDataInputFromSheet(newSheet) } : prev,
      );
    },
  });

  const submitApprovalMutation = useMutation({
    mutationFn: (timesheetId) => timesheetsService.submitForApproval(employeeId, timesheetId),
    onSuccess: (updated) => mergeTimesheetIntoCache(updated),
  });

  const employee = null; // employee data not needed here directly

  /** All UI state must be declared before memos that read it (avoids TDZ / "Cannot access before initialization"). */
  const [editingRowId, setEditingRowId] = useState(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  /** Monday `YYYY-MM-DD` for the new-timesheet week navigator. */
  const [pickerWeekMonday, setPickerWeekMonday] = useState("");
  const [newProjectLabel, setNewProjectLabel] = useState("");
  const [newModalError, setNewModalError] = useState("");
  /** @type {null | { sheetId: string; weekLabel: string; note: string; rejectedAt: string | null }} */
  const [rejectionFeedback, setRejectionFeedback] = useState(null);
  const [viewRowId, setViewRowId] = useState(null);
  /** Local hour strings while editing a draft/rejected row `{ id, weekData }`. */
  const [draftEdit, setDraftEdit] = useState(null);

  const timesheets = useMemo(() => {
    const list = tsData?.data;
    const arr = Array.isArray(list) ? [...list] : [];
    return arr.sort((a, b) => String(b.weekStart ?? "").localeCompare(String(a.weekStart ?? "")));
  }, [tsData]);

  const pickerWeekSelection = useMemo(() => {
    if (!pickerWeekMonday || !/^\d{4}-\d{2}-\d{2}$/.test(pickerWeekMonday)) return null;
    try {
      return getPickerWeekBounds(pickerWeekMonday, new Date());
    } catch {
      return null;
    }
  }, [pickerWeekMonday]);

  const hasTimesheetForPickerWeek = useMemo(
    () =>
      Boolean(
        pickerWeekSelection &&
          timesheets.some((t) => weekMondayISOFromDb(t.weekStart) === pickerWeekSelection.mondayISO),
      ),
    [timesheets, pickerWeekSelection],
  );

  const openRejectionFeedbackModal = (sheet) => {
    setRejectionFeedback({
      sheetId: sheet.id,
      weekLabel: formatTimesheetRangeLabel(sheet),
      note: sheet.rejectionNote || "No details were provided.",
      rejectedAt: sheet.rejectedAt ?? null,
    });
  };

  const acknowledgeAndEditRejected = () => {
    if (!rejectionFeedback) return;
    const row = timesheets.find((t) => t.id === rejectionFeedback.sheetId);
    setEditingRowId(rejectionFeedback.sheetId);
    if (row) setDraftEdit({ id: row.id, weekData: weekDataInputFromSheet(row) });
    setRejectionFeedback(null);
  };

  useEffect(() => {
    setEditingRowId((prev) => {
      if (!prev) return prev;
      const row = timesheets.find((t) => t.id === prev);
      if (!row || !canEmployeeEditTimesheet(row.status)) {
        setDraftEdit(null);
        return null;
      }
      return prev;
    });
  }, [timesheets]);

  const openNewModal = () => {
    setNewProjectLabel("");
    setNewModalError("");
    setPickerWeekMonday(getWeekStartISO(new Date()));
    setNewModalOpen(true);
  };

  const shiftPickerWeek = (deltaWeeks) => {
    const curMon = getWeekStartISO(new Date());
    setPickerWeekMonday((prev) => {
      const base = prev && /^\d{4}-\d{2}-\d{2}$/.test(prev) ? prev : curMon;
      const d = parseYMD(base);
      d.setDate(d.getDate() + deltaWeeks * 7);
      const next = toYMD(d);
      if (deltaWeeks > 0 && next > curMon) return base;
      return next;
    });
    setNewModalError("");
  };

  const submitNewTimesheet = () => {
    if (!employeeId) {
      setNewModalError("Not signed in.");
      return;
    }
    if (!pickerWeekSelection) {
      setNewModalError("Could not determine this week. Try again.");
      return;
    }
    const newPeriodStart = pickerWeekSelection.periodStart;
    const newPeriodEnd = pickerWeekSelection.periodEnd;
    const anchorMonday = pickerWeekSelection.mondayISO;
    const todayStr = toYMD(new Date());
    if (newPeriodEnd > todayStr) {
      setNewModalError("Dates cannot be in the future.");
      return;
    }
    if (hasTimesheetForPickerWeek) {
      setNewModalError("You already have a timesheet for this week.");
      return;
    }
    const weekData = buildWeekDataForPeriod(newPeriodStart, newPeriodEnd);
    saveDraftMutation.mutate(
      {
        weekStart: anchorMonday,
        weekData,
        periodStart: newPeriodStart,
        periodEnd: newPeriodEnd,
        projectLabel: newProjectLabel.trim() || undefined,
      },
      {
        onSuccess: () => {
          setNewModalOpen(false);
          setNewModalError("");
        },
        onError: (err) => {
          const body = err.response?.data;
          const detailMsg = Array.isArray(body?.error?.details) ? body.error.details[0]?.message : null;
          const msg =
            body?.error?.message ||
            detailMsg ||
            err.message ||
            "Could not create timesheet. Please try again.";
          setNewModalError(msg);
        },
      },
    );
  };

  const handleDayChange = (day, value) => {
    setDraftEdit((prev) => {
      if (!prev) return prev;
      return { ...prev, weekData: { ...prev.weekData, [day]: value } };
    });
  };

  const buildSaveDraftBody = (sheet) => {
    const weekStart = weekMondayISOFromDb(sheet.weekStart);
    const weekData =
      draftEdit && draftEdit.id === sheet.id ? weekDataPayloadFromInput(draftEdit.weekData) : weekDataPayloadFromInput(weekDataInputFromSheet(sheet));
    const body = { weekStart, weekData };
    const ps = sheet.periodStart != null && sheet.periodStart !== "" ? toYmdFromAny(sheet.periodStart) : "";
    const pe = sheet.periodEnd != null && sheet.periodEnd !== "" ? toYmdFromAny(sheet.periodEnd) : "";
    if (ps && pe) {
      body.periodStart = ps;
      body.periodEnd = pe;
    }
    return body;
  };

  const saveRowDraft = (sheet) => {
    saveDraftMutation.mutate(buildSaveDraftBody(sheet));
  };

  const sendRowForApproval = async (sheet) => {
    try {
      if (draftEdit?.id === sheet.id && editingRowId === sheet.id) {
        await saveDraftMutation.mutateAsync(buildSaveDraftBody(sheet));
      }
      await submitApprovalMutation.mutateAsync(sheet.id);
      setEditingRowId(null);
      setDraftEdit(null);
    } catch (err) {
      const body = err.response?.data;
      const msg = body?.error?.message || err.message || "Could not submit for approval.";
      window.alert(msg);
    }
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
        <div className="max-w-[82rem] mx-auto space-y-8">
          {timesheetsQueryError ? (
            <div
              className="flex flex-col gap-3 rounded-xl border border-error/25 bg-error-container/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              role="alert"
            >
              <p className="text-sm font-medium text-on-surface">We couldn&apos;t load your timesheets. Check your connection and try again.</p>
              <button
                type="button"
                className="shrink-0 rounded-lg bg-primary-container px-4 py-2 text-xs font-bold text-white"
                onClick={() => void refetchTimesheets()}
              >
                Retry
              </button>
            </div>
          ) : null}
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
            <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 min-w-[13.5rem] text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Date Range
                    </th>
                    <th className="px-4 py-4 w-[3.75rem] min-w-[3.75rem] text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      M
                    </th>
                    <th className="px-4 py-4 w-[3.75rem] min-w-[3.75rem] text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      T
                    </th>
                    <th className="px-4 py-4 w-[3.75rem] min-w-[3.75rem] text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      W
                    </th>
                    <th className="px-4 py-4 w-[3.75rem] min-w-[3.75rem] text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      T
                    </th>
                    <th className="px-4 py-4 w-[3.75rem] min-w-[3.75rem] text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      F
                    </th>
                    <th className="px-4 py-4 w-[3.75rem] min-w-[3.75rem] text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      ST
                    </th>
                    <th className="px-4 py-4 w-[3.75rem] min-w-[3.75rem] text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      S
                    </th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">
                      Total
                    </th>
                    <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-2 py-4 w-[2.75rem] text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
                      <div className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">edit</span>
                        <span>Edit</span>
                      </div>
                    </th>
                    <th className="px-3 py-4 w-[14rem] min-w-[14rem] text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {timesheets.map((sheet, rowIndex) => {
                    const stripeClass = rowIndex % 2 === 1 ? "bg-surface-container-low/30" : "";
                    const canEdit = canEmployeeEditTimesheet(sheet.status);
                    const isRejected = sheet.status === "Rejected";
                    const isRowEditing = editingRowId === sheet.id && canEdit && draftEdit?.id === sheet.id;
                    const rowTotal = isRowEditing
                      ? calculateTotal(weekDataPayloadFromInput(draftEdit.weekData))
                      : calculateTotal(sheet.weekData ?? {});
                    return (
                      <tr className={`${stripeClass} hover:bg-slate-50 transition-colors`} key={sheet.id}>
                        <td className={`px-6 py-5 ${sheet.status === "Rejected" ? "border-l-4 border-error" : ""}`}>
                          <p className="text-sm font-bold text-primary whitespace-nowrap">{formatTimesheetRangeLabel(sheet)}</p>
                          <p className="text-[10px] text-slate-400">{projectSubtext(sheet, employee)}</p>
                          {isRejected && (
                            <button
                              type="button"
                              className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-container/15 text-secondary text-[11px] font-bold hover:bg-secondary-container/25 transition-colors"
                              onClick={() => openRejectionFeedbackModal(sheet)}
                            >
                              View admin feedback
                            </button>
                          )}
                        </td>
                        {TIMESHEET_DAY_KEYS.map((day) => (
                          <td className="px-4 py-5 w-[3.75rem] min-w-[3.75rem] text-center text-sm font-medium align-middle" key={`${sheet.id}-${day}`}>
                            {isRowEditing ? (
                              <input
                                className="w-11 max-w-[2.75rem] h-8 mx-auto box-border border border-slate-200 rounded px-0.5 text-center text-xs font-medium leading-none bg-white focus:ring-1 focus:ring-primary-container/40 focus:border-primary-container/50"
                                inputMode="decimal"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleDayChange(day, e.target.value)}
                                type="text"
                                value={draftEdit.weekData[day] ?? ""}
                              />
                            ) : (
                              formatHourCell(sheet.weekData?.[day])
                            )}
                          </td>
                        ))}
                        <td className="px-8 py-5 text-right text-sm font-extrabold text-primary">{rowTotal.toFixed(1)}</td>
                        <td className="px-8 py-5">
                          {sheet.status === "Rejected" ? (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-error-container text-error uppercase tracking-tight cursor-pointer hover:opacity-90 font-body"
                              onClick={() => openRejectionFeedbackModal(sheet)}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-error" />
                              {sheet.status}
                            </button>
                          ) : (
                            <span
                              className={
                                sheet.status === "Approved"
                                  ? "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 uppercase tracking-tight"
                                  : sheet.status === "Draft"
                                    ? "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 uppercase tracking-tight"
                                    : "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 uppercase tracking-tight"
                              }
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  sheet.status === "Approved"
                                    ? "bg-emerald-500"
                                    : sheet.status === "Draft"
                                      ? "bg-slate-400"
                                      : "bg-amber-500"
                                }`}
                              />
                              {sheet.status}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-5 text-center align-middle">
                          {isRowEditing ? (
                            <button
                              type="button"
                              className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-error transition-all"
                              title="Close without saving"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingRowId(null);
                                setDraftEdit(null);
                              }}
                            >
                              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>
                                close
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={`w-7 h-7 inline-flex items-center justify-center rounded-lg border text-slate-500 transition-all ${
                                sheet.status === "Approved"
                                  ? "border-slate-100 opacity-40 cursor-not-allowed"
                                  : isRejected
                                    ? "border-slate-200 hover:text-primary hover:bg-slate-50"
                                    : canEdit
                                      ? "border-slate-200 hover:text-primary hover:bg-slate-50"
                                      : "border-slate-100 opacity-40 cursor-not-allowed"
                              }`}
                              disabled={sheet.status === "Approved"}
                              title={isRejected ? "Edit hours" : "Edit"}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (sheet.status === "Approved") return;
                                setDraftEdit({ id: sheet.id, weekData: weekDataInputFromSheet(sheet) });
                                setEditingRowId(sheet.id);
                              }}
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                          )}
                        </td>
                        <td className="px-2 py-5 w-[14rem] min-w-[14rem] text-right align-middle">
                          <div className="flex items-center justify-end gap-1.5 ml-auto whitespace-nowrap">
                            {canEdit && (
                              <>
                                {isRowEditing && (
                                  <button
                                    type="button"
                                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-primary-container text-white shadow-sm hover:bg-primary hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                    disabled={saveDraftMutation.isPending}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      saveRowDraft(sheet);
                                    }}
                                  >
                                    Save draft
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-primary-container text-white shadow-sm hover:bg-primary hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                  disabled={submitApprovalMutation.isPending || saveDraftMutation.isPending}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    sendRowForApproval(sheet);
                                  }}
                                >
                                  Send for approval
                                </button>
                              </>
                            )}
                            {sheet.status === "Pending" && (
                              <span className="text-[9px] text-slate-400 whitespace-nowrap">Awaiting admin</span>
                            )}
                            {sheet.status === "Approved" && (
                              <button
                                type="button"
                                className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-50"
                                title="View"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewRowId(sheet.id);
                                }}
                              >
                                <span className="material-symbols-outlined text-base">visibility</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {timesheets.length === 0 && (
                    <tr>
                      <td className="px-8 py-8 text-sm text-slate-500" colSpan={12}>
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
          <div className="glass-card rounded-xl p-6 w-[min(92vw,32rem)]">
            <h4 className="text-lg font-bold text-primary mb-3">New timesheet</h4>
            <p className="text-xs text-slate-500 mb-1">
              Timesheets are submitted weekly (Mon–Sun). Pick the week you worked; start and end dates are set automatically.
            </p>
            <p className="text-xs text-slate-400 mb-4">Hours start empty — fill them in after creating.</p>
            {pickerWeekMonday && pickerWeekSelection ? (
              <div className="mb-4 rounded-xl border border-slate-200/90 bg-surface-container-low/80 p-4 shadow-[0_8px_24px_rgba(0,6,21,0.06)]">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Week</p>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary-container/30 hover:bg-slate-50 hover:text-primary"
                    aria-label="Previous week"
                    onClick={() => shiftPickerWeek(-1)}
                  >
                    <span className="material-symbols-outlined text-xl leading-none">chevron_left</span>
                  </button>
                  <p className="min-w-0 flex-1 text-center font-headline text-sm font-bold leading-snug text-primary">
                    {formatWeekOfCalendarRange(pickerWeekMonday, pickerWeekSelection.sunISO)}
                  </p>
                  <button
                    type="button"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary-container/30 hover:bg-slate-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Next week"
                    disabled={pickerWeekMonday >= getWeekStartISO(new Date())}
                    onClick={() => shiftPickerWeek(1)}
                  >
                    <span className="material-symbols-outlined text-xl leading-none">chevron_right</span>
                  </button>
                </div>
                {pickerWeekSelection.periodEnd < pickerWeekSelection.sunISO ? (
                  <p className="mb-3 text-center text-[11px] text-slate-500">
                    Submitting through{" "}
                    <span className="font-semibold text-primary">
                      {formatWeekRangeWithWeekdays(pickerWeekSelection.periodStart, pickerWeekSelection.periodEnd)}
                    </span>{" "}
                    (current week)
                  </p>
                ) : null}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {NAV_DAY_LABELS.map((label) => (
                    <div key={`nav-h-${label}`} className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      {label}
                    </div>
                  ))}
                  {NAV_DAY_LABELS.map((_, i) => (
                    <div
                      key={`nav-d-${pickerWeekMonday}-${i}`}
                      className="rounded-lg bg-white/90 py-2 text-sm font-bold text-primary shadow-sm ring-1 ring-slate-100"
                    >
                      {formatNavDayCell(pickerWeekMonday, i)}
                    </div>
                  ))}
                </div>
                {hasTimesheetForPickerWeek ? (
                  <p className="mt-3 text-center text-[11px] font-medium text-amber-800" role="status">
                    You already have a timesheet for this week — pick another week or cancel.
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mb-3 text-xs text-slate-500" role="status">
                Open this dialog again to choose a week.
              </p>
            )}
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
                className="px-4 py-2 text-xs font-bold bg-primary-container text-white rounded disabled:cursor-not-allowed disabled:opacity-50"
                disabled={
                  saveDraftMutation.isPending ||
                  !pickerWeekSelection ||
                  hasTimesheetForPickerWeek
                }
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
                className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg border border-outline-variant/30 bg-white text-on-surface shadow-sm hover:bg-surface-container-low transition-all"
                onClick={() => setRejectionFeedback(null)}
              >
                Dismiss
              </button>
              <button
                type="button"
                className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg bg-primary-container text-white shadow-sm hover:bg-primary hover:-translate-y-0.5 transition-all"
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
            <p className="text-sm text-slate-500 mb-4">{formatTimesheetRangeLabel(viewRow)}</p>
            <p className="text-xs text-slate-400 mb-4">{projectSubtext(viewRow, employee)}</p>
            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
              {TIMESHEET_DAY_KEYS.map((d) => (
                <div key={d} className="bg-slate-50 rounded-lg py-2">
                  <div className="text-[10px] font-bold uppercase text-slate-400">{DAY_HEADER_SHORT[d]}</div>
                  <div className="font-extrabold text-primary">{formatHourCell(viewRow.weekData?.[d])}</div>
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
