/** Single source of truth for primary admin navigation (matches Applications page order). */

export const ADMIN_NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "dashboard" },
  { to: "/admin/applications", label: "Applications", icon: "description" },
  { to: "/admin/employees", label: "Employees", icon: "group" },
  { to: "/admin/timesheets", label: "Timesheets", icon: "schedule" },
  { to: "/admin/payroll", label: "Payroll", icon: "payments" },
  { to: "/admin/job-postings", label: "Job Postings", icon: "work_outline" },
  { to: "/admin/reports", label: "Reports", icon: "assessment" },
  { to: "/admin/settings", label: "Settings", icon: "settings" },
];

export function isNavActive(pathname, href) {
  if (href === "/admin") {
    return pathname === "/admin" || pathname === "/admin/";
  }
  if (href === "/admin/settings") {
    const p = normPath(pathname);
    return p === href || p.startsWith(`${href}/`);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function normPath(p) {
  return p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
}
