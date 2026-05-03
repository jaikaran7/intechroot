import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useAuthHydration } from "../hooks/useAuthHydration";
import { ADMIN_PANEL_DASHBOARD_PATH, isAllowedAdminPanelPath } from "../constants/adminAccess";

/**
 * On every navigation: limited admin roles may only view /admin-panel routes.
 */
export default function AdminRouteEnforcement() {
  const location = useLocation();
  const navigate = useNavigate();
  const hydrated = useAuthHydration();
  const role = useAuthStore((s) => s.role);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!hydrated || !accessToken || !["admin", "ADMIN"].includes(role)) return;
    if (isAllowedAdminPanelPath(location.pathname)) return;
    navigate(ADMIN_PANEL_DASHBOARD_PATH, { replace: true });
  }, [hydrated, accessToken, role, location.pathname, navigate]);

  return null;
}
