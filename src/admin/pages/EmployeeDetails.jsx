import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import EmployeeBentoProfile from "../../components/EmployeeBentoProfile";
import { getEmployeeById } from "../../data";
export default function EmployeeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const employee = getEmployeeById(id) || {};
  const initialFormData = {
    dateOfBirth: employee.personal?.dateOfBirth || "",
    gender: employee.personal?.gender || "",
    address: employee.personal?.address || "",
    employmentType: employee.employment?.employmentType || "",
    jobTitle: employee.employment?.jobTitle || employee.role || "",
    client: employee.client || "Client A",
    customClient: "",
    shiftType: employee.employment?.shiftType || "",
    salary: employee.employment?.salary || "",
    payFrequency: employee.employment?.payFrequency || "",
    contractType: employee.employment?.contractType || "",
    contractTypeDescription: employee.employment?.contractTypeDescription || "",
    employmentStatus: employee.employment?.employmentStatus || "",
    employmentStatusTag: employee.employment?.employmentStatusTag || "",
    joiningDate: employee.employment?.joiningDate || "",
    contractEndDate: employee.employment?.contractEndDate || "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [savedFormData, setSavedFormData] = useState(initialFormData);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!showSavePopup) {
      return undefined;
    }
    const timeout = window.setTimeout(() => {
      setShowSavePopup(false);
    }, 2000);
    return () => window.clearTimeout(timeout);
  }, [showSavePopup]);

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
    setIsEditMode(false);
    setShowSavePopup(true);
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
      ) : (
        <div className="mx-auto w-full max-w-6xl flex-1 p-10"></div>
      )}

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
