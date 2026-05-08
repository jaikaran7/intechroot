import { Outlet } from "react-router-dom";
import HrAdminRouteGuard from "./HrAdminRouteGuard";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <HrAdminRouteGuard>
      <AdminSidebar />
      <Outlet />
    </HrAdminRouteGuard>
  );
}
