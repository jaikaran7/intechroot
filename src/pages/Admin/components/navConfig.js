/** Single source of truth for primary admin navigation (matches Applications page order). */

export const ADMIN_NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "dashboard" },
  { to: "/admin/admins", label: "Admins", icon: "admin_panel_settings" },
  { to: "/admin/applications", label: "Applications", icon: "description" },
  { to: "/admin/employees", label: "Employees", icon: "group" },
  { to: "/admin/timesheets", label: "Timesheets", icon: "schedule" },
  { to: "/admin/payroll", label: "Payroll", icon: "payments" },
  { to: "/admin/job-postings", label: "Job Postings", icon: "work_outline" },
  { to: "/admin/reports", label: "Reports", icon: "assessment" },
  { to: "/admin/settings", label: "Settings", icon: "settings" },
];

function normPath(p) {
  return p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
}

/** @param {Record<string, boolean>} hrCan normalized dashboard permissions for hr_admin */
export function hrAdminTimesheetAccess(hrCan) {
  if (!hrCan) return false;
  return Boolean(hrCan.approveTimesheets || hrCan.rejectTimesheets || hrCan.editTimesheets);
}

/** @param {Record<string, boolean>} hrCan */
export function hrAdminJobAccess(hrCan) {
  if (!hrCan) return false;
  return Boolean(
    hrCan.viewJobPostings || hrCan.createEditJobPostings || hrCan.openCloseJobPostings,
  );
}

/** @param {Record<string, boolean>} hrCan */
export function hrAdminEmployeeNavAccess(hrCan) {
  if (!hrCan) return false;
  return Boolean(hrCan.viewEmployeeDetails || hrCan.viewEmployeeDocuments);
}

/**
 * HR admin route guard: dashboard always; other prefixes require matching view/action permissions.
 * @param {string} pathname
 * @param {Record<string, boolean> | null} hrCan pass null while permissions are loading (caller should wait)
 */
export function isPathAllowedForHrAdmin(pathname, hrCan) {
  const p = normPath(pathname);
  if (p === "/admin") return true;
  if (!hrCan) return false;

  if (p === "/admin/applications" || p.startsWith("/admin/applications/")) {
    return Boolean(hrCan.viewApplicationJourney);
  }
  if (p === "/admin/employees" || p.startsWith("/admin/employees/")) {
    return hrAdminEmployeeNavAccess(hrCan);
  }
  if (p === "/admin/timesheets" || p.startsWith("/admin/timesheets/")) {
    return hrAdminTimesheetAccess(hrCan);
  }
  if (p === "/admin/job-postings" || p.startsWith("/admin/job-postings/")) {
    return hrAdminJobAccess(hrCan);
  }
  return false;
}

/**
 * @param {string} role
 * @param {Record<string, boolean> | null} [hrCan] null while HR permissions are loading — only Dashboard is shown
 */
export function getAdminNavItems(role, hrCan = null) {
  if (role === "hr_admin") {
    if (!hrCan) {
      return ADMIN_NAV_ITEMS.filter((item) => item.to === "/admin");
    }
    return ADMIN_NAV_ITEMS.filter((item) => {
      if (item.to === "/admin") return true;
      if (item.to === "/admin/applications") return Boolean(hrCan.viewApplicationJourney);
      if (item.to === "/admin/employees") return hrAdminEmployeeNavAccess(hrCan);
      if (item.to === "/admin/timesheets") return hrAdminTimesheetAccess(hrCan);
      if (item.to === "/admin/job-postings") return hrAdminJobAccess(hrCan);
      return false;
    });
  }
  return ADMIN_NAV_ITEMS;
}

export function isNavActive(pathname, href) {
  if (href === "/admin") {
    return pathname === "/admin" || pathname === "/admin/";
  }
  if (href === "/admin/admins") {
    const p = normPath(pathname);
    return p === href || p.startsWith(`${href}/`);
  }
  if (href === "/admin/settings") {
    const p = normPath(pathname);
    return p === href || p.startsWith(`${href}/`);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
