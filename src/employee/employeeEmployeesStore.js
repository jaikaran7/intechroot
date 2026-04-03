import baseEmployees from "../data/employees.json";

const KEY = "employee_portal_employees_data_v1";

const deepClone = (data) => JSON.parse(JSON.stringify(data));

export function loadEmployeesStore() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* ignore */
  }
  return deepClone(baseEmployees);
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
