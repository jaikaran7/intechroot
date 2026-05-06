import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { useAuthHydration } from "../../../hooks/useAuthHydration";
import { ADMIN_PANEL_DASHBOARD_PATH } from "../../../constants/adminAccess";
import EmployeeHeader from "./EmployeeHeader";
import EmployeeProfileChromeHeader from "./EmployeeProfileChromeHeader";
import EmployeeSidebar from "./EmployeeSidebar";
import PageSkeleton from "../../../components/PageSkeleton";

export default function ProtectedEmployee({ children }) {
  const hydrated = useAuthHydration();
  const { role, accessToken } = useAuthStore();
  const location = useLocation();
  const { pathname } = location;

  const isAuthed = Boolean(accessToken) && role === "employee";

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-surface font-body">
        <div className="pt-24 px-6 max-w-5xl mx-auto">
          <PageSkeleton rows={10} />
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    if (accessToken && role === "admin") {
      return <Navigate to={ADMIN_PANEL_DASHBOARD_PATH} replace />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
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
