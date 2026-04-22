import { useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { documentsService } from "../../services/documents.service";
import { employeesService } from "../../services/employees.service";
import { REQUIRED_DOCUMENT_ROWS } from "../../constants/requiredDocumentTemplates";
import { uploadStatusBadge, onboardingVerificationBadge } from "../../components/shared/requiredDocumentBadges";
import {
  documentIconWrapClass,
  formatDocumentSubtitle,
} from "../../utils/applicantDocumentRows";
import {
  getRowUploadStatusKey,
  hasUploadedFile,
  resolveDocVerification,
} from "../../utils/onboardingDocumentRules";

function formatDateCell(iso) {
  if (!iso) return { text: "—", italic: true };
  const day = String(iso).slice(0, 10);
  const d = new Date(`${day}T12:00:00`);
  if (Number.isNaN(d.getTime())) return { text: day, italic: false };
  return {
    text: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    italic: false,
  };
}

export default function EmployeeDocumentsPage() {
  const { employeeId } = useAuthStore();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const { data: employee = null } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => employeesService.getById(employeeId),
    staleTime: 60_000,
    enabled: !!employeeId,
  });

  const { data: docs = [] } = useQuery({
    queryKey: ['documents', employeeId],
    queryFn: () => documentsService.getByOwner(employeeId, 'employee'),
    staleTime: 60_000,
    enabled: !!employeeId,
  });

  const [pendingUploadKey, setPendingUploadKey] = useState(null);
  const [rowErrors, setRowErrors] = useState({});
  const [previewingId, setPreviewingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [expiryDraft, setExpiryDraft] = useState({});

  const upsertMutation = useMutation({
    mutationFn: (formData) => documentsService.upsert(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', employeeId] });
    },
    onError: (err, formData) => {
      const templateKey = formData.get("templateKey");
      if (!templateKey) return;
      setRowErrors((prev) => ({
        ...prev,
        [templateKey]: err?.response?.data?.error?.message || "Upload failed. Please try again.",
      }));
    }
  });

  const requiredRows = useMemo(() => {
    const baseRequired = REQUIRED_DOCUMENT_ROWS.filter((row) => row.required);
    const adminRequested = (employee?.applicationProfile?.adminDocRequests || []).map((request) => ({
      key: `adminreq_${request.id}`,
      label: request.name,
      required: true,
      status: "not_uploaded",
      expiry: "",
      action: "upload",
      icon: "assignment_add",
    }));
    return [...baseRequired, ...adminRequested];
  }, [employee?.applicationProfile?.adminDocRequests]);

  const docsByKey = useMemo(() => {
    const map = new Map();
    for (const d of docs) {
      if (d?.templateKey) map.set(d.templateKey, d);
    }
    return map;
  }, [docs]);

  function handleUploadClick(templateKey) {
    setPendingUploadKey(templateKey);
    setRowErrors((prev) => ({ ...prev, [templateKey]: "" }));
    fileInputRef.current?.click();
  }

  function onFileSelected(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    const templateKey = pendingUploadKey;
    setPendingUploadKey(null);
    if (!file || !templateKey || !employeeId) return;

    if (file.size > 10 * 1024 * 1024) {
      setRowErrors((prev) => ({ ...prev, [templateKey]: "File must be 10MB or smaller." }));
      return;
    }

    const row = requiredRows.find((r) => r.key === templateKey);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("employeeId", employeeId);
    fd.append("templateKey", templateKey);
    fd.append("name", row?.label || templateKey);
    const expiry = (expiryDraft[templateKey] || "").trim();
    if (expiry) fd.append("expiryDate", expiry);
    upsertMutation.mutate(fd);
  }

  async function handlePreview(docId) {
    if (!docId) return;
    setPreviewingId(docId);
    try {
      const data = await documentsService.getDownloadUrl(docId);
      if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } finally {
      setPreviewingId(null);
    }
  }

  const filtered = useMemo(() => {
    return requiredRows.filter((row) => {
      const stored = docsByKey.get(row.key);
      const expiryValue = (stored?.expiryDate || expiryDraft[row.key] || "").slice(0, 10);
      const uploadStatus = getRowUploadStatusKey(stored, row, expiryValue);
      const statusLabel =
        uploadStatus === "expired"
          ? "EXPIRED"
          : uploadStatus === "expiring_soon"
            ? "EXPIRING SOON"
            : uploadStatus === "uploaded"
              ? "UPLOADED"
              : "NOT UPLOADED";
      const q = search.trim().toLowerCase();
      if (q && !(row.label || "").toLowerCase().includes(q)) return false;
      if (statusFilter !== "All Statuses" && statusLabel !== statusFilter) return false;
      return true;
    });
  }, [requiredRows, docsByKey, expiryDraft, search, statusFilter]);

  const uploadedRequiredCount = useMemo(
    () => requiredRows.filter((row) => hasUploadedFile(docsByKey.get(row.key))).length,
    [requiredRows, docsByKey],
  );

  return (
    <main className="ml-64 min-h-screen flex flex-col bg-surface text-on-surface">
      <div className="mt-16 p-8 flex-1">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={onFileSelected}
        />

        <div className="mb-10 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-primary-container tracking-tight mb-2 font-headline">Employee Documents</h1>
            <p className="text-on-surface-variant max-w-md font-body">
              Upload required compliance documents. Missing documents need upload; uploaded ones can be previewed.
            </p>
          </div>
          <button
            type="button"
            className="bg-primary-container text-on-primary px-6 py-3 rounded flex items-center gap-2 hover:translate-y-[-2px] transition-all shadow-lg shadow-primary-container/20 border-none cursor-pointer"
            onClick={() => {
              const firstMissing = requiredRows.find((row) => !hasUploadedFile(docsByKey.get(row.key)));
              handleUploadClick(firstMissing?.key || requiredRows[0]?.key);
            }}
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              add
            </span>
            <span className="font-bold text-sm">Upload Required Document</span>
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
                placeholder="Filter required documents..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="w-48">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Status</label>
            <select
              className="w-full bg-surface-container border-none text-sm px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-tertiary-fixed-dim/20"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>UPLOADED</option>
              <option>NOT UPLOADED</option>
              <option>EXPIRING SOON</option>
              <option>EXPIRED</option>
            </select>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Required Uploaded</p>
            <p className="text-sm font-bold text-primary-container">
              {uploadedRequiredCount} / {requiredRows.length}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Document Name</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Upload Status</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Upload Date</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Expiry Date</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">Verification</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-on-surface-variant text-sm">
                    No required documents match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const stored = docsByKey.get(row.key);
                  const expiryValue = (stored?.expiryDate || expiryDraft[row.key] || "").slice(0, 10);
                  const uploadStatus = getRowUploadStatusKey(stored, row, expiryValue);
                  const verification = resolveDocVerification(stored);
                  const upload = formatDateCell(stored?.uploadedAt || stored?.uploadDate);
                  const expiry = formatDateCell(expiryValue);
                  const rowCls = uploadStatus === "expiring_soon"
                    ? "bg-amber-50/30 hover:bg-amber-50/50 transition-colors"
                    : "hover:bg-surface-container-low transition-colors";
                  const hasFile = hasUploadedFile(stored);
                  const rowError = rowErrors[row.key];

                  return (
                    <tr className={rowCls} key={row.key}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={documentIconWrapClass(row, uploadStatus)}>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {row.icon || "description"}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-primary-container text-sm">{row.label}</p>
                            <p className="text-[11px] text-on-surface-variant">{formatDocumentSubtitle(stored, row)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">{uploadStatusBadge(uploadStatus)}</td>
                      <td className={`px-6 py-5 text-sm text-on-surface-variant ${upload.italic ? "italic text-slate-400" : ""}`}>{upload.text}</td>
                      <td className={`px-6 py-5 text-sm text-on-surface-variant ${expiry.italic ? "text-slate-400 italic" : ""}`}>
                        {expiry.text}
                      </td>
                      <td className="px-6 py-5">{onboardingVerificationBadge(verification)}</td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <div className="flex justify-end gap-2">
                            {hasFile ? (
                              <>
                                <button
                                  type="button"
                                  className="px-3 py-1.5 text-[10px] font-bold rounded bg-primary-container text-white hover:bg-primary transition-colors border-none cursor-pointer"
                                  disabled={previewingId === stored?.id}
                                  onClick={() => handlePreview(stored?.id)}
                                >
                                  {previewingId === stored?.id ? "Opening..." : "Preview"}
                                </button>
                                <button
                                  type="button"
                                  className="px-3 py-1.5 text-[10px] font-bold rounded border border-outline-variant/30 bg-white text-on-surface hover:bg-surface-container-low transition-colors"
                                  onClick={() => handleUploadClick(row.key)}
                                >
                                  Replace
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="px-3 py-1.5 text-[10px] font-bold rounded bg-primary-container text-white hover:bg-primary transition-colors border-none cursor-pointer"
                                onClick={() => handleUploadClick(row.key)}
                              >
                                Upload
                              </button>
                            )}
                          </div>
                          {!hasFile && (
                            <input
                              type="date"
                              value={expiryValue}
                              onChange={(e) => setExpiryDraft((prev) => ({ ...prev, [row.key]: e.target.value }))}
                              className="w-36 rounded border border-outline-variant/20 bg-white px-2 py-1 text-xs"
                            />
                          )}
                          {rowError ? <p className="text-[10px] font-medium text-error">{rowError}</p> : null}
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
              Showing {filtered.length === 0 ? 0 : 1}-{filtered.length} of {requiredRows.length} required documents
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
