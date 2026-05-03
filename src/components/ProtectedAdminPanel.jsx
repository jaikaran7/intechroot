import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useAuthHydration } from "../hooks/useAuthHydration";
import { ADMIN_PANEL_DASHBOARD_PATH, isAllowedAdminPanelPath } from "../constants/adminAccess";

export default function ProtectedAdminPanel({ children }) {
  const hydrated = useAuthHydration();
  const { role, accessToken } = useAuthStore();
  const location = useLocation();

  if (!hydrated) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "40vh",
          color: "#64748b",
          fontSize: "0.95rem",
        }}
      >
        Loading…
      </div>
    );
  }

  if (!accessToken || !["admin", "ADMIN"].includes(role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAllowedAdminPanelPath(location.pathname)) {
    return <Navigate to={ADMIN_PANEL_DASHBOARD_PATH} replace />;
  }

  return children;
}
