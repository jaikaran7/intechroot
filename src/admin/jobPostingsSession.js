import { safeJsonParse } from "../utils/safeJsonParse";

const JOB_POSTINGS_STATE_KEY = "admin_job_postings_jobs_data_v1";

export const loadJobPostingsFromSession = () => {
  try {
    const raw = sessionStorage.getItem(JOB_POSTINGS_STATE_KEY);
    const parsed = safeJsonParse(raw, null);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const persistJobPostingsToSession = (jobs) => {
  try {
    sessionStorage.setItem(JOB_POSTINGS_STATE_KEY, JSON.stringify(jobs));
  } catch {
    /* ignore quota / private mode */
  }
};
