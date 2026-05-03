export const ADMIN_PANEL_DASHBOARD_PATH = "/admin-panel/dashboard";
export const ADMIN_PANEL_TIMESHEETS_PATH = "/admin-panel/timesheets";
export const ADMIN_PANEL_ALLOWED_PATHS = new Set([
  ADMIN_PANEL_DASHBOARD_PATH,
  ADMIN_PANEL_TIMESHEETS_PATH,
]);

export function normalizePathname(pathname) {
  if (!pathname) return "/";
  const trimmed = pathname.replace(/\/$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function isAllowedAdminPanelPath(pathname) {
  return ADMIN_PANEL_ALLOWED_PATHS.has(normalizePathname(pathname));
}
