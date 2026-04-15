import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedAdmin({ children }) {
  const { role, accessToken } = useAuthStore();
  const location = useLocation();

  if (!accessToken || !["admin", "super_admin"].includes(role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
