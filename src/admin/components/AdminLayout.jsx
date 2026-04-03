import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <>
      <AdminSidebar />
      <Outlet />
    </>
  );
}
