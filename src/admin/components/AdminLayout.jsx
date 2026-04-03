import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminSidebar />
      {children}
    </>
  );
}
