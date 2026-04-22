import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EmployeeBentoProfile from "@/components/EmployeeBentoProfile";
import { buildProfileFormState } from "@/utils/employeeProfileFormState";
import { documentsService } from "@/services/documents.service";
import { onboardingService } from "@/services/onboarding.service";
import { REQUIRED_DOCUMENT_ROWS } from "@/constants/requiredDocumentTemplates";
import { uploadStatusBadge, onboardingVerificationBadge } from "@/components/shared/requiredDocumentBadges";
import { documentIconWrapClass, formatDocumentSubtitle } from "@/utils/applicantDocumentRows";
import {
  getRowUploadStatusKey,
  hasUploadedFile,
  resolveDocVerification,
} from "@/utils/onboardingDocumentRules";
import { employeesService } from "../../../services/employees.service";
import PageSkeleton from "../../../components/PageSkeleton";
import ErrorState from "../../../components/ErrorState";
import EmployeeTimesheetHistoryPanel from "./EmployeeTimesheetHistoryPanel";

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
export default function EmployeeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const profileRoute = `/admin/employees/${id}`;
  const timesheetsRoute = `/admin/employees/${id}/timesheets`;
  const documentsRoute = `/admin/employees/${id}/documents-submitted`;
  const isProfileTab = location.pathname === profileRoute;
  const isTimesheetsTab = location.pathname === timesheetsRoute;
  const isDocumentsTab = location.pathname === documentsRoute;
  const activeTopTabClass = "text-[#4059aa] dark:text-[#4cd7f6] border-b-2 border-[#4cd7f6] font-medium px-3 py-1";
  const inactiveTopTabClass = "text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors px-3 py-1 rounded";
  const getTopTabClass = (tab) =>
    (tab === "profile" && isProfileTab) || (tab === "timesheets" && isTimesheetsTab) || (tab === "documents" && isDocumentsTab)
      ? activeTopTabClass
      : inactiveTopTabClass;

  const { data: employee = {}, isLoading, isError, refetch } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeesService.getById(id),
    staleTime: 60_000,
  });

  const { data: docs = [] } = useQuery({
    queryKey: ['documents', id],
    queryFn: () => documentsService.getByOwner(id, 'employee'),
    staleTime: 60_000,
    enabled: isDocumentsTab && !!id,
  });

  const saveMutation = useMutation({
    mutationFn: (data) => employeesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsEditMode(false);
      setShowSavePopup(true);
    },
  });

  const requestDocumentMutation = useMutation({
    mutationFn: (name) => onboardingService.adminRequestDocument(employee.applicationId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      setNewDocNameDraft("");
      setIsDocRequestModalOpen(false);
    },
  });

  const [formData, setFormData] = useState({});
  const [savedFormData, setSavedFormData] = useState({});
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewingId, setPreviewingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [isDocRequestModalOpen, setIsDocRequestModalOpen] = useState(false);
  const [newDocNameDraft, setNewDocNameDraft] = useState("");

  useEffect(() => {
    if (!showSavePopup) {
      return undefined;
    }
    const timeout = window.setTimeout(() => {
      setShowSavePopup(false);
    }, 2000);
    return () => window.clearTimeout(timeout);
  }, [showSavePopup]);

  useEffect(() => {
    const next = buildProfileFormState(employee);
    setFormData(next);
    setSavedFormData(next);
    setIsEditMode(false);
  }, [employee]);

  const updateField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleSalaryChange = (event) => {
    const rawValue = event.target.value.replace(/[^\d.]/g, "");
    const firstDot = rawValue.indexOf(".");
    const normalized =
      firstDot === -1
        ? rawValue
        : `${rawValue.slice(0, firstDot + 1)}${rawValue.slice(firstDot + 1).replace(/\./g, "")}`;
    updateField("salary", normalized);
  };

  const handleCancel = () => {
    setFormData(savedFormData);
    setIsEditMode(false);
  };

  const handleSaveChanges = () => {
    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }
    setSavedFormData(formData);
    saveMutation.mutate(formData);
  };
  const formatDateValue = (value) => {
    if (!value) {
      return "N/A (Permanent)";
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const requiredRows = useMemo(
    () => REQUIRED_DOCUMENT_ROWS.filter((row) => row.required),
    [],
  );

  const requestedRows = useMemo(() => {
    const requested = employee.applicationProfile?.adminDocRequests || [];
    return requested.map((request) => ({
      key: `adminreq_${request.id}`,
      label: request.name,
      required: true,
      icon: "assignment_add",
    }));
  }, [employee.applicationProfile?.adminDocRequests]);

  const allDocRows = useMemo(
    () => [...requiredRows, ...requestedRows],
    [requiredRows, requestedRows],
  );

  const docsByKey = useMemo(() => {
    const map = new Map();
    for (const d of docs) {
      if (d?.templateKey) map.set(d.templateKey, d);
    }
    return map;
  }, [docs]);

  const filteredRows = useMemo(() => {
    return allDocRows.filter((row) => {
      const stored = docsByKey.get(row.key);
      const expiryValue = (stored?.expiryDate || "").slice(0, 10);
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
  }, [allDocRows, docsByKey, search, statusFilter]);

  const uploadedRequiredCount = useMemo(
    () => requiredRows.filter((row) => hasUploadedFile(docsByKey.get(row.key))).length,
    [requiredRows, docsByKey],
  );

  const handlePreview = async (docId) => {
    if (!docId) return;
    setPreviewingId(docId);
    try {
      const data = await documentsService.getDownloadUrl(docId);
      if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } finally {
      setPreviewingId(null);
    }
  };

  if (isLoading) return <PageSkeleton />;
  if (isError) return <ErrorState message="Failed to load employee." onRetry={refetch} />;

  return (
    <>
      <main className="relative ml-64 flex min-h-screen flex-col bg-surface network-motif">

      <header className="w-full sticky top-0 z-40 bg-white/60 dark:bg-[#000615]/60 backdrop-blur-xl shadow-[0_40px_40px_rgba(0,6,21,0.04)] flex justify-between items-center h-16 px-8 w-full tonal-shift bg-[#f7f9fc] dark:bg-[#000615]">
      <div className="flex items-center gap-6">
      <span className="text-xl font-black text-[#000615] dark:text-white font-['Manrope'] tracking-tight">Employee Details</span>
      <div className="h-6 w-[1px] bg-outline-variant/30"></div>
      <nav className="flex items-center gap-6">
      <Link className={getTopTabClass("timesheets")} to={timesheetsRoute}>Timesheets</Link>
      <Link className={getTopTabClass("profile")} to={profileRoute}>Profile</Link>
      <Link className={getTopTabClass("documents")} to={documentsRoute}>Documents Submitted</Link>
      </nav>
      </div>
      <div className="flex items-center gap-4">
      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors active:scale-95 duration-200">
      <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
      </button>
      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors active:scale-95 duration-200">
      <span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
      </button>
      <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
      <div className="text-right">
      <p className="text-xs font-bold text-primary leading-none">{employee.name}</p>
      <p className="text-[10px] text-on-primary-container">{employee.role}</p>
      </div>
      <img alt="Executive Profile" className="w-8 h-8 rounded-full border-2 border-primary/10" data-alt="Professional headshot of a mature executive male with confident expression and soft studio lighting" src={employee.performance?.panelImage}/>
      </div>
      </div>
      </header>

      {isProfileTab ? (
        <>
          <div className="relative min-h-0 flex-1">
            <EmployeeBentoProfile
              variant="admin"
              employee={employee}
              formData={formData}
              isEditMode={isEditMode}
              adminEditsPersonalDetailsOnly
              updateField={updateField}
              handleSalaryChange={handleSalaryChange}
              formatDateValue={formatDateValue}
              heroBeforeName={
                <button
                  type="button"
                  className="mb-3 flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-secondary transition-all hover:gap-2"
                  onClick={() => navigate("/admin/employees")}
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to Employees
                </button>
              }
              heroActions={
                <>
                  <button
                    type="button"
                    className="rounded-lg border-2 border-outline-variant/30 px-6 py-2.5 text-sm font-bold text-primary-container transition-all hover:bg-surface-container active:scale-95"
                    onClick={() => isEditMode && handleCancel()}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg bg-primary-container px-8 py-2.5 text-sm font-bold text-on-primary shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px] active:scale-95"
                    onClick={handleSaveChanges}
                  >
                    <span className="material-symbols-outlined text-sm">{isEditMode ? "save" : "edit"}</span>
                    {isEditMode ? "Save Changes" : "Edit"}
                  </button>
                </>
              }
            />
          </div>
        </>
      ) : isTimesheetsTab ? (
        <div className="relative min-h-0 flex-1 w-full">
          <EmployeeTimesheetHistoryPanel id={id} />
        </div>
      ) : isDocumentsTab ? (
        <div className="relative min-h-0 flex-1 w-full p-10 pb-16">
          <div className="mb-10 flex justify-between items-end flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-primary-container tracking-tight mb-2 font-headline">
                Employee Documents
              </h1>
              <p className="text-on-surface-variant max-w-md font-body">
                Submitted compliance documents for {employee.name || "this employee"}.
              </p>
            </div>
            <button
              type="button"
              className="bg-primary-container text-on-primary px-6 py-3 rounded flex items-center gap-2 hover:translate-y-[-2px] transition-all shadow-lg shadow-primary-container/20 border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!employee.applicationId || requestDocumentMutation.isPending}
              onClick={() => {
                setNewDocNameDraft("");
                setIsDocRequestModalOpen(true);
              }}
              title={
                employee.applicationId
                  ? "Request an additional document from this employee"
                  : "This employee is not linked to onboarding; document requests are unavailable"
              }
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                add
              </span>
              <span className="font-bold text-sm">Request New Document</span>
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
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
                Status
              </label>
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
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-on-surface-variant text-sm">
                      No required documents match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => {
                    const stored = docsByKey.get(row.key);
                    const expiryValue = (stored?.expiryDate || "").slice(0, 10);
                    const uploadStatus = getRowUploadStatusKey(stored, row, expiryValue);
                    const verification = resolveDocVerification(stored);
                    const upload = formatDateCell(stored?.uploadedAt || stored?.uploadDate);
                    const expiry = formatDateCell(expiryValue);
                    const rowCls = uploadStatus === "expiring_soon"
                      ? "bg-amber-50/30 hover:bg-amber-50/50 transition-colors"
                      : "hover:bg-surface-container-low transition-colors";
                    const hasFile = hasUploadedFile(stored);

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
                        <td className={`px-6 py-5 text-sm text-on-surface-variant ${upload.italic ? "italic text-slate-400" : ""}`}>
                          {upload.text}
                        </td>
                        <td className={`px-6 py-5 text-sm text-on-surface-variant ${expiry.italic ? "text-slate-400 italic" : ""}`}>
                          {expiry.text}
                        </td>
                        <td className="px-6 py-5">{onboardingVerificationBadge(verification)}</td>
                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            className="px-3 py-1.5 text-[10px] font-bold rounded bg-primary-container text-white hover:bg-primary transition-colors border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!hasFile || previewingId === stored?.id}
                            onClick={() => handlePreview(stored?.id)}
                          >
                            {previewingId === stored?.id ? "Opening..." : "Preview"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div className="p-4 bg-surface-container-low/30 flex justify-between items-center flex-wrap gap-2">
              <span className="text-xs text-on-surface-variant">
                Showing {filteredRows.length === 0 ? 0 : 1}-{filteredRows.length} of {allDocRows.length} documents
              </span>
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 text-slate-400 border-none bg-transparent cursor-not-allowed" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button type="button" className="px-3 py-1 bg-primary-container text-white text-xs font-bold rounded border-none cursor-pointer">
                  1
                </button>
                <button type="button" className="p-2 text-slate-600 border-none bg-transparent cursor-not-allowed" disabled>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {isDocRequestModalOpen ? (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md">
              <div className="glass-card rounded-xl p-6 w-[min(92vw,32rem)] border border-white/30 shadow-2xl">
                <h4 className="text-lg font-bold text-primary mb-3">Request new document</h4>
                <p className="text-xs text-on-surface-variant mb-3">
                  Enter the document name. It appears in this table and becomes uploadable by the employee.
                </p>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 rounded p-3 text-sm focus:ring-0 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30"
                  placeholder="e.g. Professional license certificate"
                  value={newDocNameDraft}
                  onChange={(e) => setNewDocNameDraft(e.target.value)}
                  autoFocus
                />
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-lg"
                    onClick={() => setIsDocRequestModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-xs font-bold bg-primary-container text-white rounded-lg disabled:opacity-40"
                    disabled={!newDocNameDraft.trim() || requestDocumentMutation.isPending}
                    onClick={() => requestDocumentMutation.mutate(newDocNameDraft.trim())}
                  >
                    {requestDocumentMutation.isPending ? "Adding..." : "Add request"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {isProfileTab && (
      <div className="sticky bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-outline-variant/10 py-4 px-10 md:hidden flex justify-between gap-4">
      <button className="flex-1 py-3 rounded-lg border-2 border-outline-variant/30 text-primary-container font-bold text-sm" onClick={() => isEditMode && handleCancel()}>
                      Cancel
                  </button>
      <button className="flex-1 py-3 rounded-lg bg-primary-container text-on-primary font-bold text-sm shadow-lg shadow-primary/20" onClick={handleSaveChanges}>
                      {isEditMode ? "Save Changes" : "Edit"}
                  </button>
      </div>
      )}
      </main>
      {showSavePopup && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md">
      <div className="glass-card rounded-2xl p-8 w-[min(90vw,28rem)] border border-white/30 shadow-2xl text-center">
      <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#0094ac]/20 flex items-center justify-center animate-pulse">
      <span className="material-symbols-outlined text-3xl text-[#0094ac]" data-icon="check_circle">check_circle</span>
      </div>
      <h4 className="text-xl font-bold text-primary mb-1">Changes Saved</h4>
      <p className="text-sm text-on-surface-variant">Employee profile was updated successfully.</p>
      </div>
      </div>
      )}
    </>
  );
}
