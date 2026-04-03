import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { getEmployees } from "@/data";
import AdminSidebar from "../components/AdminSidebar";

const ensureTimesheets = (employees) => {
  return employees.map((emp) => {
    if (emp.timesheets?.length) return emp;

    return {
      ...emp,
      timesheets: [
        {
          id: `ts-${emp.id}`,
          weekStart: "2026-04-01",
          weekData: {
            mon: 8,
            tue: 8,
            wed: 8,
            thu: 8,
            fri: 8,
          },
          status: "Pending",
          rejectionNote: "",
        },
      ],
    };
  });
};

const toYMD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const parseYMD = (ymd) => {
  const [y, m, day] = String(ymd).split("-").map(Number);
  return new Date(y, m - 1, day, 0, 0, 0, 0);
};

const addDaysISO = (isoDate, days) => {
  const d = parseYMD(isoDate);
  d.setDate(d.getDate() + days);
  return toYMD(d);
};

const getWeekStartISO = (date) => {
  const d = date instanceof Date ? new Date(date) : parseYMD(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return toYMD(d);
};

const calculateTotal = (weekData) =>
  Object.values(weekData).reduce((sum, val) => sum + Number(val || 0), 0);

export default function Timesheets() {
  const entriesPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [viewFilter, setViewFilter] = useState("Current Week");
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

  const employees = getEmployees();
  const enrichedEmployees = useMemo(() => ensureTimesheets(employees), [employees]);

  const timesheetData = useMemo(() => {
    const currentWeekStartISO = getWeekStartISO(new Date());
    let rowIndex = 0;
    return enrichedEmployees.flatMap((emp) =>
      (emp.timesheets || []).map((ts) => {
        const weekStartMonday = getWeekStartISO(ts.weekStart);
        const isCurrentWeek = weekStartMonday === currentWeekStartISO;
        const from = ts.weekStart;
        const to = addDaysISO(ts.weekStart, 4);
        const stripeClass = rowIndex % 2 === 1 ? "bg-surface-container-low/30" : "";
        rowIndex += 1;

        const weekData = {
          mon: Number(ts?.weekData?.mon ?? 0),
          tue: Number(ts?.weekData?.tue ?? 0),
          wed: Number(ts?.weekData?.wed ?? 0),
          thu: Number(ts?.weekData?.thu ?? 0),
          fri: Number(ts?.weekData?.fri ?? 0),
        };

        return {
          id: ts.id,
          employeeId: emp.id,
          employeeName: emp.name,
          role: emp.role,
          avatar: emp.avatar,
          avatarType: emp.avatarType ?? emp.avatar?.type,
          weekData,
          total: calculateTotal(weekData),
          status: ts.status || "Pending",
          rejectionNote: ts.rejectionNote || "",
          weekStart: ts.weekStart,
          dateRange: { from, to },
          viewType: isCurrentWeek ? "Current Week" : "Last Week",
          highlightedDay: "",
          stripeClass,
        };
      }),
    );
  }, [enrichedEmployees]);

  const [liveTimesheetRows, setLiveTimesheetRows] = useState([]);

  useLayoutEffect(() => {
    const safeTimesheetSource = Array.isArray(timesheetData) ? timesheetData : [];
    setLiveTimesheetRows(safeTimesheetSource);
  }, [timesheetData]);

  const data = Array.isArray(liveTimesheetRows) ? liveTimesheetRows : [];

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        row.employeeName.toLowerCase().includes(query) ||
        row.role.toLowerCase().includes(query) ||
        row.status.toLowerCase().includes(query);
      const matchesStatus = selectedStatus === "All" || row.status === selectedStatus;
      const rowFrom = new Date(row.dateRange.from);
      const rowTo = new Date(row.dateRange.to);
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const matchesView =
        viewFilter === "Current Week"
          ? row.viewType === "Current Week"
          : viewFilter === "Last Week"
            ? row.viewType === "Last Week"
            : viewFilter === "Current Month"
              ? rowFrom <= monthEnd && rowTo >= monthStart
              : !customFrom || !customTo
                ? true
                : rowFrom <= new Date(customTo) && rowTo >= new Date(customFrom);
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

  const updateRowStatus = (id, status, rejectionNote = "") => {
    setLiveTimesheetRows((previous) =>
      previous.map((row) => (row.id === id ? { ...row, status, rejectionNote } : row)),
    );
  };

  const approveRow = (id) => {
    setEditingRowId(null);
    updateRowStatus(id, "Approved", "");
    setFeedbackModal({ open: true, message: "Timesheet Approved" });
  };

  const submitReject = () => {
    if (!rejectingRowId) return;
    updateRowStatus(rejectingRowId, "Rejected", rejectionReason.trim());
    setRejectingRowId(null);
    setRejectionReason("");
    setFeedbackModal({ open: true, message: "Timesheet Rejected" });
  };

  const sendBackToReviewStage = (id) => {
    setEditingRowId(null);
    setLiveTimesheetRows((previous) =>
      previous.map((row) => (row.id === id ? { ...row, status: "Pending" } : row)),
    );
    setActiveMenuId(null);
  };
  const handleChange = (id, day, value) => {
    const normalizedValue = value.replace(/[^0-9.]/g, "");
    const numericValue = Number(normalizedValue);
    setLiveTimesheetRows((previous) =>
      previous.map((row) => {
        if (row.id !== id) return row;
        const updatedWeekData = {
          ...row.weekData,
          [day]: Number.isNaN(numericValue) ? 0 : numericValue,
        };
        return { ...row, weekData: updatedWeekData, total: calculateTotal(updatedWeekData) };
      }),
    );
  };
  return (
    <>
      <AdminSidebar />

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
      <p className="text-xs font-bold text-primary">Alex Rivera</p>
      <p className="text-[10px] text-slate-500">Administrator</p>
      </div>
      <img alt="Administrator Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" data-alt="Close-up portrait of a professional male administrator in a modern office setting with soft natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsANp7zU3dDtogpYWHrdPf0-sIpJ8WzVxfPk1m5nICvNzk6nvzMybseKc5wmPae1rwGefknzXKUzn0-AMx-5pRldbT3lpHR2mkdqAQYQi96WZqBzWxC8imhn08ca8b-I43MuwDA__C68Mu9A3OF0naMFnrP3KXKHAOCVHdU05t1jVu_XOytA0ekT_98qNb4Bm6TvOkC8lrB3TflQl58WCBHLgw5Xc5bKWW-O5GlgQLwYbCa3BcRzlLgUUmCtDtn3_pyfQqlC3JHSih"/>
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
      <p className="text-3xl font-extrabold font-headline mt-1">24</p>
      <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
      <span className="material-symbols-outlined text-[12px]" data-icon="arrow_upward">arrow_upward</span>
                              12% from last week
                          </p>
      </div>
      <div className="glass-card p-6 rounded-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-on-tertiary-container font-label">Approved</p>
      <p className="text-3xl font-extrabold font-headline mt-1">142</p>
      <p className="text-[10px] text-slate-500 mt-2">Current billing cycle</p>
      </div>
      <div className="glass-card p-6 rounded-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-error font-label">Rejected</p>
      <p className="text-3xl font-extrabold font-headline mt-1">08</p>
      <p className="text-[10px] text-slate-500 mt-2">Requires immediate action</p>
      </div>
      <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-primary-container to-slate-900 text-white">
      <p className="text-xs font-bold uppercase tracking-widest text-tertiary-fixed font-label">Total Hours</p>
      <p className="text-3xl font-extrabold font-headline mt-1">5,840</p>
      <p className="text-[10px] text-slate-400 mt-2">Week ending Oct 27</p>
      </div>
      </div>

      <section className="glass-card rounded-xl overflow-hidden">

      <div className="px-8 py-5 flex items-center justify-between bg-surface-container-low/50">
      <div className="flex gap-6 items-center">
      <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-slate-400 uppercase">View:</span>
      <select className="bg-transparent border-none text-sm font-semibold focus:ring-0 cursor-pointer" onChange={(event) => setViewFilter(event.target.value)} value={viewFilter}>
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

      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
      <thead className="bg-white border-b border-slate-100">
      <tr>
      <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Employee</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">M</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">T</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">W</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">T</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">F</th>
      <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">Total</th>
      <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Status</th>
      <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">
      <div className="inline-flex items-center gap-1">
      <span className="material-symbols-outlined text-sm" data-icon="edit">edit</span>
      <span>Edit</span>
      </div>
      </th>
      <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">Actions</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
      {paginatedData.map((row) => (
      <tr className={`${row.stripeClass} hover:bg-slate-50 transition-colors`} key={row.id}>
      <td className={`px-8 py-5 ${row.status === "Rejected" ? "border-l-4 border-error" : ""}`}>
      <div className="flex items-center gap-3">
      {row.avatarType === "image" ? (
      <img alt="Employee" className="w-8 h-8 rounded-full object-cover" src={row.avatar.image}/>
      ) : (
      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-white text-xs font-bold">{row.avatar.initials}</div>
      )}
      <div>
      <p className="text-sm font-bold text-primary">{row.employeeName}</p>
      <p className="text-[10px] text-slate-400">{row.role}</p>
      </div>
      </div>
      </td>
      {["mon", "tue", "wed", "thu", "fri"].map((day) => (
      <td className={`px-6 py-5 text-center text-sm font-medium ${row.highlightedDay === day ? "text-error font-bold" : ""}`} key={`${row.id}-${day}`}>
      {editingRowId === row.id ? (
      <input className="w-12 bg-transparent border border-slate-200 rounded text-center text-sm font-medium focus:ring-0" onChange={(event) => handleChange(row.id, day, event.target.value)} type="text" value={row.weekData[day]} />
      ) : (
      row.weekData[day].toFixed(1)
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
              : "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 uppercase tracking-tight"
        }
      >
      <span className={`w-1.5 h-1.5 rounded-full ${row.status === "Approved" ? "bg-emerald-500" : row.status === "Rejected" ? "bg-error" : "bg-amber-500"}`}></span>
                                              {row.status}
                                          </span>
      </td>
      <td className="px-8 py-5 text-center">
      <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-primary hover:bg-slate-50 transition-all" onClick={() => setEditingRowId((previous) => (previous === row.id ? null : row.id))} title="Edit">
      <span className="material-symbols-outlined text-lg" data-icon="edit">edit</span>
      </button>
      </td>
      <td className="px-8 py-5 text-right">
      {row.status === "Rejected" ? (
      <button className="px-3 py-1.5 text-[10px] font-bold text-secondary uppercase hover:bg-secondary/10 rounded transition-all" onClick={() => setActiveNote(row.rejectionNote || "No notes available.")}>View Notes</button>
      ) : row.status === "Approved" ? (
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
      <td className="px-8 py-8 text-sm text-slate-500" colSpan={10}>No timesheet records found.</td>
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
      <span className="text-sm font-bold">3 items selected</span>
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md">
      <div className="glass-card rounded-xl p-6 w-[min(92vw,32rem)]">
      <h4 className="text-lg font-bold text-primary mb-3">Reject Timesheet</h4>
      <textarea className="w-full h-28 bg-white border border-slate-200 rounded p-3 text-sm focus:ring-0" onChange={(event) => setRejectionReason(event.target.value)} placeholder="Enter rejection reason..." value={rejectionReason}></textarea>
      <div className="mt-4 flex justify-end gap-2">
      <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded" onClick={() => setRejectingRowId(null)}>Cancel</button>
      <button className="px-4 py-2 text-xs font-bold bg-primary-container text-white rounded" onClick={submitReject}>Submit</button>
      </div>
      </div>
      </div>
      )}
      {activeNote && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md">
      <div className="glass-card rounded-xl p-6 w-[min(92vw,32rem)]">
      <h4 className="text-lg font-bold text-primary mb-3">Rejection Note</h4>
      <p className="text-sm text-slate-600">{activeNote}</p>
      <div className="mt-4 flex justify-end">
      <button className="px-4 py-2 text-xs font-bold bg-primary-container text-white rounded" onClick={() => setActiveNote("")}>Close</button>
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
