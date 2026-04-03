import jobApplicationsSeed from "../data/jobApplications.json";
import { getJobs } from "../data";

const STORAGE_KEY = "intechroot_job_applications_v1";

function cloneSeed() {
  return Array.isArray(jobApplicationsSeed) ? [...jobApplicationsSeed] : [];
}

/**
 * @param {string} userId
 * @param {string} jobId
 * @param {Array<{ userId?: string, jobId?: string }>} applications
 */
export function hasUserApplied(userId, jobId, applications) {
  if (!userId || !jobId || !Array.isArray(applications)) return false;
  return applications.some((app) => app.userId === userId && app.jobId === jobId);
}

export function normalizeApplicantUserId(email) {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

export function slugifyJobKey(value) {
  if (!value || typeof value !== "string") return "general";
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "general";
}

/**
 * Load job-level submission ledger (localStorage, seeded from JSON once).
 * Shape: { id, userId, jobId, status, appliedAt }
 */
export function getJobApplications() {
  if (typeof window === "undefined") return cloneSeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* fall through */
  }
  const seed = cloneSeed();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  } catch {
    /* ignore */
  }
  return seed;
}

export function setJobApplications(applications) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  window.dispatchEvent(new CustomEvent("job-applications-updated"));
}

/**
 * @param {{ userId: string, jobId: string, status?: string }} entry
 */
/**
 * Resolve stable job id for duplicate checks (URL state, or match careers list, or general bucket).
 * @param {Record<string, unknown>} state - react-router location.state from /apply
 * @param {string} [discipline] - current form discipline / role title
 */
export function resolveJobIdFromApplyState(state, discipline) {
  if (state?.jobId != null && String(state.jobId).trim() !== "") return String(state.jobId);
  const title = discipline || state?.discipline || "";
  const jobs = getJobs();
  const match = jobs.find((j) => j.title === title);
  if (match?.id) return String(match.id);
  return `general:${slugifyJobKey(title || "apply")}`;
}

export function appendJobApplication(entry) {
  const list = getJobApplications();
  const id = `app_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const row = {
    id,
    userId: entry.userId,
    jobId: entry.jobId,
    status: entry.status || "submitted",
    appliedAt: entry.appliedAt || new Date().toISOString().slice(0, 10),
  };
  list.push(row);
  setJobApplications(list);
  return row;
}
