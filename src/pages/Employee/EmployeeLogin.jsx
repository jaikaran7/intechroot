import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees } from "@/fixtures/catalog";
import { setEmployeeSessionId } from "./employeeSession";

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const employees = getEmployees();
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? "");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!employeeId) return;
    setEmployeeSessionId(employeeId);
    navigate("/employee/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body text-on-surface">
      <form
        className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15 shadow-[0_40px_40px_rgba(0,6,21,0.04)] space-y-6"
        onSubmit={onSubmit}
      >
        <div>
          <h1 className="text-2xl font-headline font-extrabold text-primary tracking-tight">Employee sign in</h1>
          <p className="text-sm text-on-surface-variant mt-2">Select your profile (demo).</p>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Employee</label>
          <select
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#4cd7f6]/20"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} — {emp.id}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-primary-container text-white font-bold text-sm rounded-lg shadow-md hover:translate-y-[-2px] transition-all"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
