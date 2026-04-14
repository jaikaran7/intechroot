import baseEmployees from "../../fixtures/employees.json";
import { syncApplicationTimesheetsFromEmployee } from "../../data/applicationEmployeeSync";
import { safeJsonParse } from "../../utils/safeJsonParse";
import { calculateTotal } from "./timesheetUtils";

export const EMPLOYEES_STORE_KEY = "employee_portal_employees_data_v1";
const KEY = EMPLOYEES_STORE_KEY;

function cloneBaseEmployees() {
  try {
    const list = Array.isArray(baseEmployees) ? baseEmployees : [];
    return JSON.parse(JSON.stringify(list));
  } catch {
    return [];
  }
}

function notifyEmployeesStoreChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("employee-employees-updated"));
}

function cloneAndPersist(employees) {
  persistEmployeesStore(employees);
}

export function loadEmployeesStore() {
  if (typeof window === "undefined") {
    return cloneBaseEmployees();
  }
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = safeJsonParse(raw, null);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* ignore */
  }
  try {
    const legacy = sessionStorage.getItem(KEY);
    if (legacy) {
      const parsed = safeJsonParse(legacy, null);
      if (Array.isArray(parsed)) {
        localStorage.setItem(KEY, legacy);
        try {
          sessionStorage.removeItem(KEY);
        } catch {
          /* ignore */
        }
        return parsed;
      }
    }
  } catch {
    /* ignore */
  }
  const seed = cloneBaseEmployees();
  try {
    localStorage.setItem(KEY, JSON.stringify(seed));
  } catch {
    /* ignore */
  }
  return seed;
}

export function persistEmployeesStore(employees) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(employees));
  } catch {
    /* ignore */
  }
  notifyEmployeesStoreChanged();
}

export function getEmployeeFromStore(id) {
  return loadEmployeesStore().find((e) => String(e.id) === String(id)) ?? null;
}

export function updateEmployeeInStore(id, updater) {
  const all = loadEmployeesStore();
  const idx = all.findIndex((e) => String(e.id) === String(id));
  if (idx === -1) return null;
  const next = typeof updater === "function" ? updater({ ...all[idx] }) : { ...all[idx], ...updater };
  const copy = [...all];
  copy[idx] = next;
  cloneAndPersist(copy);
  return next;
}

export function replaceEmployeeTimesheets(employeeId, timesheets) {
  const result = updateEmployeeInStore(employeeId, (emp) => ({
    ...emp,
    timesheets,
  }));
  syncApplicationTimesheetsFromEmployee(employeeId);
  return result;
}

/**
 * Patch a single timesheet row on an employee (syncs admin + employee).
 */
export function patchEmployeeTimesheet(employeeId, timesheetId, patch) {
  const result = updateEmployeeInStore(employeeId, (emp) => {
    const list = [...(emp.timesheets || [])];
    const ix = list.findIndex((t) => t.id === timesheetId);
    if (ix === -1) return emp;
    const prev = list[ix];
    const merged = { ...prev, ...patch };
    if (patch.weekData) {
      merged.total = calculateTotal(patch.weekData);
    }
    list[ix] = merged;
    return { ...emp, timesheets: list };
  });
  syncApplicationTimesheetsFromEmployee(employeeId);
  return result;
}

export function subscribeEmployeesStore(callback) {
  if (typeof window === "undefined") return () => {};
  const onCustom = () => callback();
  const onStorage = (e) => {
    if (e.storageArea === localStorage && e.key === KEY) callback();
  };
  window.addEventListener("employee-employees-updated", onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("employee-employees-updated", onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
