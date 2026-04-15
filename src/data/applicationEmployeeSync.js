/**
 * Bridges applications store and employee portal store (avoids circular imports).
 */
import { getApplicationsSnapshot, updateApplication } from "./applicationsStore";
import {
  getEmployeeFromStore,
  loadEmployeesStore,
  persistEmployeesStore,
} from "../pages/Employee/employeeEmployeesStore";

/** Maps employee timesheet rows → application `timesheets` shape (persisted). */
export function employeeTimesheetsToApplicationShape(empTimesheets) {
  return (empTimesheets || []).map((t) => ({
    id: t.id,
    dateRange: t.weekStart ? String(t.weekStart) : "",
    weekStart: t.weekStart,
    periodStart: t.periodStart,
    periodEnd: t.periodEnd,
    days: t.weekData || { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
    total: Number(t.total ?? 0),
    status: String(t.status || "Pending").toLowerCase(),
    notes: t.rejectionNote || "",
    rejectionNote: t.rejectionNote || "",
  }));
}

export function syncApplicationTimesheetsFromEmployee(employeeId) {
  const emp = getEmployeeFromStore(employeeId);
  if (!emp?.applicationId) return;
  const aid = Number(emp.applicationId);
  if (!Number.isFinite(aid)) return;
  const snap = employeeTimesheetsToApplicationShape(emp.timesheets);
  updateApplication(aid, (prev) => ({
    ...prev,
    timesheets: snap,
  }));
}

/**
 * Link applicant to existing employee (same email), set sessions for hire flow.
 */
export function hireApplicantAsEmployee(applicationId) {
  const apps = getApplicationsSnapshot();
  const app = apps.find((a) => Number(a.id) === Number(applicationId));
  if (!app) return { ok: false, error: "Application not found" };
  const email = String(app.email || "").toLowerCase();
  const nameNorm = String(app.name || "").toLowerCase().trim();
  const employees = loadEmployeesStore();
  let emp =
    employees.find((e) => Number(e.applicationId) === Number(applicationId)) ||
    employees.find((e) => String(e.email || "").toLowerCase() === email) ||
    (nameNorm ? employees.find((e) => String(e.name || "").toLowerCase().trim() === nameNorm) : null);
  if (!emp) {
    return {
      ok: false,
      error: "No employee record matches (same email, name, or employee.applicationId). Update the employee roster or link applicationId.",
    };
  }
  const mergedTs =
    emp.timesheets?.length && (!app.timesheets || app.timesheets.length === 0)
      ? emp.timesheets
      : mapApplicationTimesheetsToEmployeeShape(app.timesheets, emp.timesheets);

  const nextEmp = {
    ...emp,
    applicationId: Number(applicationId),
    timesheets: mergedTs?.length ? mergedTs : emp.timesheets || [],
  };
  const idx = employees.findIndex((e) => String(e.id) === String(emp.id));
  if (idx === -1) return { ok: false, error: "Employee index error" };
  employees[idx] = nextEmp;
  persistEmployeesStore(employees);

  updateApplication(applicationId, (prev) => ({
    ...prev,
    lifecycleStage: "employee",
    employeeId: String(emp.id),
    onboarding: {
      ...prev.onboarding,
      enabled: false,
      completed: true,
      hireCompleted: true,
      finalSubmitted: true,
      profileCompleted: true,
      documentsCompleted: true,
      bgvCompleted: true,
      step: 5,
    },
    status: "Hired",
    timesheets: employeeTimesheetsToApplicationShape(nextEmp.timesheets),
  }));
  return { ok: true, employeeId: String(emp.id) };
}

function mapApplicationTimesheetsToEmployeeShape(appTs, existingEmpTs) {
  const existing = existingEmpTs || [];
  if (!appTs?.length) return existing;
  return appTs.map((t, i) => {
    const prev = existing.find((e) => e.id === t.id) || existing[i];
    const weekData =
      t.days || t.weekData || prev?.weekData || { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 };
    const statusRaw = t.status || "pending";
    const status =
      statusRaw === "approved"
        ? "Approved"
        : statusRaw === "rejected"
          ? "Rejected"
          : statusRaw === "pending" || statusRaw === "draft"
            ? "Pending"
            : String(t.status || "Pending");
    return {
      id: t.id || `ts-${i}`,
      weekStart: t.weekStart || t.dateRange || prev?.weekStart,
      periodStart: t.periodStart ?? prev?.periodStart,
      periodEnd: t.periodEnd ?? prev?.periodEnd,
      weekData,
      total: Number(t.total ?? 0),
      status: status === "Pending" && prev?.status === "Draft" ? prev.status : status,
      rejectionNote: t.notes || t.rejectionNote || "",
    };
  });
}
