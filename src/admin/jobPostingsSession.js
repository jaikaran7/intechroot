const JOB_POSTINGS_STATE_KEY = "admin_job_postings_jobs_data_v1";

export const loadJobPostingsFromSession = () => {
  try {
    const raw = sessionStorage.getItem(JOB_POSTINGS_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
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
