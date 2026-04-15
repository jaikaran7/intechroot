import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import EmployeeHeader from "./EmployeeHeader";
import EmployeeProfileChromeHeader from "./EmployeeProfileChromeHeader";
import EmployeeSidebar from "./EmployeeSidebar";

export default function ProtectedEmployee({ children }) {
  const { role, accessToken } = useAuthStore();
  const { pathname } = useLocation();

  const isAuthed = Boolean(accessToken) && role === "employee";

  if (!isAuthed) {
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
