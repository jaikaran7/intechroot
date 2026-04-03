import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeBentoProfile, { formatDateMedium } from "../../components/EmployeeBentoProfile";
import { buildProfileFormState } from "../../utils/employeeProfileFormState";
import { getEmployeeFromStore, updateEmployeeInStore } from "../employeeEmployeesStore";
import { getEmployeeSessionId } from "../employeeSession";

export default function EmployeeProfilePage() {
  const navigate = useNavigate();
  const id = getEmployeeSessionId();
  const [storeVersion, setStoreVersion] = useState(0);
  const employee = useMemo(() => (id ? getEmployeeFromStore(id) : null), [id, storeVersion]);

  const [formData, setFormData] = useState({});
  const [savedFormData, setSavedFormData] = useState({});
  const [personalDetailsEditMode, setPersonalDetailsEditMode] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);

  useEffect(() => {
    if (!employee) return;
    const next = buildProfileFormState(employee);
    setFormData(next);
    setSavedFormData(next);
    setPersonalDetailsEditMode(false);
  }, [employee, id, storeVersion]);

  useEffect(() => {
    if (!showSavePopup) return undefined;
    const timeout = window.setTimeout(() => setShowSavePopup(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [showSavePopup]);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCancel = () => {
    if (personalDetailsEditMode) {
      setFormData(savedFormData);
      setPersonalDetailsEditMode(false);
    } else {
      navigate("/employee/dashboard");
    }
  };

  const handleSave = () => {
    if (!id || !personalDetailsEditMode) return;
    updateEmployeeInStore(id, (emp) => ({
      ...emp,
      personal: {
        ...(emp.personal || {}),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
      },
      employment: {
        ...(emp.employment || {}),
        employmentType: formData.employmentType,
      },
    }));
    setSavedFormData({ ...formData });
    setPersonalDetailsEditMode(false);
    setStoreVersion((v) => v + 1);
    setShowSavePopup(true);
  };

  const handlePenClick = () => setPersonalDetailsEditMode(true);

  if (!employee) return null;

  const formatDateValue = (v) => formatDateMedium(v) || "—";

  return (
    <>
      <main className="relative ml-64 min-h-screen bg-surface pt-16 font-body text-on-surface network-motif">
        <EmployeeBentoProfile
          employee={employee}
          variant="employee"
          formData={formData}
          isEditMode={false}
          personalDetailsEditMode={personalDetailsEditMode}
          onPersonalDetailsPenClick={handlePenClick}
          updateField={updateField}
          handleSalaryChange={() => {}}
          formatDateValue={formatDateValue}
          heroActions={
            <>
              <button
                type="button"
                className="rounded-lg border border-outline-variant px-6 py-2.5 text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-container active:scale-95"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!personalDetailsEditMode}
                className={`rounded-lg px-8 py-2.5 text-sm font-semibold shadow-lg transition-all active:scale-95 ${
                  personalDetailsEditMode
                    ? "bg-primary-container text-on-primary shadow-primary/20 hover:-translate-y-0.5"
                    : "cursor-not-allowed bg-primary-container text-on-primary opacity-50"
                }`}
                onClick={handleSave}
              >
                Save Changes
              </button>
            </>
          }
        />
      </main>
      {showSavePopup ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/20 backdrop-blur-md">
          <div className="glass-card w-[min(90vw,28rem)] rounded-2xl border border-white/30 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-[#0094ac]/20">
              <span className="material-symbols-outlined text-3xl text-[#0094ac]" data-icon="check_circle">
                check_circle
              </span>
            </div>
            <h4 className="mb-1 text-xl font-bold text-primary">Changes Saved</h4>
            <p className="text-sm text-on-surface-variant">Your profile was updated successfully.</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
