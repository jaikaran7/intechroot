import { useMemo } from "react";
import EmployeeBentoProfile from "../../components/EmployeeBentoProfile";
import { getEmployeeFromStore } from "../employeeEmployeesStore";
import { getEmployeeSessionId } from "../employeeSession";

export default function EmployeeProfilePage() {
  const id = getEmployeeSessionId();
  const employee = useMemo(() => (id ? getEmployeeFromStore(id) : null), [id]);

  if (!employee) return null;

  return (
    <main className="relative ml-64 min-h-screen bg-surface pt-16 font-body text-on-surface network-motif">
      <EmployeeBentoProfile employee={employee} variant="employee" />
    </main>
  );
}
