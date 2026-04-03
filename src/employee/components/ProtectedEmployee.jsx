import { Navigate, useLocation } from "react-router-dom";
import { getEmployeeSessionId } from "../employeeSession";
import EmployeeHeader from "./EmployeeHeader";
import EmployeeProfileChromeHeader from "./EmployeeProfileChromeHeader";
import EmployeeSidebar from "./EmployeeSidebar";

export default function ProtectedEmployee({ children }) {
  const id = getEmployeeSessionId();
  const { pathname } = useLocation();
  if (!id) {
    return <Navigate to="/employee/login" replace />;
  }
  const profileChrome = pathname === "/employee/profile";
  return (
    <>
      <EmployeeSidebar />
      {profileChrome ? <EmployeeProfileChromeHeader /> : <EmployeeHeader />}
      <div className="bg-surface font-body text-on-surface selection:bg-tertiary-fixed selection:text-primary">
        {children}
      </div>
    </>
  );
}
