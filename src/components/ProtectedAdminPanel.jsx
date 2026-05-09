import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useAuthHydration } from "../hooks/useAuthHydration";
import { ADMIN_PANEL_DASHBOARD_PATH, isAllowedAdminPanelPath } from "../constants/adminAccess";
import PageSkeleton from "./PageSkeleton";

export default function ProtectedAdminPanel({ children }) {
  const hydrated = useAuthHydration();
  const { role, accessToken } = useAuthStore();
  const location = useLocation();

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-surface font-body">
        <div className="pt-24 px-6 max-w-5xl mx-auto">
          <PageSkeleton rows={10} />
        </div>
      </div>
    );
  }

  if (!accessToken || !["admin", "ADMIN", "hr_admin"].includes(role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAllowedAdminPanelPath(location.pathname)) {
    return <Navigate to={ADMIN_PANEL_DASHBOARD_PATH} replace />;
  }

  return children;
}
