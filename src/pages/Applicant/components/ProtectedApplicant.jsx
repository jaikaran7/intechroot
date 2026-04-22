import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { useAuthHydration } from "../../../hooks/useAuthHydration";

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
    return <Navigate to="/applicant/login" replace />;
  }
  return children;
}
