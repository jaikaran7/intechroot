const EMPLOYEE_ID_KEY = "employee_portal_current_id_v1";

export function getEmployeeSessionId() {
  try {
    return sessionStorage.getItem(EMPLOYEE_ID_KEY);
  } catch {
    return null;
  }
}

export function setEmployeeSessionId(id) {
  try {
    sessionStorage.setItem(EMPLOYEE_ID_KEY, String(id));
  } catch {
    /* ignore */
  }
}
