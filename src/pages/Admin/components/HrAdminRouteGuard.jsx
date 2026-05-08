import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { useHrAdminPermissions } from "@/hooks/useHrAdminPermissions";
import { isPathAllowedForHrAdmin } from "./navConfig";

function normPath(p) {
  return p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
}

/**
 * HR admins: dashboard always; other /admin/* routes require matching permissions from admin-panel dashboard.
 */
export default function HrAdminRouteGuard({ children }) {
  const role = useAuthStore((s) => s.role);
  const { pathname } = useLocation();
  const { can, isLoading } = useHrAdminPermissions();

  if (role !== "hr_admin") {
    return children;
  }

  const p = normPath(pathname);
  if (p === "/admin") {
    return children;
  }

  if (isLoading) {
    return (
      <div className="ml-64 flex min-h-screen items-center justify-center bg-surface text-on-surface-variant text-sm">
        Loading…
      </div>
    );
  }

  if (!isPathAllowedForHrAdmin(pathname, can)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
