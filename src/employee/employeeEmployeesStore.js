import baseEmployees from "../data/employees.json";
import { safeJsonParse } from "../utils/safeJsonParse";

const KEY = "employee_portal_employees_data_v1";

function cloneBaseEmployees() {
  try {
    const list = Array.isArray(baseEmployees) ? baseEmployees : [];
    return JSON.parse(JSON.stringify(list));
  } catch {
    return [];
  }
}

export function loadEmployeesStore() {
  try {
    const raw = sessionStorage.getItem(KEY);
    const parsed = safeJsonParse(raw, null);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* ignore */
  }
  return cloneBaseEmployees();
}

export function persistEmployeesStore(employees) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(employees));
  } catch {
    /* ignore */
  }
}

export function getEmployeeFromStore(id) {
  return loadEmployeesStore().find((e) => String(e.id) === String(id)) ?? null;
}

export function updateEmployeeInStore(id, updater) {
  const all = loadEmployeesStore();
  const idx = all.findIndex((e) => String(e.id) === String(id));
  if (idx === -1) return null;
  const next = typeof updater === "function" ? updater(all[idx]) : { ...all[idx], ...updater };
  const copy = [...all];
  copy[idx] = next;
  persistEmployeesStore(copy);
  return next;
}

export function replaceEmployeeTimesheets(employeeId, timesheets) {
  return updateEmployeeInStore(employeeId, (emp) => ({
    ...emp,
    timesheets,
  }));
}
