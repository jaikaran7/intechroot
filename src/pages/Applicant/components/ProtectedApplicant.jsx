import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { useAuthHydration } from "../../../hooks/useAuthHydration";
import { ADMIN_PANEL_DASHBOARD_PATH } from "../../../constants/adminAccess";

export default function ProtectedApplicant({ children }) {
  const hydrated = useAuthHydration();
  const { accessToken, role, applicationId } = useAuthStore();

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

  if (!accessToken || role !== "applicant" || !applicationId) {
    if (accessToken && role === "admin") {
      return <Navigate to={ADMIN_PANEL_DASHBOARD_PATH} replace />;
    }
    return <Navigate to="/applicant/login" replace />;
  }
  return children;
}
