import employees from "./employees.json";
import jobsData from "./jobs.json";
import { getApplicationsSnapshot } from "../data/applicationsStore";

export const getEmployees = () => employees;
export const getEmployeeById = (id) => employees.find((e) => String(e.id) === String(id));
export const getApplications = () => getApplicationsSnapshot();
export const getApplicationById = (id) =>
  getApplicationsSnapshot().find((a) => Number(a.id) === Number(id)) || null;
export const getApplicationByEmail = (email) => {
  if (!email || typeof email !== "string") return null;
  const normalized = email.trim().toLowerCase();
  return getApplicationsSnapshot().find((a) => String(a.email || "").toLowerCase() === normalized) || null;
};
export const getJobs = () => jobsData.jobs;
export const getFeaturedRoles = () => jobsData.featuredRoles;
