import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timesheetsService } from "../../../services/timesheets.service";
import PageSkeleton from "../../../components/PageSkeleton";
import ErrorState from "../../../components/ErrorState";
import EntityAvatar from "@/components/shared/EntityAvatar";
import { useAuthStore } from "@/store/authStore";
import {
  addDaysISO,
  calculateTotal,
  formatHourCell,
  formatTimesheetRangeLabel,
  getWeekStartISO,
  parseYMD,
  weekMondayISOFromDb,
} from "../../Employee/timesheetUtils";

function formatAdminWeekRangeSubtitle(row) {
  if (!row?.dateRange?.from || !row?.dateRange?.to) return "";
  const a = formatMonthDay(row.dateRange.from);
  const b = new Date(row.dateRange.to).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${a} – ${b}`;
}

function formatMonthDay(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatRejectionTimestamp(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

export default function Timesheets() {
  const entriesPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [viewFilter, setViewFilter] = useState("All periods");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRowId, setEditingRowId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [rejectingRowId, setRejectingRowId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeNote, setActiveNote] = useState("");
  const [feedbackModal, setFeedbackModal] = useState({ open: false, message: "" });
  const { user, role } = useAuthStore();
  const hideEditForSuperAdmin = role === "super_admin";

  const queryClient = useQueryClient();

  const { data: apiData, isLoading, isError, refetch } = useQuery({
    queryKey: ['timesheets'],
    queryFn: () => timesheetsService.getAll({ limit: 200 }),
    staleTime: 30_000,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => timesheetsService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      setFeedbackModal({ open: true, message: "Timesheet Approved" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, rejectionNote }) => timesheetsService.reject(id, rejectionNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      setRejectingRowId(null);
      setRejectionReason("");
      setFeedbackModal({ open: true, message: "Timesheet Rejected" });
    },
  });

  const rawTimesheets = useMemo(() => {
    const list = apiData?.data;
    return Array.isArray(list) ? list : [];
  }, [apiData]);

  const timesheetData = useMemo(() => {
    const currentWeekStartISO = getWeekStartISO(new Date());
    const lastWeekStartISO = addDaysISO(currentWeekStartISO, -7);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return rawTimesheets
      .map((ts, rowIndex) => {
      const weekStartMonday = weekMondayISOFromDb(ts.weekStart);
      if (!weekStartMonday) return null;
      const from = weekStartMonday;
      const to = from ? addDaysISO(from, 6) : "";
      const stripeClass = rowIndex % 2 === 1 ? "bg-surface-container-low/30" : "";

      const weekData = ts?.weekData && typeof ts.weekData === "object" ? ts.weekData : {};

      let viewType = "Other";
      if (weekStartMonday === currentWeekStartISO) viewType = "Current Week";
      else if (weekStartMonday === lastWeekStartISO) viewType = "Last Week";
      else {
        const ws = from ? parseYMD(from) : null;
        if (ws && !Number.isNaN(ws.getTime()) && ws >= monthStart && ws <= monthEnd) {
          viewType = "Current Month";
        }
      }

      return {
        id: ts.id,
        employeeId: ts.employee?.id ?? ts.employeeId,
        employeeName: ts.employee?.name ?? "",
        role: ts.employee?.role ?? "",
        avatar: null,
        avatarType: null,
        weekData,
        total: calculateTotal(weekData),
        status: ts.status || "Pending",
        rejectionNote: ts.rejectionNote || "",
        weekStart: weekStartMonday,
        dateRange: { from, to },
        rangeLabel: formatTimesheetRangeLabel(ts),
        viewType,
        highlightedDay: "",
        stripeClass,
      };
    })
      .filter(Boolean);
  }, [rawTimesheets]);

  const data = Array.isArray(timesheetData) ? timesheetData : [];

  const stats = useMemo(() => {
    const list = rawTimesheets;
    const pending = list.filter((t) => t.status === "Pending").length;
    const approved = list.filter((t) => t.status === "Approved").length;
    const rejected = list.filter((t) => t.status === "Rejected").length;
    const totalHours = list.reduce((sum, t) => sum + calculateTotal(t.weekData || {}), 0);
    return { pending, approved, rejected, totalHours };
  }, [rawTimesheets]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        row.employeeName.toLowerCase().includes(query) ||
        row.role.toLowerCase().includes(query) ||
        row.status.toLowerCase().includes(query);
      const matchesStatus = selectedStatus === "All" || row.status === selectedStatus;
      const rowFrom = row.dateRange.from ? parseYMD(row.dateRange.from) : null;
      const rowTo = row.dateRange.to ? parseYMD(row.dateRange.to) : null;
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const matchesView =
        viewFilter === "All periods"
          ? true
          : viewFilter === "Current Week"
            ? row.viewType === "Current Week"
            : viewFilter === "Last Week"
              ? row.viewType === "Last Week"
              : viewFilter === "Current Month"
                ? row.viewType === "Current Month"
                : !customFrom || !customTo
                  ? true
                  : rowFrom &&
                    rowTo &&
                    rowFrom <= new Date(customTo + "T12:00:00") &&
                    rowTo >= new Date(customFrom + "T12:00:00");
      return matchesSearch && matchesStatus && matchesView;
    });
  }, [customFrom, customTo, searchQuery, selectedStatus, data, viewFilter]);

  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = useMemo(
    () => filteredData.slice(startIndex, endIndex),
    [endIndex, filteredData, startIndex],
  );
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, viewFilter, customFrom, customTo]);

  useEffect(() => {
    if (filteredData.length === 0 && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredData.length, totalPages]);

  useEffect(() => {
    if (!feedbackModal.open) {
      return undefined;
    }
    const timeout = window.setTimeout(() => {
      setFeedbackModal({ open: false, message: "" });
    }, 2000);
    return () => window.clearTimeout(timeout);
  }, [feedbackModal]);

  useEffect(() => {
    if (hideEditForSuperAdmin) setEditingRowId(null);
  }, [hideEditForSuperAdmin]);

  const approveRow = (id) => {
    setEditingRowId(null);
    approveMutation.mutate(id);
  };

  const submitReject = () => {
    const reason = rejectionReason.trim();
    if (!rejectingRowId || !reason) return;
    rejectMutation.mutate({ id: rejectingRowId, rejectionNote: reason });
  };

  const sendBackToReviewStage = (id) => {
    setEditingRowId(null);
    setActiveMenuId(null);
    approveMutation.mutate(id); // reuse approve to set back to pending — handled server-side
  };

  const handleChange = (_id, _day, _value) => {
    // Inline editing is read-only from admin; employees submit timesheets
  };

  const rejectingRow = rejectingRowId ? (data.find((r) => r.id === rejectingRowId) ?? null) : null;
  const rejectingRangeLabel = rejectingRow ? rejectingRow.rangeLabel || formatAdminWeekRangeSubtitle(rejectingRow) : "";

  if (isLoading) return <PageSkeleton />;
  if (isError) return <ErrorState message="Failed to load timesheets." onRetry={refetch} />;

  return (
    <>
      <main className="ml-64 min-h-screen">

      <header className="sticky top-0 z-40 w-full bg-white/60 backdrop-blur-xl border-b border-slate-200/50 h-16 flex items-center justify-between px-8 shadow-sm shadow-slate-200/20">
      <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-lg w-96 transition-all focus-within:ring-2 focus-within:ring-[#4cd7f6]/20">
      <span className="material-symbols-outlined text-slate-400 text-sm mr-2" data-icon="search">search</span>
      <input className="bg-transparent border-none focus:ring-0 text-sm w-full font-body" onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search records, employees, or status..." type="text" value={searchQuery}/>
      </div>
      <div className="flex items-center gap-6">
      <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
      <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all relative">
      <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
      <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
      </button>
      <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
      <span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
      </button>
      </div>
      <div className="flex items-center gap-3">
      <div className="text-right">
      <p className="text-xs font-bold text-primary">{user?.name || "Admin"}</p>
      <p className="text-[10px] text-slate-500">
        {(user?.role && String(user.role).replace(/_/g, " ")) || "Administrator"}
      </p>
      </div>
      <EntityAvatar name={user?.name || user?.email || "Admin"} size="md" className="border-2 border-white shadow-sm" />
      </div>
      </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto space-y-8">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
      <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-primary">Timesheet Management</h2>
      <p className="text-on-primary-container mt-2 font-body">Review and manage weekly employee hours and billing status.</p>
      </div>
      <div className="flex gap-3">
      <button className="px-6 py-2.5 border border-primary-container text-primary-container font-semibold rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2">
      <span className="material-symbols-outlined text-sm" data-icon="file_download">file_download</span>
                              Export CSV
                          </button>
      <button className="px-6 py-2.5 bg-primary-container text-white font-semibold rounded-lg shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2">
      <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                              Manual Entry
                          </button>
      </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="glass-card p-6 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
      <span className="material-symbols-outlined text-6xl" data-icon="pending_actions">pending_actions</span>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-secondary font-label">Pending</p>
      <p className="text-3xl font-extrabold font-headline mt-1">{stats.pending}</p>
      <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
      <span className="material-symbols-outlined text-[12px]" data-icon="arrow_upward">arrow_upward</span>
                              12% from last week
                          </p>
      </div>
      <div className="glass-card p-6 rounded-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-on-tertiary-container font-label">Approved</p>
      <p className="text-3xl font-extrabold font-headline mt-1">{stats.approved}</p>
      <p className="text-[10px] text-slate-500 mt-2">Current billing cycle</p>
      </div>
      <div className="glass-card p-6 rounded-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-error font-label">Rejected</p>
      <p className="text-3xl font-extrabold font-headline mt-1">{stats.rejected}</p>
      <p className="text-[10px] text-slate-500 mt-2">Requires immediate action</p>
      </div>
      <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-primary-container to-slate-900 text-white">
      <p className="text-xs font-bold uppercase tracking-widest text-tertiary-fixed font-label">Total Hours</p>
      <p className="text-3xl font-extrabold font-headline mt-1">
        {(Number.isFinite(stats.totalHours) ? stats.totalHours : 0).toLocaleString("en-US", { maximumFractionDigits: 1 })}
      </p>
      <p className="text-[10px] text-slate-400 mt-2">Across loaded timesheets</p>
      </div>
      </div>

      <section className="glass-card rounded-xl overflow-hidden">

      <div className="px-8 py-5 flex items-center justify-between bg-surface-container-low/50">
      <div className="flex gap-6 items-center">
      <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-slate-400 uppercase">View:</span>
      <select className="bg-transparent border-none text-sm font-semibold focus:ring-0 cursor-pointer" onChange={(event) => setViewFilter(event.target.value)} value={viewFilter}>
      <option>All periods</option>
      <option>Current Week</option>
      <option>Last Week</option>
      <option>Current Month</option>
      <option>Custom</option>
      </select>
      </div>
      {viewFilter === "Custom" && (
      <div className="flex items-center gap-2">
      <input className="bg-transparent border border-slate-200 text-sm font-semibold focus:ring-0 cursor-pointer rounded px-2 py-1" onChange={(event) => setCustomFrom(event.target.value)} type="date" value={customFrom}/>
      <span className="text-xs font-bold text-slate-400 uppercase">to</span>
      <input className="bg-transparent border border-slate-200 text-sm font-semibold focus:ring-0 cursor-pointer rounded px-2 py-1" onChange={(event) => setCustomTo(event.target.value)} type="date" value={customTo}/>
      </div>
      )}
      <div className="h-4 w-[1px] bg-slate-300"></div>
      <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-slate-400 uppercase">Status:</span>
      <div className="flex gap-1">
      <button className={selectedStatus === "All" ? "px-3 py-1 bg-white text-xs font-bold rounded shadow-sm border border-slate-200" : "px-3 py-1 text-xs font-bold text-slate-500 hover:text-primary"} onClick={() => setSelectedStatus("All")}>All</button>
      <button className={selectedStatus === "Pending" ? "px-3 py-1 bg-white text-xs font-bold rounded shadow-sm border border-slate-200" : "px-3 py-1 text-xs font-bold text-slate-500 hover:text-primary"} onClick={() => setSelectedStatus("Pending")}>Pending</button>
      <button className={selectedStatus === "Approved" ? "px-3 py-1 bg-white text-xs font-bold rounded shadow-sm border border-slate-200" : "px-3 py-1 text-xs font-bold text-slate-500 hover:text-primary"} onClick={() => setSelectedStatus("Approved")}>Approved</button>
      </div>
      </div>
      </div>
      <div className="flex items-center gap-2 text-slate-500">
      <span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
      <span className="text-xs font-bold">More Filters</span>
      </div>
      </div>

      <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <table className="w-full text-left border-collapse">
      <thead className="bg-white border-b border-slate-100">
      <tr>
      <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Employee</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 min-w-[10rem]">Date range</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">M</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">T</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">W</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">T</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">F</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">ST</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">S</th>
      <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">Total</th>
      <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Status</th>
      {!hideEditForSuperAdmin && (
      <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
      <div className="inline-flex items-center gap-1">
      <span className="material-symbols-outlined text-sm" data-icon="edit">edit</span>
      <span>Edit</span>
      </div>
      </th>
      )}
      <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">Actions</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
      {paginatedData.map((row) => (
      <tr className={`${row.stripeClass} hover:bg-slate-50 transition-colors`} key={row.id}>
      <td className={`px-8 py-5 ${row.status === "Rejected" ? "border-l-4 border-error" : ""}`}>
      <div className="flex items-center gap-3">
      <EntityAvatar name={row.employeeName || "Employee"} size="sm" />
      <div>
      <p className="text-sm font-bold text-primary">{row.employeeName}</p>
      <p className="text-[10px] text-slate-400">{row.role}</p>
      </div>
      </div>
      </td>
      <td className="px-6 py-5 text-xs font-semibold text-primary whitespace-nowrap">{row.rangeLabel || "—"}</td>
      {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
      <td className={`px-6 py-5 text-center text-sm font-medium ${row.highlightedDay === day ? "text-error font-bold" : ""}`} key={`${row.id}-${day}`}>
      {!hideEditForSuperAdmin && editingRowId === row.id ? (
      <input className="w-12 bg-transparent border border-slate-200 rounded text-center text-sm font-medium focus:ring-0" onChange={(event) => handleChange(row.id, day, event.target.value)} type="text" value={row.weekData[day] === null || row.weekData[day] === undefined ? "" : String(row.weekData[day])} />
      ) : (
      formatHourCell(row.weekData[day])
      )}
      </td>
      ))}
      <td className="px-8 py-5 text-right text-sm font-extrabold text-primary">{row.total.toFixed(1)}</td>
      <td className="px-8 py-5">
      <span
        className={
          row.status === "Approved"
            ? "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 uppercase tracking-tight"
            : row.status === "Rejected"
              ? "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-error-container text-error uppercase tracking-tight"
              : row.status === "Draft"
                ? "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 uppercase tracking-tight"
                : "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 uppercase tracking-tight"
        }
      >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          row.status === "Approved"
            ? "bg-emerald-500"
            : row.status === "Rejected"
              ? "bg-error"
              : row.status === "Draft"
                ? "bg-slate-400"
                : "bg-amber-500"
        }`}
      ></span>
                                              {row.status}
                                          </span>
      </td>
      {!hideEditForSuperAdmin && (
      <td className="px-8 py-5 text-center">
      <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-primary hover:bg-slate-50 transition-all" onClick={() => setEditingRowId((previous) => (previous === row.id ? null : row.id))} title="Edit">
      <span className="material-symbols-outlined text-lg" data-icon="edit">edit</span>
      </button>
      </td>
      )}
      <td className="px-8 py-5 text-right">
      {row.status === "Rejected" ? (
      <button className="px-3 py-1.5 text-[10px] font-bold text-secondary uppercase hover:bg-secondary/10 rounded transition-all" onClick={() => setActiveNote(row.rejectionNote || "No notes available.")}>View Notes</button>
      ) : row.status === "Approved" ? (
      hideEditForSuperAdmin ? (
      <span className="text-[10px] text-slate-400">—</span>
      ) : (
      <div className="relative inline-block">
      <button className="p-2 text-slate-400 hover:text-primary transition-colors" onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}>
      <span className="material-symbols-outlined text-lg" data-icon="more_vert">more_vert</span>
      </button>
      {activeMenuId === row.id && (
      <div className="absolute right-0 mt-1 w-24 rounded border border-slate-200 bg-white shadow-md z-20">
      <button className="w-full text-left px-3 py-2 text-xs font-bold text-primary hover:bg-slate-50" onClick={() => sendBackToReviewStage(row.id)}>
                                                  Edit
                                              </button>
      </div>
      )}
      </div>
      )
      ) : (
      <div className="flex justify-end gap-2">
      <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-error-container text-error hover:bg-error-container/20 transition-all" onClick={() => { setRejectingRowId(row.id); setRejectionReason(""); }} title="Reject">
      <span className="material-symbols-outlined text-lg" data-icon="close">close</span>
      </button>
      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-container text-tertiary-fixed hover:shadow-md transition-all" onClick={() => approveRow(row.id)} title="Approve">
      <span className="material-symbols-outlined text-lg" data-icon="check">check</span>
      </button>
      </div>
      )}
      </td>
      </tr>
      ))}
      {paginatedData.length === 0 && (
      <tr>
      <td className="px-8 py-8 text-sm text-slate-500" colSpan={hideEditForSuperAdmin ? 12 : 13}>No timesheet records found.</td>
      </tr>
      )}
      </tbody>
      </table>
      </div>

      <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between">
      <p className="text-xs text-slate-500 font-medium">Showing <span className="text-primary font-bold">{filteredData.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredData.length)}</span> of <span className="text-primary font-bold">{filteredData.length}</span> entries</p>
      <div className="flex gap-1">
      <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50" disabled={currentPage === 1} onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}>
      <span className="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span>
      </button>
      {Array.from({ length: totalPages > 0 ? totalPages : 1 }, (_, index) => index + 1).map((pageNumber) => (
      <button className={currentPage === pageNumber ? "w-8 h-8 flex items-center justify-center rounded bg-primary text-white text-xs font-bold" : "w-8 h-8 flex items-center justify-center rounded hover:bg-slate-50 text-xs font-bold"} key={pageNumber} onClick={() => setCurrentPage(pageNumber)}>
        {pageNumber}
      </button>
      ))}
      <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50" disabled={totalPages === 0 || currentPage >= totalPages} onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}>
      <span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
      </button>
      </div>
      </div>
      </section>

      <div className="flex items-center justify-between p-6 bg-primary-container text-white rounded-xl shadow-2xl">
      <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-tertiary-fixed-dim" data-icon="library_add_check">library_add_check</span>
      <span className="text-sm font-bold">Bulk selection</span>
      </div>
      <div className="h-6 w-[1px] bg-slate-700"></div>
      <p className="text-xs text-on-primary-container">Select multiple rows to perform bulk approval or rejection actions.</p>
      </div>
      <div className="flex gap-3">
      <button className="px-5 py-2 text-xs font-bold uppercase tracking-widest border border-slate-600 hover:bg-slate-800 rounded transition-all">Clear</button>
      <button className="px-5 py-2 text-xs font-bold uppercase tracking-widest bg-tertiary-fixed-dim text-primary-container rounded shadow-lg hover:-translate-y-0.5 transition-all">Approve Selected</button>
      </div>
      </div>
      </div>
      </main>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary-container text-tertiary-fixed rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-all z-50">
      <span className="material-symbols-outlined text-3xl" data-icon="add_task">add_task</span>
      </button>
      {rejectingRowId && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md p-4">
      <div className="relative bg-white rounded-xl shadow-xl shadow-slate-900/10 w-full max-w-md p-8 border border-slate-100 font-body">
      <button type="button" className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors" aria-label="Dismiss" onClick={() => { setRejectingRowId(null); setRejectionReason(""); }}>
      <span className="material-symbols-outlined text-xl">close</span>
      </button>
      <div className="flex flex-col items-center text-center pt-2">
      <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center mb-5 shadow-md shadow-red-500/20">
      <span className="material-symbols-outlined text-3xl text-white font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span>
      </div>
      <h4 className="text-xl font-extrabold text-[#0B1F3A] font-headline tracking-tight">Reject timesheet</h4>
      <p className="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
        {rejectingRow
          ? (
            <>
              Decline <span className="font-semibold text-slate-700">{rejectingRow.employeeName}&apos;s</span> timesheet
              {rejectingRangeLabel ? ` for ${rejectingRangeLabel}` : ""}?
            </>
            )
          : "Add feedback before declining this timesheet."}
      </p>
      </div>
      <div className="mt-6">
      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Admin comments</label>
      <textarea className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#4cd7f6]/25 focus:border-slate-300 resize-y" onChange={(event) => setRejectionReason(event.target.value)} placeholder="Explain what needs to change..." value={rejectionReason}/>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
      <span className="material-symbols-outlined text-base text-slate-400">schedule</span>
      This feedback will be shown to the employee.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3">
      <button type="button" className="w-full py-3 px-4 text-sm font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => { setRejectingRowId(null); setRejectionReason(""); }}>Dismiss</button>
      <button type="button" className="w-full py-3 px-4 text-sm font-bold rounded-lg bg-[#0B1F3A] text-white hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed" disabled={!rejectionReason.trim()} onClick={submitReject}>Submit</button>
      </div>
      </div>
      </div>
      )}
      {activeNote && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md p-4">
      <div className="relative bg-white rounded-xl shadow-xl shadow-slate-900/10 w-full max-w-md p-8 border border-slate-100 font-body">
      <button type="button" className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors" aria-label="Close" onClick={() => setActiveNote("")}>
      <span className="material-symbols-outlined text-xl">close</span>
      </button>
      <div className="flex flex-col items-center text-center pt-2">
      <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center mb-5 shadow-md shadow-red-500/20">
      <span className="material-symbols-outlined text-3xl text-white font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span>
      </div>
      <h4 className="text-xl font-extrabold text-[#0B1F3A] font-headline tracking-tight">Rejection feedback</h4>
      <p className="text-sm text-slate-500 mt-2">Employee-facing comments</p>
      </div>
      <div className="mt-6">
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Admin comments</p>
      <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{activeNote}</div>
      </div>
      <div className="mt-8 flex justify-end">
      <button type="button" className="py-3 px-6 text-sm font-bold rounded-lg bg-[#0B1F3A] text-white hover:bg-slate-800 transition-colors" onClick={() => setActiveNote("")}>Dismiss</button>
      </div>
      </div>
      </div>
      )}
      {feedbackModal.open && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md">
      <div className="glass-card rounded-2xl p-8 w-[min(90vw,26rem)] border border-white/30 shadow-2xl text-center">
      <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#0094ac]/20 flex items-center justify-center animate-pulse">
      <span className="material-symbols-outlined text-3xl text-[#0094ac]" data-icon="check_circle">check_circle</span>
      </div>
      <h4 className="text-xl font-bold text-primary">{feedbackModal.message}</h4>
      </div>
      </div>
      )}
    </>
  );
}
