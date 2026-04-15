import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

export default function ProtectedApplicant({ children }) {
  const { accessToken, role, applicationId } = useAuthStore();
  if (!accessToken || role !== "applicant" || !applicationId) {
    return <Navigate to="/applicant/login" replace />;
  }
  return children;
}
