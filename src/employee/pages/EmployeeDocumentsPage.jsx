import { useMemo, useState } from "react";
import { getEmployeeFromStore } from "../employeeEmployeesStore";
import { getEmployeeSessionId } from "../employeeSession";

const EXPIRING_DAYS = 30;

function classifyDoc(expiryDateStr) {
  if (!expiryDateStr) return "valid";
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDateStr);
  exp.setHours(0, 0, 0, 0);
  if (Number.isNaN(exp.getTime())) return "valid";
  if (exp < now) return "expired";
  const soon = new Date(now);
  soon.setDate(soon.getDate() + EXPIRING_DAYS);
  if (exp <= soon) return "expiring";
  return "valid";
}

function iconWrap(type) {
  const t = String(type).toLowerCase();
  if (t.includes("contract")) return { box: "bg-purple-50 text-purple-600", icon: "contract" };
  if (t.includes("id") || t.includes("permit") || t.includes("passport")) return { box: "bg-blue-50 text-blue-600", icon: "description" };
  return { box: "bg-amber-50 text-amber-600", icon: "assignment_ind" };
}

export default function EmployeeDocumentsPage() {
  const id = getEmployeeSessionId();
  const employee = useMemo(() => (id ? getEmployeeFromStore(id) : null), [id]);
  const docs = employee?.documents ?? [];

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      const q = search.trim().toLowerCase();
      if (q && !d.name.toLowerCase().includes(q)) return false;
      if (typeFilter !== "All Types" && d.type !== typeFilter) return false;
      const st = classifyDoc(d.expiryDate);
      const stLabel = st === "expired" ? "EXPIRED" : st === "expiring" ? "EXPIRING SOON" : "VALID";
      if (statusFilter !== "All Statuses" && stLabel !== statusFilter) return false;
      return true;
    });
  }, [docs, search, typeFilter, statusFilter]);

  const formatCell = (iso) => {
    if (!iso) return { text: "N/A", italic: true };
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return { text: iso, italic: false };
    return {
      text: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      italic: false,
    };
  };

  return (
    <main className="ml-64 min-h-screen flex flex-col bg-surface text-on-surface">
      <div className="mt-16 p-8 flex-1">
        <div className="mb-10 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-primary-container tracking-tight mb-2 font-headline">Employee Documents</h1>
            <p className="text-on-surface-variant max-w-md font-body">
              Manage, track, and verify essential employee certifications and legal documentation with automated expiry alerts.
            </p>
          </div>
          <button
            type="button"
            className="bg-primary-container text-on-primary px-6 py-3 rounded flex items-center gap-2 hover:translate-y-[-2px] transition-all shadow-lg shadow-primary-container/20 border-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              add
            </span>
            <span className="font-bold text-sm">Upload New Document</span>
          </button>
        </div>

        <div className="glass-card rounded-xl p-4 mb-8 flex flex-wrap items-center gap-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
              Search Documents
            </label>
            <div className="relative">
              <input
                className="w-full bg-surface-container border-none text-sm px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-tertiary-fixed-dim/20"
                placeholder="Filter by name..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="w-48">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
              Document Type
            </label>
            <select
              className="w-full bg-surface-container border-none text-sm px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-tertiary-fixed-dim/20"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All Types</option>
              <option>ID</option>
              <option>Contract</option>
              <option>Certification</option>
              <option>Tax Form</option>
            </select>
          </div>
          <div className="w-48">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Status</label>
            <select
              className="w-full bg-surface-container border-none text-sm px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-tertiary-fixed-dim/20"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>VALID</option>
              <option>EXPIRING SOON</option>
              <option>EXPIRED</option>
            </select>
          </div>
          <div className="flex items-end h-full self-end pb-0.5">
            <button type="button" className="p-2.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg transition-colors border-none cursor-pointer">
              <span className="material-symbols-outlined text-on-surface-variant">tune</span>
            </button>
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Document Name</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Type</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Upload Date</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Expiry Date</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-on-surface-variant text-sm">
                    No documents match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => {
                  const st = classifyDoc(doc.expiryDate);
                  const { box, icon } = iconWrap(doc.type);
                  const upload = formatCell(doc.uploadDate);
                  const expiry = formatCell(doc.expiryDate);
                  const rowCls =
                    st === "expiring"
                      ? "bg-amber-50/30 hover:bg-amber-50/50 transition-colors group"
                      : "hover:bg-surface-container-low transition-colors group";
                  const statusInner =
                    st === "valid" ? (
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">VALID</span>
                      </div>
                    ) : st === "expiring" ? (
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">EXPIRING SOON</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-red-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">EXPIRED</span>
                      </div>
                    );
                  return (
                    <tr className={rowCls} key={doc.id}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded flex items-center justify-center ${box}`}>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {icon}
                            </span>
                          </div>
                          <span className="font-bold text-primary-container text-sm">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-600">{doc.type}</span>
                      </td>
                      <td className={`px-6 py-5 text-sm text-on-surface-variant ${upload.italic ? "italic text-slate-400" : ""}`}>{upload.text}</td>
                      <td
                        className={`px-6 py-5 text-sm text-on-surface-variant ${st === "expiring" ? "text-amber-700 font-bold underline decoration-amber-200" : ""} ${expiry.italic ? "text-slate-400 italic" : ""}`}
                      >
                        {expiry.text}
                      </td>
                      <td className="px-6 py-5">{statusInner}</td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-white rounded" title="View">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          <button type="button" className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-white rounded" title="Download">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <div className="p-4 bg-surface-container-low/30 flex justify-between items-center flex-wrap gap-2">
            <span className="text-xs text-on-surface-variant">
              Showing {filtered.length === 0 ? 0 : 1}-{filtered.length} of {docs.length} documents
            </span>
            <div className="flex items-center gap-2">
              <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors border-none bg-transparent cursor-not-allowed" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button type="button" className="px-3 py-1 bg-primary-container text-white text-xs font-bold rounded border-none cursor-pointer">
                1
              </button>
              <button type="button" className="p-2 text-slate-600 hover:text-primary transition-colors border-none bg-transparent cursor-pointer">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <div className="glass-card p-6 rounded-xl flex items-center justify-between border-l-4 border-l-[#4cd7f6] flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-tertiary-fixed/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-3xl">policy</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-container font-headline">Compliance Audit Score</h3>
                  <p className="text-on-surface-variant text-sm font-body">
                    Your department currently maintains a 98% document accuracy rate.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-primary-container font-headline">98%</span>
                <div className="w-32 h-1 bg-surface-container-highest mt-2 overflow-hidden rounded-full">
                  <div className="bg-tertiary-fixed-dim h-full w-[98%]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-primary-container p-6 rounded-xl relative overflow-hidden h-full flex flex-col justify-center">
              <div className="relative z-10">
                <p className="text-[#acedff] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Next Step</p>
                <h3 className="text-white text-lg font-bold leading-tight font-headline">
                  Run full audit report for Q4 compliance review.
                </h3>
                <button
                  type="button"
                  className="mt-4 text-white text-xs font-bold flex items-center gap-2 group border-none bg-transparent cursor-pointer p-0"
                >
                  Generate Report{" "}
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
              <span
                className="material-symbols-outlined absolute -bottom-4 -right-4 text-white/10 text-[120px] select-none"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                analytics
              </span>
            </div>
          </div>
        </div>

        <footer className="mt-auto px-8 py-4 bg-surface-container-low/30 border-t border-outline-variant/10 text-center">
          <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase font-body">
            InTechRoot Enterprise Architecture • Node ID: 882-99-ALPHA
          </p>
        </footer>
      </div>
    </main>
  );
}
